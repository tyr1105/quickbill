import { formatAmount } from '../utils/helpers'

export default function InvoicePreview({ invoice, calc, template }) {
  const { colors } = template
  const currency = invoice.currency || 'CNY'

  return (
    <div id="invoice-preview" style={{ 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '100%', 
      background: '#fff',
      padding: '32px 28px',
      fontSize: '13px',
      color: '#1f2937',
      lineHeight: 1.5,
    }}>
      {/* 头部区域 */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div style={{ flex: 1 }}>
          {invoice.from.logo && (
            <img src={invoice.from.logo} alt="Logo" style={{ height: 48, marginBottom: 8, objectFit: 'contain' }} />
          )}
          <div style={{ fontSize: 18, fontWeight: 700, color: colors.primary }}>
            {invoice.from.name || '您的公司名称'}
          </div>
          {invoice.from.email && <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{invoice.from.email}</div>}
          {invoice.from.phone && <div style={{ color: '#6b7280', fontSize: 12 }}>{invoice.from.phone}</div>}
          {invoice.from.address && <div style={{ color: '#6b7280', fontSize: 12 }}>{invoice.from.address}</div>}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: colors.primary, letterSpacing: 1 }}>
            INVOICE
          </div>
          <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
            <div>编号: <strong>{invoice.number}</strong></div>
            <div>日期: {invoice.date}</div>
            <div>到期: {invoice.dueDate}</div>
          </div>
        </div>
      </div>

      {/* 分隔线 */}
      <div style={{ height: 3, background: `linear-gradient(90deg, ${colors.primary}, ${colors.accent})`, borderRadius: 2, marginBottom: 24 }}></div>

      {/* 收票方 */}
      <div style={{ marginBottom: 24, padding: 16, background: colors.bg, borderRadius: 8 }}>
        <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: colors.primary, fontWeight: 600, marginBottom: 6 }}>
          收票方 (Bill To)
        </div>
        <div style={{ fontSize: 15, fontWeight: 600 }}>{invoice.to.name || '客户名称'}</div>
        {invoice.to.email && <div style={{ color: '#6b7280', fontSize: 12 }}>{invoice.to.email}</div>}
        {invoice.to.phone && <div style={{ color: '#6b7280', fontSize: 12 }}>{invoice.to.phone}</div>}
        {invoice.to.address && <div style={{ color: '#6b7280', fontSize: 12 }}>{invoice.to.address}</div>}
      </div>

      {/* 明细表格 */}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 20 }}>
        <thead>
          <tr>
            {['描述', '数量', '单价', '金额'].map((h, i) => (
              <th key={i} style={{ 
                padding: '10px 12px', 
                textAlign: i >= 1 ? 'right' : 'left',
                fontSize: 11,
                textTransform: 'uppercase',
                letterSpacing: 0.5,
                color: '#fff',
                background: colors.primary,
                fontWeight: 600,
                borderRadius: i === 0 ? '6px 0 0 0' : i === 3 ? '0 6px 0 0' : 0,
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item, i) => (
            <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
              <td style={{ padding: '10px 12px' }}>{item.description || '-'}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right' }}>{item.quantity}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right' }}>{formatAmount(item.rate, currency)}</td>
              <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 600 }}>
                {formatAmount(item.quantity * item.rate, currency)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 合计 */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ width: 260 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
            <span style={{ color: '#6b7280' }}>小计</span>
            <span>{formatAmount(calc.subtotal, currency)}</span>
          </div>
          {calc.discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
              <span style={{ color: '#6b7280' }}>折扣</span>
              <span style={{ color: '#dc2626' }}>-{formatAmount(calc.discountAmount, currency)}</span>
            </div>
          )}
          {calc.taxAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: 13 }}>
              <span style={{ color: '#6b7280' }}>税 ({invoice.taxRate}%)</span>
              <span>{formatAmount(calc.taxAmount, currency)}</span>
            </div>
          )}
          <div style={{ 
            display: 'flex', justifyContent: 'space-between', padding: '12px 0', 
            borderTop: `2px solid ${colors.primary}`, marginTop: 6,
            fontSize: 17, fontWeight: 700
          }}>
            <span>合计</span>
            <span style={{ color: colors.primary }}>{formatAmount(calc.total, currency)}</span>
          </div>
        </div>
      </div>

      {/* 备注和条款 */}
      {(invoice.notes || invoice.terms) && (
        <div style={{ marginTop: 24, padding: 16, background: '#f9fafb', borderRadius: 8 }}>
          {invoice.notes && (
            <div style={{ marginBottom: invoice.terms ? 12 : 0 }}>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: colors.primary, fontWeight: 600, marginBottom: 4 }}>
                备注
              </div>
              <div style={{ color: '#6b7280', fontSize: 12, whiteSpace: 'pre-wrap' }}>{invoice.notes}</div>
            </div>
          )}
          {invoice.terms && (
            <div>
              <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 1, color: colors.primary, fontWeight: 600, marginBottom: 4 }}>
                条款
              </div>
              <div style={{ color: '#6b7280', fontSize: 12, whiteSpace: 'pre-wrap' }}>{invoice.terms}</div>
            </div>
          )}
        </div>
      )}

      {/* 页脚 */}
      <div style={{ marginTop: 24, textAlign: 'center', color: '#9ca3af', fontSize: 10 }}>
        由 QuickBill 免费发票生成器创建
      </div>
    </div>
  )
}
