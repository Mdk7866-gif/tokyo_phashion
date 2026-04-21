import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImage = async (
  fileInput: string,
  options?: { folder?: string }
): Promise<string> => {
  try {
    const result = await cloudinary.uploader.upload(fileInput, {
      folder: options?.folder ?? 'tokyofashion/misc',
    });
    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    throw new Error('Image upload failed');
  }
};

export const uploadImageBuffer = async (
  fileBuffer: Buffer,
  options?: { folder?: string }
): Promise<string> => {
  const folder = options?.folder ?? 'tokyofashion/misc';

  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
      },
      (error, result) => {
        if (error || !result?.secure_url) {
          console.error('Cloudinary Stream Upload Error:', error);
          reject(new Error('Image upload failed'));
          return;
        }

        resolve(result.secure_url);
      }
    );

    stream.end(fileBuffer);
  });
};

export default cloudinary;
