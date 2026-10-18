import React, { useRef, useEffect } from 'react'
import { Copy, Check, RotateCcw, ArrowRightLeft, AlertCircle } from 'lucide-react'

export default function Display({
  expression,
  setExpression,
  result,
  previewResult,
  error,
  angleMode,
  memoryValue,
  isSecondActive,
  displayFormat,
  onToggleFraction,
  onCopy,
  copiedTarget,
  inputRef
}) {
  const exprEndRef = useRef(null)

  // Scroll expression to the right when typing long expressions
  useEffect(() => {
    if (exprEndRef.current) {
      exprEndRef.current.scrollIntoView({ behavior: 'smooth', inline: 'end' })
    }
  }, [expression])

  // Determine dynamic font size for result
  const getResultFontSize = () => {
    const text = result || previewResult || '0'
    const len = text.toString().length
    if (len > 24) return 'text-xl sm:text-2xl'
    if (len > 16) return 'text-2xl sm:text-3xl'
    if (len > 10) return 'text-3xl sm:text-4xl'
    return 'text-4xl sm:text-5xl'
  }

  return (
    <div className="w-full rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl p-4 sm:p-5 flex flex-col justify-between gap-3 relative overflow-hidden backdrop-blur-xl transition-all">
      {/* Top Bar: Status Badges and Quick Actions */}
      <div className="flex items-center justify-between text-xs font-mono text-slate-400 gap-2 border-b border-slate-800/60 pb-2">
        {/* Status Badges */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-2 py-0.5 rounded font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
            {angleMode}
          </span>

          {memoryValue !== 0 && (
            <span
              title={`Memory Stored: ${memoryValue}`}
              className="px-2 py-0.5 rounded font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1"
            >
              <span>M</span>
              <span className="max-w-[70px] truncate text-[10px]">({memoryValue})</span>
            </span>
          )}

          {isSecondActive && (
            <span className="px-2 py-0.5 rounded font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30 animate-pulse">
              2nd
            </span>
          )}

          <span className="px-2 py-0.5 rounded font-semibold bg-slate-800 text-slate-400 uppercase text-[10px]">
            {displayFormat}
          </span>
        </div>

        {/* Quick Action Tools */}
        <div className="flex items-center gap-1 text-slate-400">
          {/* Fraction / Decimal Toggle Button */}
          {result && (
            <button
              onClick={onToggleFraction}
              title="Toggle Fraction / Decimal format"
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-indigo-300 transition-colors flex items-center gap-1 text-[11px]"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">a/b ⇄ 0.0</span>
            </button>
          )}

          {/* Copy Expression */}
          {expression && (
            <button
              onClick={() => onCopy(expression, 'expression')}
              title="Copy expression"
              className="p-1.5 rounded-lg hover:bg-slate-800 hover:text-slate-200 transition-colors relative"
            >
              {copiedTarget === 'expression' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}

          {/* Copy Result */}
          {result && (
            <button
              onClick={() => onCopy(result, 'result')}
              title="Copy result"
              className="px-2 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 transition-all flex items-center gap-1 text-[11px] font-sans font-medium"
            >
              {copiedTarget === 'result' ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Middle Line: Expression Display & Input */}
      <div className="min-h-[36px] flex items-center overflow-x-auto overflow-y-hidden whitespace-nowrap font-mono text-slate-300 text-lg sm:text-xl py-1 px-1 scroll-smooth select-text">
        <input
          ref={inputRef}
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="0"
          className="w-full bg-transparent outline-none border-none text-right font-mono text-slate-300 placeholder-slate-600 focus:placeholder-transparent cursor-text tracking-wide"
          aria-label="Calculator Expression"
        />
        <div ref={exprEndRef} />
      </div>

      {/* Error Banner (if error occurred) */}
      {error ? (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm animate-shake">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span className="font-medium truncate">{error}</span>
        </div>
      ) : (
        /* Bottom Line: Main Result / Live Preview Display */
        <div className="flex items-baseline justify-end gap-2 font-mono tracking-tight select-text">
          {previewResult && !result && (
            <span className="text-slate-500 text-base sm:text-lg font-sans mr-1">
              ≈
            </span>
          )}

          <div
            className={`font-bold transition-all text-right overflow-x-auto overflow-y-hidden select-text ${
              result
                ? `${getResultFontSize()} text-white font-mono`
                : previewResult
                ? 'text-2xl sm:text-3xl text-slate-400'
                : 'text-3xl sm:text-4xl text-slate-600'
            }`}
          >
            {result || previewResult || '0'}
          </div>
        </div>
      )}
    </div>
  )
}
