import React, { useState, useEffect, useRef, useCallback } from 'react'
import Header from './components/Header'
import Display from './components/Display'
import MemoryBar from './components/MemoryBar'
import Keypad from './components/Keypad'
import MatrixCalculator from './components/MatrixCalculator'
import NumberTheoryTools from './components/NumberTheoryTools'
import HistoryDrawer from './components/HistoryDrawer'
import SettingsModal from './components/SettingsModal'
import ShortcutsModal from './components/ShortcutsModal'
import { mathEngine } from './utils/mathEngine'
import { playSound, triggerHaptic } from './utils/sound'

export default function App() {
  // Navigation tab: 'scientific', 'matrix', 'tools'
  const [activeTab, setActiveTab] = useState('scientific')

  // Calculator Core State
  const [expression, setExpression] = useState('')
  const [result, setResult] = useState(null)
  const [previewResult, setPreviewResult] = useState(null)
  const [error, setError] = useState(null)

  // Secondary function toggle (2nd)
  const [isSecondActive, setIsSecondActive] = useState(false)
  const [isScientificExpanded, setIsScientificExpanded] = useState(false)

  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false)
  const [copiedTarget, setCopiedTarget] = useState(null)

  // References
  const inputRef = useRef(null)

  // =========================================================================
  // PERSISTED SETTINGS (LocalStorage)
  // =========================================================================
  const [angleMode, setAngleModeState] = useState(() => {
    return localStorage.getItem('omni_angleMode') || 'DEG'
  })

  const [precision, setPrecisionState] = useState(() => {
    const saved = localStorage.getItem('omni_precision')
    return saved ? Number(saved) : 8
  })

  const [displayFormat, setDisplayFormatState] = useState(() => {
    return localStorage.getItem('omni_displayFormat') || 'standard'
  })

  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('omni_theme') || 'dark'
  })

  const [soundEnabled, setSoundEnabledState] = useState(() => {
    const saved = localStorage.getItem('omni_sound')
    return saved !== null ? JSON.parse(saved) : true
  })

  const [memoryValue, setMemoryValueState] = useState(() => {
    const saved = localStorage.getItem('omni_memory')
    return saved ? Number(saved) : 0
  })

  const [history, setHistoryState] = useState(() => {
    try {
      const saved = localStorage.getItem('omni_history')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Synchronize mathEngine configuration
  useEffect(() => {
    mathEngine.setAngleMode(angleMode)
    localStorage.setItem('omni_angleMode', angleMode)
  }, [angleMode])

  useEffect(() => {
    mathEngine.setPrecision(precision)
    localStorage.setItem('omni_precision', precision)
  }, [precision])

  useEffect(() => {
    mathEngine.setDisplayFormat(displayFormat)
    localStorage.setItem('omni_displayFormat', displayFormat)
  }, [displayFormat])

  useEffect(() => {
    localStorage.setItem('omni_theme', theme)
  }, [theme])

  useEffect(() => {
    localStorage.setItem('omni_sound', JSON.stringify(soundEnabled))
  }, [soundEnabled])

  useEffect(() => {
    localStorage.setItem('omni_memory', String(memoryValue))
  }, [memoryValue])

  useEffect(() => {
    localStorage.setItem('omni_history', JSON.stringify(history))
  }, [history])

  // Play audio wrapper
  const triggerAudio = useCallback((type) => {
    playSound(type, soundEnabled)
    triggerHaptic()
  }, [soundEnabled])

  // =========================================================================
  // LIVE CALCULATION PREVIEW
  // =========================================================================
  useEffect(() => {
    if (!expression || expression.trim() === '') {
      setPreviewResult(null)
      setError(null)
      return
    }

    // Try silent evaluation for live preview
    const { result: evaluated, error: err } = mathEngine.evaluate(expression)
    if (!err && evaluated !== null && evaluated !== undefined) {
      setPreviewResult(evaluated)
    } else {
      setPreviewResult(null)
    }
  }, [expression, angleMode, precision, displayFormat])

  // =========================================================================
  // INSERTION & MANIPULATION LOGIC
  // =========================================================================
  const handleInsert = useCallback((value) => {
    triggerAudio('click')
    setError(null)

    setExpression((prev) => {
      // If previous calculation just finished and user starts typing a number, start fresh
      if (result !== null && /^[0-9πe.]$/.test(value)) {
        setResult(null)
        return value
      }
      // If user clicks an operator (+, -, *, /) right after result, chain it with previous result
      if (result !== null && /^[+\−×÷^]/.test(value.trim())) {
        const chainExpr = `${result} ${value.trim()} `
        setResult(null)
        return chainExpr
      }

      setResult(null)
      return prev + value
    })
  }, [result, triggerAudio])

  // All Clear (AC)
  const handleClearAll = useCallback(() => {
    triggerAudio('clear')
    setExpression('')
    setResult(null)
    setPreviewResult(null)
    setError(null)
  }, [triggerAudio])

  // Clear Entry (CE)
  const handleClearEntry = useCallback(() => {
    triggerAudio('click')
    setError(null)
    setExpression((prev) => {
      // Remove last token / word / number
      const tokens = prev.trimEnd().split(/([+\−×÷^() ]+)/)
      tokens.pop()
      return tokens.join('')
    })
  }, [triggerAudio])

  // Backspace (⌫)
  const handleBackspace = useCallback(() => {
    triggerAudio('click')
    setError(null)
    setExpression((prev) => {
      if (!prev) return ''
      // If ending with function name like "sin(" or "sqrt(", remove the entire function call
      const match = prev.match(/([a-zA-Z0-9_]+[(]|\s*n[P|C]r\s*|\s*mod\s*)$/)
      if (match) {
        return prev.slice(0, -match[0].length)
      }
      return prev.slice(0, -1)
    })
  }, [triggerAudio])

  // Negate (±)
  const handleNegate = useCallback(() => {
    triggerAudio('click')
    setExpression((prev) => {
      if (!prev) return '-('
      if (prev.startsWith('-(') && prev.endsWith(')')) {
        return prev.slice(2, -1)
      }
      return `-(${prev})`
    })
  }, [triggerAudio])

  // =========================================================================
  // EVALUATION & HISTORY LOGGING
  // =========================================================================
  const logToHistory = useCallback((expr, res) => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    const newEntry = {
      id: `${Date.now()}-${Math.random()}`,
      expression: expr,
      result: res,
      timestamp: timeStr
    }
    setHistoryState((prev) => [newEntry, ...prev.slice(0, 99)]) // Keep up to 100 entries
  }, [])

  const handleCalculate = useCallback(() => {
    if (!expression || expression.trim() === '') return

    const { result: evaluated, raw, error: err } = mathEngine.evaluate(expression)

    if (err) {
      setError(err)
      triggerAudio('error')
    } else {
      setResult(evaluated)
      setError(null)
      logToHistory(expression, evaluated)
      triggerAudio('equals')
    }
  }, [expression, triggerAudio, logToHistory])

  // Toggle Fraction vs Decimal view for current result
  const handleToggleFraction = useCallback(() => {
    if (!result) return
    triggerAudio('click')
    if (displayFormat === 'fraction') {
      setDisplayFormatState('standard')
    } else {
      setDisplayFormatState('fraction')
    }
  }, [result, displayFormat, triggerAudio])

  // =========================================================================
  // MEMORY OPERATIONS (MC, MR, M+, M-, MS)
  // =========================================================================
  const getCurrentOrEvaluatedNumber = () => {
    if (result !== null && !isNaN(Number(result))) {
      return Number(result)
    }
    if (expression) {
      const { raw, error } = mathEngine.evaluate(expression)
      if (!error && typeof raw === 'number' && Number.isFinite(raw)) {
        return raw
      }
    }
    return 0
  }

  const handleMemoryClear = () => {
    triggerAudio('click')
    setMemoryValueState(0)
  }

  const handleMemoryRecall = () => {
    triggerAudio('click')
    handleInsert(String(memoryValue))
  }

  const handleMemoryAdd = () => {
    triggerAudio('click')
    const val = getCurrentOrEvaluatedNumber()
    setMemoryValueState((prev) => Number((prev + val).toFixed(10)))
  }

  const handleMemorySubtract = () => {
    triggerAudio('click')
    const val = getCurrentOrEvaluatedNumber()
    setMemoryValueState((prev) => Number((prev - val).toFixed(10)))
  }

  const handleMemoryStore = () => {
    triggerAudio('click')
    const val = getCurrentOrEvaluatedNumber()
    setMemoryValueState(val)
  }

  // =========================================================================
  // CLIPBOARD COPY
  // =========================================================================
  const handleCopy = (text, target) => {
    if (!text) return
    navigator.clipboard.writeText(String(text))
    setCopiedTarget(target)
    triggerAudio('click')
    setTimeout(() => setCopiedTarget(null), 2000)
  }

  // =========================================================================
  // KEYBOARD EVENT LISTENER
  // =========================================================================
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in a modal, search, or matrix input
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        return
      }

      const key = e.key

      // Number keys & basic operators
      if (/^[0-9.]$/.test(key)) {
        e.preventDefault()
        handleInsert(key)
      } else if (key === '+') {
        e.preventDefault()
        handleInsert(' + ')
      } else if (key === '-') {
        e.preventDefault()
        handleInsert(' − ')
      } else if (key === '*') {
        e.preventDefault()
        handleInsert(' × ')
      } else if (key === '/') {
        e.preventDefault()
        handleInsert(' ÷ ')
      } else if (key === '%') {
        e.preventDefault()
        handleInsert('%')
      } else if (key === '^') {
        e.preventDefault()
        handleInsert('^')
      } else if (key === '(' || key === ')') {
        e.preventDefault()
        handleInsert(key)
      } else if (key === '!' ) {
        e.preventDefault()
        handleInsert('!')
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault()
        handleCalculate()
      } else if (key === 'Backspace') {
        e.preventDefault()
        handleBackspace()
      } else if (key === 'Escape') {
        e.preventDefault()
        handleClearAll()
      } else if (key.toLowerCase() === 's') {
        e.preventDefault()
        handleInsert('sin(')
      } else if (key.toLowerCase() === 'c' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault()
        handleInsert('cos(')
      } else if (key.toLowerCase() === 't') {
        e.preventDefault()
        handleInsert('tan(')
      } else if (key.toLowerCase() === 'l') {
        e.preventDefault()
        handleInsert('log(')
      } else if (key.toLowerCase() === 'n') {
        e.preventDefault()
        handleInsert('ln(')
      } else if (key.toLowerCase() === 'r') {
        e.preventDefault()
        handleInsert('sqrt(')
      } else if (key.toLowerCase() === 'p') {
        e.preventDefault()
        handleInsert('π')
      } else if (key.toLowerCase() === 'e') {
        e.preventDefault()
        handleInsert('e')
      } else if (key.toLowerCase() === 'h') {
        e.preventDefault()
        setIsHistoryOpen((prev) => !prev)
      } else if (key === '?') {
        e.preventDefault()
        setIsShortcutsOpen(true)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleInsert, handleCalculate, handleBackspace, handleClearAll])

  // Reset defaults
  const handleResetDefaults = () => {
    setAngleModeState('DEG')
    setPrecisionState(8)
    setDisplayFormatState('standard')
    setThemeState('dark')
    setSoundEnabledState(true)
    setIsSettingsOpen(false)
  }

  // Theme container classes
  const getThemeClass = () => {
    if (theme === 'light') {
      return 'bg-slate-100 text-slate-800'
    }
    if (theme === 'cyberpunk') {
      return 'bg-[#0b0b14] text-cyan-200'
    }
    return 'bg-slate-950 text-slate-100'
  }

  return (
    <div className={`min-h-screen flex flex-col font-sans transition-colors duration-200 ${getThemeClass()}`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        angleMode={angleMode}
        setAngleMode={setAngleModeState}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabledState}
        theme={theme}
        setTheme={setThemeState}
        historyCount={history.length}
        onToggleHistory={() => setIsHistoryOpen(!isHistoryOpen)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-3 sm:p-6 flex flex-col items-center justify-start">
        {/* TAB 1: SCIENTIFIC CALCULATOR */}
        {activeTab === 'scientific' && (
          <div className="w-full max-w-2xl flex flex-col gap-3 sm:gap-4 my-auto py-2">
            {/* Display Panel */}
            <Display
              expression={expression}
              setExpression={setExpression}
              result={result}
              previewResult={previewResult}
              error={error}
              angleMode={angleMode}
              memoryValue={memoryValue}
              isSecondActive={isSecondActive}
              displayFormat={displayFormat}
              onToggleFraction={handleToggleFraction}
              onCopy={handleCopy}
              copiedTarget={copiedTarget}
              inputRef={inputRef}
            />

            {/* Memory Bar */}
            <MemoryBar
              memoryValue={memoryValue}
              onMemoryClear={handleMemoryClear}
              onMemoryRecall={handleMemoryRecall}
              onMemoryAdd={handleMemoryAdd}
              onMemorySubtract={handleMemorySubtract}
              onMemoryStore={handleMemoryStore}
            />

            {/* Scientific & Core Keypad */}
            <Keypad
              isSecondActive={isSecondActive}
              setIsSecondActive={setIsSecondActive}
              isScientificExpanded={isScientificExpanded}
              setIsScientificExpanded={setIsScientificExpanded}
              onInsert={handleInsert}
              onClearAll={handleClearAll}
              onClearEntry={handleClearEntry}
              onBackspace={handleBackspace}
              onCalculate={handleCalculate}
              onNegate={handleNegate}
            />
          </div>
        )}

        {/* TAB 2: MATRIX STUDIO */}
        {activeTab === 'matrix' && (
          <div className="w-full py-4">
            <MatrixCalculator
              onLogHistory={logToHistory}
              onPlaySound={triggerAudio}
            />
          </div>
        )}

        {/* TAB 3: ADVANCED NUMBER TOOLS */}
        {activeTab === 'tools' && (
          <div className="w-full py-4">
            <NumberTheoryTools
              onLogHistory={logToHistory}
              onPlaySound={triggerAudio}
            />
          </div>
        )}
      </main>

      {/* Footer Info */}
      <footer className="w-full py-3 border-t border-slate-800/80 text-center text-xs text-slate-500 font-mono">
        <span>OmniCalc Pro • Precision Math Engine powered by math.js • Press </span>
        <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-400 font-bold border border-slate-700">?</kbd>
        <span> for hotkeys</span>
      </footer>

      {/* History Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={() => setHistoryState([])}
        onSelectExpression={(expr) => {
          setExpression(expr)
          setResult(null)
          setIsHistoryOpen(false)
          triggerAudio('click')
        }}
        onSelectResult={(res) => {
          handleInsert(String(res))
          setIsHistoryOpen(false)
          triggerAudio('click')
        }}
        onDeleteHistoryItem={(id) => {
          setHistoryState((prev) => prev.filter((item) => item.id !== id))
        }}
      />

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        angleMode={angleMode}
        setAngleMode={setAngleModeState}
        precision={precision}
        setPrecision={setPrecisionState}
        displayFormat={displayFormat}
        setDisplayFormat={setDisplayFormatState}
        theme={theme}
        setTheme={setThemeState}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabledState}
        onResetDefaults={handleResetDefaults}
      />

      {/* Shortcuts Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />
    </div>
  )
}
