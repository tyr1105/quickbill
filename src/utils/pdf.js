import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

// 生成PDF导出
export async function exportToPDF(elementId, filename = 'invoice.pdf') {
  const element = document.getElementById(elementId)
  if (!element) return

  // 使用 html2canvas 截图，然后用 jsPDF 生成PDF
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    backgroundColor: '#ffffff',
  })

  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = canvas.width
  const imgHeight = canvas.height
  const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight)
  
  const imgX = (pdfWidth - imgWidth * ratio) / 2
  const imgY = 0

  pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio)
  pdf.save(filename)
}
