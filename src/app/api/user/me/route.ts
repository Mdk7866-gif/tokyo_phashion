import { createClient } from '../../../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  // Get the current authenticated user
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ user: null })
  }

  // Fetch extra data from our 'users' table and 'addresses'
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select(`
      *,
      addresses (
        *
      )
    `)
    .eq("id", user.id)
    .single();

  if (userError) {
    console.error("Error fetching user detail:", userError);
    // Fallback to basic auth info
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || '',
        avatar: user.user_metadata?.avatar_url || '',
      }
    });
  }

  // Find default address
  const defaultAddress = userData.addresses?.find((a: any) => a.is_default && !a.deleted_at);

  return NextResponse.json({
    user: {
      ...userData,
      address: defaultAddress || null
    }
  });
}
