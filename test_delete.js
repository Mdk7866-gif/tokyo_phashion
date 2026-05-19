const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
);

async function test() {
  console.log("Creating test category...");
  const t0 = Date.now();
  const { data: cat, error: catErr } = await supabase
    .from('categories')
    .insert([{ name: 'temp_test_category_xyz' }])
    .select()
    .single();
    
  if (catErr) {
    console.error("Error creating category:", catErr);
    return;
  }
  console.log(`Category created in ${Date.now() - t0}ms. ID: ${cat.id}`);
  
  console.log("Creating test subcategory...");
  const t1 = Date.now();
  const { data: sub, error: subErr } = await supabase
    .from('subcategories')
    .insert([{ category_id: cat.id, name: 'temp_test_sub_xyz' }])
    .select()
    .single();
    
  if (subErr) {
    console.error("Error creating subcategory:", subErr);
    // Cleanup cat
    await supabase.from('categories').delete().eq('id', cat.id);
    return;
  }
  console.log(`Subcategory created in ${Date.now() - t1}ms. ID: ${sub.id}`);
  
  console.log("Deleting subcategory...");
  const t2 = Date.now();
  const { error: delSubErr } = await supabase
    .from('subcategories')
    .delete()
    .eq('id', sub.id);
  console.log(`Subcategory delete took ${Date.now() - t2}ms. Error:`, delSubErr);
  
  console.log("Deleting category...");
  const t3 = Date.now();
  const { error: delCatErr } = await supabase
    .from('categories')
    .delete()
    .eq('id', cat.id);
  console.log(`Category delete took ${Date.now() - t3}ms. Error:`, delCatErr);
}

test();
