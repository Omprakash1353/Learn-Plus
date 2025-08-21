import { env } from "@/lib/env";

export function useConstructUrl(key: string) {
  return key
    ? `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.amazonaws.com/${key}`
    : "";
}
