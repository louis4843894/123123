'use client'

import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowRight, ArrowLeft, CheckCircle2, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

type SituationType = 'emergency' | 'preplanning' | 'hasDirection' | null

const EMERGENCY_STEPS = [
  {
    id: 'e1',
    question: '親人已離世，目前在什麼地方？',
    options: [
      { value: 'hospital', label: '醫院或安養院', next: 'e2' },
      { value: 'home', label: '家中', next: 'e2' },
      { value: 'public', label: '公共場所或意外', next: 'e_police' },
    ],
  },
  {
    id: 'e_police',
    message: true,
    content: {
      title: '需先聯絡警方',
      body: '若為意外、突發死亡或公共場所，依台灣法規需先報警，由警方或檢察官確認後，才能進行遺體處理。請先撥打 110，我們在您完成後續程序後隨時可以協助。',
      cta: '我已了解，繼續規劃',
      next: 'e2',
    },
  },
  {
    id: 'e2',
    question: '是否已取得或正在申請死亡證明？',
    options: [
      { value: 'yes', label: '已取得', next: 'e3' },
      { value: 'processing', label: '申請中', next: 'e2b' },
      { value: 'no', label: '尚未申請', next: 'e2b' },
    ],
  },
  {
    id: 'e2b',
    message: true,
    content: {
      title: '如何取得死亡證明書',
      body: '死亡證明書需由主治醫師或法醫開立。醫院死亡：請向主治醫師申請；居家死亡：需先由家醫或急診醫師確認；意外死亡：需由法醫驗屍後取得相驗屍體證明書。取得後請持正本申辦除籍及火化許可。',
      cta: '了解了，繼續',
      next: 'e3',
    },
  },
  {
    id: 'e3',
    question: '您希望哪一類殯葬方式？',
    options: [
      { value: 'traditional', label: '傳統佛/道教儀式', next: 'e4' },
      { value: 'christian', label: '基督/天主教儀式', next: 'e4' },
      { value: 'simple', label: '簡單告別式', next: 'e4' },
      { value: 'undecided', label: '尚未決定，需要建議', next: 'e4' },
    ],
  },
  {
    id: 'e4',
    question: '您的預算範圍大約是？',
    options: [
      { value: 'budget', label: '60萬以下（基本型）', next: 'done' },
      { value: 'mid', label: '60–120萬（標準型）', next: 'done' },
      { value: 'premium', label: '120萬以上（完整型）', next: 'done' },
      { value: 'unknown', label: '不確定，請協助建議', next: 'done' },
    ],
  },
]

const PREPLANNING_STEPS = [
  {
    id: 'p1',
    question: '您正在為誰規劃？',
    options: [
      { value: 'self', label: '為自己預立', next: 'p2' },
      { value: 'elderly', label: '為年邁父母/長輩預立', next: 'p2' },
      { value: 'gift', label: '為另一半規劃', next: 'p2' },
    ],
  },
  {
    id: 'p2',
    question: '希望保留哪種形式的記念？',
    options: [
      { value: 'columbarium', label: '納骨塔（靈骨塔）', next: 'p3' },
      { value: 'cemetery', label: '公墓或私立墓地', next: 'p3' },
      { value: 'tree', label: '樹葬或海葬（環保葬）', next: 'p3' },
      { value: 'undecided', label: '尚未決定', next: 'p3' },
    ],
  },
  {
    id: 'p3',
    question: '是否需要我們協助草擬預立遺囑或意願書？',
    options: [
      { value: 'yes', label: '需要，希望了解更多', next: 'done' },
      { value: 'no', label: '不需要，先規劃服務方案', next: 'done' },
    ],
  },
]

function ChevronRight({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <polyline points="9 18 15 12 9 6" />
    </svg>
  )
}

