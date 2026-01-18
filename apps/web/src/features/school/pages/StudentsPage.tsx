import { useState, useEffect, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { UserPlus, Search, Edit, Save, X, Phone, UserCheck, Shield, Trash2, Power, User } from 'lucide-react'
import { StudentCsvImport } from '@/features/school/components/StudentCsvImport'
import { normalizeCpf, normalizePhone } from '@/features/school/utils/csv'
import { useAuditLog } from '@/hooks/useAuditLog'

interface Guardian {
  id: string
  full_name: string
  cpf?: string | null
  phone?: string | null
  email?: string | null
  school_id?: string | null
}

interface Student {
  id: string
  full_name: string
  birth_date: string
  guardian_id: string
  guardian?: Guardian // Join
  school_id?: string
  photo_url?: string | null
  blood_type?: string | null
  allergies?: string | null
  category: string
  active: boolean
  financial_status?: 'active' | 'warning' | 'blocked'
  class_students?: Array<{
    class_id: string
    class?: {
      id: string
      name: string
    } | null
  }>
}

interface School {
  id: string
  name: string
}

interface ClassRow {
  id: string
  name: string
  school_id: string | null
}

export function StudentsPage() {
  const { user, role } = useAuth()
  const { logAction } = useAuditLog()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [students, setStudents] = useState<Student[]>([])
  const [guardians, setGuardians] = useState<Guardian[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [savingStudent, setSavingStudent] = useState(false)
  const [editingStudentId, setEditingStudentId] = useState<string | null>(null)
  const [userSchoolId, setUserSchoolId] = useState<string | null>(null)
  const [schools, setSchools] = useState<School[]>([]) 
  const [classes, setClasses] = useState<ClassRow[]>([])
  const [studentSearchTerm, setStudentSearchTerm] = useState('')
  const [financialFilter, setFinancialFilter] = useState<'all' | 'active' | 'warning' | 'blocked'>('all')
  const [billingMode, setBillingMode] = useState(false)
  const [billingClassId, setBillingClassId] = useState<string>('all')
  const [selectedStudentIds, setSelectedStudentIds] = useState<Record<string, boolean>>({})
  const [bulkFinancialStatus, setBulkFinancialStatus] = useState<'active' | 'warning' | 'blocked'>('warning')
  const [billingMessageTemplate, setBillingMessageTemplate] = useState<'default' | 'warning' | 'blocked' | 'active'>('default')
  const [billingMessageBusy, setBillingMessageBusy] = useState(false)
  const [whatsQueueOpen, setWhatsQueueOpen] = useState(false)
  const [whatsQueueIndex, setWhatsQueueIndex] = useState(0)
  const [lastChargeByStudentId, setLastChargeByStudentId] = useState<Record<string, { created_at: string; channel: string; template: string | null }>>({})
  const [chargeRecencyFilter, setChargeRecencyFilter] = useState<'any' | 'none' | '24h' | '7d'>('any')
  
  // State para Busca de Responsável
  const [guardianSearchTerm, setGuardianSearchTerm] = useState('')
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null)
  const [isCreatingGuardian, setIsCreatingGuardian] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreviewUrl, setPhotoPreviewUrl] = useState<string | null>(null)
  const [photoRemoveRequested, setPhotoRemoveRequested] = useState(false)

  // Form Data (Aluno)
  const [formData, setFormData] = useState({
    full_name: '',
    birth_date: '',
    blood_type: '',
    allergies: '',
    school_id: ''
  })

  // Form Data (Novo Responsável)
  const [guardianForm, setGuardianForm] = useState({
    full_name: '',
    cpf: '',
    phone: '',
    email: ''
  })

  const fetchStudents = useCallback(async () => {
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        guardian:guardians (
          id,
          full_name,
          phone,
          email
        ),
        class_students:class_students (
          class_id,
          class:classes (
            id,
            name
          )
        )
      `)
      .order('created_at', { ascending: false })
    
    if (error) console.error('Erro ao buscar alunos:', error)
    else setStudents(data || [])
  }, [])

  const fetchClasses = useCallback(
    async (schoolId: string | null) => {
      const query = supabase.from('classes').select('id, name, school_id').order('name', { ascending: true })
      const { data, error } = schoolId && role !== 'super_admin' ? await query.eq('school_id', schoolId) : await query
      if (!error && data) setClasses(data as unknown as ClassRow[])
    },
    [role],
  )

  const fetchGuardians = useCallback(async () => {
    const { data, error } = await supabase
      .from('guardians')
      .select('*')
      .order('full_name', { ascending: true })
      
    if (!error && data) setGuardians(data)
  }, [])

  const fetchProfileAndData = useCallback(async () => {
    try {
      setLoading(true)
      let scopedSchoolId: string | null = null
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('school_id')
          .eq('id', user.id)
          .single()
        
        if (profile?.school_id) {
          scopedSchoolId = profile.school_id
          setUserSchoolId(profile.school_id)
          setFormData(prev => ({ ...prev, school_id: profile.school_id }))
        }
      }

      if (role === 'super_admin') {
        const { data: schoolsData } = await supabase.from('schools').select('id, name')
        if (schoolsData) setSchools(schoolsData)
      }

      await fetchClasses(scopedSchoolId)
      await fetchStudents()
      await fetchGuardians()

    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }, [fetchClasses, fetchGuardians, fetchStudents, role, user])

  useEffect(() => {
    fetchProfileAndData()
  }, [fetchProfileAndData])

  useEffect(() => {
    const next = searchParams.get('financial')
    if (next === 'active' || next === 'warning' || next === 'blocked' || next === 'all') {
      setFinancialFilter(next)
    }
    const cls = searchParams.get('class')
    if (cls) setBillingClassId(cls)
  }, [searchParams])

  useEffect(() => {
    return () => {
      if (photoPreviewUrl && photoPreviewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(photoPreviewUrl)
      }
    }
  }, [photoPreviewUrl])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleGuardianInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setGuardianForm(prev => ({ ...prev, [name]: value }))
  }

  const handleCreateGuardian = async () => {
    // Validação básica
    if (!guardianForm.full_name || !guardianForm.phone) {
      alert('Nome e Telefone do responsável são obrigatórios')
      return
    }

    try {
      const effectiveSchoolId = userSchoolId || formData.school_id
      if (!effectiveSchoolId) {
        alert('Selecione uma escola antes de criar o responsável.')
        return
      }

      const cpfKey = guardianForm.cpf ? normalizeCpf(guardianForm.cpf) : ''
      const phoneKey = guardianForm.phone ? normalizePhone(guardianForm.phone) : ''

      const payload = {
        school_id: effectiveSchoolId,
        full_name: guardianForm.full_name.trim(),
        cpf: cpfKey ? cpfKey : null,
        phone: phoneKey ? phoneKey : null,
        email: guardianForm.email.trim() ? guardianForm.email.trim() : null,
      }
      
      const { data, error } = await supabase
        .from('guardians')
        .insert(payload)
        .select()
        .single()

      if (error) throw error

      if (data) {
        setGuardians(prev => [...prev, data])
        setSelectedGuardian(data)
        setIsCreatingGuardian(false)
        alert('Responsável criado e selecionado!')
      }
    } catch (error) {
      console.error('Erro ao criar responsável:', error)
      const err = error as { code?: string; message?: string }
      if (err?.code === '23505') {
        alert('CPF já cadastrado. Verifique se já existe um responsável com esse CPF.')
        return
      }
      alert(`Erro ao criar responsável: ${err?.message || 'tente novamente.'}`)
    }
  }

  const validateForm = () => {
    if (!formData.full_name.trim()) return 'Nome completo é obrigatório'
    if (!formData.birth_date) return 'Data de nascimento é obrigatória'
    if (!selectedGuardian) return 'Selecione um responsável para o aluno'
    
    if (!formData.school_id && role === 'super_admin') {
      return 'Selecione uma escola'
    }

    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const errorMsg = validateForm()
    if (errorMsg) {
      alert(errorMsg)
      return
    }

    try {
      setSavingStudent(true)
      const effectiveSchoolId = userSchoolId || formData.school_id
      const payload = {
        ...formData,
        school_id: effectiveSchoolId,
        guardian_id: selectedGuardian?.id,
        category: calculateCategory(formData.birth_date)
      }

      const saveQuery = editingStudentId
        ? supabase.from('students').update(payload).eq('id', editingStudentId).select('id, school_id').single()
        : supabase.from('students').insert(payload).select('id, school_id').single()

      const { data: savedStudent, error: saveError } = await saveQuery
      if (saveError) throw saveError

      alert(editingStudentId ? 'Aluno atualizado com sucesso!' : 'Aluno cadastrado com sucesso!')

      if (savedStudent?.id && effectiveSchoolId) {
        const objectPath = `${effectiveSchoolId}/${savedStudent.id}`

        if (photoRemoveRequested && !photoFile) {
          await supabase.storage.from('student-photos').remove([objectPath])
          const { error: updatePhotoError } = await supabase.from('students').update({ photo_url: null }).eq('id', savedStudent.id)
          if (updatePhotoError) throw updatePhotoError
        }

        if (photoFile) {
          const { error: uploadError } = await supabase.storage.from('student-photos').upload(objectPath, photoFile, {
            upsert: true,
            contentType: photoFile.type || undefined,
          })
          if (uploadError) throw uploadError

          const publicUrl = supabase.storage.from('student-photos').getPublicUrl(objectPath).data.publicUrl
          const photoUrlWithVersion = `${publicUrl}?v=${Date.now()}`
          const { error: updatePhotoError } = await supabase.from('students').update({ photo_url: photoUrlWithVersion }).eq('id', savedStudent.id)
          if (updatePhotoError) throw updatePhotoError
        }
      }

      setIsCreating(false)
      setEditingStudentId(null)
      setSelectedGuardian(null)
      setGuardianSearchTerm('')
      setIsCreatingGuardian(false)
      setPhotoFile(null)
      setPhotoPreviewUrl(null)
      setPhotoRemoveRequested(false)
      fetchStudents()
      
      // Reset form
      setFormData({
        full_name: '',
        birth_date: '',
        blood_type: '',
        allergies: '',
        school_id: userSchoolId || ''
      })

    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert(editingStudentId ? 'Erro ao atualizar aluno.' : 'Erro ao cadastrar aluno.')
    } finally {
      setSavingStudent(false)
    }
  }

  const handleUpdateFinancialStatus = async (student: Student, next: 'active' | 'warning' | 'blocked') => {
    try {
      setSavingStudent(true)
      const prev = (student.financial_status ?? 'active') as 'active' | 'warning' | 'blocked'
      const { error } = await supabase.from('students').update({ financial_status: next }).eq('id', student.id)
      if (error) throw error
      if (prev !== next) {
        await logAction('update_student_financial_status', `Aluno: ${student.full_name}`, {
          student_id: student.id,
          previous_status: prev,
          next_status: next,
        })
      }
      await fetchStudents()
    } catch (error) {
      const err = error as { message?: string }
      alert(err?.message || 'Erro ao atualizar status financeiro')
    } finally {
      setSavingStudent(false)
    }
  }

  const calculateCategory = (birthDate: string) => {
    if (!birthDate) return 'N/A'
    const year = new Date(birthDate).getFullYear()
    const currentYear = new Date().getFullYear()
    const age = currentYear - year
    return `Sub-${Math.ceil(age / 2) * 2}`
  }

  const effectiveSchoolId = userSchoolId || formData.school_id
  const normalizedGuardianSearch = guardianSearchTerm.trim().toLowerCase()
  const guardianSearchDigits = normalizeCpf(guardianSearchTerm.trim())
  const guardiansInScope =
    role === 'super_admin' ? guardians.filter((g) => g.school_id === effectiveSchoolId) : guardians
  const filteredGuardians = normalizedGuardianSearch
    ? guardiansInScope.filter((g) => {
        const name = (g.full_name || '').toLowerCase()
        const cpf = g.cpf || ''
        const phone = g.phone || ''
        const email = (g.email || '').toLowerCase()
        return (
          name.includes(normalizedGuardianSearch) ||
          email.includes(normalizedGuardianSearch) ||
          (guardianSearchDigits ? cpf.includes(guardianSearchDigits) || phone.includes(guardianSearchDigits) : false)
        )
      })
    : guardiansInScope

  const normalizedStudentSearch = studentSearchTerm.trim().toLowerCase()
  const visibleStudentsBase = normalizedStudentSearch
    ? students.filter((student) => {
        const guardianName = student.guardian?.full_name || ''
        const guardianPhone = student.guardian?.phone || ''
        const guardianEmail = student.guardian?.email || ''
        return (
          student.full_name.toLowerCase().includes(normalizedStudentSearch) ||
          guardianName.toLowerCase().includes(normalizedStudentSearch) ||
          guardianPhone.toLowerCase().includes(normalizedStudentSearch) ||
          guardianEmail.toLowerCase().includes(normalizedStudentSearch)
        )
      })
    : students

  const blockedCount = students.filter((s) => (s.financial_status ?? 'active') === 'blocked').length
  const warningCount = students.filter((s) => (s.financial_status ?? 'active') === 'warning').length

  const classFilteredStudents =
    billingMode && billingClassId !== 'all'
      ? visibleStudentsBase.filter((s) => s.class_students?.some((cs) => cs.class_id === billingClassId))
      : visibleStudentsBase

  const chargeFilteredStudents =
    billingMode && chargeRecencyFilter !== 'any'
      ? classFilteredStudents.filter((student) => {
          const last = lastChargeByStudentId[student.id]
          if (!last) return chargeRecencyFilter === 'none'
          if (chargeRecencyFilter === 'none') return false
          const ms = Date.now() - new Date(last.created_at).getTime()
          if (chargeRecencyFilter === '24h') return ms <= 24 * 60 * 60 * 1000
          if (chargeRecencyFilter === '7d') return ms <= 7 * 24 * 60 * 60 * 1000
          return true
        })
      : classFilteredStudents

  const financialFilteredStudents =
    financialFilter === 'all' ? chargeFilteredStudents : chargeFilteredStudents.filter((s) => (s.financial_status ?? 'active') === financialFilter)

  const sortedVisibleStudents = [...financialFilteredStudents].sort((a, b) => {
    const order = (s: Student) => ((s.financial_status ?? 'active') === 'blocked' ? 0 : (s.financial_status ?? 'active') === 'warning' ? 1 : 2)
    const diff = order(a) - order(b)
    if (diff !== 0) return diff
    return a.full_name.localeCompare(b.full_name, 'pt-BR')
  })

  const selectedIds = Object.keys(selectedStudentIds).filter((id) => selectedStudentIds[id])
  const allPageSelected = sortedVisibleStudents.length > 0 && sortedVisibleStudents.every((s) => selectedStudentIds[s.id])

  const toggleSelectAllPage = () => {
    setSelectedStudentIds((prev) => {
      const next: Record<string, boolean> = { ...prev }
      if (allPageSelected) {
        sortedVisibleStudents.forEach((s) => {
          delete next[s.id]
        })
      } else {
        sortedVisibleStudents.forEach((s) => {
          next[s.id] = true
        })
      }
      return next
    })
  }

  const toggleSelectStudent = (studentId: string) => {
    setSelectedStudentIds((prev) => ({ ...prev, [studentId]: !prev[studentId] }))
  }

  const clearSelection = () => setSelectedStudentIds({})

  const applyBulkFinancialStatus = async () => {
    if (selectedIds.length === 0) return
    if (role !== 'school_admin' && role !== 'super_admin') return
    const ok = confirm(`Aplicar "${bulkFinancialStatus}" para ${selectedIds.length} aluno(s)?`)
    if (!ok) return

    try {
      setSavingStudent(true)
      const { error } = await supabase.from('students').update({ financial_status: bulkFinancialStatus }).in('id', selectedIds)
      if (error) throw error

      await logAction('bulk_update_student_financial_status', 'Alunos (lote)', {
        student_ids: selectedIds,
        next_status: bulkFinancialStatus,
        class_id: billingClassId === 'all' ? null : billingClassId,
      })

      await fetchStudents()
      clearSelection()
    } catch (error) {
      const err = error as { message?: string }
      alert(err?.message || 'Erro ao atualizar status financeiro em lote')
    } finally {
      setSavingStudent(false)
    }
  }

  const formatPhoneForWhatsapp = (raw: string) => {
    const digits = (raw || '').replace(/\D/g, '')
    if (!digits) return null
    if (digits.startsWith('55')) return digits
    if (digits.length === 11 || digits.length === 10) return `55${digits}`
    return digits
  }

  const statusLabel = (status: Student['financial_status']) => {
    const s = status ?? 'active'
    return s === 'active' ? 'em dia' : s === 'warning' ? 'em aviso' : 'bloqueado'
  }

  const buildBillingMessage = (student: Student, template?: typeof billingMessageTemplate) => {
    const chosen = template ?? billingMessageTemplate
    const guardianName = student.guardian?.full_name?.trim() || 'Responsável'
    const base = `Olá, ${guardianName}. Aqui é da secretaria.`
    const line = `A mensalidade do atleta ${student.full_name} está ${statusLabel(student.financial_status)}.`
    const close = `Se já regularizou, desconsidere. Obrigado.`

    if (chosen === 'blocked') return `${base}\n${line}\nPor favor, regularize para liberar o acesso.\n${close}`
    if (chosen === 'warning') return `${base}\n${line}\nPor favor, verifique a pendência para evitar bloqueio.\n${close}`
    if (chosen === 'active') return `${base}\nA mensalidade do atleta ${student.full_name} está em dia.\n${close}`
    return `${base}\n${line}\n${close}`
  }

  const selectedStudents = sortedVisibleStudents.filter((s) => selectedStudentIds[s.id])
  const whatsQueueStudents = selectedStudents
    .map((student) => ({ student, phone: formatPhoneForWhatsapp(student.guardian?.phone || '') }))
    .filter((row): row is { student: Student; phone: string } => Boolean(row.phone))

  useEffect(() => {
    let mounted = true
    const run = async () => {
      if (!billingMode) return
      const ids = sortedVisibleStudents.map((s) => s.id).slice(0, 500)
      if (ids.length === 0) {
        if (mounted) setLastChargeByStudentId({})
        return
      }

      const { data, error } = await supabase
        .from('financial_charge_events')
        .select('student_id, channel, template, created_at')
        .in('student_id', ids)
        .order('created_at', { ascending: false })
        .limit(2000)

      if (!mounted) return
      if (error || !data) return

      const next: Record<string, { created_at: string; channel: string; template: string | null }> = {}
      for (const row of data as unknown as Array<{ student_id: string; channel: string; template: string | null; created_at: string }>) {
        if (!next[row.student_id]) {
          next[row.student_id] = { created_at: row.created_at, channel: row.channel, template: row.template }
        }
      }
      setLastChargeByStudentId(next)
    }

    void run()

    return () => {
      mounted = false
    }
  }, [billingMode, sortedVisibleStudents])

  const recordChargeEvents = async (rows: Array<{ student: Student; channel: string; template: string | null; meta?: object }>) => {
    if (!user?.id) return
    if (role !== 'school_admin' && role !== 'super_admin') return
    try {
      const payload = rows.map((r) => ({
        student_id: r.student.id,
        guardian_id: r.student.guardian_id || null,
        school_id: r.student.school_id || null,
        actor_id: user.id,
        channel: r.channel,
        template: r.template,
        status_at_time: r.student.financial_status ?? 'active',
        meta: r.meta ?? {},
      }))
      const { error } = await supabase.from('financial_charge_events').insert(payload)
      if (error) throw error
    } catch (err) {
      console.error('Falha ao registrar histórico de cobrança:', err)
    }
  }

  const copyBillingMessages = async () => {
    if (selectedStudents.length === 0) return
    setBillingMessageBusy(true)
    try {
      const blocks = selectedStudents.map((student) => {
        const phone = student.guardian?.phone || ''
        const header = `Para: ${student.guardian?.full_name || 'Responsável'} (${phone || 'sem telefone'})`
        return `${header}\n${buildBillingMessage(student)}`
      })
      await navigator.clipboard.writeText(blocks.join('\n\n---\n\n'))
      await recordChargeEvents(selectedStudents.map((student) => ({ student, channel: 'clipboard', template: billingMessageTemplate })))
      await logAction('bulk_copy_financial_message', 'Financeiro (lote)', {
        student_ids: selectedStudents.map((s) => s.id),
        class_id: billingClassId === 'all' ? null : billingClassId,
        template: billingMessageTemplate,
      })
      alert('Mensagens copiadas!')
    } catch {
      alert('Não consegui copiar. Tente novamente.')
    } finally {
      setBillingMessageBusy(false)
    }
  }

  const openWhatsappForFirstSelected = async () => {
    if (selectedStudents.length === 0) return
    const student = selectedStudents[0]
    const phone = formatPhoneForWhatsapp(student.guardian?.phone || '')
    if (!phone) {
      alert('Responsável sem telefone válido.')
      return
    }
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(buildBillingMessage(student))}`
    window.open(url, '_blank', 'noopener,noreferrer')
    await recordChargeEvents([{ student, channel: 'whatsapp', template: billingMessageTemplate }])
    await logAction('open_whatsapp_financial_message', 'Financeiro (WhatsApp)', {
      student_id: student.id,
      class_id: billingClassId === 'all' ? null : billingClassId,
      template: billingMessageTemplate,
    })
  }

  const settleAndCopyMessages = async () => {
    if (selectedStudents.length === 0) return
    if (role !== 'school_admin' && role !== 'super_admin') return
    const ok = confirm(`Marcar como "em dia" e copiar mensagem para ${selectedStudents.length} aluno(s)?`)
    if (!ok) return

    setSavingStudent(true)
    setBillingMessageBusy(true)
    try {
      const ids = selectedStudents.map((s) => s.id)
      const { error } = await supabase.from('students').update({ financial_status: 'active' }).in('id', ids)
      if (error) throw error

      const blocks = selectedStudents.map((student) => {
        const phone = student.guardian?.phone || ''
        const header = `Para: ${student.guardian?.full_name || 'Responsável'} (${phone || 'sem telefone'})`
        return `${header}\n${buildBillingMessage(student, 'active')}`
      })
      await navigator.clipboard.writeText(blocks.join('\n\n---\n\n'))
      await recordChargeEvents(selectedStudents.map((student) => ({ student, channel: 'clipboard', template: 'active', meta: { settle: true } })))

      await logAction('bulk_settle_and_copy_financial_message', 'Financeiro (lote)', {
        student_ids: ids,
        class_id: billingClassId === 'all' ? null : billingClassId,
      })

      await fetchStudents()
      clearSelection()
      alert('Status atualizado e mensagens copiadas!')
    } catch (error) {
      const err = error as { message?: string }
      alert(err?.message || 'Erro ao quitar e copiar mensagem')
    } finally {
      setBillingMessageBusy(false)
      setSavingStudent(false)
    }
  }

  const openWhatsappForQueueIndex = async (index: number) => {
    const row = whatsQueueStudents[index]
    if (!row) return
    const url = `https://wa.me/${row.phone}?text=${encodeURIComponent(buildBillingMessage(row.student))}`
    window.open(url, '_blank', 'noopener,noreferrer')
    await recordChargeEvents([{ student: row.student, channel: 'whatsapp', template: billingMessageTemplate }])
    await logAction('open_whatsapp_financial_message', 'Financeiro (WhatsApp)', {
      student_id: row.student.id,
      class_id: billingClassId === 'all' ? null : billingClassId,
      template: billingMessageTemplate,
    })
  }

  const visibleGuardianResults = normalizedGuardianSearch.length > 0 ? filteredGuardians : filteredGuardians.slice(0, 12)

  const openCreateForm = () => {
    setIsImporting(false)
    setEditingStudentId(null)
    setSelectedGuardian(null)
    setGuardianSearchTerm('')
    setIsCreatingGuardian(false)
    setPhotoFile(null)
    setPhotoPreviewUrl(null)
    setPhotoRemoveRequested(false)
    setFormData({
      full_name: '',
      birth_date: '',
      blood_type: '',
      allergies: '',
      school_id: userSchoolId || '',
    })
    setIsCreating(true)
  }

  const openEditForm = (student: Student) => {
    setIsImporting(false)
    setEditingStudentId(student.id)
    setGuardianSearchTerm('')
    setIsCreatingGuardian(false)
    setPhotoFile(null)
    setPhotoPreviewUrl(student.photo_url || null)
    setPhotoRemoveRequested(false)
    const school_id = (student.school_id || userSchoolId || formData.school_id || '').trim()
    setFormData({
      full_name: student.full_name || '',
      birth_date: student.birth_date || '',
      blood_type: student.blood_type || '',
      allergies: student.allergies || '',
      school_id,
    })
    const guardianFromList = guardians.find((g) => g.id === student.guardian_id) || null
    if (guardianFromList) {
      setSelectedGuardian(guardianFromList)
    } else if (student.guardian?.id) {
      setSelectedGuardian({
        id: student.guardian.id,
        full_name: student.guardian.full_name,
        cpf: null,
        phone: student.guardian.phone ?? null,
        email: student.guardian.email ?? null,
        school_id: school_id || null,
      })
    } else {
      setSelectedGuardian(null)
    }
    setIsCreating(true)
  }

  const handleDeleteStudent = async (student: Student) => {
    const ok = confirm(`Excluir o aluno "${student.full_name}"? Esta ação não pode ser desfeita.`)
    if (!ok) return
    try {
      setSavingStudent(true)
      if (student.school_id) {
        await supabase.storage.from('student-photos').remove([`${student.school_id}/${student.id}`])
      }
      const { error } = await supabase.from('students').delete().eq('id', student.id)
      if (error) throw error
      await fetchStudents()
    } catch (error) {
      console.error('Erro ao excluir aluno:', error)
      const err = error as { message?: string }
      alert(err?.message || 'Erro ao excluir aluno.')
    } finally {
      setSavingStudent(false)
    }
  }

  const handleToggleActive = async (student: Student) => {
    const next = !student.active
    const ok = confirm(`${next ? 'Ativar' : 'Inativar'} o aluno "${student.full_name}"?`)
    if (!ok) return
    try {
      setSavingStudent(true)
      const { error } = await supabase.from('students').update({ active: next }).eq('id', student.id)
      if (error) throw error
      await fetchStudents()
    } catch (error) {
      console.error('Erro ao atualizar status do aluno:', error)
      const err = error as { message?: string }
      alert(err?.message || 'Erro ao atualizar status do aluno.')
    } finally {
      setSavingStudent(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gestão de Alunos</h1>
          <p className="text-slate-500">
            {role === 'super_admin' ? 'Gerencie alunos de todas as unidades.' : 'Gerencie os atletas da sua escola.'}
          </p>
        </div>
        {!isCreating && !isImporting ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsImporting(true)}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              Importar CSV
            </button>
            <button
              onClick={openCreateForm}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Novo Aluno
            </button>
          </div>
        ) : null}
      </div>

      {isImporting && !isCreating ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">Importação em lote</p>
            <button
              type="button"
              onClick={() => setIsImporting(false)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50"
            >
              Fechar
            </button>
          </div>
          <StudentCsvImport
            role={role}
            userSchoolId={userSchoolId}
            schools={schools}
            onImported={async () => {
              await fetchStudents()
              await fetchGuardians()
              setIsImporting(false)
            }}
          />
        </div>
      ) : null}

      {/* Form de Criação */}
      {isCreating && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-slate-900">{editingStudentId ? 'Editar aluno' : 'Novo Cadastro de Aluno'}</h3>
            <button
              onClick={() => {
                setIsCreating(false)
                setEditingStudentId(null)
              }}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {role === 'super_admin' ? (
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Escola
                </h4>
                <label className="block text-sm font-medium text-slate-700 mb-1">Selecione a escola</label>
                <select
                  name="school_id"
                  value={formData.school_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  required
                >
                  <option value="">Selecione uma escola...</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
            
            {/* ETAPA 1: RESPONSÁVEL */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                1. Responsável Legal
              </h4>
              
              {!selectedGuardian ? (
                <div className="space-y-4">
                  {!isCreatingGuardian ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                          Buscar Responsável (Nome, CPF, Telefone ou Email)
                        </label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                            <input 
                              type="text"
                              value={guardianSearchTerm}
                              onChange={(e) => setGuardianSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 outline-none"
                              placeholder="Digite para buscar..."
                            />
                          </div>
                          <button 
                            type="button"
                            disabled={role === 'super_admin' && !formData.school_id}
                            onClick={() => setIsCreatingGuardian(true)}
                            className="px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            + Novo
                          </button>
                        </div>
                        {role === 'super_admin' && !formData.school_id ? (
                          <p className="mt-2 text-xs text-slate-600">Selecione uma escola acima para buscar/criar responsáveis.</p>
                        ) : null}
                      </div>
                      
                      {/* Resultados da Busca */}
                      <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-lg bg-white divide-y divide-slate-100">
                        {role === 'super_admin' && !formData.school_id ? (
                          <div className="p-4 text-center text-sm text-slate-500">Selecione uma escola para listar responsáveis.</div>
                        ) : visibleGuardianResults.length > 0 ? visibleGuardianResults.map(g => (
                            <div 
                              key={g.id} 
                              onClick={() => setSelectedGuardian(g)}
                              className="p-3 hover:bg-slate-50 cursor-pointer flex justify-between items-center"
                            >
                              <div>
                                <p className="text-sm font-medium text-slate-900">{g.full_name}</p>
                                <p className="text-xs text-slate-500">CPF: {g.cpf || 'N/A'} • Tel: {g.phone || 'N/A'}</p>
                              </div>
                              <UserCheck className="w-4 h-4 text-slate-400" />
                            </div>
                          )) : (
                          <div className="p-4 text-center text-sm text-slate-500">Nenhum responsável encontrado.</div>
                        )}
                      </div>
                    </>
                  ) : (
                    // Form de Criação Rápida de Responsável
                    <div className="bg-white p-4 rounded border border-slate-200 space-y-3 animate-in fade-in">
                      <div className="flex justify-between items-center mb-2">
                        <h5 className="text-sm font-semibold text-slate-800">Novo Responsável</h5>
                        <button type="button" onClick={() => setIsCreatingGuardian(false)} className="text-xs text-slate-500 hover:text-red-500">Cancelar</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          name="full_name"
                          placeholder="Nome Completo *"
                          value={guardianForm.full_name}
                          onChange={handleGuardianInputChange}
                          className="px-3 py-2 border rounded text-sm"
                        />
                        <input 
                          name="cpf"
                          placeholder="CPF"
                          value={guardianForm.cpf}
                          onChange={handleGuardianInputChange}
                          className="px-3 py-2 border rounded text-sm"
                        />
                        <input 
                          name="phone"
                          placeholder="Telefone *"
                          value={guardianForm.phone}
                          onChange={handleGuardianInputChange}
                          className="px-3 py-2 border rounded text-sm"
                        />
                        <input 
                          name="email"
                          placeholder="Email"
                          value={guardianForm.email}
                          onChange={handleGuardianInputChange}
                          className="px-3 py-2 border rounded text-sm"
                        />
                      </div>
                      <button 
                        type="button"
                        onClick={handleCreateGuardian}
                        className="w-full py-2 bg-slate-800 text-white text-sm rounded hover:bg-slate-900"
                      >
                        Salvar Responsável
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Card do Responsável Selecionado
                <div className="flex items-center justify-between bg-green-50 border border-green-200 p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold">
                      {selectedGuardian.full_name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{selectedGuardian.full_name}</p>
                      <p className="text-xs text-slate-600">CPF: {selectedGuardian.cpf || '---'} • {selectedGuardian.phone}</p>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setSelectedGuardian(null)}
                    className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 hover:bg-red-50 rounded"
                  >
                    Trocar
                  </button>
                </div>
              )}
            </div>

            {/* ETAPA 2: DADOS DO ALUNO */}
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-primary" />
                2. Dados do Aluno
              </h4>

              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center text-slate-600 font-bold">
                  {photoPreviewUrl ? (
                    <img src={photoPreviewUrl} alt="Foto do aluno" className="w-full h-full object-cover" />
                  ) : (
                    <span>{formData.full_name.trim() ? formData.full_name.trim()[0]?.toUpperCase() : 'NP'}</span>
                  )}
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Foto do aluno (opcional)</label>
                  <input
                    type="file"
                    accept="image/*"
                    disabled={savingStudent}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null
                      if (!file) {
                        setPhotoFile(null)
                        setPhotoPreviewUrl((prev) => (prev && prev.startsWith('blob:') ? null : prev))
                        return
                      }
                      if (file.size > 2 * 1024 * 1024) {
                        alert('A imagem deve ter no máximo 2MB.')
                        e.target.value = ''
                        return
                      }
                      setPhotoRemoveRequested(false)
                      setPhotoFile(file)
                      const nextUrl = URL.createObjectURL(file)
                      setPhotoPreviewUrl(nextUrl)
                    }}
                    className="block w-full text-sm text-slate-700 file:mr-4 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white hover:file:bg-slate-800 disabled:opacity-50"
                  />
                  <p className="mt-1 text-xs text-slate-500">Formatos comuns (JPG/PNG/WebP). Máx. 2MB.</p>
                  {editingStudentId ? (
                    <div className="mt-2 flex items-center gap-3">
                      <button
                        type="button"
                        disabled={savingStudent || (!photoPreviewUrl && !photoFile)}
                        onClick={() => {
                          setPhotoRemoveRequested(true)
                          setPhotoFile(null)
                          setPhotoPreviewUrl(null)
                        }}
                        className="text-xs text-red-600 hover:text-red-800 underline disabled:opacity-50"
                      >
                        Remover foto
                      </button>
                      {photoRemoveRequested ? <span className="text-xs text-slate-500">Remoção pendente (salve para aplicar).</span> : null}
                    </div>
                  ) : null}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nome Completo</label>
                  <input 
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Data de Nascimento</label>
                  <input 
                    type="date"
                    name="birth_date"
                    value={formData.birth_date}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    required
                  />
                </div>
              </div>

              {/* Saúde (Opcional) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tipo Sanguíneo</label>
                  <select 
                    name="blood_type"
                    value={formData.blood_type}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                  >
                    <option value="">Não sei</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Alergias</label>
                  <input 
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                    placeholder="Ex: Amendoim, Dipirona..."
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsCreating(false)
                  setEditingStudentId(null)
                }}
                disabled={savingStudent}
                className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={savingStudent}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {savingStudent ? 'Salvando...' : editingStudentId ? 'Salvar alterações' : 'Concluir Cadastro'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Alunos */}
      {students.length === 0 && !loading && !isCreating ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserPlus className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum aluno cadastrado</h3>
          <p className="text-slate-500 max-w-sm mx-auto mb-6">
            Comece adicionando os atletas da sua escola para gerenciar presenças e avaliações.
          </p>
          <button 
            onClick={openCreateForm}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            Cadastrar Primeiro Aluno
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {whatsQueueOpen ? (
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div className="text-sm text-slate-700">
                  <span className="font-semibold text-slate-900">Fila WhatsApp</span>{' '}
                  <span className="text-slate-500">
                    {whatsQueueStudents.length === 0 ? 'Sem destinatários válidos' : `${whatsQueueIndex + 1}/${whatsQueueStudents.length}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 justify-end flex-wrap">
                  <button
                    type="button"
                    onClick={() => setWhatsQueueOpen(false)}
                    className="inline-flex items-center gap-2 text-xs border border-slate-200 rounded px-3 py-2 bg-white hover:bg-slate-50"
                  >
                    Fechar
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhatsQueueIndex((v) => Math.max(0, v - 1))}
                    disabled={whatsQueueIndex <= 0}
                    className="inline-flex items-center gap-2 text-xs border border-slate-200 rounded px-3 py-2 bg-white hover:bg-slate-50 disabled:opacity-50"
                  >
                    Anterior
                  </button>
                  <button
                    type="button"
                    onClick={() => setWhatsQueueIndex((v) => Math.min(Math.max(0, whatsQueueStudents.length - 1), v + 1))}
                    disabled={whatsQueueStudents.length === 0 || whatsQueueIndex >= whatsQueueStudents.length - 1}
                    className="inline-flex items-center gap-2 text-xs border border-slate-200 rounded px-3 py-2 bg-white hover:bg-slate-50 disabled:opacity-50"
                  >
                    Próximo
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await openWhatsappForQueueIndex(whatsQueueIndex)
                      setWhatsQueueIndex((v) => Math.min(Math.max(0, whatsQueueStudents.length - 1), v + 1))
                    }}
                    disabled={whatsQueueStudents.length === 0}
                    className="inline-flex items-center gap-2 text-xs border border-slate-200 rounded px-3 py-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                  >
                    Abrir WhatsApp
                  </button>
                </div>
              </div>

              {whatsQueueStudents.length > 0 ? (
                <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
                  <p className="text-xs font-semibold text-slate-900">Prévia</p>
                  <p className="mt-1 text-sm text-slate-700 whitespace-pre-wrap">
                    {buildBillingMessage(whatsQueueStudents[Math.min(whatsQueueIndex, whatsQueueStudents.length - 1)].student)}
                  </p>
                </div>
              ) : null}
            </div>
          ) : null}
          {!isCreating && !isImporting ? (
            <div className="p-4 border-b border-slate-100 bg-white">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="relative max-w-md w-full">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    placeholder="Buscar aluno ou responsável..."
                    className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
                  />
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  <span className="text-xs text-slate-500">
                    Bloqueados: <span className="font-semibold text-slate-700">{blockedCount}</span> • Aviso:{' '}
                    <span className="font-semibold text-slate-700">{warningCount}</span>
                  </span>
                  <select
                    value={financialFilter}
                    onChange={(e) => {
                      const next = e.target.value as 'all' | 'active' | 'warning' | 'blocked'
                      setFinancialFilter(next)
                      setSearchParams((prev) => {
                        const nextParams = new URLSearchParams(prev)
                        if (next === 'all') nextParams.delete('financial')
                        else nextParams.set('financial', next)
                        return nextParams
                      })
                    }}
                    className="text-xs border border-slate-200 rounded px-2 py-2 bg-white"
                    aria-label="Filtro financeiro"
                  >
                    <option value="all">Financeiro: todos</option>
                    <option value="active">Financeiro: em dia</option>
                    <option value="warning">Financeiro: aviso</option>
                    <option value="blocked">Financeiro: bloqueado</option>
                  </select>

                  {(role === 'school_admin' || role === 'super_admin') ? (
                    <button
                      type="button"
                      onClick={() => {
                        setBillingMode((v) => {
                          const next = !v
                          setSearchParams((prev) => {
                            const nextParams = new URLSearchParams(prev)
                            if (!next) nextParams.delete('class')
                            return nextParams
                          })
                          if (!next) setBillingClassId('all')
                          clearSelection()
                          return next
                        })
                      }}
                      className="inline-flex items-center gap-2 text-xs border border-slate-200 rounded px-3 py-2 bg-white hover:bg-slate-50"
                    >
                      <Shield className="w-4 h-4 text-slate-500" />
                      {billingMode ? 'Sair do modo cobrança' : 'Modo cobrança'}
                    </button>
                  ) : null}
                </div>
              </div>

              {billingMode ? (
                <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div className="flex items-center gap-2">
                    <select
                      value={billingClassId}
                      onChange={(e) => {
                        const next = e.target.value
                        setBillingClassId(next)
                        clearSelection()
                        setSearchParams((prev) => {
                          const nextParams = new URLSearchParams(prev)
                          if (next === 'all') nextParams.delete('class')
                          else nextParams.set('class', next)
                          return nextParams
                        })
                      }}
                      className="text-xs border border-slate-200 rounded px-2 py-2 bg-white"
                      aria-label="Filtro de turma"
                    >
                      <option value="all">Turma: todas</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={chargeRecencyFilter}
                      onChange={(e) => {
                        setChargeRecencyFilter(e.target.value as 'any' | 'none' | '24h' | '7d')
                        clearSelection()
                      }}
                      className="text-xs border border-slate-200 rounded px-2 py-2 bg-white"
                      aria-label="Filtro de cobrança"
                    >
                      <option value="any">Cobrança: qualquer</option>
                      <option value="none">Cobrança: sem histórico</option>
                      <option value="24h">Cobrança: últimas 24h</option>
                      <option value="7d">Cobrança: últimos 7 dias</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 justify-end">
                    <span className="text-xs text-slate-500">
                      Selecionados: <span className="font-semibold text-slate-700">{selectedIds.length}</span>
                    </span>
                    <select
                      value={billingMessageTemplate}
                      onChange={(e) => setBillingMessageTemplate(e.target.value as 'default' | 'warning' | 'blocked' | 'active')}
                      className="text-xs border border-slate-200 rounded px-2 py-2 bg-white"
                      aria-label="Template de mensagem"
                    >
                      <option value="default">Mensagem: padrão</option>
                      <option value="warning">Mensagem: aviso</option>
                      <option value="blocked">Mensagem: bloqueio</option>
                      <option value="active">Mensagem: em dia</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => void copyBillingMessages()}
                      disabled={billingMessageBusy || savingStudent || selectedIds.length === 0}
                      className="inline-flex items-center gap-2 text-xs border border-slate-200 rounded px-3 py-2 bg-white hover:bg-slate-50 disabled:opacity-50"
                    >
                      {billingMessageBusy ? 'Copiando…' : 'Copiar mensagem'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void openWhatsappForFirstSelected()}
                      disabled={billingMessageBusy || savingStudent || selectedIds.length === 0}
                      className="inline-flex items-center gap-2 text-xs border border-slate-200 rounded px-3 py-2 bg-white hover:bg-slate-50 disabled:opacity-50"
                    >
                      WhatsApp (1º)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setWhatsQueueIndex(0)
                        setWhatsQueueOpen(true)
                      }}
                      disabled={billingMessageBusy || savingStudent || selectedIds.length === 0 || whatsQueueStudents.length === 0}
                      className="inline-flex items-center gap-2 text-xs border border-slate-200 rounded px-3 py-2 bg-white hover:bg-slate-50 disabled:opacity-50"
                    >
                      WhatsApp (fila)
                    </button>
                    <button
                      type="button"
                      onClick={() => void settleAndCopyMessages()}
                      disabled={billingMessageBusy || savingStudent || selectedIds.length === 0}
                      className="inline-flex items-center gap-2 text-xs border border-slate-200 rounded px-3 py-2 bg-white hover:bg-slate-50 disabled:opacity-50"
                    >
                      Quitar + copiar
                    </button>
                    <select
                      value={bulkFinancialStatus}
                      onChange={(e) => setBulkFinancialStatus(e.target.value as 'active' | 'warning' | 'blocked')}
                      className="text-xs border border-slate-200 rounded px-2 py-2 bg-white"
                      aria-label="Ação em massa"
                    >
                      <option value="active">Marcar em dia</option>
                      <option value="warning">Marcar aviso</option>
                      <option value="blocked">Marcar bloqueado</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => void applyBulkFinancialStatus()}
                      disabled={savingStudent || selectedIds.length === 0}
                      className="inline-flex items-center gap-2 text-xs border border-slate-200 rounded px-3 py-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr>
                  {billingMode ? (
                    <th className="px-4 py-4 text-xs font-semibold text-slate-500 uppercase">
                      <input
                        type="checkbox"
                        checked={allPageSelected}
                        onChange={toggleSelectAllPage}
                        className="h-4 w-4"
                        aria-label="Selecionar todos"
                      />
                    </th>
                  ) : null}
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Aluno</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Categoria</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Turmas</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Responsável</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Financeiro</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedVisibleStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                    {billingMode ? (
                      <td className="px-4 py-4 align-top">
                        <input
                          type="checkbox"
                          checked={Boolean(selectedStudentIds[student.id])}
                          onChange={() => toggleSelectStudent(student.id)}
                          disabled={savingStudent}
                          className="h-4 w-4"
                          aria-label={`Selecionar ${student.full_name}`}
                        />
                      </td>
                    ) : null}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 overflow-hidden flex items-center justify-center text-primary font-bold text-xs">
                          {student.photo_url ? (
                            <img src={student.photo_url} alt={student.full_name} className="w-full h-full object-cover" />
                          ) : (
                            student.full_name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{student.full_name}</p>
                          <p className="text-xs text-slate-500">{new Date(student.birth_date).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {student.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {student.class_students && student.class_students.length > 0 ? (
                          student.class_students.map((cs, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-purple-50 text-purple-700 text-xs rounded border border-purple-100">
                              {cs.class?.name}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">Sem turma</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-slate-900">{student.guardian?.full_name || '---'}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {student.guardian?.phone || '---'}
                      </div>
                      {billingMode && lastChargeByStudentId[student.id] ? (
                        <div className="text-xs text-slate-500 mt-1">
                          Cobrança: {new Date(lastChargeByStudentId[student.id].created_at).toLocaleString('pt-BR')} • {lastChargeByStudentId[student.id].channel}
                          {lastChargeByStudentId[student.id].template ? ` • ${lastChargeByStudentId[student.id].template}` : ''}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            (student.financial_status ?? 'active') === 'active'
                              ? 'bg-green-50 text-green-700 border border-green-100'
                              : (student.financial_status ?? 'active') === 'warning'
                                ? 'bg-amber-50 text-amber-700 border border-amber-100'
                                : 'bg-red-50 text-red-700 border border-red-100'
                          }`}
                        >
                          {(student.financial_status ?? 'active') === 'active' ? 'Em dia' : (student.financial_status ?? 'active') === 'warning' ? 'Aviso' : 'Bloqueado'}
                        </span>
                        <select
                          value={student.financial_status ?? 'active'}
                          onChange={(e) => void handleUpdateFinancialStatus(student, e.target.value as 'active' | 'warning' | 'blocked')}
                          disabled={savingStudent || (role !== 'school_admin' && role !== 'super_admin')}
                          className="text-xs border border-slate-200 rounded px-2 py-1 bg-white disabled:opacity-50"
                        >
                          <option value="active">Em dia</option>
                          <option value="warning">Aviso</option>
                          <option value="blocked">Bloqueado</option>
                        </select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        student.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {student.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => navigate(`/dashboard/students/${student.id}/card`)}
                        disabled={savingStudent}
                        className="text-slate-400 hover:text-slate-700 transition-colors mx-1 disabled:opacity-50"
                        aria-label="Ver ficha do atleta"
                      >
                        <User className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditForm(student)}
                        disabled={savingStudent}
                        className="text-slate-400 hover:text-primary transition-colors mx-1 disabled:opacity-50"
                        aria-label="Editar aluno"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleActive(student)}
                        disabled={savingStudent}
                        className="text-slate-400 hover:text-amber-600 transition-colors mx-1 disabled:opacity-50"
                        aria-label={student.active ? 'Inativar aluno' : 'Ativar aluno'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStudent(student)}
                        disabled={savingStudent}
                        className="text-slate-400 hover:text-red-600 transition-colors mx-1 disabled:opacity-50"
                        aria-label="Excluir aluno"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
