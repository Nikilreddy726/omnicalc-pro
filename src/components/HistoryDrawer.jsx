import React, { useState } from 'react'
import {
  X,
  Trash2,
  Copy,
  Check,
  Search,
  CornerDownLeft,
  Download,
  Clock,
  ArrowRight
} from 'lucide-react'

export default function HistoryDrawer({
  isOpen,
  onClose,
  history,
  onClearHistory,
  onSelectExpression,
  onSelectResult,
  onDeleteHistoryItem
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  if (!isOpen) return null

  // Filter history by search query
  const filteredHistory = history.filter(item => {
    const q = searchQuery.toLowerCase()
    return (
      item.expression.toLowerCase().includes(q) ||
      String(item.result).toLowerCase().includes(q)
    )
  })

  const copyItem = (item) => {
    navigator.clipboard.writeText(`${item.expression} = ${item.result}`)
    setCopiedId(item.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const exportHistory = () => {
    const text = history
      .map(item => `[${item.timestamp}] ${item.expression} = ${item.result}`)
      .join('\n')
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `OmniCalc_History_${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-black/60 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-md h-full bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col p-4 sm:p-6 text-slate-100 animate-slide-left">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Calculation History</h3>
            <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
              {history.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Actions Bar */}
        <div className="py-3 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search history..."
              className="w-full h-9 rounded-xl bg-slate-950 border border-slate-800 pl-9 pr-3 text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 font-mono"
            />
          </div>

          {history.length > 0 && (
            <>
              <button
                onClick={exportHistory}
                title="Export history as text file"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>

              <button
                onClick={onClearHistory}
                title="Clear all history"
                className="p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/20 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 pr-1 -mr-1">
          {filteredHistory.length === 0 ? (
            <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-center text-xs">
              <Clock className="w-8 h-8 mb-2 stroke-1 text-slate-600" />
              <p>No calculation history found</p>
              {searchQuery && <p className="mt-1 text-slate-600">Try adjusting your search</p>}
            </div>
          ) : (
            filteredHistory.map((item) => (
              <div
                key={item.id}
                className="py-3.5 group flex flex-col gap-1.5 transition-colors hover:bg-slate-800/30 rounded-lg px-2 -mx-2"
              >
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span className="font-mono">{item.timestamp}</span>

                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyItem(item)}
                      title="Copy item"
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => onDeleteHistoryItem(item.id)}
                      title="Delete entry"
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Expression */}
                <div
                  onClick={() => onSelectExpression(item.expression)}
                  className="font-mono text-sm text-slate-300 hover:text-indigo-300 cursor-pointer transition-colors truncate"
                  title="Click to load this expression into calculator"
                >
                  {item.expression}
                </div>

                {/* Result */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-slate-500 text-xs">=</span>
                  <div
                    onClick={() => onSelectResult(item.result)}
                    className="font-mono font-bold text-base text-white hover:text-indigo-400 cursor-pointer transition-colors truncate text-right flex-1"
                    title="Click to append this result into current expression"
                  >
                    {item.result}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer tip */}
        <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
          <span>Click expression to load • Click result to reuse</span>
        </div>
      </div>
    </div>
  )
}
