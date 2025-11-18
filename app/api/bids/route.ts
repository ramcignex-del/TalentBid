import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { calculateMatchScore, generateRoleDescription } from '@/lib/ai/openai-client'
import { sendNewBidNotification, sendNonCompetitiveBidNotification } from '@/lib/notifications'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const candidateId = searchParams.get('candidate_id')
    const employerId = searchParams.get('employer_id')

    // Get user profile to determine role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    let query = supabase.from('bids').select(`
      *,
      employer:employers(*),
      candidate:candidates(*)
    `)

    if (profile?.role === 'candidate') {
      // Candidates see all bids for them
      const { data: candidate } = await supabase
        .from('candidates')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (candidate) {
        query = query.eq('candidate_id', candidate.id)
      }
    } else if (profile?.role === 'employer') {
      // Employers see their own bids
      const { data: employer } = await supabase
        .from('employers')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (employer) {
        query = query.eq('employer_id', employer.id)
      }
    }

    if (candidateId) {
      query = query.eq('candidate_id', candidateId)
    }

    if (employerId) {
      query = query.eq('employer_id', employerId)
    }

    const { data: bids, error } = await query.order('created_at', { ascending: false })

    if (error) throw error

    // For employers, add competitive indicator and hide other bid amounts
    if (profile?.role === 'employer' && bids) {
      const processedBids = await Promise.all(
        bids.map(async (bid: any) => {
          // Get all bids for this candidate
          const { data: allCandidateBids } = await supabase
            .from('bids')
            .select('salary_offer')
            .eq('candidate_id', bid.candidate_id)
            .eq('status', 'pending')

          if (allCandidateBids && allCandidateBids.length > 0) {
            const amounts = allCandidateBids.map((b: any) => b.salary_offer).sort((a: number, b: number) => b - a)
            const highestBid = amounts[0]
            const candidateMinSalary = bid.candidate?.min_salary || 0

            let indicator: 'highest' | 'competitive' | 'not_competitive' = 'not_competitive'

            if (bid.salary_offer === highestBid) {
              indicator = 'highest'
            } else if (bid.salary_offer >= candidateMinSalary && bid.salary_offer >= highestBid * 0.9) {
              indicator = 'competitive'
            }

            return {
              ...bid,
              competitive_indicator: indicator,
              // Hide other employers' data
              candidate: {
                ...bid.candidate,
                // Keep candidate info visible
              },
            }
          }

          return bid
        })
      )

      return NextResponse.json(processedBids)
    }

    return NextResponse.json(bids)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bids' },
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

    // Get employer ID
    const { data: employer } = await supabase
      .from('employers')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (!employer) {
      return NextResponse.json({ error: 'Employer profile not found' }, { status: 404 })
    }

    // Get candidate data
    const { data: candidate } = await supabase
      .from('candidates')
      .select('*')
      .eq('id', body.candidate_id)
      .single()

    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    // Validate bid amount against minimum salary
    if (body.salary_offer < candidate.min_salary) {
      return NextResponse.json(
        { error: `Bid amount must be at least $${candidate.min_salary}` },
        { status: 400 }
      )
    }

    // Generate role description if not provided
    let roleDescription = body.role_description
    if (!roleDescription) {
      roleDescription = await generateRoleDescription({
        title: body.role_title,
        salary: body.salary_offer,
        perks: body.perks,
        companyName: employer.company_name,
      })
    }

    // Calculate match score
    const matchScore = await calculateMatchScore(
      {
        skills: candidate.skills || [],
        experienceYears: candidate.experience_years || 0,
        minSalary: candidate.min_salary,
      },
      {
        roleTitle: body.role_title,
        salaryOffer: body.salary_offer,
        roleDescription: roleDescription,
      }
    )

    const bidData = {
      employer_id: employer.id,
      candidate_id: body.candidate_id,
      salary_offer: body.salary_offer,
      currency: body.currency || 'USD',
      role_title: body.role_title,
      role_description: roleDescription,
      perks: body.perks || [],
      include_trial: body.include_trial || false,
      trial_duration_days: body.trial_duration_days,
      status: 'pending',
      match_score: matchScore,
    }

    const { data: bid, error } = await supabase
      .from('bids')
      .insert(bidData)
      .select()
      .single()

    if (error) throw error

    // Send notification to candidate
    await sendNewBidNotification({
      candidateEmail: candidate.email,
      candidateName: candidate.full_name,
      companyName: employer.company_name,
      roleTitle: body.role_title,
      salaryOffer: body.salary_offer,
    })

    // Check if bid is competitive
    const { data: allBids } = await supabase
      .from('bids')
      .select('salary_offer')
      .eq('candidate_id', body.candidate_id)
      .eq('status', 'pending')

    if (allBids && allBids.length > 1) {
      const highestBid = Math.max(...allBids.map((b: any) => b.salary_offer))
      if (body.salary_offer < highestBid && body.salary_offer < highestBid * 0.9) {
        await sendNonCompetitiveBidNotification({
          employerEmail: employer.email,
          companyName: employer.company_name,
          candidateName: candidate.full_name,
          roleTitle: body.role_title,
        })
      }
    }

    return NextResponse.json(bid, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create bid' },
      { status: 500 }
    )
  }
}
