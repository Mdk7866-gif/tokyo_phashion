import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tab = searchParams.get('tab') || 'critical stoke';

  try {
    let query = supabaseAdmin
      .from('variant_sizes')
      .select(`
        id, size, stock,
        product_variants (
          id, color,
          products ( id, name ),
          product_images ( image_url, sort_order )
        )
      `)
      .is('deleted_at', null);

    if (tab === 'out of stoke') {
      query = query.lte('stock', 0);
    } else {
      // critical stoke: <= 5 and > 0
      query = query.lte('stock', 5).gt('stock', 0);
    }

    const { data, error } = await query.order('stock', { ascending: true });

    if (error) {
      console.error('Fetch stokes error:', error);
      return NextResponse.json({ error: 'Failed to fetch stokes' }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (err) {
    console.error('Stokes api error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { variant_size_id, additional_stock } = await request.json();

    if (!variant_size_id || typeof additional_stock !== 'number' || additional_stock <= 0) {
      return NextResponse.json({ error: 'Invalid input data' }, { status: 400 });
    }

    // Fetch current stock
    const { data: vs, error: fetchErr } = await supabaseAdmin
      .from('variant_sizes')
      .select('stock')
      .eq('id', variant_size_id)
      .single();

    if (fetchErr || !vs) {
      return NextResponse.json({ error: 'Variant size not found' }, { status: 404 });
    }

    const newStock = vs.stock + additional_stock;

    const { error: updateErr } = await supabaseAdmin
      .from('variant_sizes')
      .update({ stock: newStock, updated_at: new Date().toISOString() })
      .eq('id', variant_size_id);

    if (updateErr) {
      console.error('Update stock error:', updateErr);
      return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
    }

    return NextResponse.json({ success: true, newStock });
  } catch (err) {
    console.error('Update stock route error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
