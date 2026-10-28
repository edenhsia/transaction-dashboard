import { useQuery } from '@tanstack/vue-query'
import { getTransactions, type TransactionQuery } from '@/services/transactions'

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
