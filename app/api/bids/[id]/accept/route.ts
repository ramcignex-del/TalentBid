import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendBidAcceptedNotification } from '@/lib/notifications'

export async function POST(
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

    // Get bid with relations
    const { data: bid, error: bidError } = await supabase
      .from('bids')
      .select(`
        *,
        employer:employers(*),
        candidate:candidates(*)
      `)
      .eq('id', id)
      .single()

    if (bidError) throw bidError

    if (!bid) {
      return NextResponse.json({ error: 'Bid not found' }, { status: 404 })
    }

    // Verify user is the candidate
    const { data: candidate } = await supabase
      .from('candidates')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (!candidate || candidate.id !== bid.candidate_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Accept this bid
    const { data: acceptedBid, error: acceptError } = await supabase
      .from('bids')
      .update({
        status: 'accepted',
        accepted_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (acceptError) throw acceptError

    // Expire all other bids for this candidate
    await supabase
      .from('bids')
      .update({ status: 'expired' })
      .eq('candidate_id', bid.candidate_id)
      .neq('id', id)
      .eq('status', 'pending')

    // Send notification to employer
    await sendBidAcceptedNotification({
      employerEmail: bid.employer.email,
      companyName: bid.employer.company_name,
      candidateName: bid.candidate.full_name,
      roleTitle: bid.role_title,
    })

    return NextResponse.json(acceptedBid)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to accept bid' },
      { status: 500 }
    )
  }
}
