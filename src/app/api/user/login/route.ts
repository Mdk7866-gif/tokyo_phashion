import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'

// Helper to get the base URL
function getBaseUrl(request: Request) {
  const { origin } = new URL(request.url);
  
  // Always use the local origin during development (e.g., localhost or 127.0.0.1)
  if (process.env.NODE_ENV === 'development') {
    return origin;
  }
  
  // In production, force the use of the configured DOMAIN_NAME if available
  if (process.env.DOMAIN_NAME) {
    return `https://${process.env.DOMAIN_NAME}`;
  }
  
  return origin;
}

// 1. GET HANDLER: Handles the Google Callback
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const baseUrl = getBaseUrl(request)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      const user = data.user
      
      // Sync user to public.users table
      if (user.email) {
        const { data: existingUser } = await supabaseAdmin
          .from('users')
          .select('name')
          .eq('email', user.email)
          .single();

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

      // Sanitize the 'next' path to ensure it's relative
      let redirectPath = next
      if (next.startsWith('http')) {
        try {
          const nextUrl = new URL(next)
          redirectPath = nextUrl.pathname + nextUrl.search
        } catch {
          redirectPath = '/'
        }
      }

      return NextResponse.redirect(`${baseUrl}${redirectPath}`)
    }
  }

  return NextResponse.redirect(`${baseUrl}/login?error=auth_failed`)
}

// 2. POST HANDLER: Initiates the Google Login flow
export async function POST(request: Request) {
  const baseUrl = getBaseUrl(request)
  const supabase = await createClient()

  // Try to get next path from body
  let next = '/';
  try {
    const body = await request.json();
    next = body.next || '/';
  } catch {}

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${baseUrl}/api/user/login?next=${encodeURIComponent(next)}`,
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
