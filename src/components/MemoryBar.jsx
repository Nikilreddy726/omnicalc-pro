import React from 'react'

export default function MemoryBar({
  memoryValue,
  onMemoryClear,
  onMemoryRecall,
  onMemoryAdd,
  onMemorySubtract,
  onMemoryStore
}) {
  const hasMemory = memoryValue !== 0

  return (
    <div className="w-full flex items-center justify-between gap-1.5 sm:gap-2 p-1.5 rounded-xl bg-slate-900/50 border border-slate-800/80">
      {/* MC - Memory Clear */}
      <button
        onClick={onMemoryClear}
        disabled={!hasMemory}
        title="Memory Clear (MC)"
        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all calc-btn ${
          hasMemory
            ? 'bg-slate-800 hover:bg-rose-500/20 text-rose-300 hover:text-rose-200 border border-slate-700/60'
            : 'text-slate-600 bg-slate-900/40 cursor-not-allowed border border-transparent'
        }`}
      >
        MC
      </button>

      {/* MR - Memory Recall */}
      <button
        onClick={onMemoryRecall}
        disabled={!hasMemory}
        title={`Memory Recall (MR): ${memoryValue}`}
        className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-semibold transition-all calc-btn ${
          hasMemory
            ? 'bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30'
            : 'text-slate-600 bg-slate-900/40 cursor-not-allowed border border-transparent'
        }`}
      >
        MR
      </button>

      {/* M+ - Memory Add */}
      <button
        onClick={onMemoryAdd}
        title="Add current result to memory (M+)"
        className="flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all calc-btn"
      >
        M+
      </button>

      {/* M- - Memory Subtract */}
      <button
        onClick={onMemorySubtract}
        title="Subtract current result from memory (M-)"
        className="flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all calc-btn"
      >
        M−
      </button>

      {/* MS - Memory Store */}
      <button
        onClick={onMemoryStore}
        title="Store current result into memory (MS)"
        className="flex-1 py-1.5 px-2 rounded-lg text-xs font-mono font-semibold bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-slate-700/60 transition-all calc-btn"
      >
        MS
      </button>
    </div>
  )
}