export function GuideContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialType = searchParams.get('type') as SituationType

  const [situationType, setSituationType] = useState<SituationType>(initialType)
  const [currentStepId, setCurrentStepId] = useState<string | null>(
    initialType === 'emergency' ? 'e1' :
    initialType === 'preplanning' ? 'p1' : null
  )
  const [history, setHistory] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  const getSteps = () => situationType === 'emergency' ? EMERGENCY_STEPS : PREPLANNING_STEPS
  const currentStep = getSteps().find(s => s.id === currentStepId)

  const handleSelect = (value: string, next: string) => {
    setAnswers(prev => ({ ...prev, [currentStepId!]: value }))
    setHistory(prev => [...prev, currentStepId!])
    if (next === 'done') setDone(true)
    else setCurrentStepId(next)
  }

  const handleMessageNext = (next: string) => {
    setHistory(prev => [...prev, currentStepId!])
    if (next === 'done') setDone(true)
    else setCurrentStepId(next)
  }

  const handleBack = () => {
    if (history.length === 0) {
      setSituationType(null)
      setCurrentStepId(null)
      return
    }
    const prev = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setCurrentStepId(prev)
  }

  if (!situationType) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <p className="text-xs tracking-widest text-muted-foreground uppercase mb-3">情境引導</p>
          <h1 className="text-3xl font-semibold mb-3 text-balance">請告訴我們您的情況</h1>
          <p className="text-muted-foreground">我們將根據您的狀況，引導您走過每一個步驟</p>
        </div>
        <div className="grid gap-4">
          {[
            { type: 'emergency' as SituationType, title: '緊急情況', subtitle: '親人剛剛離世，需要立即協助', startStep: 'e1', urgent: true },
            { type: 'preplanning' as SituationType, title: '預立規劃', subtitle: '為未來做好準備，減輕家人負擔', startStep: 'p1', urgent: false },
            { type: 'hasDirection' as SituationType, title: '已有方向', subtitle: '需要比較業者或完成特定服務', startStep: null, urgent: false },
          ].map((item) => (
            <button
              key={String(item.type)}
              onClick={() => {
                setSituationType(item.type)
                if (item.type === 'hasDirection') { router.push('/vendors'); return }
                setCurrentStepId(item.startStep)
              }}
              className={`text-left p-5 rounded-xl border-2 transition-all hover:shadow-md hover:-translate-y-0.5 ${
                item.urgent ? 'border-destructive/40 bg-destructive/5' : 'border-border bg-card'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-lg mb-0.5">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.subtitle}</p>
                </div>
                <ArrowRight size={18} className="text-muted-foreground mt-1 shrink-0" />
              </div>
              {item.urgent && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-destructive">
                  <Phone size={12} />
                  <span>24小時緊急聯絡：0800-123-456</span>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} className="text-accent" />
        </div>
        <h2 className="text-2xl font-semibold mb-3">我們已了解您的需求</h2>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          根據您的回答，我們為您推薦以下步驟。您可以立即建構方案，或先瀏覽業者。
        </p>
        <div className="flex flex-col gap-3">
          <Button asChild size="lg" className="bg-primary text-primary-foreground gap-2">
            <a href="/plan">前往方案規劃 <ArrowRight size={16} /></a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="/vendors">瀏覽業者列表</a>
          </Button>
          <Button size="lg" variant="ghost" onClick={() => {
            setSituationType(null); setCurrentStepId(null)
            setHistory([]); setAnswers({}); setDone(false)
          }}>
            重新回答
          </Button>
        </div>
      </div>
    )
  }

  if (!currentStep) return null

  const total = getSteps().length
  const progress = Math.round((history.length / total) * 100)

  return (
    <div className="max-w-xl mx-auto px-4 py-12">
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>{situationType === 'emergency' ? '緊急情況引導' : '預立規劃引導'}</span>
          <span>{Math.min(history.length + 1, total)} / {total}</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${Math.max(progress, 5)}%` }} />
        </div>
      </div>

      {'message' in currentStep && currentStep.message ? (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-3">{currentStep.content.title}</h2>
          <p className="text-sm text-muted-foreground leading-relaxed mb-6">{currentStep.content.body}</p>
          <Button className="w-full bg-primary text-primary-foreground gap-2" onClick={() => handleMessageNext(currentStep.content.next)}>
            {currentStep.content.cta}
            <ArrowRight size={16} />
          </Button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-6">{'question' in currentStep ? currentStep.question : ''}</h2>
          <div className="grid gap-3">
            {'options' in currentStep && currentStep.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSelect(opt.value, opt.next)}
                className="text-left px-4 py-3.5 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/40 transition-all text-sm font-medium flex items-center justify-between group"
              >
                <span>{opt.label}</span>
                <ChevronRight size={16} className="text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={handleBack} className="mt-4 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft size={14} />
        <span>上一步</span>
      </button>
    </div>
  )
}
