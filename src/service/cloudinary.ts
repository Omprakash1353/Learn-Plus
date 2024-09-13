import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export async function UploadImage(file: File, folder: string) {
  const buffer = await file.arrayBuffer();
  const bytes = Buffer.from(buffer);

  return new Promise(async (resolve, reject) => {
    await cloudinary.uploader
      .upload_stream({ resource_type: "auto", folder }, async (err, res) => {
        if (err) {
          reject(err.message);
        }
        resolve(res);
      })
      .end(bytes);
  });
}

export async function DeleteImage(public_id: string) {
  return new Promise(async (resolve, reject) => {
    await cloudinary.uploader.destroy(
      public_id,
      { resource_type: "auto" },
      async (err, res) => {
        if (err) {
          reject(err.message);
        }
        resolve(res);
      },
    );
  });
}
