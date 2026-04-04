import { useState, useCallback, useEffect } from 'react'
import PuppetStage from './components/PuppetStage'
import StageUI from './components/StageUI'
import ProjectDetailModal from './components/ProjectDetailModal'
import type { Project } from './data/projects'
import './App.css'

export type ActId = 'intro' | 'automation' | 'ai'
export type StagePhase = 'opening' | 'performing'

function App() {
  const [phase, setPhase] = useState<StagePhase>('opening')
  const [currentAct, setCurrentAct] = useState<ActId>('intro')
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [hoveredPuppet, setHoveredPuppet] = useState<string | null>(null)
  const [showOpeningText, setShowOpeningText] = useState(true)

  // Opening sequence: show all puppets dancing for 8 seconds, then transition
  useEffect(() => {
    if (phase === 'opening') {
      const textTimer = setTimeout(() => setShowOpeningText(false), 5000)
      const phaseTimer = setTimeout(() => setPhase('performing'), 8000)
      return () => {
        clearTimeout(textTimer)
        clearTimeout(phaseTimer)
      }
    }
  }, [phase])

  const handleActChange = useCallback((act: ActId) => {
    setCurrentAct(act)
    setSelectedProject(null)
    setHoveredPuppet(null)
  }, [])

  const handleSkipOpening = useCallback(() => {
    setPhase('performing')
    setShowOpeningText(false)
  }, [])

  return (
    <div className="stage-container">
      <PuppetStage
        currentAct={currentAct}
        phase={phase}
        onPuppetClick={setSelectedProject}
        onPuppetHover={setHoveredPuppet}
      />

      {/* Opening overlay */}
      {phase === 'opening' && (
        <div className="opening-overlay" onClick={handleSkipOpening}>
          {showOpeningText && (
            <div className="opening-text">
              <h1 className="opening-title">Múa Rối Nước</h1>
              <p className="opening-subtitle">Vietnamese Water Puppet Theater</p>
              <p className="opening-desc">Portfolio — Analysis · Automation · AI</p>
            </div>
          )}
          <div className="opening-skip">Click để bắt đầu</div>
        </div>
      )}

      {phase === 'performing' && (
        <>
          <StageUI
            currentAct={currentAct}
            onActChange={handleActChange}
            hoveredPuppet={hoveredPuppet}
          />
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        </>
      )}
    </div>
  )
}

export default App
