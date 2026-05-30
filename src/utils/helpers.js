import { currencies } from '../data/currencies'

// 生成唯一ID
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

// 格式化金额
export function formatAmount(amount, currencyCode = 'CNY') {
  const currency = currencies.find(c => c.code === currencyCode) || currencies[0]
  return `${currency.symbol}${Number(amount || 0).toFixed(2)}`
}

// 计算发票总计
export function calculateInvoice(invoice) {
  const subtotal = (invoice.items || []).reduce((sum, item) => {
    return sum + (Number(item.quantity || 0) * Number(item.rate || 0))
  }, 0)
  
  const discountAmount = invoice.discountType === 'percent'
    ? subtotal * (Number(invoice.discount || 0) / 100)
    : Number(invoice.discount || 0)
  
  const afterDiscount = subtotal - discountAmount
  const taxAmount = afterDiscount * (Number(invoice.taxRate || 0) / 100)
  const total = afterDiscount + taxAmount

  return { subtotal, discountAmount, taxAmount, total }
}

// 生成发票编号
export function generateInvoiceNumber() {
  const now = new Date()
  const y = now.getFullYear().toString().slice(-2)
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const rand = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `INV-${y}${m}-${rand}`
}

// 创建空白发票
export function createBlankInvoice() {
  return {
    id: generateId(),
    number: generateInvoiceNumber(),
    date: new Date().toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    currency: 'CNY',
    template: 'modern',
    status: 'draft',
    from: { name: '', email: '', phone: '', address: '', logo: null },
    to: { name: '', email: '', phone: '', address: '' },
    items: [{ description: '', quantity: 1, rate: 0 }],
    taxRate: 0,
    discount: 0,
    discountType: 'percent',
    notes: '',
    terms: '请在到期日前付款。谢谢！',
  }
}
