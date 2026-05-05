import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// CREATE
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    
    // 1. Create Category
    const { data: category, error } = await supabaseAdmin
      .from('categories')
      .insert([{ name: name.toLowerCase() }])
      .select()
      .single();
    
    if (error) throw error;

    // 2. Create empty thumbnail entry
    await supabaseAdmin
      .from('category_thumbnails')
      .insert([{ category_id: category.id, image_url: null }]);

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// UPDATE
export async function PATCH(request: Request) {
  try {
    const { id, name } = await request.json();
    const { data, error } = await supabaseAdmin.from('categories').update({ name: name.toLowerCase() }).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabaseAdmin.from('categories').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
