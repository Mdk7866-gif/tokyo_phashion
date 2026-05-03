import { createClient } from '../../../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  // Get the current authenticated user
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ user: null })
  }

  // We only return what the frontend needs to stay clean
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || '',
      avatar: user.user_metadata?.avatar_url || '',
    }
  })
}
