import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifyAdminSession } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const tab = searchParams.get('tab') || 'critical stoke';

  try {
    // We use !inner to ensure we only get variant sizes that have valid products/variants.
    // Also removing the strict is('deleted_at', null) on the size level to see if it helps with visibility.
    let query = supabaseAdmin
      .from('variant_sizes')
      .select(`
        id, size, stock,
        product_variants!inner (
          id, color,
          products!inner ( id, name ),
          product_images ( image_url, sort_order )
        )
      `);

    if (tab === 'out of stoke') {
      // Tab "out of stoke": <= 0
      query = query.lte('stock', 0);
    } else if (tab === 'critical stoke') {
      // Tab "critical stoke": 1 to 5
      query = query.lte('stock', 5).gt('stock', 0);
    } else if (tab === 'all') {
      // All problematic stocks: <= 5
      query = query.lte('stock', 5);
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
  const isAdmin = await verifyAdminSession();
  if (!isAdmin) {
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
