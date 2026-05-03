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
      resource_type: "auto",
      public_id: fileName,
      folder: "tokyofashion", // Storing in the requested folder
    });
    return res;
  } catch (error) {
    throw error;
  }
};