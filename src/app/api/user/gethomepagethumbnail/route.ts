import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('categories')
      .select('*, category_thumbnails(image_url)')
      .order('name');

    if (error) throw error;
    
    // We only want to return categories that have a thumbnail for the home page (or maybe all, but the user requested thumbnail categories)
    return NextResponse.json({ data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
