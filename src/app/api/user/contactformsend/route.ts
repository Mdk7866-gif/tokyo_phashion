import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { uploadImage, uploadImageBuffer } from '@/lib/cloudinary';

export const runtime = 'nodejs';

type ContactFormBody = {
  name?: unknown;
  mobile_number?: unknown;
  detailes?: unknown;
  photo?: unknown; // optional: base64 data URL
};

function asNonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') ?? '';

    let name: string | null = null;
    let mobile_number: string | null = null;
    let detailes: string | null = null;
    let photoDataUrl: string | null = null;
    let photoBuffer: Buffer | null = null;

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData();
      name = asNonEmptyString(form.get('name'));
      mobile_number = asNonEmptyString(form.get('mobile_number'));
      detailes = asNonEmptyString(form.get('detailes'));

      const photo = form.get('photo');
      if (photo instanceof File && photo.size > 0) {
        photoBuffer = Buffer.from(await photo.arrayBuffer());
      }
    } else {
      const body = (await request.json()) as ContactFormBody;
      name = asNonEmptyString(body.name);
      mobile_number = asNonEmptyString(body.mobile_number);
      detailes = asNonEmptyString(body.detailes);

      const photo = body.photo;
      if (typeof photo === 'string' && photo.startsWith('data:image')) {
        photoDataUrl = photo;
      }
    }

    if (!name || !mobile_number || !detailes) {
      return NextResponse.json(
        { error: 'name, mobile_number, detailes are required' },
        { status: 400 }
      );
    }

    let photo_url: string | null = null;
    if (photoBuffer) {
      photo_url = await uploadImageBuffer(photoBuffer, {
        folder: 'tokyofashion/contact_form',
      });
    } else if (photoDataUrl) {
      photo_url = await uploadImage(photoDataUrl, {
        folder: 'tokyofashion/contact_form',
      });
    }

    const client = await clientPromise;
    const db = client.db(process.env.DATABASE_NAME || 'tokyofashion');

    const doc = {
      name,
      mobile_number,
      detailes,
      photo_url,
      created_at: new Date().toISOString(),
    };

    const result = await db.collection('usercontactformdata').insertOne(doc);

    return NextResponse.json(
      {
        success: true,
        message: 'Contact form submitted successfully',
        insertedId: result.insertedId,
        photo_url,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Contact form API Error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

