'use client'

import { useState } from 'react'
import { Link2, QrCode, ThumbsUp, ThumbsDown, Send, Users, Calculator } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MOCK_FAMILY_MEMBERS, MOCK_MESSAGES, type FamilyMember, type Message } from '@/lib/data'

function formatTime(ts: string) {
  return ts.split(' ')[1] || ts
}

export function FamilyContent() {
  const [members, setMembers] = useState<FamilyMember[]>(MOCK_FAMILY_MEMBERS)
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const [newMsg, setNewMsg] = useState('')
  const [activeTab, setActiveTab] = useState<'vote' | 'discuss' | 'split'>('vote')
  const [splitMode, setSplitMode] = useState<'equal' | 'ratio'>('equal')
  const [totalAmount] = useState(185000)
  const [ratios, setRatios] = useState<Record<string, number>>(
    Object.fromEntries(MOCK_FAMILY_MEMBERS.map(m => [m.id, m.shareRatio]))
  )

  const approved = members.filter(m => m.vote === 'approve').length
  const rejected = members.filter(m => m.vote === 'reject').length
  const pending = members.filter(m => m.vote === null).length
  const total = members.length

  const handleVote = (id: string, vote: 'approve' | 'reject') => {
    setMembers(prev => prev.map(m => m.id === id ? { ...m, vote } : m))
  }

  const handleSendMessage = () => {
    if (!newMsg.trim()) return
    const msg: Message = {
      id: `m${Date.now()}`,
      author: '我（陳大明）',
      role: 'family',
      content: newMsg.trim(),
      timestamp: new Date().toLocaleString('zh-TW', { hour12: false }).replace(',', ''),
    }
    setMessages(prev => [...prev, msg])
    setNewMsg('')
  }

  const splitAmounts = () => {
    if (splitMode === 'equal') {
      return members.map(m => ({ ...m, amount: Math.ceil(totalAmount / members.length) }))
    }
    const totalRatio = Object.values(ratios).reduce((s, r) => s + r, 0)
    return members.map(m => ({
      ...m,
      amount: Math.round((ratios[m.id] / totalRatio) * totalAmount),
    }))
  }

  const TABS = [
    { id: 'vote', label: '即時投票', icon: ThumbsUp },
    { id: 'discuss', label: '即時討論', icon: Users },
    { id: 'split', label: '費用均分', icon: Calculator },
  ] as const

  return (
    <main className="flex-1 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <p className="text-xs tracking-widest text-muted-foreground uppercase mb-2">家庭共決空間</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold mb-1">陳家共決空間</h1>
              <p className="text-muted-foreground text-sm">案件編號：JT-2024-0892 · 共 {total} 位家屬</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <Link2 size={13} />複製邀請連結
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5 text-xs">
                <QrCode size={13} />QR Code
              </Button>
            </div>
          </div>
        </div>

        <div className="flex gap-1 bg-muted/50 p-1 rounded-xl mb-6 w-fit">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={14} />{tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'vote' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl p-5 mb-4">
                <p className="text-sm font-semibold mb-4">投票結果</p>
                <div className="grid grid-cols-3 gap-2 text-center mb-4">
                  <div className="bg-accent/10 rounded-lg p-3">
                    <p className="text-2xl font-bold text-accent">{approved}</p>
                    <p className="text-xs text-muted-foreground">同意</p>
                  </div>
                  <div className="bg-destructive/10 rounded-lg p-3">
                    <p className="text-2xl font-bold text-destructive">{rejected}</p>
                    <p className="text-xs text-muted-foreground">反對</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-2xl font-bold text-muted-foreground">{pending}</p>
                    <p className="text-xs text-muted-foreground">待票</p>
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden flex">
                  <div className="bg-accent h-full transition-all" style={{ width: `${(approved / total) * 100}%` }} />
                  <div className="bg-destructive h-full transition-all" style={{ width: `${(rejected / total) * 100}%` }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {approved > total / 2 ? '過半數同意，可進入下一步' : '等待更多家屬投票'}
                </p>
              </div>
              {approved > total / 2 && (
                <Button className="w-full bg-primary text-primary-foreground text-sm" asChild>
                  <a href="/vendors">確認方案，選擇業者</a>
                </Button>
              )}
            </div>
            <div className="lg:col-span-2 flex flex-col gap-3">
              {members.map(member => (
                <div key={member.id} className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-semibold shrink-0">
                    {member.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.relation}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {member.vote === 'approve' && <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full">已同意</span>}
                    {member.vote === 'reject' && <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full">反對</span>}
                    {member.vote === null && <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">待投票</span>}
                    {member.vote === null && (
                      <div className="flex gap-1 ml-2">
                        <button onClick={() => handleVote(member.id, 'approve')} className="w-7 h-7 rounded-lg bg-accent/10 hover:bg-accent/20 flex items-center justify-center transition-colors">
                          <ThumbsUp size={13} className="text-accent" />
                        </button>
                        <button onClick={() => handleVote(member.id, 'reject')} className="w-7 h-7 rounded-lg bg-destructive/10 hover:bg-destructive/20 flex items-center justify-center transition-colors">
                          <ThumbsDown size={13} className="text-destructive" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'discuss' && (
          <div className="bg-card border border-border rounded-xl flex flex-col" style={{ height: '520px' }}>
            <div className="p-4 border-b border-border">
              <p className="text-sm font-semibold">留言板</p>
              <p className="text-xs text-muted-foreground">家屬與業者均可在此溝通</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'family' && msg.author.includes('大明') ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    msg.role === 'vendor' ? 'bg-accent/20 text-accent' : msg.role === 'system' ? 'bg-muted' : 'bg-primary/20 text-primary'
                  }`}>
                    {msg.role === 'system' ? '系' : msg.author[0]}
                  </div>
                  <div className={`max-w-xs lg:max-w-md ${msg.role === 'family' && msg.author.includes('大明') ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{msg.role === 'family' && msg.author.includes('大明') ? '' : msg.author}</span>
                      <span>{formatTime(msg.timestamp)}</span>
                    </div>
                    <div className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      msg.role === 'system' ? 'bg-muted/60 text-muted-foreground text-xs italic' :
                      msg.role === 'family' && msg.author.includes('大明') ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-border flex gap-2">
              <input
                type="text"
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder="輸入留言…"
                className="flex-1 text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button size="sm" onClick={handleSendMessage} disabled={!newMsg.trim()} className="bg-primary text-primary-foreground">
                <Send size={14} />
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-sm font-semibold mb-4">費用均分計算機</p>
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-1">方案總金額</p>
                <p className="text-2xl font-semibold">NT${totalAmount.toLocaleString('zh-TW')}</p>
              </div>
              <div className="flex gap-2 mb-5">
                {(['equal', 'ratio'] as const).map(mode => (
                  <button key={mode} onClick={() => setSplitMode(mode)} className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                    splitMode === mode ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted/40'
                  }`}>
                    {mode === 'equal' ? '平均分攤' : '按比例分攤'}
                  </button>
                ))}
              </div>
              {splitMode === 'ratio' && (
                <div className="mb-5 flex flex-col gap-3">
                  <p className="text-xs text-muted-foreground">調整各人比例</p>
                  {members.map(m => (
                    <div key={m.id} className="flex items-center gap-3">
                      <span className="text-sm w-16 shrink-0">{m.name}</span>
                      <input type="range" min={0} max={100} value={ratios[m.id]} onChange={e => setRatios(prev => ({ ...prev, [m.id]: Number(e.target.value) }))} className="flex-1 accent-primary" />
                      <span className="text-sm w-10 text-right">{ratios[m.id]}%</span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex flex-col gap-2">
                {splitAmounts().map(m => (
                  <div key={m.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                    <div>
                      <span className="text-sm font-medium">{m.name}</span>
                      <span className="text-xs text-muted-foreground ml-2">{m.relation}</span>
                    </div>
                    <span className="text-sm font-semibold text-accent">NT${m.amount.toLocaleString('zh-TW')}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-card border border-border rounded-xl p-5">
              <p className="text-sm font-semibold mb-4">付款里程碑</p>
              <p className="text-xs text-muted-foreground mb-4 leading-relaxed">靜途採用分段付款機制，確保每個服務步驟完成後才撥款，保障家屬權益。</p>
              {[
                { stage: '訂金', ratio: 30, desc: '確認委托時繳交', status: 'paid' },
                { stage: '服務開始款', ratio: 30, desc: '遺體接運完成後撥款', status: 'pending' },
                { stage: '告別式完成款', ratio: 20, desc: '告別式結束後撥款', status: 'locked' },
                { stage: '尾款', ratio: 20, desc: '所有服務完成後撥款', status: 'locked' },
              ].map(stage => (
                <div key={stage.stage} className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${stage.status === 'paid' ? 'bg-accent' : stage.status === 'pending' ? 'bg-amber-400' : 'bg-muted-foreground/30'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{stage.stage} ({stage.ratio}%)</p>
                    <p className="text-xs text-muted-foreground">{stage.desc}</p>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${stage.status === 'paid' ? 'bg-accent/10 text-accent' : stage.status === 'pending' ? 'bg-amber-400/10 text-amber-600' : 'bg-muted text-muted-foreground'}`}>
                    {stage.status === 'paid' ? '已付' : stage.status === 'pending' ? '待付' : '鎖定'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
