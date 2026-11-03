import { branchMap, statusConfig, paymentLabels } from '@/constants/transactions'
import { getTransactions, type Transaction, type TransactionQuery } from '@/services/transactions'

function escapeCsv(value: string | number) {
  let text = String(value)

  if (/^[\s]*[=+\-@]/.test(text)) {
    text = `'${text}`
  }

  return `"${text.replace(/"/g, '""')}"`
}

function createCsv(transactions: Transaction[]) {
  const headers = ['交易時間', '交易編號', '分店', 'MID', 'TID', '付款方式', '交易金額', '交易狀態']

  const rows = transactions.map(function (item) {
    return [
      item.createdAt.replace('T', ' ').slice(0, 19),
      item.id,
      branchMap[item.mid] ?? '',
      item.mid,
      item.tid,
      paymentLabels[item.paymentMethod],
      item.amount,
      statusConfig[item.status].label,
    ]
  })

  return [headers, ...rows]
    .map(function (row) {
      return row.map(escapeCsv).join(',')
    })
    .join('\r\n')
}

export async function exportTransactionsCsv(query: TransactionQuery) {
  const transactions: Transaction[] = []
  const pageSize = 100
  let page = 1
  let total = 0

  do {
    const result = await getTransactions({
      ...query,
      page,
      pageSize,
    })

    transactions.push(...result.data)
    total = result.pagination.total

    if (result.data.length === 0) break

    page++
  } while (transactions.length < total)

  const csv = '\uFEFF' + createCsv(transactions)
  const blob = new Blob([csv], {
    type: 'text/csv;charset=utf-8;',
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url

  const date = new Date().toLocaleDateString('sv-SE')

  link.download = `retail-lab-transactions-${date}.csv`

  document.body.appendChild(link)
  link.click()
  link.remove()

  setTimeout(function () {
    URL.revokeObjectURL(url)
  }, 0)
}
