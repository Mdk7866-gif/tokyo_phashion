import { NextResponse } from 'next/server'
import { createClient } from '../../../../lib/supabase/server'
import { supabaseAdmin } from '../../../../lib/supabase/admin'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data?.user) {
      const user = data.user
      
      // Sync user to public.users table using the admin client
      const { error: syncError } = await supabaseAdmin
        .from('users')
        .upsert({
          id: user.id,
          name: '', // Leaving name empty as requested
          email: user.email,
          google_id: user.id,
          profile_image: user.user_metadata.avatar_url,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'email' })

      if (syncError) {
        console.error('Error syncing user to public.users:', syncError)
      }

      const forwardedHost = request.headers.get('x-forwarded-host')
      const isLocalEnv = process.env.NODE_ENV === 'development'
      
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
