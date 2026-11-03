import branches from '@/data/branches.json'
import type { PaymentMethod, TransactionStatus } from '@/services/transactions'

export const branchMap: Record<string, string> = Object.fromEntries(
  branches.map(function (branch) {
    return [branch.mid, branch.name]
  }),
)

export const statusConfig: Record<
  TransactionStatus,
  { label: string; severity: 'success' | 'danger' | 'warn' }
> = {
  success: { label: '成功', severity: 'success' },
  failed: { label: '失敗', severity: 'danger' },
  pending: { label: '處理中', severity: 'warn' },
}

export const paymentLabels: Record<PaymentMethod, string> = {
  credit_card: '信用卡',
  mobile_payment: '行動支付',
}
