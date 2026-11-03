export type TransactionStatus = 'success' | 'failed' | 'pending'
export type PaymentMethod = 'credit_card' | 'mobile_payment'

export type Transaction = {
  id: string
  mid: string
  tid: string
  amount: number
  paymentMethod: PaymentMethod
  status: TransactionStatus
  createdAt: string
}

export type TransactionQuery = {
  page: number
  pageSize: number
  id?: string
  mid?: string
  status?: string
  startDate?: string
  endDate?: string
}

export type TransactionsResponse = {
  data: Transaction[]
  pagination: {
    page: number
    pageSize: number
    total: number
  }
}

export async function getTransactions(query: TransactionQuery): Promise<TransactionsResponse> {
  const params = new URLSearchParams()

  Object.entries(query).forEach(function ([key, value]) {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value))
    }
  })

  const response = await fetch(`/api/transactions?${params}`)

  if (!response.ok) {
    throw new Error('無法取得交易紀錄')
  }

  return response.json()
}

export type TransactionDetailResponse = {
  data: Transaction
}

export async function getTransaction(id: string): Promise<Transaction> {
  const response = await fetch(`/api/transactions/${encodeURIComponent(id)}`)

  if (!response.ok) {
    throw new Error('無法取得交易詳細資料')
  }

  const result: TransactionDetailResponse = await response.json()

  return result.data
}
