import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Definição de Cores do Tema (Tailwind colors aproximadas)
const COLORS = {
  primary: [59, 130, 246], // blue-500
  secondary: [15, 23, 42], // slate-900
  slate100: [241, 245, 249],
  slate500: [100, 116, 139],
}

// Helper para desenhar o Cabeçalho com "Logo"
const drawHeader = (doc: jsPDF, title: string) => {
  const pageWidth = doc.internal.pageSize.width

  // Fundo do Header
  doc.setFillColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2])
  doc.rect(0, 0, pageWidth, 40, 'F')

  // "Logo" (Simulado com texto e forma)
  doc.setFillColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
  doc.roundedRect(14, 10, 10, 10, 2, 2, 'F')
  
  doc.setFontSize(14)
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.text('NP', 15.5, 16.5) // Sigla NextPro

  doc.setFontSize(22)
  doc.text('NextPro', 28, 17)

  // Título do Relatório
  doc.setFontSize(16)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(200, 200, 200)
  doc.text(title, 14, 32)

  // Data/Hora no canto direito
  doc.setFontSize(10)
  doc.setTextColor(150, 150, 150)
  const dateStr = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
  doc.text(dateStr, pageWidth - 14, 32, { align: 'right' })

  // Linha decorativa
  doc.setDrawColor(COLORS.primary[0], COLORS.primary[1], COLORS.primary[2])
  doc.setLineWidth(1)
  doc.line(0, 40, pageWidth, 40)
}

// Helper para desenhar Rodapé
const drawFooter = (doc: jsPDF) => {
  const pageCount = doc.getNumberOfPages()
  const pageWidth = doc.internal.pageSize.width
  const pageHeight = doc.internal.pageSize.height

  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(COLORS.slate500[0], COLORS.slate500[1], COLORS.slate500[2])
    
    // Texto Esquerda
    doc.text('NextPro - Sistema de Gestão Esportiva', 14, pageHeight - 10)
    
    // Paginação Direita
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - 14, pageHeight - 10, { align: 'right' })
  }
}

// ----------------------------------------------------------------------
// Relatório de Escolas
// ----------------------------------------------------------------------
export const generateSchoolsReport = (schools: any[]) => {
  const doc = new jsPDF()

  // Header Personalizado
  drawHeader(doc, 'Relatório de Escolas e Unidades')

  // Tabela
  const tableColumn = ["Nome", "Documento", "Endereço", "Status", "Alunos"]
  const tableRows = schools.map(school => [
    school.name,
    school.document || 'N/A',
    school.address || 'N/A',
    school.active ? 'Ativa' : 'Inativa',
    school.studentsCount || 0
  ])

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 50,
    theme: 'grid',
    headStyles: { 
      fillColor: COLORS.secondary,
      textColor: [255, 255, 255],
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: COLORS.slate100
    },
    styles: { 
      fontSize: 10, 
      cellPadding: 4,
      textColor: [50, 50, 50]
    },
  })

  // Footer
  drawFooter(doc)

  doc.save(`relatorio-escolas-${new Date().toISOString().split('T')[0]}.pdf`)
}

// ----------------------------------------------------------------------
// Relatório do Dashboard (Visão Geral)
// ----------------------------------------------------------------------
export const generateDashboardReport = (kpiData: any, auditLogs: any[]) => {
  const doc = new jsPDF()
  
  drawHeader(doc, 'Resumo Executivo do Dashboard')

  let currentY = 50

  // Seção de KPIs (Simples listagem formatada, já que desenhar cards é complexo)
  doc.setFontSize(14)
  doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2])
  doc.setFont('helvetica', 'bold')
  doc.text('Indicadores de Desempenho (KPIs)', 14, currentY)
  
  currentY += 10

  const kpiRows = [
    ['Métrica', 'Valor', 'Status'],
    ['Total de Alunos', kpiData.students, '+12% vs mês anterior'],
    ['Receita Mensal', kpiData.revenue, '+8% vs mês anterior'],
    ['Taxa de Frequência', kpiData.attendance, 'Estável'],
    ['Novas Matrículas', kpiData.newEnrollments, '+5% vs mês anterior']
  ]

  autoTable(doc, {
    startY: currentY,
    head: [kpiRows[0]],
    body: kpiRows.slice(1),
    theme: 'striped',
    headStyles: { fillColor: COLORS.primary },
    styles: { fontSize: 11, cellPadding: 5 }
  })

  // @ts-ignore
  currentY = doc.lastAutoTable.finalY + 20

  // Seção de Auditoria Recente
  doc.setFontSize(14)
  doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2])
  doc.text('Últimas Atividades Registradas', 14, currentY)
  
  currentY += 10

  const auditRows = auditLogs.map(log => [
    log.time,
    log.action,
    log.user,
    log.detail
  ])

  autoTable(doc, {
    startY: currentY,
    head: [['Horário', 'Ação', 'Usuário', 'Detalhes']],
    body: auditRows,
    theme: 'grid',
    headStyles: { fillColor: COLORS.secondary },
    styles: { fontSize: 9 }
  })

  drawFooter(doc)

  doc.save(`relatorio-dashboard-${new Date().toISOString().split('T')[0]}.pdf`)
}
