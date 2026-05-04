import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

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