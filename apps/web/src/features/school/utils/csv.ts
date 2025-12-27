export type ParsedCsv<Row extends Record<string, string>> = {
  headers: string[]
  rows: Row[]
}

export function normalizeCsvHeader(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_')
}

export function inferCsvDelimiter(headerLine: string): ',' | ';' {
  const commas = headerLine.split(',').length - 1
  const semicolons = headerLine.split(';').length - 1
  return semicolons > commas ? ';' : ','
}

export function parseCsv(text: string, delimiter: ',' | ';'): ParsedCsv<Record<string, string>> {
  const rows: string[][] = []
  let currentField = ''
  let currentRow: string[] = []
  let inQuotes = false

  const pushField = () => {
    currentRow.push(currentField)
    currentField = ''
  }

  const pushRow = () => {
    const isEmptyRow = currentRow.length === 1 && currentRow[0].trim() === ''
    if (!isEmptyRow) rows.push(currentRow)
    currentRow = []
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i]

    if (char === '"') {
      const nextChar = text[i + 1]
      if (inQuotes && nextChar === '"') {
        currentField += '"'
        i++
        continue
      }
      inQuotes = !inQuotes
      continue
    }

    if (!inQuotes && char === delimiter) {
      pushField()
      continue
    }

    if (!inQuotes && (char === '\n' || char === '\r')) {
      if (char === '\r' && text[i + 1] === '\n') i++
      pushField()
      pushRow()
      continue
    }

    currentField += char
  }

  pushField()
  pushRow()

  if (rows.length === 0) return { headers: [], rows: [] }

  const headers = rows[0].map((h) => h.trim())
  const dataRows = rows.slice(1)

  const objects = dataRows.map((r) => {
    const obj: Record<string, string> = {}
    headers.forEach((header, idx) => {
      obj[header] = (r[idx] ?? '').trim()
    })
    return obj
  })

  return { headers, rows: objects }
}

export function toIsoDate(value: string) {
  const raw = value.trim()
  if (!raw) return ''

  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw

  const m = raw.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (m) {
    const [, dd, mm, yyyy] = m
    return `${yyyy}-${mm}-${dd}`
  }

  const parsed = new Date(raw)
  if (Number.isNaN(parsed.getTime())) return ''

  const yyyy = parsed.getFullYear()
  const mm = String(parsed.getMonth() + 1).padStart(2, '0')
  const dd = String(parsed.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export function normalizeCpf(value: string) {
  return value.replace(/\D/g, '')
}

export function normalizePhone(value: string) {
  return value.replace(/\D/g, '')
}

