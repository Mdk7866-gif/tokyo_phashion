import { createClient } from '../../../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { origin } = new URL(request.url)
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/api/auth/callback`,
      queryParams: {
        prompt: 'select_account',
        access_type: 'offline',
      },
      skipBrowserRedirect: true, // This tells Supabase to return the URL instead of redirecting automatically
    },
  })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ url: data.url })
}
