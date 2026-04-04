import type { ActId } from '../App'
import { projects } from '../data/projects'
import './StageUI.css'

interface Props {
  currentAct: ActId
  onActChange: (act: ActId) => void
  hoveredPuppet: string | null
}

const acts: { id: ActId; label: string; sub: string }[] = [
  { id: 'intro', label: 'Man mo man', sub: 'Gioi thieu' },
  { id: 'automation', label: 'Man II', sub: 'Automation' },
  { id: 'ai', label: 'Man III', sub: 'AI' },
]

export default function StageUI({ currentAct, onActChange, hoveredPuppet }: Props) {
  const hoveredProject = hoveredPuppet
    ? projects.find(p => p.id === hoveredPuppet) || (hoveredPuppet === 'intro-personal' ? { title: 'Gioi thieu ca nhan', shortDescription: 'Click de xem' } : null)
    : null

  return (
    <>
      {/* Act selector — top center */}
      <div className="stage-ui-acts">
        <span className="stage-ui-label">Chon man dien</span>
        <div className="stage-ui-act-buttons">
          {acts.map(act => (
            <button
              key={act.id}
              className={`stage-ui-act-btn ${currentAct === act.id ? 'stage-ui-act-btn--active' : ''}`}
              onClick={() => onActChange(act.id)}
            >
              <span className="stage-ui-act-name">{act.label}</span>
              <span className="stage-ui-act-sub">{act.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Puppet tooltip — bottom center */}
      {hoveredProject && (
        <div className="stage-ui-tooltip">
          <span className="stage-ui-tooltip-title">{hoveredProject.title}</span>
          <span className="stage-ui-tooltip-desc">{hoveredProject.shortDescription}</span>
          <span className="stage-ui-tooltip-cue">Click de xem chi tiet</span>
        </div>
      )}

      {/* Act hint — shows when no puppet hovered */}
      {!hoveredProject && (
        <div className="stage-ui-hint">
          {currentAct === 'intro' && 'Click vao con roi de xem gioi thieu'}
          {currentAct === 'automation' && 'Moi con roi la mot du an — click de kham pha'}
          {currentAct === 'ai' && 'Nhung con roi phat sang — click de kham pha AI'}
        </div>
      )}
    </>
  )
}
