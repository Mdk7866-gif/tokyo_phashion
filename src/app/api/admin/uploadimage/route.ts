import { NextResponse } from 'next/server';
import { uploadToCloudinary } from '@/lib/cloudinary';

// Allow larger payloads for image uploads
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'File is required' }, { status: 400 });
    }

    // Guard: only accept images
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
    }

    // Guard: max 10 MB
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'File is too large (max 10 MB)' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const uploadRes = await uploadToCloudinary(fileBase64, `prod_${Date.now()}`);

    // Return the secure URL + a Cloudinary auto-format/quality delivery URL
    // This URL will automatically serve WebP/AVIF to supporting browsers
    const optimisedUrl = uploadRes.secure_url.replace(
      '/upload/',
      '/upload/q_auto:good,f_auto,w_900,c_limit/'
    );

    return NextResponse.json({
      success: true,
      url: optimisedUrl,
      rawUrl: uploadRes.secure_url,
    });
  } catch (error) {
    console.error('[uploadimage]', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
