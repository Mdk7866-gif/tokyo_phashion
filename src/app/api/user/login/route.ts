import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'

// 1. GET HANDLER: Handles the Google Callback
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      const user = data.user
      
      // Sync user to public.users table
      // 1. Check if user already exists to preserve their name if they've updated it in the dashboard
      if (user.email) {
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('name')
          .eq('email', user.email)
          .single();

        // 2. Determine the name: Existing > Google Metadata > Empty
        const nameToSet = existingUser?.name || (user.user_metadata?.full_name as string) || '';

        const { error: syncError } = await supabaseAdmin
          .from('users')
          .upsert({
            id: user.id,
            name: nameToSet, 
            email: user.email,
            google_id: user.id,
            profile_image: user.user_metadata?.avatar_url as string,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'email' })

        if (syncError) {
          console.error('Error syncing user to public.users:', syncError)
        }
      }

      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}

// 2. POST HANDLER: Initiates the Google Login flow
export async function POST(request: Request) {
  const { origin } = new URL(request.url)
  const supabase = await createClient()

  // Try to get next path from body
  let next = '/';
  try {
    const body = await request.json();
    next = body.next || '/';
  } catch (e) {}

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/api/user/login?next=${encodeURIComponent(next)}`,
      queryParams: {
        prompt: 'select_account',
        access_type: 'offline',
      },
      skipBrowserRedirect: true,
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ url: data.url })
}
