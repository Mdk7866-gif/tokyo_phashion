import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { uploadToCloudinary } from '@/lib/cloudinary';

// GET CATEGORIES WITH THUMBNAILS
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*, category_thumbnails(image_url)')
      .order('name');

    if (error) throw error;
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// UPLOAD / UPDATE
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const category_id = formData.get('category_id') as string;
    const file = formData.get('file') as File;

    if (!category_id || !file) {
      return NextResponse.json({ error: 'Category ID and File are required' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileBase64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    const uploadRes = await uploadToCloudinary(fileBase64, `cat_${category_id}_${Date.now()}`);

    const { data, error } = await supabaseAdmin
      .from('category_thumbnails')
      .upsert({
        category_id,
        image_url: uploadRes.secure_url,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'category_id' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE THUMBNAIL (Keep the category, just remove the image)
export async function DELETE(request: Request) {
  try {
    const { category_id } = await request.json();
    const { error } = await supabaseAdmin
      .from('category_thumbnails')
      .update({ image_url: null }) // We just nullify the URL
      .eq('category_id', category_id);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
