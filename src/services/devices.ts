export type Device = {
  mid: string
  tid: string
  enabled: boolean
}

export type DevicesResponse = {
  data: Device[]
}

export type DeviceResponse = {
  data: Device
}

export async function getDevices(): Promise<DevicesResponse> {
  const response = await fetch('/api/devices')

  if (!response.ok) {
    throw new Error('取得設備列表失敗')
  }

  return response.json()
}

export async function updateDevice(
  mid: string,
  tid: string,
  enabled: boolean,
): Promise<DeviceResponse> {
  const response = await fetch(
    `/api/devices/${encodeURIComponent(mid)}/${encodeURIComponent(tid)}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ enabled }),
    },
  )

  if (!response.ok) {
    throw new Error('更新設備狀態失敗')
  }

  return response.json()
}
