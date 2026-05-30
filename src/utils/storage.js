// localStorage 工具函数
const STORAGE_KEY = 'quickbill_invoices'
const SETTINGS_KEY = 'quickbill_settings'

export function saveInvoice(invoice) {
  const invoices = getAllInvoices()
  const idx = invoices.findIndex(i => i.id === invoice.id)
  if (idx >= 0) {
    invoices[idx] = invoice
  } else {
    invoices.unshift(invoice)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
}

export function getAllInvoices() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

export function deleteInvoice(id) {
  const invoices = getAllInvoices().filter(i => i.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices))
}

export function getSettings() {
  try {
    return JSON.parse(localStorage.getItem(SETTINGS_KEY) || '{}')
  } catch {
    return {}
  }
}

export function saveSettings(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
}
