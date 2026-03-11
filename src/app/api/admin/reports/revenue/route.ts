import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-auth'
import { MOCK_ADMIN_BETS } from '@/lib/admin-mock-data'
import { TIER_LABELS } from '@/types/admin'

export async function GET() {
  try {
    const auth = await requireAdmin()
    if (auth.error) return auth.error

    if (auth.isMock || !auth.adminClient) {
      const bets = MOCK_ADMIN_BETS

      // Revenue by tier
      const byTier = Object.entries(TIER_LABELS).map(([tier, label]) => {
        const tierBets = bets.filter(b => b.tier === tier)
        return {
          tier,
          label,
          count: tierBets.length,
          revenue: tierBets.reduce((s, b) => s + b.stakePence, 0),
          payouts: tierBets.filter(b => b.status === 'paid' || b.status === 'verified').reduce((s, b) => s + b.potentialWinPence, 0),
        }
      })

      // Revenue by course
      const courseMap = new Map<string, { name: string; revenue: number; count: number }>()
      bets.forEach(b => {
        const existing = courseMap.get(b.courseName) || { name: b.courseName, revenue: 0, count: 0 }
        existing.revenue += b.stakePence
        existing.count += 1
        courseMap.set(b.courseName, existing)
      })
      const byCourse = Array.from(courseMap.values()).sort((a, b) => b.revenue - a.revenue)

      const totalRevenue = bets.reduce((s, b) => s + b.stakePence, 0)
      const totalPayouts = bets.filter(b => b.status === 'paid' || b.status === 'verified').reduce((s, b) => s + b.potentialWinPence, 0)

      return NextResponse.json({
        totalRevenue,
        totalPayouts,
        netProfit: totalRevenue - totalPayouts,
        margin: totalRevenue > 0 ? ((totalRevenue - totalPayouts) / totalRevenue * 100).toFixed(1) : '0',
        byTier,
        byCourse,
        totalBets: bets.length,
      })
    }

    const adminClient = auth.adminClient

    const { data: allBets } = await adminClient
      .from('bets')
      .select('tier, stake_pence, potential_win_pence, status, course_id, courses ( name )')

    const bets = allBets ?? []
    const totalRevenue = bets.reduce((s, b) => s + (b.stake_pence ?? 0), 0)
    const totalPayouts = bets
      .filter(b => b.status === 'paid')
      .reduce((s, b) => s + (b.potential_win_pence ?? 0), 0)

    const byTier = Object.entries(TIER_LABELS).map(([tier, label]) => {
      const tierBets = bets.filter(b => b.tier === tier)
      return {
        tier,
        label,
        count: tierBets.length,
        revenue: tierBets.reduce((s, b) => s + (b.stake_pence ?? 0), 0),
        payouts: tierBets.filter(b => b.status === 'paid').reduce((s, b) => s + (b.potential_win_pence ?? 0), 0),
      }
    })

    const courseMap = new Map<string, { name: string; revenue: number; count: number }>()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    bets.forEach((b: any) => {
      const name = b.courses?.name || 'Unknown'
      const existing = courseMap.get(name) || { name, revenue: 0, count: 0 }
      existing.revenue += b.stake_pence ?? 0
      existing.count += 1
      courseMap.set(name, existing)
    })
    const byCourse = Array.from(courseMap.values()).sort((a, b) => b.revenue - a.revenue)

    return NextResponse.json({
      totalRevenue,
      totalPayouts,
      netProfit: totalRevenue - totalPayouts,
      margin: totalRevenue > 0 ? ((totalRevenue - totalPayouts) / totalRevenue * 100).toFixed(1) : '0',
      byTier,
      byCourse,
      totalBets: bets.length,
    })
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
