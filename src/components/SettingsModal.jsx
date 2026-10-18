import React from 'react'
import { X, Sliders, Volume2, Palette, Hash, Sparkles } from 'lucide-react'

export default function SettingsModal({
  isOpen,
  onClose,
  angleMode,
  setAngleMode,
  precision,
  setPrecision,
  displayFormat,
  setDisplayFormat,
  theme,
  setTheme,
  soundEnabled,
  setSoundEnabled,
  onResetDefaults
}) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-5 sm:p-6 text-slate-100 flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">Calculator Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 text-xs">
          {/* Angle Mode */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div>
              <span className="font-semibold text-white block">Angle Mode</span>
              <span className="text-slate-400">Controls sin, cos, tan, and inverse trigonometry</span>
            </div>
            <div className="flex rounded-lg bg-slate-900 p-1 border border-slate-800">
              <button
                onClick={() => setAngleMode('DEG')}
                className={`px-3 py-1 rounded-md font-mono font-bold transition-all ${
                  angleMode === 'DEG' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                DEG
              </button>
              <button
                onClick={() => setAngleMode('RAD')}
                className={`px-3 py-1 rounded-md font-mono font-bold transition-all ${
                  angleMode === 'RAD' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                RAD
              </button>
            </div>
          </div>

          {/* Decimal Precision Slider */}
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-indigo-400" />
                <span className="font-semibold text-white">Decimal Precision</span>
              </div>
              <span className="font-mono font-bold text-indigo-300 text-sm">{precision} digits</span>
            </div>
            <input
              type="range"
              min="2"
              max="14"
              value={precision}
              onChange={(e) => setPrecision(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>2</span>
              <span>6</span>
              <span>10</span>
              <span>14</span>
            </div>
          </div>

          {/* Display Notation */}
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <span className="font-semibold text-white">Result Notation Format</span>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'standard', name: 'Standard (0.00)' },
                { id: 'scientific', name: 'Scientific (1.2e+3)' },
                { id: 'engineering', name: 'Engineering (120e+3)' },
                { id: 'fraction', name: 'Exact Fraction (a/b)' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setDisplayFormat(f.id)}
                  className={`p-2 rounded-lg text-left transition-all border ${
                    displayFormat === f.id
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 font-semibold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-850 hover:text-slate-200'
                  }`}
                >
                  {f.name}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Selector */}
          <div className="flex flex-col gap-2 p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold text-white">Theme Selection</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'dark', name: 'Dark Slate' },
                { id: 'light', name: 'Modern Light' },
                { id: 'cyberpunk', name: 'Cyberpunk' }
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`py-2 px-2.5 rounded-lg text-center transition-all border ${
                    theme === t.id
                      ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50 font-semibold shadow-sm'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/60 border border-slate-800">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-indigo-400" />
              <div>
                <span className="font-semibold text-white block">Keypress Audio Feedback</span>
                <span className="text-slate-400">Synthesized mechanical click sound</span>
              </div>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                soundEnabled ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-white transition-transform ${
                  soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
          <button
            onClick={onResetDefaults}
            className="text-slate-400 hover:text-rose-400 transition-colors"
          >
            Reset to Defaults
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md shadow-indigo-600/30 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
