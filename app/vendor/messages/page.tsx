'use client'

import { useState } from 'react'
import { Send, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MOCK_MESSAGES, VENDOR_CASES, type Message } from '@/lib/data'

export default function VendorMessagesPage() {
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES)
  const [selectedCase, setSelectedCase] = useState(VENDOR_CASES[0].id)
  const [newMsg, setNewMsg] = useState('')

  const sendMessage = () => {
    if (!newMsg.trim()) return
    const msg: Message = {
      id: `vm${Date.now()}`,
      author: '慈恩禮儀',
      role: 'vendor',
      content: newMsg.trim(),
      timestamp: new Date().toLocaleString('zh-TW', { hour12: false }).replace(',', ''),
    }
    setMessages(prev => [...prev, msg])
    setNewMsg('')
  }

  const caseData = VENDOR_CASES.find(c => c.id === selectedCase)

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">溝通模組</h1>
        <p className="text-muted-foreground text-sm">與各案件家屬及系統進行即時溝通</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Case list */}
        <div className="lg:col-span-1 flex flex-col gap-2">
          {VENDOR_CASES.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedCase(c.id)}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                selectedCase === c.id ? 'border-accent bg-accent/5' : 'border-border bg-card hover:bg-muted/30'
              }`}
            >
              <p className="font-medium text-sm">{c.familyName}</p>
              <p className="text-xs text-muted-foreground">{c.caseNumber}</p>
            </button>
          ))}
        </div>

        {/* Chat area */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl flex flex-col" style={{ height: '500px' }}>
          <div className="p-4 border-b border-border flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">{caseData?.familyName}</p>
              <p className="text-xs text-muted-foreground">{caseData?.caseNumber}</p>
            </div>
            <button className="p-2 rounded-lg hover:bg-muted/40 transition-colors relative">
              <Bell size={15} className="text-muted-foreground" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.role === 'vendor' ? 'flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                  msg.role === 'vendor' ? 'bg-primary text-primary-foreground' :
                  msg.role === 'system' ? 'bg-muted' : 'bg-accent/20 text-accent'
                }`}>
                  {msg.role === 'system' ? '系' : msg.author[0]}
                </div>
                <div className={`max-w-xs lg:max-w-sm flex flex-col gap-1 ${msg.role === 'vendor' ? 'items-end' : 'items-start'}`}>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {msg.role !== 'vendor' && <span>{msg.author}</span>}
                    <span>{msg.timestamp.split(' ')[1] || msg.timestamp}</span>
                  </div>
                  <div className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
                    msg.role === 'system' ? 'bg-muted/60 text-muted-foreground text-xs italic' :
                    msg.role === 'vendor' ? 'bg-primary text-primary-foreground' : 'bg-muted'
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
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
              placeholder="輸入回覆給家屬的訊息…"
              className="flex-1 text-sm border border-border rounded-lg px-3 py-2 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <Button onClick={sendMessage} disabled={!newMsg.trim()} className="bg-primary text-primary-foreground">
              <Send size={14} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
