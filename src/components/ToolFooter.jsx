const tools = [
  { name: 'QuickBill 发票', url: '/quickbill/', desc: '发票生成器' },
  { name: 'RedCover 封面', url: '/redcover/', desc: '小红书封面' },
  { name: 'WriteBoom 文案', url: '/writeboom/', desc: '文案生成' },
  { name: 'PicTool 图片', url: '/pictool/', desc: '图片工具箱' },
  { name: 'PDFKit', url: '/pdfkit/', desc: 'PDF工具' },
  { name: 'QRGen', url: '/qrgen/', desc: '二维码' },
  { name: 'ResumeCraft', url: '/resumecraft/', desc: '简历制作' },
  { name: 'ShotPro', url: '/shotpro/', desc: '截图美化' },
  { name: 'DevKit', url: '/devkit-tools/', desc: '开发工具' },
  { name: 'AI-Tools', url: '/ai-tools-box/', desc: 'AI工具集' },
]

export default function ToolFooter() {
  return (
    <footer className="mt-16 border-t border-gray-200 bg-gray-900 text-gray-300 py-10">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold text-white">🛠 更多免费工具</h3>
          <p className="text-sm text-gray-500 mt-1">全部免费，浏览器本地处理，隐私安全</p>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 text-center">
          {tools.map(t => (
            <a key={t.url} href={t.url} target="_blank" rel="noopener"
              className="px-3 py-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-xs">
              <div className="font-medium text-white">{t.name}</div>
              <div className="text-gray-500 mt-0.5">{t.desc}</div>
            </a>
          ))}
        </div>
        <div className="text-center mt-8 text-xs text-gray-600">
          © 2025-2026 QuickBill · 免费在线发票生成器 · 数据不上传服务器
        </div>
      </div>
    </footer>
  )
}
