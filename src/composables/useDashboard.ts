import { useQuery } from '@tanstack/vue-query'
import { getDashboard, type DashboardDays } from '@/services/dashboard'

export function useDashboard(days: MaybeRefOrGetter<DashboardDays>) {
  return useQuery({
    queryKey: computed(function () {
      return ['dashboard', toValue(days)]
    }),
    queryFn: function () {
      return getDashboard(toValue(days))
    },
  })
}
