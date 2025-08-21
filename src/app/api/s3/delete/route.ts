import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";

import { requireInstructor } from "@/app/data/instructor/require-instructor";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { env } from "@/lib/env";
import { s3 } from "@/lib/s3-client";

const aj = arcjet.withRule(fixedWindow({ mode: "LIVE", window: "1m", max: 5 }));

export async function DELETE(request: Request) {
  try {
    const session = await requireInstructor();

    const decision = await aj.protect(request, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      return NextResponse.json({ error: "To many request" }, { status: 429 });
    }

    const body = await request.json();
    const { key } = body;

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    const command = new DeleteObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);

    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error('S3 DELETE API ROUTE ERROR', error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
