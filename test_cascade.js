const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function test() {
  console.log("Creating test category...");
  const { data: cat } = await supabase
    .from('categories')
    .insert([{ name: 'cascade_test_category' }])
    .select()
    .single();
    
  console.log("Creating test subcategory...");
  const { data: sub } = await supabase
    .from('subcategories')
    .insert([{ category_id: cat.id, name: 'cascade_test_sub' }])
    .select()
    .single();
    
  console.log("Creating test product...");
  const { data: prod, error: prodErr } = await supabase
    .from('products')
    .insert([{ subcategory_id: sub.id, name: 'cascade_test_product' }])
    .select()
    .single();
    
  if (prodErr) {
    console.error("Error creating product:", prodErr);
    // Cleanup
    await supabase.from('categories').delete().eq('id', cat.id);
    return;
  }
  console.log("Product created. ID:", prod.id);
  
  console.log("Trying to delete subcategory...");
  const { error: delSubErr } = await supabase
    .from('subcategories')
    .delete()
    .eq('id', sub.id);
    
  if (delSubErr) {
    console.error("Subcategory delete failed! Error:", delSubErr.message);
  } else {
    console.log("Subcategory delete succeeded! (Cascade delete is active for products)");
  }
  
  // Cleanup if it failed
  if (delSubErr) {
    console.log("Cleaning up product and category manually...");
    await supabase.from('products').delete().eq('id', prod.id);
    await supabase.from('categories').delete().eq('id', cat.id);
  } else {
    console.log("Cleaning up category...");
    await supabase.from('categories').delete().eq('id', cat.id);
  }
}

test();
