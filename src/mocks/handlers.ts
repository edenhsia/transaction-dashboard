import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import branches from '@/data/branches.json'
import transactions from '@/data/transactions.json'
import devices from '@/data/devices.json'
import type { Device } from '@/services/devices'
import type {
  DashboardComparison,
  DashboardInsight,
  DashboardSummary,
} from '@/services/dashboard'

const STORAGE_KEY = 'retail-lab-devices'

function createDashboardSummary(items: Array<{ amount: number; status: string }>): DashboardSummary {
  const successful = items.filter(function (transaction) {
    return transaction.status === 'success'
  })

  const totalAmount = successful.reduce(function (sum, transaction) {
    return sum + transaction.amount
  }, 0)

  const totalTransactions = items.length
  const successCount = successful.length

  return {
    totalAmount,
    totalTransactions,
    successRate: totalTransactions
      ? Number(((successCount / totalTransactions) * 100).toFixed(2))
      : 0,
    averageAmount: successCount ? Math.round(totalAmount / successCount) : 0,
  }
}

function getChangeRate(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null

  return Number((((current - previous) / previous) * 100).toFixed(1))
}

function createDashboardInsights(
  days: number,
  startDate: string,
  endDate: string,
  summary: DashboardSummary,
  comparison: DashboardComparison,
  items: Array<{ mid: string; status: string }>,
): DashboardInsight[] {
  const insights: DashboardInsight[] = []
  const amountChange = comparison.totalAmountChangeRate

  if (amountChange === null) {
    insights.push({
      id: 'total-amount',
      severity: 'info',
      title: '前期無交易金額可供比較',
      description: `目前顯示近 ${days} 天的成功交易總額。`,
    })
  } else if (amountChange === 0) {
    insights.push({
      id: 'total-amount',
      severity: 'info',
      title: '成功交易總額與前期持平',
      description: `近 ${days} 天的成功交易總額沒有明顯變化。`,
    })
  } else {
    insights.push({
      id: 'total-amount',
      severity: amountChange > 0 ? 'success' : 'warn',
      title: `成功交易總額較前 ${days} 天${amountChange > 0 ? '成長' : '下降'} ${Math.abs(amountChange).toFixed(1)}%`,
      description: amountChange > 0 ? '整體交易金額呈現成長。' : '建議持續觀察交易量與客單價。',
    })
  }

  const successRateChange = comparison.successRateChangePoints

  insights.push({
    id: 'success-rate',
    severity: successRateChange > 0 ? 'success' : successRateChange < 0 ? 'warn' : 'info',
    title:
      successRateChange === 0
        ? '交易成功率與前期持平'
        : `交易成功率較前 ${days} 天${successRateChange > 0 ? '上升' : '下降'} ${Math.abs(successRateChange).toFixed(1)} 個百分點`,
    description:
      successRateChange < 0 ? '建議檢查失敗交易與設備狀態。' : '目前交易成功率維持穩定。',
    action:
      successRateChange < 0
        ? {
            label: '查看失敗交易',
            query: {
              status: 'failed',
              startDate,
              endDate,
            },
          }
        : undefined,
  })

  const branchRates = branches
    .map(function (branch) {
      const branchItems = items.filter(function (item) {
        return item.mid === branch.mid
      })
      const successCount = branchItems.filter(function (item) {
        return item.status === 'success'
      }).length

      return {
        mid: branch.mid,
        name: branch.name,
        total: branchItems.length,
        successRate: branchItems.length ? (successCount / branchItems.length) * 100 : 0,
      }
    })
    .filter(function (branch) {
      return branch.total >= 5
    })
    .sort(function (a, b) {
      return a.successRate - b.successRate
    })

  const lowestBranch = branchRates[0]

  if (lowestBranch) {
    const gap = Number((summary.successRate - lowestBranch.successRate).toFixed(1))

    insights.push({
      id: 'branch-success-rate',
      severity: gap >= 3 ? 'warn' : 'info',
      title: `${lowestBranch.name}成功率最低，為 ${lowestBranch.successRate.toFixed(1)}%`,
      description:
        gap > 0
          ? `低於整體成功率 ${gap.toFixed(1)} 個百分點。`
          : '各分店成功率表現接近整體水準。',
      action: {
        label: '查看分店失敗交易',
        query: {
          mid: lowestBranch.mid,
          status: 'failed',
          startDate,
          endDate,
        },
      },
    })
  }

  return insights.slice(0, 3)
}

function getDevices(): Device[] {
  const stored = localStorage.getItem(STORAGE_KEY)

  if (!stored) return devices

  try {
    const parsed: unknown = JSON.parse(stored)

    if (
      !Array.isArray(parsed) ||
      parsed.length !== devices.length ||
      !parsed.every(function (item) {
        return (
          item !== null &&
          typeof item === 'object' &&
          typeof item.mid === 'string' &&
          typeof item.tid === 'string' &&
          typeof item.enabled === 'boolean'
        )
      })
    ) {
      localStorage.removeItem(STORAGE_KEY)
      return devices
    }

    return parsed as Device[]
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return devices
  }
}

