import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateProfileSummary } from '@/lib/ai/openai-client'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is employer to list all active candidates
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role === 'employer') {
      // List all active candidates for employers
      const { data: candidates, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) throw error
      return NextResponse.json(candidates)
    } else {
      // Get candidate's own profile
      const { data: candidate, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return NextResponse.json(candidate)
    }
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch candidates' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Generate AI profile summary if skills and experience provided
    let profileSummary = body.profile_summary
    if (!profileSummary && body.skills && body.skills.length > 0) {
      profileSummary = await generateProfileSummary({
        fullName: body.full_name,
        skills: body.skills,
        experienceYears: body.experience_years || 0,
        education: body.education,
        bio: body.bio,
      })
    }

    const candidateData = {
      user_id: user.id,
      full_name: body.full_name,
      email: body.email,
      phone: body.phone,
      location: body.location,
      min_salary: body.min_salary,
      currency: body.currency || 'USD',
      skills: body.skills || [],
      experience_years: body.experience_years || 0,
      education: body.education,
      bio: body.bio,
      profile_summary: profileSummary,
      allow_paid_trial: body.allow_paid_trial || false,
      trial_duration_days: body.trial_duration_days || 30,
      trial_rate_percentage: body.trial_rate_percentage || 50,
      is_active: true,
    }

    const { data, error } = await supabase
      .from('candidates')
      .insert(candidateData)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create candidate profile' },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Regenerate profile summary if requested
    if (body.regenerate_summary) {
      const { data: existingCandidate } = await supabase
        .from('candidates')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (existingCandidate) {
        body.profile_summary = await generateProfileSummary({
          fullName: body.full_name || existingCandidate.full_name,
          skills: body.skills || existingCandidate.skills,
          experienceYears: body.experience_years || existingCandidate.experience_years,
          education: body.education || existingCandidate.education,
          bio: body.bio || existingCandidate.bio,
        })
      }
    }

    delete body.regenerate_summary

    const { data, error } = await supabase
      .from('candidates')
      .update(body)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update candidate profile' },
      { status: 500 }
    )
  }
}
