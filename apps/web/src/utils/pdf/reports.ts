import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { COLORS, drawFooter, drawHeader } from '@/utils/pdf/core'

export const generateSchoolsReport = (
  schools: Array<{
    name: string
    document?: string | null
    address?: string | null
    active: boolean
    studentsCount?: number | null
  }>
) => {
  const doc = new jsPDF()
  drawHeader(doc, 'Relatório de Escolas e Unidades')

  const tableColumn = ['Nome', 'Documento', 'Endereço', 'Status', 'Alunos']
  const tableRows = schools.map((school) => [
    school.name,
    school.document || 'N/A',
    school.address || 'N/A',
    school.active ? 'Ativa' : 'Inativa',
    school.studentsCount || 0,
  ])

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 50,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.secondary,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: COLORS.slate100,
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
      textColor: [50, 50, 50],
    },
  })

  drawFooter(doc)
  doc.save(`relatorio-escolas-${new Date().toISOString().split('T')[0]}.pdf`)
}

export const generateDashboardReport = (
  kpiData: {
    students: string
    revenue: string
    attendance: string
    newEnrollments: string
  },
  auditLogs: Array<{
    time: string
    action: string
    user: string
    detail: string
  }>
) => {
  const doc = new jsPDF()
  drawHeader(doc, 'Resumo Executivo do Dashboard')

  let currentY = 50

  doc.setFontSize(14)
  doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2])
  doc.setFont('helvetica', 'bold')
  doc.text('Indicadores de Desempenho (KPIs)', 14, currentY)

  currentY += 10

  const toStatus = (value: string) => (value && value !== '—' ? 'OK' : 'Em breve')

  const kpiRows = [
    ['Métrica', 'Valor', 'Status'],
    ['Total de Alunos', kpiData.students, toStatus(kpiData.students)],
    ['Receita Mensal', kpiData.revenue, toStatus(kpiData.revenue)],
    ['Taxa de Frequência', kpiData.attendance, toStatus(kpiData.attendance)],
    ['Novas Matrículas', kpiData.newEnrollments, toStatus(kpiData.newEnrollments)],
  ]

  autoTable(doc, {
    startY: currentY,
    head: [kpiRows[0]],
    body: kpiRows.slice(1),
    theme: 'striped',
    headStyles: { fillColor: COLORS.primary },
    styles: { fontSize: 11, cellPadding: 5 },
  })

  const lastAutoTable = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
  currentY = (lastAutoTable?.finalY ?? currentY) + 20

  doc.setFontSize(14)
  doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2])
  doc.text('Últimas Atividades Registradas', 14, currentY)

  currentY += 10

  const auditRows = auditLogs.map((log) => [log.time, log.action, log.user, log.detail])

  autoTable(doc, {
    startY: currentY,
    head: [['Horário', 'Ação', 'Usuário', 'Detalhes']],
    body: auditRows,
    theme: 'grid',
    headStyles: { fillColor: COLORS.secondary },
    styles: { fontSize: 9 },
  })

  drawFooter(doc)
  doc.save(`relatorio-dashboard-${new Date().toISOString().split('T')[0]}.pdf`)
}

export const generateAttendanceReport = (params: {
  className: string
  session: {
    date: string
    start_time: string
    end_time: string
    topic?: string
  }
  rows: Array<{
    student: string
    status: 'present' | 'absent' | 'late' | 'excused'
    notes?: string
  }>
}) => {
  const doc = new jsPDF()
  drawHeader(doc, 'Lista de Presença (PDF)')

  const sessionDate = new Date(params.session.date).toLocaleDateString('pt-BR')
  const sessionTime = `${params.session.start_time.slice(0, 5)} - ${params.session.end_time.slice(0, 5)}`
  const topic = params.session.topic?.trim() ? params.session.topic.trim() : 'Sem tema definido'

  doc.setFontSize(12)
  doc.setTextColor(COLORS.secondary[0], COLORS.secondary[1], COLORS.secondary[2])
  doc.setFont('helvetica', 'bold')
  doc.text(params.className, 14, 52)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(COLORS.slate500[0], COLORS.slate500[1], COLORS.slate500[2])
  doc.text(`${sessionDate} • ${sessionTime} • ${topic}`, 14, 59)

  const statusLabel: Record<string, string> = {
    present: 'Presente',
    absent: 'Falta',
    late: 'Atraso',
    excused: 'Justificado',
  }

  const tableRows = params.rows.map((r) => [r.student, statusLabel[r.status] ?? r.status, r.notes || ''])

  autoTable(doc, {
    startY: 66,
    head: [['Aluno', 'Status', 'Observações']],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: COLORS.secondary, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: COLORS.slate100 },
    styles: { fontSize: 10, cellPadding: 4, textColor: [50, 50, 50] },
  })

  drawFooter(doc)
  doc.save(`lista-presenca-${params.className}-${new Date().toISOString().split('T')[0]}.pdf`)
}
