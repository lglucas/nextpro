import { useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Camera, CheckCircle2, ClipboardPaste, Link as LinkIcon, XCircle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

type CheckInStatus = 'idle' | 'scanning' | 'checking_in' | 'success' | 'error'

function parseSessionIdFromValue(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  try {
    const maybeUrl = new URL(trimmed)
    const fromUrl = maybeUrl.searchParams.get('sessionId')
    return fromUrl?.trim() ? fromUrl.trim() : null
  } catch {
    return trimmed
  }
}

function parseExpiresAtFromValue(value: string): number | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  try {
    const maybeUrl = new URL(trimmed)
    const raw = maybeUrl.searchParams.get('expiresAt')
    if (!raw) return null
    const parsed = Number(raw)
    if (!Number.isFinite(parsed)) return null
    return parsed
  } catch {
    return null
  }
}

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}

export function CheckInPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()

  const initialSessionId = useMemo(() => {
    const value = searchParams.get('sessionId')
    return value?.trim() ? value.trim() : ''
  }, [searchParams])

  const initialExpiresAt = useMemo(() => {
    const value = searchParams.get('expiresAt')
    if (!value) return null
    const parsed = Number(value)
    if (!Number.isFinite(parsed)) return null
    return parsed
  }, [searchParams])

  const [manualValue, setManualValue] = useState('')
  const [sessionId, setSessionId] = useState(initialSessionId)
  const [expiresAt, setExpiresAt] = useState<number | null>(initialExpiresAt)
  const [status, setStatus] = useState<CheckInStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [students, setStudents] = useState<Array<{ id: string; full_name: string }>>([])
  const [selectedStudentId, setSelectedStudentId] = useState<string>('')

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const rafRef = useRef<number | null>(null)

  const canUseBarcodeDetector = useMemo(() => {
    return typeof window !== 'undefined' && 'BarcodeDetector' in window
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSessionId(initialSessionId)
      setExpiresAt(initialExpiresAt)
    }, 0)
    return () => window.clearTimeout(timeoutId)
  }, [initialExpiresAt, initialSessionId])

  useEffect(() => {
    let mounted = true

    const run = async () => {
      if (!user) return
      const { data, error } = await supabase
        .from('students')
        .select('id, full_name')
        .eq('user_id', user.id)
        .eq('active', true)
        .order('full_name')

      if (!mounted) return

      if (error) {
        setStudents([])
        setSelectedStudentId('')
        return
      }

      const list = (data ?? []) as Array<{ id: string; full_name: string }>
      setStudents(list)
      setSelectedStudentId((prev) => {
        if (prev && list.some((s) => s.id === prev)) return prev
        return list.length === 1 ? list[0].id : ''
      })
    }

    run()

    return () => {
      mounted = false
    }
  }, [user])

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = null
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
  }, [])

  const startScanner = async () => {
    setErrorMessage(null)

    if (!canUseBarcodeDetector) {
      setErrorMessage('Seu navegador não suporta leitura de QR. Use o campo manual.')
      setStatus('error')
      return
    }

    try {
      setStatus('scanning')
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      })
      streamRef.current = stream

      if (!videoRef.current) return
      videoRef.current.srcObject = stream
      await videoRef.current.play()

      const Detector = (window as unknown as { BarcodeDetector: unknown }).BarcodeDetector as new (options: {
        formats: string[]
      }) => { detect: (source: unknown) => Promise<Array<{ rawValue?: string }>> }
      const detector = new Detector({ formats: ['qr_code'] })

      const loop = async () => {
        if (!videoRef.current) return
        if (!streamRef.current) return

        try {
          const results = await detector.detect(videoRef.current)
          const rawValue = results?.[0]?.rawValue
          if (rawValue) {
            const nextSessionId = parseSessionIdFromValue(rawValue)
            const nextExpiresAt = parseExpiresAtFromValue(rawValue)
            if (nextSessionId && isUuid(nextSessionId)) {
              setSessionId(nextSessionId)
              setExpiresAt(nextExpiresAt)
              if (nextExpiresAt) setSearchParams({ sessionId: nextSessionId, expiresAt: String(nextExpiresAt) }, { replace: true })
              else setSearchParams({ sessionId: nextSessionId }, { replace: true })
              stopScanner()
              await submitCheckIn({ sessionId: nextSessionId, expiresAt: nextExpiresAt })
              return
            }
          }
        } catch {
          void 0
        }

        rafRef.current = requestAnimationFrame(loop)
      }

      rafRef.current = requestAnimationFrame(loop)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Falha ao abrir a câmera'
      setErrorMessage(message)
      setStatus('error')
    }
  }

  const stopScanner = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    rafRef.current = null

    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop())
    streamRef.current = null

    setStatus('idle')
  }

  const submitCheckIn = async (next?: { sessionId?: string; expiresAt?: number | null }) => {
    setErrorMessage(null)

    const effectiveSessionId = (next?.sessionId ?? sessionId).trim()
    const effectiveExpiresAt = next?.expiresAt ?? expiresAt
    if (!user) return

    if (!isUuid(effectiveSessionId)) {
      setErrorMessage('Session ID inválido. Escaneie de novo ou cole o link completo.')
      setStatus('error')
      return
    }

    if (!effectiveExpiresAt) {
      setErrorMessage('QR inválido ou antigo. Peça para o professor gerar um novo QR.')
      setStatus('error')
      return
    }

    const nowSeconds = Math.floor(Date.now() / 1000)
    if (nowSeconds > effectiveExpiresAt) {
      setErrorMessage('Este QR expirou. Peça para o professor gerar um novo QR.')
      setStatus('error')
      return
    }

    if (!selectedStudentId) {
      setErrorMessage('Nenhum atleta vinculado ao seu usuário. Peça para a escolinha vincular seu User ID ao atleta.')
      setStatus('error')
      return
    }

    setStatus('checking_in')

    const { error } = await supabase
      .from('attendances')
      .upsert(
        {
          session_id: effectiveSessionId,
          student_id: selectedStudentId,
          status: 'present',
          notes: 'qr',
        },
        { onConflict: 'session_id,student_id' },
      )

    if (error) {
      setErrorMessage(error.message || 'Erro ao registrar presença.')
      setStatus('error')
      return
    }

    setStatus('success')
  }

  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setManualValue(text)
      const nextSessionId = parseSessionIdFromValue(text)
      const nextExpiresAt = parseExpiresAtFromValue(text)
      if (nextSessionId) {
        setSessionId(nextSessionId)
        setExpiresAt(nextExpiresAt)
        if (isUuid(nextSessionId) && nextExpiresAt)
          setSearchParams({ sessionId: nextSessionId, expiresAt: String(nextExpiresAt) }, { replace: true })
        else if (isUuid(nextSessionId)) setSearchParams({ sessionId: nextSessionId }, { replace: true })
      }
    } catch {
      setErrorMessage('Não consegui ler a área de transferência.')
      setStatus('error')
    }
  }

  const athleteLabel = useMemo(() => {
    if (!students.length) return 'Atleta'
    if (students.length === 1) return students[0].full_name
    const selected = students.find((s) => s.id === selectedStudentId)
    return selected?.full_name ?? 'Selecione o atleta'
  }, [students, selectedStudentId])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Check-in</h1>
            <p className="mt-2 text-slate-600">Escaneie o QR Code do treino para registrar sua presença.</p>
          </div>
          {status === 'scanning' ? (
            <button
              type="button"
              onClick={stopScanner}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <XCircle className="w-4 h-4" />
              Parar
            </button>
          ) : (
            <button
              type="button"
              onClick={startScanner}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              Abrir câmera
            </button>
          )}
        </div>

        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-500">Atleta</p>
          {students.length > 1 ? (
            <select
              value={selectedStudentId}
              onChange={(e) => setSelectedStudentId(e.target.value)}
              className="mt-2 w-full px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white"
            >
              <option value="">Selecione…</option>
              {students.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.full_name}
                </option>
              ))}
            </select>
          ) : (
            <p className="mt-2 text-sm font-semibold text-slate-900 break-words">{athleteLabel}</p>
          )}
          <p className="mt-2 text-xs text-slate-500 break-all">Seu User ID: {user?.id || '—'}</p>
        </div>

        {status === 'scanning' && (
          <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-black">
            <video ref={videoRef} className="w-full h-[320px] object-cover" playsInline muted />
          </div>
        )}

        <div className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-slate-900">Ou cole o link / Session ID</p>
            <button
              type="button"
              onClick={handlePasteFromClipboard}
              className="px-3 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <ClipboardPaste className="w-4 h-4" />
              Colar
            </button>
          </div>

          <div className="mt-3 flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LinkIcon className="w-4 h-4 text-slate-400" />
              </div>
              <input
                value={manualValue}
                onChange={(e) => setManualValue(e.target.value)}
                placeholder="Cole aqui o link do QR ou o Session ID"
                className="w-full pl-10 pr-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <button
              type="button"
              disabled={status === 'checking_in'}
              onClick={async () => {
                const nextSessionId = parseSessionIdFromValue(manualValue)
                const nextExpiresAt = parseExpiresAtFromValue(manualValue)
                if (!nextSessionId) {
                  setErrorMessage('Cole um valor antes de confirmar.')
                  setStatus('error')
                  return
                }
                setSessionId(nextSessionId)
                setExpiresAt(nextExpiresAt)
                if (isUuid(nextSessionId) && nextExpiresAt)
                  setSearchParams({ sessionId: nextSessionId, expiresAt: String(nextExpiresAt) }, { replace: true })
                else if (isUuid(nextSessionId)) setSearchParams({ sessionId: nextSessionId }, { replace: true })
                await submitCheckIn({ sessionId: nextSessionId, expiresAt: nextExpiresAt })
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
            >
              {status === 'checking_in' ? 'Confirmando...' : 'Confirmar'}
            </button>
          </div>
        </div>

        {(status === 'success' || status === 'error') && (
          <div
            className={`mt-6 rounded-xl border p-4 ${
              status === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {status === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-green-700 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-700 mt-0.5" />
              )}
              <div>
                <p className={`font-semibold ${status === 'success' ? 'text-green-900' : 'text-red-900'}`}>
                  {status === 'success' ? 'Presença registrada!' : 'Não foi possível registrar.'}
                </p>
                <p className={`mt-1 text-sm ${status === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                  {status === 'success'
                    ? 'Você pode fechar esta tela.'
                    : errorMessage || 'Tente novamente ou use o campo manual.'}
                </p>
              </div>
            </div>
          </div>
        )}

        {status === 'idle' && sessionId && isUuid(sessionId) && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs text-slate-500">Session ID detectado</p>
                <p className="mt-1 text-sm font-semibold text-slate-900 break-all">{sessionId}</p>
              </div>
              <button
                type="button"
                onClick={() => submitCheckIn({ sessionId, expiresAt })}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
              >
                Registrar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
