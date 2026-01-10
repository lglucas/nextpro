import jsPDF from 'jspdf'

type ColorTuple = [number, number, number]

export const COLORS: {
  primary: ColorTuple
  secondary: ColorTuple
  slate100: ColorTuple
  slate500: ColorTuple
} = {
  primary: [59, 130, 246],
  secondary: [15, 23, 42],
  slate100: [241, 245, 249],
  slate500: [100, 116, 139],
}

export const drawHeader = (doc: jsPDF, title: string) => {
  const pageWidth = doc.internal.pageSize.width

  doc.setFillColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2])
  doc.rect(0, 0, pageWidth, 40, 'F')

  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
  doc.roundedRect(14, 10, 10, 10, 2, 2, 'F')

  doc.setFontSize(14)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('NP', 15.5, 16.5)

  doc.setFontSize(22)
  doc.text('NextPro', 28, 17)

  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(200, 200, 200)
  doc.text(title, 14, 32)

  doc.setFontSize(10)
  doc.setTextColor(150, 150, 150)
  const dateStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
  doc.text(dateStr, pageWidth - 14, 32, { align: 'right' })

  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
  doc.setLineWidth(1)
  doc.line(0, 40, pageWidth, 40)
}

export const drawFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(COLORS.slate500[0], COLORS.slate500[1], COLORS.slate500[2])
    doc.text('NextPro - Sistema de Gestão Esportiva', 14, pageHeight - 10)
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 14, pageHeight - 10, { align: 'right' })
  }
}
