import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export const generateSchoolsReport = (schools: any[]) => {
  const doc = new jsPDF()

  // Header
  doc.setFontSize(20)
  doc.setTextColor(40, 40, 40)
  doc.text('Relatório de Escolas - NextPro', 14, 22)

  doc.setFontSize(10)
  doc.setTextColor(100, 100, 100)
  doc.text(`Gerado em: ${new Date().toLocaleDateString()} às ${new Date().toLocaleTimeString()}`, 14, 30)

  // Table
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
    startY: 35,
    theme: 'grid',
    headStyles: { fillColor: [15, 23, 42] }, // Slate-900 like
    styles: { fontSize: 10, cellPadding: 3 },
  })

  // Footer
  const pageCount = doc.getNumberOfPages()
  for(let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.text(`Página ${i} de ${pageCount}`, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10)
  }

  doc.save(`relatorio-escolas-${new Date().toISOString().split('T')[0]}.pdf`)
}
