import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateProfileSummary } from '@/lib/ai/openai-client'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    const summary = await generateProfileSummary({
      fullName: body.fullName,
      skills: body.skills || [],
      experienceYears: body.experienceYears || 0,
      education: body.education,
      bio: body.bio,
    })

    return NextResponse.json({ summary })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
