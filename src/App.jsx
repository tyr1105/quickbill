import { useState, useEffect, useRef } from 'react'
import { currencies } from './data/currencies'
import { templates } from './data/templates'
import { saveInvoice, getAllInvoices, deleteInvoice } from './utils/storage'
import { exportToPDF } from './utils/pdf'
import { formatAmount, calculateInvoice, createBlankInvoice, generateId } from './utils/helpers'
import InvoicePreview from './components/InvoicePreview'
import ToolFooter from './components/ToolFooter'
import './index.css'

export default function App() {
  const [invoice, setInvoice] = useState(createBlankInvoice())
  const [savedInvoices, setSavedInvoices] = useState([])
  const [showSaved, setShowSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('edit') // edit | saved
  const previewRef = useRef(null)

  useEffect(() => {
    setSavedInvoices(getAllInvoices())
  }, [])

  // 更新发票字段的通用方法
  const updateField = (path, value) => {
    setInvoice(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      const keys = path.split('.')
      let obj = next
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]]
      obj[keys[keys.length - 1]] = value
      return next
    })
  }

  // 更新行项目
  const updateItem = (index, field, value) => {
    setInvoice(prev => {
      const next = JSON.parse(JSON.stringify(prev))
      next.items[index][field] = value
      return next
    })
  }

  // 添加行项目
  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, rate: 0 }]
    }))
  }

  // 删除行项目
  const removeItem = (index) => {
    if (invoice.items.length <= 1) return
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }))
  }

  // 保存发票
  const handleSave = () => {
    const toSave = { ...invoice, updatedAt: new Date().toISOString() }
    saveInvoice(toSave)
    setSavedInvoices(getAllInvoices())
    alert('保存成功！')
  }

  // 加载发票
  const loadInvoice = (inv) => {
    setInvoice(inv)
    setActiveTab('edit')
  }

  // 删除发票
  const handleDelete = (id) => {
    if (!confirm('确定要删除这张发票吗？')) return
    deleteInvoice(id)
    setSavedInvoices(getAllInvoices())
  }

  // 新建发票
  const handleNew = () => {
    setInvoice(createBlankInvoice())
  }

  // 导出PDF
  const handleExport = async () => {
    await exportToPDF('invoice-preview', `${invoice.number || 'invoice'}.pdf`)
  }

  // Logo上传
  const handleLogoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => updateField('from.logo', ev.target.result)
    reader.readAsDataURL(file)
  }

  const calc = calculateInvoice(invoice)
  const currentTemplate = templates.find(t => t.id === invoice.template) || templates[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">QuickBill</h1>
              <p className="text-xs text-gray-500">免费发票生成器</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleNew}
              className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
              + 新建
            </button>
            <button onClick={handleSave}
              className="px-3 py-1.5 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors">
              💾 保存
            </button>
            <button onClick={handleExport}
              className="px-3 py-1.5 text-sm bg-green-600 text-white hover:bg-green-700 rounded-lg transition-colors">
              📄 导出PDF
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 左侧：编辑区域 */}
          <div className="space-y-4 overflow-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
            {/* 基础信息 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                📋 发票信息
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-500">发票编号</label>
                  <input type="text" value={invoice.number} onChange={e => updateField('number', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">币种</label>
                  <select value={invoice.currency} onChange={e => updateField('currency', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    {currencies.map(c => (
                      <option key={c.code} value={c.code}>{c.symbol} {c.code} - {c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs text-gray-500">开票日期</label>
                  <input type="date" value={invoice.date} onChange={e => updateField('date', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">到期日期</label>
                  <input type="date" value={invoice.dueDate} onChange={e => updateField('dueDate', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              {/* 模板选择 */}
              <div className="mt-3">
                <label className="text-xs text-gray-500">发票模板</label>
                <div className="flex gap-2 mt-1">
                  {templates.map(t => (
                    <button key={t.id} onClick={() => updateField('template', t.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all ${
                        invoice.template === t.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                      }`}>
                      <span className="w-3 h-3 rounded-full" style={{ background: t.colors.primary }}></span>
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 开票方信息 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                🏢 开票方（您的信息）
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">公司/个人名称</label>
                  <input type="text" value={invoice.from.name} onChange={e => updateField('from.name', e.target.value)}
                    placeholder="公司名称或个人姓名"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">邮箱</label>
                  <input type="email" value={invoice.from.email} onChange={e => updateField('from.email', e.target.value)}
                    placeholder="email@example.com"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">电话</label>
                  <input type="tel" value={invoice.from.phone} onChange={e => updateField('from.phone', e.target.value)}
                    placeholder="138-0000-0000"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">地址</label>
                  <input type="text" value={invoice.from.address} onChange={e => updateField('from.address', e.target.value)}
                    placeholder="详细地址"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">公司Logo</label>
                  <div className="mt-1 flex items-center gap-3">
                    {invoice.from.logo && (
                      <img src={invoice.from.logo} alt="Logo" className="w-12 h-12 object-contain border rounded" />
                    )}
                    <label className="px-3 py-2 border border-gray-300 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                      📎 上传Logo
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                    {invoice.from.logo && (
                      <button onClick={() => updateField('from.logo', null)} className="text-red-500 text-sm">删除</button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 收票方信息 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                👤 收票方（客户信息）
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">客户名称</label>
                  <input type="text" value={invoice.to.name} onChange={e => updateField('to.name', e.target.value)}
                    placeholder="客户公司或个人名称"
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">邮箱</label>
                  <input type="email" value={invoice.to.email} onChange={e => updateField('to.email', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">电话</label>
                  <input type="tel" value={invoice.to.phone} onChange={e => updateField('to.phone', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs text-gray-500">地址</label>
                  <input type="text" value={invoice.to.address} onChange={e => updateField('to.address', e.target.value)}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            {/* 明细项目 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                📝 费用明细
              </h3>
              <div className="space-y-2">
                {/* 表头 */}
                <div className="grid grid-cols-12 gap-2 text-xs text-gray-500 px-1">
                  <div className="col-span-5">描述</div>
                  <div className="col-span-2">数量</div>
                  <div className="col-span-2">单价</div>
                  <div className="col-span-2 text-right">金额</div>
                  <div className="col-span-1"></div>
                </div>
                {invoice.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 items-center">
                    <input type="text" value={item.description} onChange={e => updateItem(i, 'description', e.target.value)}
                      placeholder="服务描述"
                      className="col-span-5 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    <input type="number" value={item.quantity} onChange={e => updateItem(i, 'quantity', e.target.value)}
                      min="0" step="1"
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    <input type="number" value={item.rate} onChange={e => updateItem(i, 'rate', e.target.value)}
                      min="0" step="0.01"
                      className="col-span-2 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                    <div className="col-span-2 text-right text-sm font-medium">
                      {formatAmount(item.quantity * item.rate, invoice.currency)}
                    </div>
                    <button onClick={() => removeItem(i)}
                      className="col-span-1 text-red-400 hover:text-red-600 text-lg">×</button>
                  </div>
                ))}
                <button onClick={addItem}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-colors">
                  + 添加项目
                </button>
              </div>

              {/* 合计 */}
              <div className="mt-4 border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">小计</span>
                  <span>{formatAmount(calc.subtotal, invoice.currency)}</span>
                </div>
                <div className="flex justify-between text-sm items-center gap-2">
                  <span className="text-gray-500">折扣</span>
                  <div className="flex items-center gap-2">
                    <input type="number" value={invoice.discount} onChange={e => updateField('discount', e.target.value)}
                      min="0" step="0.01"
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right" />
                    <select value={invoice.discountType} onChange={e => updateField('discountType', e.target.value)}
                      className="px-2 py-1 border border-gray-300 rounded text-sm">
                      <option value="percent">%</option>
                      <option value="fixed">固定</option>
                    </select>
                    <span className="text-gray-400 text-xs">
                      -{formatAmount(calc.discountAmount, invoice.currency)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-sm items-center gap-2">
                  <span className="text-gray-500">税率</span>
                  <div className="flex items-center gap-2">
                    <input type="number" value={invoice.taxRate} onChange={e => updateField('taxRate', e.target.value)}
                      min="0" max="100" step="0.1"
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm text-right" />
                    <span className="text-gray-400 text-xs">%</span>
                    <span className="text-gray-400 text-xs">
                      +{formatAmount(calc.taxAmount, invoice.currency)}
                    </span>
                  </div>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>合计</span>
                  <span style={{ color: currentTemplate.colors.primary }}>
                    {formatAmount(calc.total, invoice.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* 备注 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-3">📝 备注和条款</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500">备注</label>
                  <textarea value={invoice.notes} onChange={e => updateField('notes', e.target.value)}
                    rows={2} placeholder="付款备注..."
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500">条款</label>
                  <textarea value={invoice.terms} onChange={e => updateField('terms', e.target.value)}
                    rows={2} placeholder="付款条款..."
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
            </div>

            {/* 已保存的发票 */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center justify-between">
                <span>📁 已保存发票 ({savedInvoices.length})</span>
              </h3>
              {savedInvoices.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">暂无保存的发票</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-auto">
                  {savedInvoices.map(inv => (
                    <div key={inv.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 border border-gray-100">
                      <div className="flex-1 cursor-pointer" onClick={() => loadInvoice(inv)}>
                        <div className="text-sm font-medium">{inv.number}</div>
                        <div className="text-xs text-gray-500">{inv.to.name || '未填写'} · {formatAmount(calculateInvoice(inv).total, inv.currency)}</div>
                      </div>
                      <button onClick={() => handleDelete(inv.id)} className="text-red-400 hover:text-red-600 text-sm ml-2">删除</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 右侧：实时预览 */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">👁 实时预览</h3>
                <button onClick={handleExport}
                  className="px-3 py-1.5 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700">
                  📥 导出PDF
                </button>
              </div>
              <div className="overflow-auto border border-gray-100 rounded-lg" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                <InvoicePreview invoice={invoice} calc={calc} template={currentTemplate} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <ToolFooter />
    </div>
  )
}
