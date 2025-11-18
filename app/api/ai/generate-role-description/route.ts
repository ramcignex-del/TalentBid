import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateRoleDescription } from '@/lib/ai/openai-client'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const description = await generateRoleDescription({
      title: body.title,
      salary: body.salary,
      perks: body.perks,
      companyName: body.companyName,
    })

    return NextResponse.json({ description })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate description' },
      { status: 500 }
    )
  }
}
