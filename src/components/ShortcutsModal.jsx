import React from 'react'
import { X, Keyboard, Command } from 'lucide-react'

export default function ShortcutsModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const shortcuts = [
    { key: '0 - 9', desc: 'Input numbers' },
    { key: '+ - * /', desc: 'Basic arithmetic (+, −, ×, ÷)' },
    { key: 'Enter or =', desc: 'Calculate expression' },
    { key: 'Backspace', desc: 'Delete last character' },
    { key: 'Escape', desc: 'All Clear (AC)' },
    { key: '(', desc: 'Open parenthesis' },
    { key: ')', desc: 'Close parenthesis' },
    { key: '^', desc: 'Power / Exponent' },
    { key: '%', desc: 'Percentage' },
    { key: '!', desc: 'Factorial' },
    { key: 's', desc: 'Trigonometric sin(' },
    { key: 'c', desc: 'Trigonometric cos(' },
    { key: 't', desc: 'Trigonometric tan(' },
    { key: 'l', desc: 'Logarithm log(' },
    { key: 'n', desc: 'Natural logarithm ln(' },
    { key: 'r', desc: 'Square root sqrt(' },
    { key: 'p', desc: 'Constant Pi (π)' },
    { key: 'e', desc: 'Euler\'s constant (e)' },
    { key: 'h', desc: 'Toggle calculation history' },
    { key: '?', desc: 'Show this keyboard shortcuts guide' }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col gap-4 max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Keyboard Shortcuts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts Table */}
        <div className="overflow-y-auto divide-y divide-slate-800/60 pr-1">
          <div className="grid grid-cols-2 gap-2 py-2">
            {shortcuts.map((sc, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                <span className="text-xs text-slate-300">{sc.desc}</span>
                <kbd className="px-2 py-1 rounded bg-slate-800 border border-slate-700 text-indigo-300 font-mono text-[11px] font-bold shadow-sm">
                  {sc.key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs shadow-md shadow-indigo-600/30 transition-all"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  )
}