export const handlers = [
  http.get('/api/transactions', function ({ request }) {
    const { searchParams } = new URL(request.url)

    const id = searchParams.get('id')
    const mid = searchParams.get('mid')
    const tid = searchParams.get('tid')
    const status = searchParams.get('status')
    const paymentMethod = searchParams.get('paymentMethod')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const page = Math.max(1, Number(searchParams.get('page')) || 1)

    const pageSize = Math.max(1, Math.min(100, Number(searchParams.get('pageSize')) || 10))

    const filtered = transactions
      .filter(function (transaction) {
        if (id && !transaction.id.includes(id)) return false
        if (mid && transaction.mid !== mid) return false
        if (tid && transaction.tid !== tid) return false
        if (status && transaction.status !== status) return false

        if (paymentMethod && transaction.paymentMethod !== paymentMethod) {
          return false
        }

        const date = transaction.createdAt.slice(0, 10)

        if (startDate && date < startDate) return false
        if (endDate && date > endDate) return false

        return true
      })
      .sort(function (a, b) {
        return b.createdAt.localeCompare(a.createdAt)
      })

    const start = (page - 1) * pageSize

    return HttpResponse.json({
      data: filtered.slice(start, start + pageSize),
      pagination: {
        page,
        pageSize,
        total: filtered.length,
      },
    })
  }),

  http.get('/api/transactions/:id', function ({ params }) {
    const transaction = transactions.find(function (item) {
      return item.id === params.id
    })

    if (!transaction) {
      return HttpResponse.json({ message: '找不到交易資料' }, { status: 404 })
    }

    return HttpResponse.json({
      data: transaction,
    })
  }),

  http.get('/api/dashboard', async function ({ request }) {
    await delay(1000)

    const { searchParams } = new URL(request.url)

    const rawDays = Number(searchParams.get('days') ?? 7)
    const days = [7, 30, 90].includes(rawDays) ? rawDays : 7

    const latestDate = transactions.reduce(function (latest, transaction) {
      const date = transaction.createdAt.slice(0, 10)
      return date > latest ? date : latest
    }, '')

    if (!latestDate) {
      return HttpResponse.json({ message: '目前沒有交易資料' }, { status: 404 })
    }

    const end = new Date(`${latestDate}T00:00:00Z`)
    const start = new Date(end)

    start.setUTCDate(start.getUTCDate() - (days - 1))

    const startDate = start.toISOString().slice(0, 10)
    const endDate = latestDate

    const filtered = transactions.filter(function (transaction) {
      const date = transaction.createdAt.slice(0, 10)
      return date >= startDate && date <= endDate
    })

    const previousEnd = new Date(start)
    previousEnd.setUTCDate(previousEnd.getUTCDate() - 1)

    const previousStart = new Date(previousEnd)
    previousStart.setUTCDate(previousStart.getUTCDate() - (days - 1))

    const previousStartDate = previousStart.toISOString().slice(0, 10)
    const previousEndDate = previousEnd.toISOString().slice(0, 10)

    const previousFiltered = transactions.filter(function (transaction) {
      const date = transaction.createdAt.slice(0, 10)
      return date >= previousStartDate && date <= previousEndDate
    })

    const successful = filtered.filter(function (transaction) {
      return transaction.status === 'success'
    })

    const summary = createDashboardSummary(filtered)
    const previousSummary = createDashboardSummary(previousFiltered)

    const comparison = {
      totalAmountChangeRate: getChangeRate(summary.totalAmount, previousSummary.totalAmount),
      totalTransactionsChangeRate: getChangeRate(
        summary.totalTransactions,
        previousSummary.totalTransactions,
      ),
      successRateChangePoints: Number(
        (summary.successRate - previousSummary.successRate).toFixed(1),
      ),
      averageAmountChangeRate: getChangeRate(
        summary.averageAmount,
        previousSummary.averageAmount,
      ),
    }

    const dailyMap = new Map<string, number>()

    successful.forEach(function (transaction) {
      const date = transaction.createdAt.slice(0, 10)

      dailyMap.set(date, (dailyMap.get(date) ?? 0) + transaction.amount)
    })

    const dailyTrend = []

    for (let i = 0; i < days; i++) {
      const current = new Date(start)
      current.setUTCDate(current.getUTCDate() + i)

      const date = current.toISOString().slice(0, 10)

      dailyTrend.push({
        date,
        amount: dailyMap.get(date) ?? 0,
      })
    }

    const statuses = ['success', 'failed', 'pending'] as const

    const statusDistribution = statuses.map(function (status) {
      return {
        status,
        count: filtered.filter(function (transaction) {
          return transaction.status === status
        }).length,
      }
    })

    const branchComparison = branches
      .map(function (branch) {
        const amount = successful.reduce(function (sum, transaction) {
          return transaction.mid === branch.mid ? sum + transaction.amount : sum
        }, 0)

        return {
          mid: branch.mid,
          name: branch.name,
          amount,
        }
      })
      .sort(function (a, b) {
        return b.amount - a.amount
      })

    const insights = createDashboardInsights(
      days,
      startDate,
      endDate,
      summary,
      comparison,
      filtered,
    )

    return HttpResponse.json({
      period: {
        days,
        startDate,
        endDate,
      },
      summary,
      comparison,
      insights,
      dailyTrend,
      statusDistribution,
      branchComparison,
    })
  }),

  http.get('/api/devices', function () {
    return HttpResponse.json({
      data: getDevices(),
    })
  }),

  http.patch('/api/devices/:mid/:tid', async function ({ params, request }) {
    const { mid, tid } = params
    const body: unknown = await request.json()

    if (
      typeof mid !== 'string' ||
      typeof tid !== 'string' ||
      !body ||
      typeof body !== 'object' ||
      !('enabled' in body) ||
      typeof body.enabled !== 'boolean'
    ) {
      return HttpResponse.json({ message: '無效的設備設定' }, { status: 400 })
    }

    const current = getDevices()

    const device = current.find(function (item) {
      return item.mid === mid && item.tid === tid
    })

    if (!device) {
      return HttpResponse.json({ message: '找不到設備' }, { status: 404 })
    }

    const updated = current.map(function (item) {
      if (item.mid === mid && item.tid === tid) {
        return {
          ...item,
          enabled: body.enabled,
        }
      }

      return item
    })

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

    return HttpResponse.json({
      data: {
        ...device,
        enabled: body.enabled,
      },
    })
  }),
]
