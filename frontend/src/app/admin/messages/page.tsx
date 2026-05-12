'use client'
import { useState, useEffect, useCallback } from 'react'
import { Mail, MailOpen, Trash2, Phone, User, Clock, Inbox, RefreshCw, Send, X, CheckCircle2 } from 'lucide-react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { adminGetMessages, adminMarkMessageRead, adminReplyMessage, adminDeleteMessage } from '@/lib/api'

interface Message {
  id: number
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  is_read: boolean
  created_at: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AU', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function ReplyForm({ msg, onSent }: { msg: Message; onSent: () => void }) {
  const [body, setBody] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const handleSend = async () => {
    if (!body.trim()) return
    setStatus('sending')
    setErrorMsg('')
    try {
      await adminReplyMessage(msg.id, body.trim())
      setStatus('sent')
      setTimeout(() => { onSent(); setStatus('idle'); setBody('') }, 1800)
    } catch (err: any) {
      setErrorMsg(err?.response?.data?.message || 'Failed to send. Check your SMTP settings.')
      setStatus('error')
    }
  }

  if (status === 'sent') {
    return (
      <div className="flex items-center gap-2.5 px-4 py-3 bg-teal-50 rounded-xl text-teal-700 text-sm font-medium">
        <CheckCircle2 className="w-4 h-4 shrink-0" />
        Reply sent to {msg.email}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Reply to <span className="text-primary-700">{msg.email}</span>
        </p>
      </div>
      <textarea
        value={body}
        onChange={e => setBody(e.target.value)}
        placeholder={`Write your reply to ${msg.name}…`}
        rows={5}
        className="input resize-none text-sm leading-relaxed"
        autoFocus
      />
      {status === 'error' && (
        <p className="text-xs text-red-500 font-medium">{errorMsg}</p>
      )}
      <div className="flex gap-2">
        <button
          onClick={handleSend}
          disabled={!body.trim() || status === 'sending'}
          className="btn-teal text-sm py-2 px-5 disabled:opacity-50"
        >
          {status === 'sending'
            ? <><span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending…</>
            : <><Send className="w-3.5 h-3.5" /> Send Reply</>
          }
        </button>
        <button
          onClick={() => { setBody(''); setStatus('idle') }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <X className="w-3.5 h-3.5" /> Cancel
        </button>
      </div>
    </div>
  )
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [expanded, setExpanded] = useState<number | null>(null)
  const [replying, setReplying] = useState<number | null>(null)
  const [deleting, setDeleting] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Message | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await adminGetMessages(1, filter === 'unread' ? 'unread' : undefined)
      setMessages(res.data?.data?.data ?? [])
    } catch {
      setMessages([])
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { load() }, [load])

  const handleExpand = async (msg: Message) => {
    if (expanded === msg.id) { setExpanded(null); setReplying(null); return }
    setExpanded(msg.id)
    setReplying(null)
    if (!msg.is_read) {
      try {
        await adminMarkMessageRead(msg.id)
        setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
      } catch { /* ignore */ }
    }
  }

  const handleDeleteConfirmed = async () => {
    if (!confirmDelete) return
    setDeleting(confirmDelete.id)
    try {
      await adminDeleteMessage(confirmDelete.id)
      setMessages(prev => prev.filter(m => m.id !== confirmDelete.id))
      if (expanded === confirmDelete.id) { setExpanded(null); setReplying(null) }
    } catch { /* ignore */ }
    finally { setDeleting(null); setConfirmDelete(null) }
  }

  const unreadCount = messages.filter(m => !m.is_read).length

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Header */}
      <AnimatedSection className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-primary-900 flex items-center gap-2">
            Messages
            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full bg-blue-500 text-white text-xs font-bold min-w-[22px]">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-gray-400 text-sm">{messages.length} message{messages.length !== 1 ? 's' : ''} {filter === 'unread' ? 'unread' : 'total'}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border border-gray-200 overflow-hidden text-sm">
            {(['all', 'unread'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-4 py-2 font-medium transition-colors capitalize ${filter === f ? 'bg-primary-800 text-white' : 'bg-white text-gray-500 hover:bg-gray-50'}`}>
                {f}
              </button>
            ))}
          </div>
          <button onClick={load} className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-primary-800 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </AnimatedSection>

      {/* List */}
      <div className="space-y-2">
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="card p-5 animate-pulse">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-gray-100 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))
        ) : messages.length === 0 ? (
          <AnimatedSection>
            <div className="card p-14 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                <Inbox className="w-7 h-7 text-gray-300" />
              </div>
              <p className="font-medium text-gray-500">No messages yet</p>
              <p className="text-sm text-gray-400">Messages sent via the contact form will appear here.</p>
            </div>
          </AnimatedSection>
        ) : (
          messages.map((msg, i) => {
            const isOpen = expanded === msg.id
            const isReplying = replying === msg.id
            return (
              <AnimatedSection key={msg.id} delay={i * 0.04}>
                <div className={`card overflow-hidden transition-all ${!msg.is_read ? 'border-l-4 border-l-blue-500' : ''}`}>

                  {/* Row header — click to expand */}
                  <button onClick={() => handleExpand(msg)}
                    className="w-full text-left p-5 flex items-start gap-4 hover:bg-gray-50/60 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${msg.is_read ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-blue-500'}`}>
                      {msg.is_read ? <MailOpen className="w-5 h-5" /> : <Mail className="w-5 h-5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`font-semibold text-sm ${msg.is_read ? 'text-gray-700' : 'text-primary-900'}`}>
                          {msg.name}
                          {!msg.is_read && <span className="ml-2 inline-block w-2 h-2 rounded-full bg-blue-500 align-middle" />}
                        </span>
                        <span className="text-xs text-gray-400 shrink-0 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {formatDate(msg.created_at)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{msg.email}{msg.phone ? ` · ${msg.phone}` : ''}</p>
                      {msg.subject && <p className="text-xs text-primary-600 font-medium mt-0.5">{msg.subject}</p>}
                      {!isOpen && <p className="text-sm text-gray-500 mt-1.5 line-clamp-1">{msg.message}</p>}
                    </div>
                    <span className="text-gray-300 text-xs shrink-0 mt-1">{isOpen ? '▲' : '▼'}</span>
                  </button>

                  {/* Expanded body */}
                  {isOpen && (
                    <div className="border-t border-gray-100">
                      <div className="px-5 py-5 flex gap-4">
                        <div className="w-10 shrink-0" />
                        <div className="flex-1 space-y-4">

                          {/* Contact details */}
                          <div className="flex flex-wrap gap-4 text-sm">
                            <span className="flex items-center gap-1.5 text-gray-500">
                              <User className="w-3.5 h-3.5 text-gray-400" /> {msg.name}
                            </span>
                            <span className="flex items-center gap-1.5 text-gray-600">
                              <Mail className="w-3.5 h-3.5 text-gray-400" /> {msg.email}
                            </span>
                            {msg.phone && (
                              <span className="flex items-center gap-1.5 text-gray-600">
                                <Phone className="w-3.5 h-3.5 text-gray-400" /> {msg.phone}
                              </span>
                            )}
                          </div>

                          {/* Message body */}
                          <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {msg.message}
                          </div>

                          {/* Action buttons or reply form */}
                          {isReplying ? (
                            <ReplyForm
                              msg={msg}
                              onSent={() => {
                                setReplying(null)
                                setMessages(prev => prev.map(m => m.id === msg.id ? { ...m, is_read: true } : m))
                              }}
                            />
                          ) : (
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => setReplying(msg.id)}
                                className="btn-teal text-sm py-2 px-4"
                              >
                                <Send className="w-3.5 h-3.5" /> Reply
                              </button>
                              <button
                                onClick={() => setConfirmDelete(msg)}
                                disabled={deleting === msg.id}
                                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors border border-red-100"
                              >
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          )}

                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            )
          })
        )}
      </div>

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete Message"
        message={`Delete the message from ${confirmDelete?.name ?? 'this sender'}? This cannot be undone.`}
        confirmLabel="Yes, Delete"
        loading={deleting !== null}
        onConfirm={handleDeleteConfirmed}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  )
}
