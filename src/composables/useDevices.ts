import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { getDevices, updateDevice } from '@/services/devices'

export function useDevices() {
  return useQuery({
    queryKey: ['devices'],
    queryFn: getDevices,
  })
}

export function useUpdateDevice() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: function (payload: { mid: string; tid: string; enabled: boolean }) {
      return updateDevice(payload.mid, payload.tid, payload.enabled)
    },
    onSuccess: function () {
      queryClient.invalidateQueries({ queryKey: ['devices'] })
    },
  })
}
