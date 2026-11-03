import { useQuery } from '@tanstack/vue-query'
import { getTransactions, type TransactionQuery } from '@/services/transactions'
import { getTransaction } from '@/services/transactions'

export function useTransactions(query: MaybeRefOrGetter<TransactionQuery>) {
  return useQuery({
    queryKey: computed(function () {
      return ['transactions', toValue(query)]
    }),
    queryFn: function () {
      return getTransactions(toValue(query))
    },
  })
}

export function useTransaction(id: MaybeRefOrGetter<string>) {
  return useQuery({
    queryKey: computed(function () {
      return ['transaction', toValue(id)]
    }),
    queryFn: function () {
      return getTransaction(toValue(id))
    },
    enabled: computed(function () {
      return Boolean(toValue(id))
    }),
  })
}
