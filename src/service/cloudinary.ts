import {
  v2 as cloudinary,
  UploadApiResponse,
  UploadApiErrorResponse,
} from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

type folderType =
  | "LEARNPLUS_COURSE_VIDEOS"
  | "LEARNPLUS_COURSE_THUMBNAILS"
  | "LEARNPLUS_USER_AVATARS";

class CloudinaryService {
  /**
   * Uploads an image to cloudinary
   * @param file - The file to be uploaded
   * @param folder - The folder to upload the image to
   * @returns A promise which resolves with the upload response
   */
  async uploadImage(
    file: File,
    folder: folderType,
  ): Promise<UploadApiResponse> {
    const buffer = Buffer.from(await file.arrayBuffer());

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "image", folder }, (err, result) => {
          if (err) return reject(err);
          resolve(result!);
        })
        .end(buffer);
    });
  }

  /**
   * Deletes an image from Cloudinary.
   * @param public_id The public ID of the image to delete.
   * @returns A promise that resolves with the deletion result.
   * @throws An error if the deletion fails.
   */
  async deleteImage(public_id: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        public_id,
        { resource_type: "image" },
        (
          err: UploadApiErrorResponse | null,
          result: UploadApiResponse | null,
        ) => {
          if (err) return reject(err);
          resolve(result!);
        },
      );
    });
  }

  /**
   * Uploads a video to Cloudinary
   * @param file - The video file to be uploaded
   * @param folder - The folder to upload the video to
   * @returns A promise which resolves with the upload response
   */
  async uploadVideo(
    file: File,
    folder: folderType,
  ): Promise<UploadApiResponse> {
    console.log("UPLOADING VIDEO")
    const buffer = Buffer.from(await file.arrayBuffer());

    console.log("BUFFER", buffer);

    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ resource_type: "video", folder }, (err, result) => {
          if (err) return reject(err);
          resolve(result!);
        })
        .end(buffer);
    });
  }

  /**
   * Deletes a video from Cloudinary.
   * @param public_id The public ID of the video to delete.
   * @returns A promise that resolves with the deletion result.
   * @throws An error if the deletion fails.
   */
  async deleteVideo(public_id: string): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(
        public_id,
        { resource_type: "video" },
        (
          err: UploadApiErrorResponse | null,
          result: UploadApiResponse | null,
        ) => {
          if (err) return reject(err);
          resolve(result!);
        },
      );
    });
  }
}

const cloudinaryService = new CloudinaryService();
export default cloudinaryService;
