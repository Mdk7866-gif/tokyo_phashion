import { NextResponse } from 'next/server'
import { createClient } from '../../../lib/supabase/server'
import { supabaseAdmin } from '../../../lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in search params, use it as the redirection URL
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      const user = data.user
      
      // Sync user to public.users table
      const { error: syncError } = await supabaseAdmin
        .from('users')
        .upsert({
          id: user.id,
          name: user.user_metadata.full_name || user.email?.split('@')[0] || 'Unknown',
          email: user.email,
          google_id: user.id, // Using supabase user id as google_id for simplicity or mapping
          profile_image: user.user_metadata.avatar_url,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' })

      if (syncError) {
        console.error('Error syncing user to public.users:', syncError)
      }

      const forwardedHost = request.headers.get('x-forwarded-host') // i.e. localhost:3000
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that origin is localhost:3000
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
