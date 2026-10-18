import React, { useState } from 'react'
import {
  Binary,
  CheckCircle,
  XCircle,
  Sparkles,
  ArrowRight,
  Shuffle,
  Percent,
  Divide,
  Copy,
  Check
} from 'lucide-react'
import { mathEngine } from '../utils/mathEngine'

export default function NumberTheoryTools({ onLogHistory, onPlaySound }) {
  const [activeSubTab, setActiveSubTab] = useState('prime') // 'prime', 'gcd-lcm', 'combinatorics', 'fraction', 'random'

  // 1. Prime Checker State
  const [primeInput, setPrimeInput] = useState('109')
  const [primeResult, setPrimeResult] = useState(null)

  // 2. GCD & LCM State
  const [gcdInput, setGcdInput] = useState('48, 180')
  const [gcdResult, setGcdResult] = useState(null)

  // 3. Combinatorics State
  const [combN, setCombN] = useState('10')
  const [combR, setCombR] = useState('3')
  const [combResult, setCombResult] = useState(null)

  // 4. Fraction Converter State
  const [fracInput, setFracInput] = useState('3.625')
  const [fracResult, setFracResult] = useState(null)

  // 5. Random Generator State
  const [randMin, setRandMin] = useState('1')
  const [randMax, setRandMax] = useState('100')
  const [randCount, setRandCount] = useState('5')
  const [randUnique, setRandUnique] = useState(true)
  const [randResult, setRandResult] = useState(null)

  const [copiedKey, setCopiedKey] = useState(null)

  const copyToClipboard = (text, key) => {
    if (!text) return
    navigator.clipboard.writeText(String(text))
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Handle Prime Check
  const handleCheckPrime = () => {
    onPlaySound?.('click')
    const val = Number(primeInput)
    if (isNaN(val)) return
    const res = mathEngine.checkPrime(val)
    setPrimeResult(res)
    onLogHistory?.(`Prime Check: ${val}`, res.message)
    onPlaySound?.('equals')
  }

  // Handle GCD & LCM
  const handleCalculateGcdLcm = () => {
    onPlaySound?.('click')
    try {
      const nums = gcdInput
        .split(/[, ]+/)
        .map(n => n.trim())
        .filter(n => n !== '')
        .map(Number)

      if (nums.some(isNaN) || nums.length < 2) {
        setGcdResult({ error: 'Please enter at least 2 valid numbers separated by commas or spaces.' })
        return
      }

      const scope = mathEngine.getCustomScope()
      const gcdVal = scope.gcd(...nums)
      const lcmVal = scope.lcm(...nums)

      const res = {
        numbers: nums,
        gcd: gcdVal,
        lcm: lcmVal
      }
      setGcdResult(res)
      onLogHistory?.(`GCD/LCM of [${nums.join(', ')}]`, `GCD: ${gcdVal}, LCM: ${lcmVal}`)
      onPlaySound?.('equals')
    } catch (err) {
      setGcdResult({ error: err.message })
      onPlaySound?.('error')
    }
  }

  // Handle Combinatorics (nPr, nCr)
  const handleCalculateCombinatorics = () => {
    onPlaySound?.('click')
    try {
      const n = Number(combN)
      const r = Number(combR)

      if (isNaN(n) || isNaN(r)) {
        setCombResult({ error: 'Please enter valid integer values for n and r.' })
        return
      }

      const scope = mathEngine.getCustomScope()
      const npr = scope.nPr(n, r)
      const ncr = scope.nCr(n, r)

      const res = {
        n,
        r,
        npr,
        ncr
      }
      setCombResult(res)
      onLogHistory?.(`Combinatorics: n=${n}, r=${r}`, `nPr: ${npr}, nCr: ${ncr}`)
      onPlaySound?.('equals')
    } catch (err) {
      setCombResult({ error: err.message })
      onPlaySound?.('error')
    }
  }

  // Handle Fraction Conversion
  const handleConvertFraction = () => {
    onPlaySound?.('click')
    const val = Number(fracInput)
    if (isNaN(val)) {
      setFracResult({ error: 'Please enter a valid numeric value.' })
      return
    }

    const fractionStr = mathEngine.toFractionString(val)
    setFracResult({
      original: val,
      fraction: fractionStr
    })
    onLogHistory?.(`Fraction: ${val}`, fractionStr)
    onPlaySound?.('equals')
  }

  // Handle Random Generation
  const handleGenerateRandom = () => {
    onPlaySound?.('click')
    const min = Math.ceil(Number(randMin))
    const max = Math.floor(Number(randMax))
    const count = Math.max(1, Math.min(100, Number(randCount)))

    if (isNaN(min) || isNaN(max) || min >= max) {
      setRandResult({ error: 'Min must be strictly less than Max.' })
      return
    }

    const range = max - min + 1
    if (randUnique && count > range) {
      setRandResult({ error: `Cannot generate ${count} unique numbers in a range of ${range}.` })
      return
    }

    const numbers = []
    if (randUnique) {
      const set = new Set()
      while (set.size < count) {
        set.add(Math.floor(Math.random() * range) + min)
      }
      numbers.push(...Array.from(set))
    } else {
      for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * range) + min)
      }
    }

    setRandResult({
      numbers,
      min,
      max
    })
    onLogHistory?.(`Random [${min}..${max}] × ${count}`, numbers.join(', '))
    onPlaySound?.('equals')
  }

  return (
    <div className="w-full flex flex-col gap-5 select-none">
      {/* Subtab Selector */}
      <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-lg overflow-x-auto">
        <button
          onClick={() => setActiveSubTab('prime')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
            activeSubTab === 'prime'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Prime Checker
        </button>

        <button
          onClick={() => setActiveSubTab('gcd-lcm')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
            activeSubTab === 'gcd-lcm'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          GCD & LCM
        </button>

        <button
          onClick={() => setActiveSubTab('combinatorics')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
            activeSubTab === 'combinatorics'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Permutations & Combinations
        </button>

        <button
          onClick={() => setActiveSubTab('fraction')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
            activeSubTab === 'fraction'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Fraction Converter
        </button>

        <button
          onClick={() => setActiveSubTab('random')}
          className={`flex-1 py-2 px-3 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
            activeSubTab === 'random'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Random Generator
        </button>
      </div>

      {/* ======================================================== */}
      {/* 1. PRIME CHECKER */}
      {/* ======================================================== */}
      {activeSubTab === 'prime' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-5">
          <div>
            <h3 className="text-base font-semibold text-white">Prime Number Checker & Factorization</h3>
            <p className="text-xs text-slate-400 mt-1">
              Verify if an integer is prime and discover its prime factor decomposition.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="number"
              value={primeInput}
              onChange={(e) => setPrimeInput(e.target.value)}
              placeholder="Enter an integer..."
              className="w-full sm:flex-1 h-12 rounded-xl bg-slate-950 border border-slate-700/80 px-4 font-mono text-base text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleCheckPrime}
              className="w-full sm:w-auto px-6 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-md shadow-indigo-600/30 transition-all calc-btn"
            >
              Analyze Number
            </button>
          </div>

          {primeResult && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                {primeResult.isPrime ? (
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-amber-400" />
                )}
                <span className="font-semibold text-white text-base">{primeResult.message}</span>
              </div>

              {primeResult.factors && primeResult.factors.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-slate-400">Prime Factors:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-indigo-300 font-semibold text-sm">
                      {primeResult.factors.join(' × ')}
                    </span>
                    <button
                      onClick={() => copyToClipboard(primeResult.factors.join(' * '), 'prime')}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      title="Copy factors"
                    >
                      {copiedKey === 'prime' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. GCD & LCM */}
      {/* ======================================================== */}
      {activeSubTab === 'gcd-lcm' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-5">
          <div>
            <h3 className="text-base font-semibold text-white">GCD & LCM Multi-Number Solver</h3>
            <p className="text-xs text-slate-400 mt-1">
              Find the Greatest Common Divisor and Least Common Multiple of two or more numbers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={gcdInput}
              onChange={(e) => setGcdInput(e.target.value)}
              placeholder="e.g. 24, 36, 60"
              className="w-full sm:flex-1 h-12 rounded-xl bg-slate-950 border border-slate-700/80 px-4 font-mono text-base text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleCalculateGcdLcm}
              className="w-full sm:w-auto px-6 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-md shadow-indigo-600/30 transition-all calc-btn"
            >
              Compute GCD & LCM
            </button>
          </div>

          {gcdResult && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3">
              {gcdResult.error ? (
                <span className="text-rose-400 text-sm font-medium">{gcdResult.error}</span>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col gap-1">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Greatest Common Divisor (GCD)
                    </span>
                    <span className="font-mono text-2xl font-bold text-indigo-300">{gcdResult.gcd}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col gap-1">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Least Common Multiple (LCM)
                    </span>
                    <span className="font-mono text-2xl font-bold text-purple-300">{gcdResult.lcm}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. COMBINATORICS (nPr, nCr) */}
      {/* ======================================================== */}
      {activeSubTab === 'combinatorics' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-5">
          <div>
            <h3 className="text-base font-semibold text-white">Permutations & Combinations (nPr, nCr)</h3>
            <p className="text-xs text-slate-400 mt-1">
              Calculate arrangements where order matters (nPr) and selections where order doesn't (nCr).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-mono">Total Items (n):</label>
              <input
                type="number"
                value={combN}
                onChange={(e) => setCombN(e.target.value)}
                className="w-full h-12 rounded-xl bg-slate-950 border border-slate-700/80 px-4 font-mono text-base text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-mono">Select Items (r):</label>
              <input
                type="number"
                value={combR}
                onChange={(e) => setCombR(e.target.value)}
                className="w-full h-12 rounded-xl bg-slate-950 border border-slate-700/80 px-4 font-mono text-base text-white outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleCalculateCombinatorics}
              className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-md shadow-indigo-600/30 transition-all calc-btn"
            >
              Calculate
            </button>
          </div>

          {combResult && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3">
              {combResult.error ? (
                <span className="text-rose-400 text-sm font-medium">{combResult.error}</span>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col gap-1">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Permutations (nPr = n! / (n-r)!)
                    </span>
                    <span className="font-mono text-2xl font-bold text-indigo-300">{combResult.npr}</span>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col gap-1">
                    <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                      Combinations (nCr = n! / (r!·(n-r)!))
                    </span>
                    <span className="font-mono text-2xl font-bold text-purple-300">{combResult.ncr}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. FRACTION CONVERTER */}
      {/* ======================================================== */}
      {activeSubTab === 'fraction' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-5">
          <div>
            <h3 className="text-base font-semibold text-white">Decimal to Exact & Mixed Fraction Converter</h3>
            <p className="text-xs text-slate-400 mt-1">
              Converts floating point decimals into simplified irreducible rational fractions and mixed numbers.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              value={fracInput}
              onChange={(e) => setFracInput(e.target.value)}
              placeholder="e.g. 0.875 or 2.625"
              className="w-full sm:flex-1 h-12 rounded-xl bg-slate-950 border border-slate-700/80 px-4 font-mono text-base text-white outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              onClick={handleConvertFraction}
              className="w-full sm:w-auto px-6 h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-md shadow-indigo-600/30 transition-all calc-btn"
            >
              Convert to Fraction
            </button>
          </div>

          {fracResult && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3">
              {fracResult.error ? (
                <span className="text-rose-400 text-sm font-medium">{fracResult.error}</span>
              ) : (
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-lg text-slate-400">{fracResult.original}</span>
                    <ArrowRight className="w-4 h-4 text-indigo-400" />
                    <span className="font-mono text-2xl font-bold text-white">{fracResult.fraction}</span>
                  </div>

                  <button
                    onClick={() => copyToClipboard(fracResult.fraction, 'frac')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
                  >
                    {copiedKey === 'frac' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. RANDOM NUMBER GENERATOR */}
      {/* ======================================================== */}
      {activeSubTab === 'random' && (
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-5">
          <div>
            <h3 className="text-base font-semibold text-white">Cryptographic / Uniform Random Generator</h3>
            <p className="text-xs text-slate-400 mt-1">
              Generate customizable random integers or sequences within any specified boundary.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div>
              <label className="text-xs text-slate-400 block mb-1 font-mono">Min Value:</label>
              <input
                type="number"
                value={randMin}
                onChange={(e) => setRandMin(e.target.value)}
                className="w-full h-12 rounded-xl bg-slate-950 border border-slate-700/80 px-4 font-mono text-base text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-mono">Max Value:</label>
              <input
                type="number"
                value={randMax}
                onChange={(e) => setRandMax(e.target.value)}
                className="w-full h-12 rounded-xl bg-slate-950 border border-slate-700/80 px-4 font-mono text-base text-white outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1 font-mono">Quantity (Count):</label>
              <input
                type="number"
                value={randCount}
                onChange={(e) => setRandCount(e.target.value)}
                className="w-full h-12 rounded-xl bg-slate-950 border border-slate-700/80 px-4 font-mono text-base text-white outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleGenerateRandom}
              className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 calc-btn"
            >
              <Shuffle className="w-4 h-4" />
              <span>Generate</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="unique-cb"
              checked={randUnique}
              onChange={(e) => setRandUnique(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="unique-cb" className="text-xs text-slate-300 cursor-pointer">
              Ensure all generated numbers are unique (no duplicates)
            </label>
          </div>

          {randResult && (
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col gap-3">
              {randResult.error ? (
                <span className="text-rose-400 text-sm font-medium">{randResult.error}</span>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-400">Generated Numbers:</span>
                    <button
                      onClick={() => copyToClipboard(randResult.numbers.join(', '), 'rand')}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1"
                    >
                      {copiedKey === 'rand' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy All</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {randResult.numbers.map((n, i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 font-mono text-base font-semibold text-indigo-300 shadow-sm"
                      >
                        {n}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
