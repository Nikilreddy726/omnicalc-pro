import React from 'react'
import {
  Calculator,
  Grid3X3,
  Binary,
  Volume2,
  VolumeX,
  History,
  Settings,
  Keyboard,
  Sun,
  Moon,
  Sparkles
} from 'lucide-react'

export default function Header({
  activeTab,
  setActiveTab,
  angleMode,
  setAngleMode,
  soundEnabled,
  setSoundEnabled,
  theme,
  setTheme,
  historyCount,
  onToggleHistory,
  onOpenSettings,
  onOpenShortcuts
}) {
  const cycleTheme = () => {
    if (theme === 'dark') setTheme('light')
    else if (theme === 'light') setTheme('cyberpunk')
    else setTheme('dark')
  }

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-500" />
    if (theme === 'cyberpunk') return <Sparkles className="w-4 h-4 text-fuchsia-400" />
    return <Moon className="w-4 h-4 text-indigo-400" />
  }

  return (
    <header className="w-full border-b transition-colors duration-200 backdrop-blur-md sticky top-0 z-30
      bg-slate-900/80 border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* App Title & Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
            <Calculator className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                OmniCalc Pro
              </h1>
              <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Scientific
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              All-in-One Mathematics & Matrix Studio
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center p-1 rounded-xl bg-slate-950/60 border border-slate-800/80 shadow-inner">
          <button
            onClick={() => setActiveTab('scientific')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              activeTab === 'scientific'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Scientific</span>
          </button>

          <button
            onClick={() => setActiveTab('matrix')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              activeTab === 'matrix'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span>Matrix Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('tools')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
              activeTab === 'tools'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Advanced</span>
            <span>Tools</span>
          </button>
        </div>

        {/* Quick Actions & Preferences */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Angle Mode Badge Button (Only in scientific tab) */}
          {activeTab === 'scientific' && (
            <button
              onClick={() => setAngleMode(angleMode === 'DEG' ? 'RAD' : 'DEG')}
              title={`Switch angle mode (Currently ${angleMode})`}
              className="px-2.5 py-1.5 rounded-lg text-xs font-mono font-bold tracking-wide transition-all bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/50"
            >
              {angleMode}
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
            className={`p-2 rounded-lg text-xs transition-colors border ${
              soundEnabled
                ? 'bg-slate-800/80 text-emerald-400 border-slate-700 hover:bg-slate-700'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-400'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme Cycler */}
          <button
            onClick={cycleTheme}
            title={`Current theme: ${theme}. Click to switch.`}
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            {getThemeIcon()}
          </button>

          {/* History Drawer Toggle */}
          <button
            onClick={onToggleHistory}
            title="View calculation history (H)"
            className="relative p-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
          >
            <History className="w-4 h-4" />
            {historyCount > 0 && (
              <span className="absolute -top-1 -right-1 px-1.5 py-0.2 text-[9px] font-bold bg-indigo-500 text-white rounded-full min-w-[16px] text-center shadow">
                {historyCount > 99 ? '99+' : historyCount}
              </span>
            )}
          </button>

          {/* Keyboard Shortcuts Dialog */}
          <button
            onClick={onOpenShortcuts}
            title="Keyboard Shortcuts (?)"
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white hidden sm:flex"
          >
            <Keyboard className="w-4 h-4" />
          </button>

          {/* Settings Modal */}
          <button
            onClick={onOpenSettings}
            title="Settings"
            className="p-2 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition-colors text-slate-300 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  )
}
