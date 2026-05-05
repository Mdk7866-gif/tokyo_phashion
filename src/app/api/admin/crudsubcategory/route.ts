import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

// CREATE
export async function POST(request: Request) {
  try {
    const { category_id, name } = await request.json();
    const { data, error } = await supabaseAdmin.from('subcategories').insert([{ category_id, name: name.toLowerCase() }]).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// UPDATE
export async function PATCH(request: Request) {
  try {
    const { id, name } = await request.json();
    const { data, error } = await supabaseAdmin.from('subcategories').update({ name: name.toLowerCase() }).eq('id', id).select().single();
    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    const { error } = await supabaseAdmin.from('subcategories').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
