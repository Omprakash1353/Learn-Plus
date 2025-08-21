import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextResponse } from "next/server";
import { v4 as uuid } from "uuid";
import { z } from "zod";

import { requireInstructor } from "@/app/data/instructor/require-instructor";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { env } from "@/lib/env";
import { s3 } from "@/lib/s3-client";

const fileUploadSchema = z.object({
  fileName: z.string().min(1, { message: "Filename is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "Size is required" }),
  isImage: z.boolean(),
});

const aj = arcjet.withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 5 }));

export async function POST(request: Request) {
  try {
    const session = await requireInstructor();

    const decision = await aj.protect(request, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      return NextResponse.json({ error: "To many request" }, { status: 429 });
    }

    const body = await request.json();
    const validation = fileUploadSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid Request Body" },
        { status: 400 }
      );
    }

    const { fileName, contentType, size } = validation.data;
    const uniqueKey = `${uuid()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: uniqueKey,
      ContentType: contentType,
      ContentLength: size,
    });

    const presignedUrl = await getSignedUrl(s3, command, {
      expiresIn: 360,
    });

    return NextResponse.json({ presignedUrl, key: uniqueKey }, { status: 200 });
  } catch (error) {
    console.error('S3 UPLOAD POST API ERROR', error)
    return NextResponse.json(
      { error: "Failed to generate presigned URL" },
      { status: 500 }
    );
  }
}
