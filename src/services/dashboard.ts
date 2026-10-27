export type DashboardDays = 7 | 30 | 90

export async function getDashboard(days: DashboardDays = 7) {
  const response = await fetch(`/api/dashboard?days=${days}`)

  if (!response.ok) {
    throw new Error('無法取得 Dashboard 資料')
  }

  return response.json()
}
