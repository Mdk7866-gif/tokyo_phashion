import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();

  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { 
      name, 
      mobile_number, 
      full_address, 
      city, 
      state, 
      pincode 
    } = body;

    // 1. Update User Table
    const { error: userUpdateError } = await supabase
      .from("users")
      .update({
        name,
        mobile_number,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (userUpdateError) throw userUpdateError;

    // 2. Handle Address (Upsert the default address)
    // First, check if a default address exists
    const { data: existingAddress, error: addressFetchError } = await supabase
      .from("addresses")
      .select("id")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .is("deleted_at", null)
      .single();

    if (addressFetchError && addressFetchError.code !== 'PGRST116') {
      throw addressFetchError;
    }

    if (existingAddress) {
      // Update existing default address
      const { error: addressUpdateError } = await supabase
        .from("addresses")
        .update({
          full_address,
          city,
          state,
          pincode,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingAddress.id);

      if (addressUpdateError) throw addressUpdateError;
    } else {
      // Create new default address
      const { error: addressInsertError } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          full_address,
          city,
          state,
          pincode,
          is_default: true,
        });

      if (addressInsertError) throw addressInsertError;
    }

    return NextResponse.json({ success: true, message: "Profile updated successfully" });

  } catch (error: any) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
