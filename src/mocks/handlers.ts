import { http, HttpResponse } from 'msw/http'
import { delay } from 'msw/utils/delay'
import branches from '@/data/branches.json'
import transactions from '@/data/transactions.json'

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

    const successful = filtered.filter(function (transaction) {
      return transaction.status === 'success'
    })

    const totalAmount = successful.reduce(function (sum, transaction) {
      return sum + transaction.amount
    }, 0)

    const totalTransactions = filtered.length
    const successCount = successful.length

    const summary = {
      totalAmount,
      totalTransactions,
      successRate: totalTransactions
        ? Number(((successCount / totalTransactions) * 100).toFixed(2))
        : 0,
      averageAmount: successCount ? Math.round(totalAmount / successCount) : 0,
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

    return HttpResponse.json({
      period: {
        days,
        startDate,
        endDate,
      },
      summary,
      dailyTrend,
      statusDistribution,
      branchComparison,
    })
  }),
]
