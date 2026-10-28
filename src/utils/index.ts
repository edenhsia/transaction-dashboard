export function reloadPage() {
  window.location.reload()
}

export function formatMoney(number: number) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  }).format(number)
}
