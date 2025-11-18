import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const { data: candidate, error } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json(candidate)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch candidate' },
      { status: 500 }
    )
  }
}
