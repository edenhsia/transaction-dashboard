export type DashboardDays = 7 | 30 | 90

export type DashboardSummary = {
  totalAmount: number
  totalTransactions: number
  successRate: number
  averageAmount: number
}

export type DashboardComparison = {
  totalAmountChangeRate: number | null
  totalTransactionsChangeRate: number | null
  successRateChangePoints: number
  averageAmountChangeRate: number | null
}

export type DashboardResponse = {
  period: {
    days: DashboardDays
    startDate: string
    endDate: string
  }
  summary: DashboardSummary
  comparison: DashboardComparison
  dailyTrend: Array<{ date: string; amount: number }>
  statusDistribution: Array<{
    status: 'success' | 'failed' | 'pending'
    count: number
  }>
  branchComparison: Array<{ mid: string; name: string; amount: number }>
}

export async function getDashboard(days: DashboardDays = 7): Promise<DashboardResponse> {
  const response = await fetch(`/api/dashboard?days=${days}`)

  if (!response.ok) {
    throw new Error('無法取得 Dashboard 資料')
  }

  return response.json()
}
