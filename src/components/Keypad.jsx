import React from 'react'
import {
  Delete,
  RotateCcw,
  Equal,
  ChevronDown,
  ChevronUp,
  Percent,
  Divide,
  X as Multiply,
  Minus,
  Plus
} from 'lucide-react'

export default function Keypad({
  isSecondActive,
  setIsSecondActive,
  isScientificExpanded,
  setIsScientificExpanded,
  onInsert,
  onClearAll,
  onClearEntry,
  onBackspace,
  onCalculate,
  onNegate
}) {
  return (
    <div className="w-full flex flex-col gap-2">
      {/* Mobile/Compact Expand/Collapse Scientific Panel Toggle */}
      <div className="flex md:hidden justify-between items-center px-1">
        <button
          onClick={() => setIsScientificExpanded(!isScientificExpanded)}
          className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 py-1"
        >
          <span>{isScientificExpanded ? 'Hide Scientific Pad' : 'Show Scientific Pad'}</span>
          {isScientificExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        <button
          onClick={() => setIsSecondActive(!isSecondActive)}
          className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-colors ${
            isSecondActive
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          2nd
        </button>
      </div>

      {/* Grid Container */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 sm:gap-2">
        {/* ======================================================== */}
        {/* SCIENTIFIC PANEL (Columns 1-4 on Desktop; collapsible on mobile) */}
        {/* ======================================================== */}
        <div
          className={`${
            isScientificExpanded ? 'grid' : 'hidden md:grid'
          } col-span-4 grid-cols-4 gap-1.5 sm:gap-2`}
        >
          {/* Row 1 Scientific */}
          <button
            onClick={() => setIsSecondActive(!isSecondActive)}
            className={`py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-bold transition-all calc-btn ${
              isSecondActive
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'bg-slate-800/80 hover:bg-slate-750 text-purple-300 hover:text-purple-200 border border-slate-700/60'
            }`}
          >
            2nd
          </button>

          <button
            onClick={() => onInsert(isSecondActive ? 'asin(' : 'sin(')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          >
            {isSecondActive ? 'sin⁻¹' : 'sin'}
          </button>

          <button
            onClick={() => onInsert(isSecondActive ? 'acos(' : 'cos(')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          >
            {isSecondActive ? 'cos⁻¹' : 'cos'}
          </button>

          <button
            onClick={() => onInsert(isSecondActive ? 'atan(' : 'tan(')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          >
            {isSecondActive ? 'tan⁻¹' : 'tan'}
          </button>

          {/* Row 2 Scientific */}
          <button
            onClick={() => onInsert(isSecondActive ? 'asinh(' : 'sinh(')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          >
            {isSecondActive ? 'asinh' : 'sinh'}
          </button>

          <button
            onClick={() => onInsert(isSecondActive ? 'acosh(' : 'cosh(')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          >
            {isSecondActive ? 'acosh' : 'cosh'}
          </button>

          <button
            onClick={() => onInsert(isSecondActive ? 'atanh(' : 'tanh(')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          >
            {isSecondActive ? 'atanh' : 'tanh'}
          </button>

          <button
            onClick={() => onInsert(isSecondActive ? 'e^(' : 'ln(')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          >
            {isSecondActive ? 'eˣ' : 'ln'}
          </button>

          {/* Row 3 Scientific */}
          <button
            onClick={() => onInsert(isSecondActive ? '10^(' : 'log(')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          >
            {isSecondActive ? '10ˣ' : 'log'}
          </button>

          <button
            onClick={() => onInsert(isSecondActive ? '^3' : '^2')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          >
            {isSecondActive ? 'x³' : 'x²'}
          </button>

          <button
            onClick={() => onInsert('^')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          >
            xʸ
          </button>

          <button
            onClick={() => onInsert(isSecondActive ? 'cbrt(' : 'sqrt(')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          >
            {isSecondActive ? '∛x' : '√x'}
          </button>

          {/* Row 4 Scientific */}
          <button
            onClick={() => onInsert('nthRoot(')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
            title="nth root: nthRoot(x, n)"
          >
            ʸ√x
          </button>

          <button
            onClick={() => onInsert('!')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          >
            n!
          </button>

          <button
            onClick={() => onInsert('1/(')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          >
            1/x
          </button>

          <button
            onClick={() => onInsert('abs(')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          >
            |x|
          </button>

          {/* Row 5 Scientific */}
          <button
            onClick={() => onInsert('π')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 border border-slate-700/50 transition-all calc-btn"
          >
            π
          </button>

          <button
            onClick={() => onInsert('e')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-indigo-300 hover:text-indigo-200 border border-slate-700/50 transition-all calc-btn"
          >
            e
          </button>

          <button
            onClick={() => onInsert(' nPr ')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
            title="Permutations (nPr)"
          >
            nPr
          </button>

          <button
            onClick={() => onInsert(' nCr ')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
            title="Combinations (nCr)"
          >
            nCr
          </button>
        </div>

        {/* ======================================================== */}
        {/* CORE KEYPAD (Columns 5-8 on Desktop; Always visible on mobile) */}
        {/* ======================================================== */}
        <div className="col-span-4 grid grid-cols-4 gap-1.5 sm:gap-2">
          {/* Row 1 Core: Clear, Parens, Division */}
          <button
            onClick={onClearAll}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-sm sm:text-base font-bold bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-200 border border-rose-500/30 transition-all calc-btn"
            title="All Clear (AC / Esc)"
          >
            AC
          </button>

          <button
            onClick={() => onInsert('(')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-sm sm:text-base font-medium bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-all calc-btn"
          >
            (
          </button>

          <button
            onClick={() => onInsert(')')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-sm sm:text-base font-medium bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-all calc-btn"
          >
            )
          </button>

          <button
            onClick={() => onInsert(' ÷ ')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-bold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 transition-all calc-btn flex items-center justify-center"
          >
            <Divide className="w-4 h-4" />
          </button>

          {/* Row 2 Core: 7, 8, 9, Multiply */}
          <button
            onClick={() => onInsert('7')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-semibold bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-700/60 transition-all shadow-sm calc-btn"
          >
            7
          </button>

          <button
            onClick={() => onInsert('8')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-semibold bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-700/60 transition-all shadow-sm calc-btn"
          >
            8
          </button>

          <button
            onClick={() => onInsert('9')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-semibold bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-700/60 transition-all shadow-sm calc-btn"
          >
            9
          </button>

          <button
            onClick={() => onInsert(' × ')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-bold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 transition-all calc-btn flex items-center justify-center"
          >
            <Multiply className="w-4 h-4" />
          </button>

          {/* Row 3 Core: 4, 5, 6, Subtract */}
          <button
            onClick={() => onInsert('4')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-semibold bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-700/60 transition-all shadow-sm calc-btn"
          >
            4
          </button>

          <button
            onClick={() => onInsert('5')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-semibold bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-700/60 transition-all shadow-sm calc-btn"
          >
            5
          </button>

          <button
            onClick={() => onInsert('6')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-semibold bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-700/60 transition-all shadow-sm calc-btn"
          >
            6
          </button>

          <button
            onClick={() => onInsert(' − ')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-bold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 transition-all calc-btn flex items-center justify-center"
          >
            <Minus className="w-4 h-4" />
          </button>

          {/* Row 4 Core: 1, 2, 3, Add */}
          <button
            onClick={() => onInsert('1')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-semibold bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-700/60 transition-all shadow-sm calc-btn"
          >
            1
          </button>

          <button
            onClick={() => onInsert('2')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-semibold bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-700/60 transition-all shadow-sm calc-btn"
          >
            2
          </button>

          <button
            onClick={() => onInsert('3')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-semibold bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-700/60 transition-all shadow-sm calc-btn"
          >
            3
          </button>

          <button
            onClick={() => onInsert(' + ')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-bold bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 transition-all calc-btn flex items-center justify-center"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Row 5 Core: Negate, 0, Decimal, Backspace / Mod */}
          <button
            onClick={onNegate}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-sm sm:text-base font-semibold bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-white border border-slate-700/60 transition-all calc-btn"
            title="Negate (±)"
          >
            ±
          </button>

          <button
            onClick={() => onInsert('0')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-semibold bg-slate-800/90 hover:bg-slate-750 text-white border border-slate-700/60 transition-all shadow-sm calc-btn"
          >
            0
          </button>

          <button
            onClick={() => onInsert('.')}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-base sm:text-lg font-bold bg-slate-800/80 hover:bg-slate-750 text-white border border-slate-700/60 transition-all calc-btn"
          >
            .
          </button>

          <button
            onClick={onBackspace}
            className="py-3 sm:py-3.5 rounded-xl font-mono text-sm sm:text-base font-medium bg-slate-800/80 hover:bg-slate-750 text-slate-300 hover:text-rose-300 border border-slate-700/60 transition-all calc-btn flex items-center justify-center"
            title="Backspace (⌫)"
          >
            <Delete className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Standout Bottom Action Bar: Clear Entry, Mod, Percent, and Prominent Equals Button */}
      <div className="grid grid-cols-4 md:grid-cols-8 gap-1.5 sm:gap-2 mt-0.5">
        <button
          onClick={onClearEntry}
          className="py-2.5 sm:py-3 rounded-xl font-mono text-xs sm:text-sm font-semibold bg-slate-800/60 hover:bg-slate-800 text-amber-300 hover:text-amber-200 border border-slate-700/50 transition-all calc-btn"
          title="Clear Entry (CE)"
        >
          CE
        </button>

        <button
          onClick={() => onInsert(' mod ')}
          className="py-2.5 sm:py-3 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          title="Modulo (remainder)"
        >
          mod
        </button>

        <button
          onClick={() => onInsert('%')}
          className="py-2.5 sm:py-3 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          title="Percentage (%)"
        >
          %
        </button>

        <button
          onClick={() => onInsert('rand()')}
          className="py-2.5 sm:py-3 rounded-xl font-mono text-xs sm:text-sm font-medium bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/50 transition-all calc-btn"
          title="Random number between 0 and 1"
        >
          rand
        </button>

        {/* Equals button spans 4 columns on both desktop and mobile */}
        <button
          onClick={onCalculate}
          className="col-span-4 py-3 sm:py-3.5 rounded-xl font-mono text-lg sm:text-xl font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 border border-indigo-400/40 transition-all flex items-center justify-center gap-2 calc-btn active:scale-[0.98]"
          title="Calculate Result (Enter / =)"
        >
          <Equal className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="tracking-wide">Calculate</span>
        </button>
      </div>
    </div>
  )
}
