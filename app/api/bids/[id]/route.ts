import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { sendBidAcceptedNotification, sendBidRejectedNotification } from '@/lib/notifications'

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

    const { data: bid, error } = await supabase
      .from('bids')
      .select(`
        *,
        employer:employers(*),
        candidate:candidates(*)
      `)
      .eq('id', id)
      .single()

    if (error) throw error

    return NextResponse.json(bid)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to fetch bid' },
      { status: 500 }
    )
  }
}

export async function PATCH(
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
    const body = await request.json()

    // Get existing bid
    const { data: existingBid } = await supabase
      .from('bids')
      .select('*, employer:employers(*), candidate:candidates(*)')
      .eq('id', id)
      .single()

    if (!existingBid) {
      return NextResponse.json({ error: 'Bid not found' }, { status: 404 })
    }

    // Check revision limit for employers
    if (body.salary_offer && existingBid.revision_count >= 3) {
      return NextResponse.json(
        { error: 'Maximum revision limit (3) reached' },
        { status: 400 }
      )
    }

    // Increment revision count if salary is being updated
    if (body.salary_offer && body.salary_offer !== existingBid.salary_offer) {
      body.revision_count = existingBid.revision_count + 1
    }

    const { data: bid, error } = await supabase
      .from('bids')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(bid)
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to update bid' },
      { status: 500 }
    )
  }
}
