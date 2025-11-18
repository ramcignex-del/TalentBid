import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendBidRejectedNotification } from '@/lib/notifications'

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

    // Reject this bid
    const { data: rejectedBid, error: rejectError } = await supabase
      .from('bids')
      .update({
        status: 'rejected',
        rejected_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (rejectError) throw rejectError

    // Send notification to employer
    await sendBidRejectedNotification({
      employerEmail: bid.employer.email,
      companyName: bid.employer.company_name,
      candidateName: bid.candidate.full_name,
      roleTitle: bid.role_title,
    })

    return NextResponse.json(rejectedBid)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to reject bid' },
      { status: 500 }
    )
  }
}
