import "server-only";

import { DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

import { env } from "./env";

export const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});

export async function deleteFileFromS3(key: string) {
  try {
    const command = new DeleteObjectCommand({
      Bucket: env.S3_BUCKET_NAME,
      Key: key,
    });

    await s3.send(command);
    return { success: true };
  } catch (error) {
    console.error("S3 DELETE UTILITY ERROR", error);
    return { success: false, error };
  }
}
