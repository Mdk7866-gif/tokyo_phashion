import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// Legacy support if used anywhere else
export const uploadToCloudinary = async (fileUri: string, fileName: string) => {
  try {
    const res = await cloudinary.uploader.upload(fileUri, {
      invalidate: true,
      resource_type: "image",
      public_id: fileName,
      folder: "tokyofashion",
      // Auto quality & format for fastest delivery (serves WebP/AVIF automatically)
      quality: "auto:good",
      fetch_format: "auto",
      // Pre-generate an optimised version eagerly — non-blocking
      eager: [
        { width: 900, crop: "limit", quality: "auto:good", fetch_format: "webp" },
      ],
      eager_async: true,
      // Strip EXIF / colour profiles to reduce size
      flags: "strip_profile",
    });
    return res;
  } catch (error) {
    throw error;
  }
};

// Extremely fast streaming upload using Buffer (bypasses base64 memory overhead)
export const uploadBufferToCloudinary = async (buffer: Buffer, fileName: string): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        invalidate: true,
        resource_type: "image",
        public_id: fileName,
        folder: "tokyofashion",
        quality: "auto:good",
        fetch_format: "auto",
        eager: [
          { width: 900, crop: "limit", quality: "auto:good", fetch_format: "webp" },
        ],
        eager_async: true,
        flags: "strip_profile",
      },
      (error, result) => {
        if (error) return reject(error);
        if (result) return resolve(result);
        reject(new Error("Upload failed"));
      }
    );
    stream.end(buffer);
  });
};