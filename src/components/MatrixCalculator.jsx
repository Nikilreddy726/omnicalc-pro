import React, { useState } from 'react'
import {
  Grid3X3,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  AlertCircle,
  HelpCircle
} from 'lucide-react'
import { MatrixEngine } from '../utils/matrixEngine'

export default function MatrixCalculator({ onLogHistory, onPlaySound }) {
  // Dimensions for Matrix A and Matrix B
  const [rowsA, setRowsA] = useState(2)
  const [colsA, setColsA] = useState(2)
  const [rowsB, setRowsB] = useState(2)
  const [colsB, setColsB] = useState(2)

  // Matrix values state
  const [matrixA, setMatrixA] = useState([
    [1, 2],
    [3, 4]
  ])
  const [matrixB, setMatrixB] = useState([
    [5, 6],
    [7, 8]
  ])

  // Scalars for scalar multiplication
  const [scalarA, setScalarA] = useState(2)
  const [scalarB, setScalarB] = useState(2)

  // Result state
  const [resultMatrix, setResultMatrix] = useState(null)
  const [scalarResult, setScalarResult] = useState(null)
  const [operationTitle, setOperationTitle] = useState('')
  const [error, setError] = useState(null)
  const [copied, setCopied] = useState(false)

  // Resize matrix helper
  const resizeMatrix = (matrix, newRows, newCols, fill = 0) => {
    return Array.from({ length: newRows }, (_, r) =>
      Array.from({ length: newCols }, (_, c) => (matrix[r] && matrix[r][c] !== undefined ? matrix[r][c] : fill))
    )
  }

  const handleDimensionChangeA = (newR, newC) => {
    newR = Math.max(1, Math.min(5, newR))
    newC = Math.max(1, Math.min(5, newC))
    setRowsA(newR)
    setColsA(newC)
    setMatrixA(prev => resizeMatrix(prev, newR, newC))
  }

  const handleDimensionChangeB = (newR, newC) => {
    newR = Math.max(1, Math.min(5, newR))
    newC = Math.max(1, Math.min(5, newC))
    setRowsB(newR)
    setColsB(newC)
    setMatrixB(prev => resizeMatrix(prev, newR, newC))
  }

  const updateCellA = (r, c, val) => {
    const num = val === '' ? '' : Number(val)
    setMatrixA(prev => {
      const copy = prev.map(row => [...row])
      copy[r][c] = num
      return copy
    })
  }

  const updateCellB = (r, c, val) => {
    const num = val === '' ? '' : Number(val)
    setMatrixB(prev => {
      const copy = prev.map(row => [...row])
      copy[r][c] = num
      return copy
    })
  }

  // Sanitize matrices before calculation (replace empty string with 0)
  const sanitize = (mat) => mat.map(row => row.map(cell => (cell === '' || isNaN(cell) ? 0 : Number(cell))))

  // Execute operation safely
  const runOperation = (name, fn) => {
    setError(null)
    setResultMatrix(null)
    setScalarResult(null)
    setOperationTitle(name)
    onPlaySound?.('click')

    try {
      const cleanA = sanitize(matrixA)
      const cleanB = sanitize(matrixB)
      const res = fn(cleanA, cleanB)

      if (typeof res === 'number') {
        setScalarResult(res)
        onLogHistory?.(`Matrix: ${name}`, `${res}`)
      } else {
        setResultMatrix(res)
        onLogHistory?.(`Matrix: ${name}`, MatrixEngine.toString(res))
      }
      onPlaySound?.('equals')
    } catch (err) {
      setError(err.message)
      onPlaySound?.('error')
    }
  }

  // Preset operations
  const setPreset = (target, type) => {
    onPlaySound?.('click')
    if (target === 'A') {
      if (type === 'identity') {
        const n = Math.min(rowsA, colsA)
        setRowsA(n)
        setColsA(n)
        setMatrixA(MatrixEngine.createIdentity(n))
      } else if (type === 'zero') {
        setMatrixA(MatrixEngine.createMatrix(rowsA, colsA, 0))
      } else if (type === 'random') {
        setMatrixA(MatrixEngine.createRandom(rowsA, colsA, -5, 10))
      }
    } else {
      if (type === 'identity') {
        const n = Math.min(rowsB, colsB)
        setRowsB(n)
        setColsB(n)
        setMatrixB(MatrixEngine.createIdentity(n))
      } else if (type === 'zero') {
        setMatrixB(MatrixEngine.createMatrix(rowsB, colsB, 0))
      } else if (type === 'random') {
        setMatrixB(MatrixEngine.createRandom(rowsB, colsB, -5, 10))
      }
    }
  }

  // Copy result
  const handleCopy = () => {
    let text = ''
    if (scalarResult !== null) {
      text = String(scalarResult)
    } else if (resultMatrix) {
      text = MatrixEngine.toString(resultMatrix)
    }
    if (text) {
      navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // Transfer result to Matrix A or B
  const transferResult = (target) => {
    if (!resultMatrix) return
    onPlaySound?.('click')
    const r = resultMatrix.length
    const c = resultMatrix[0]?.length || 0

    if (target === 'A') {
      setRowsA(r)
      setColsA(c)
      setMatrixA(resultMatrix)
    } else {
      setRowsB(r)
      setColsB(c)
      setMatrixB(resultMatrix)
    }
  }

  return (
    <div className="w-full flex flex-col gap-6 select-none">
      {/* Introduction Banner */}
      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-3 text-sm text-indigo-200">
        <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <h2 className="font-semibold text-white">Linear Algebra & Matrix Studio</h2>
          <p className="text-xs text-indigo-300/80 mt-0.5">
            Perform matrix addition, subtraction, multiplication, inverse, determinant, transpose, and scalar operations up to 5×5 matrices with real-time validation.
          </p>
        </div>
      </div>

      {/* Matrices Grid Inputs: Matrix A and Matrix B */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* MATRIX A */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono font-bold flex items-center justify-center text-xs shadow-sm">
                A
              </span>
              <h3 className="font-semibold text-slate-100 text-sm">Matrix A</h3>
              <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                {rowsA} × {colsA}
              </span>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setPreset('A', 'identity')}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Identity Matrix"
              >
                I
              </button>
              <button
                onClick={() => setPreset('A', 'zero')}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Zero Matrix"
              >
                0
              </button>
              <button
                onClick={() => setPreset('A', 'random')}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Random Matrix"
              >
                Rand
              </button>
            </div>
          </div>

          {/* Size Selectors */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Preset sizes:</span>
            {[2, 3, 4].map(sz => (
              <button
                key={sz}
                onClick={() => handleDimensionChangeA(sz, sz)}
                className={`px-2 py-1 rounded font-mono font-medium transition-colors ${
                  rowsA === sz && colsA === sz
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {sz}×{sz}
              </button>
            ))}
          </div>

          {/* Grid of Inputs */}
          <div className="flex justify-center p-2 overflow-x-auto">
            <div
              className="grid gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-inner"
              style={{ gridTemplateColumns: `repeat(${colsA}, minmax(44px, 60px))` }}
            >
              {matrixA.map((row, r) =>
                row.map((cell, c) => (
                  <input
                    key={`A-${r}-${c}`}
                    type="number"
                    value={cell}
                    onChange={(e) => updateCellA(r, c, e.target.value)}
                    className="w-full h-10 sm:h-11 rounded-lg bg-slate-900 border border-slate-700/80 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-center font-mono text-sm text-white outline-none transition-all"
                  />
                ))
              )}
            </div>
          </div>

          {/* Matrix A Unary Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2 border-t border-slate-800/60 text-xs">
            <button
              onClick={() => runOperation('det(A)', (A) => MatrixEngine.determinant(A))}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors font-mono"
            >
              det(A)
            </button>
            <button
              onClick={() => runOperation('A⁻¹', (A) => MatrixEngine.inverse(A))}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors font-mono"
            >
              A⁻¹
            </button>
            <button
              onClick={() => runOperation('Aᵀ', (A) => MatrixEngine.transpose(A))}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors font-mono"
            >
              Aᵀ
            </button>
            <button
              onClick={() => runOperation('Trace(A)', (A) => MatrixEngine.trace(A))}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors font-mono"
            >
              Trace(A)
            </button>
          </div>

          {/* Scalar multiply A */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-mono">k × A:</span>
            <input
              type="number"
              value={scalarA}
              onChange={(e) => setScalarA(e.target.value)}
              className="w-16 h-8 rounded-lg bg-slate-950 border border-slate-700 text-center font-mono text-white text-xs outline-none focus:border-indigo-500"
            />
            <button
              onClick={() => runOperation(`${scalarA} × A`, (A) => MatrixEngine.scalarMultiply(A, scalarA))}
              className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-mono"
            >
              Compute k·A
            </button>
          </div>
        </div>

        {/* MATRIX B */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-purple-600 text-white font-mono font-bold flex items-center justify-center text-xs shadow-sm">
                B
              </span>
              <h3 className="font-semibold text-slate-100 text-sm">Matrix B</h3>
              <span className="text-xs font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">
                {rowsB} × {colsB}
              </span>
            </div>

            {/* Presets */}
            <div className="flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setPreset('B', 'identity')}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Identity Matrix"
              >
                I
              </button>
              <button
                onClick={() => setPreset('B', 'zero')}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Zero Matrix"
              >
                0
              </button>
              <button
                onClick={() => setPreset('B', 'random')}
                className="px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                title="Random Matrix"
              >
                Rand
              </button>
            </div>
          </div>

          {/* Size Selectors */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span>Preset sizes:</span>
            {[2, 3, 4].map(sz => (
              <button
                key={sz}
                onClick={() => handleDimensionChangeB(sz, sz)}
                className={`px-2 py-1 rounded font-mono font-medium transition-colors ${
                  rowsB === sz && colsB === sz
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {sz}×{sz}
              </button>
            ))}
          </div>

          {/* Grid of Inputs */}
          <div className="flex justify-center p-2 overflow-x-auto">
            <div
              className="grid gap-2 p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 shadow-inner"
              style={{ gridTemplateColumns: `repeat(${colsB}, minmax(44px, 60px))` }}
            >
              {matrixB.map((row, r) =>
                row.map((cell, c) => (
                  <input
                    key={`B-${r}-${c}`}
                    type="number"
                    value={cell}
                    onChange={(e) => updateCellB(r, c, e.target.value)}
                    className="w-full h-10 sm:h-11 rounded-lg bg-slate-900 border border-slate-700/80 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-center font-mono text-sm text-white outline-none transition-all"
                  />
                ))
              )}
            </div>
          </div>

          {/* Matrix B Unary Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-2 border-t border-slate-800/60 text-xs">
            <button
              onClick={() => runOperation('det(B)', (_, B) => MatrixEngine.determinant(B))}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors font-mono"
            >
              det(B)
            </button>
            <button
              onClick={() => runOperation('B⁻¹', (_, B) => MatrixEngine.inverse(B))}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors font-mono"
            >
              B⁻¹
            </button>
            <button
              onClick={() => runOperation('Bᵀ', (_, B) => MatrixEngine.transpose(B))}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors font-mono"
            >
              Bᵀ
            </button>
            <button
              onClick={() => runOperation('Trace(B)', (_, B) => MatrixEngine.trace(B))}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 transition-colors font-mono"
            >
              Trace(B)
            </button>
          </div>

          {/* Scalar multiply B */}
          <div className="flex items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 font-mono">k × B:</span>
            <input
              type="number"
              value={scalarB}
              onChange={(e) => setScalarB(e.target.value)}
              className="w-16 h-8 rounded-lg bg-slate-950 border border-slate-700 text-center font-mono text-white text-xs outline-none focus:border-purple-500"
            />
            <button
              onClick={() => runOperation(`${scalarB} × B`, (_, B) => MatrixEngine.scalarMultiply(B, scalarB))}
              className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors font-mono"
            >
              Compute k·B
            </button>
          </div>
        </div>
      </div>

      {/* Binary Operations Toolbar: A + B, A - B, A * B */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-semibold text-slate-200">Binary Operations:</span>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => runOperation('A + B', (A, B) => MatrixEngine.add(A, B))}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all calc-btn"
          >
            A + B
          </button>
          <button
            onClick={() => runOperation('A − B', (A, B) => MatrixEngine.subtract(A, B))}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all calc-btn"
          >
            A − B
          </button>
          <button
            onClick={() => runOperation('A × B', (A, B) => MatrixEngine.multiply(A, B))}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-mono font-semibold text-sm shadow-md shadow-indigo-600/30 transition-all calc-btn"
          >
            A × B
          </button>
        </div>
      </div>

      {/* Result Display & Errors */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-300 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {(resultMatrix || scalarResult !== null) && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Result
              </span>
              <h3 className="font-semibold text-slate-200 text-sm">{operationTitle}</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Result'}</span>
              </button>

              {resultMatrix && (
                <>
                  <button
                    onClick={() => transferResult('A')}
                    className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs transition-colors"
                    title="Send result into Matrix A"
                  >
                    → Store in A
                  </button>
                  <button
                    onClick={() => transferResult('B')}
                    className="px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs transition-colors"
                    title="Send result into Matrix B"
                  >
                    → Store in B
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Scalar Result Output */}
          {scalarResult !== null && (
            <div className="flex justify-center p-6 font-mono text-4xl sm:text-5xl font-bold text-white bg-slate-950/60 rounded-xl border border-slate-800/80">
              {scalarResult}
            </div>
          )}

          {/* Matrix Result Output */}
          {resultMatrix && (
            <div className="flex justify-center p-4 overflow-x-auto">
              <div className="relative inline-flex items-center px-4 py-2">
                {/* Left Bracket */}
                <div className="w-3 self-stretch border-l-2 border-t-2 border-b-2 border-slate-400 rounded-l-md" />

                <div
                  className="grid gap-3 px-3 py-2"
                  style={{ gridTemplateColumns: `repeat(${resultMatrix[0]?.length || 1}, minmax(48px, auto))` }}
                >
                  {resultMatrix.map((row, r) =>
                    row.map((val, c) => (
                      <div
                        key={`res-${r}-${c}`}
                        className="h-10 sm:h-11 px-3 rounded-lg bg-slate-950/80 border border-slate-800 flex items-center justify-center font-mono text-sm sm:text-base font-semibold text-white shadow-inner"
                      >
                        {val}
                      </div>
                    ))
                  )}
                </div>

                {/* Right Bracket */}
                <div className="w-3 self-stretch border-r-2 border-t-2 border-b-2 border-slate-400 rounded-r-md" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
