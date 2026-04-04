import { motion, AnimatePresence } from 'framer-motion'
import type { Project } from '../data/projects'
import './ProjectDetailModal.css'

interface Props {
  project: Project | null
  onClose: () => void
}

const categoryLabels: Record<string, string> = {
  analysis: 'Analysis',
  automation: 'Automation',
  ai: 'AI',
}

export default function ProjectDetailModal({ project, onClose }: Props) {
  if (!project) return null

  // Parse storyText sections
  const sections = project.storyText.split('\n\n').filter(Boolean)

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="pdm-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.div
            className="pdm-panel"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button className="pdm-close" onClick={onClose}>&#10005;</button>

            {/* Header */}
            <div className="pdm-header">
              <span className="pdm-category">{categoryLabels[project.category]}</span>
              <h2 className="pdm-title">{project.title}</h2>
              <p className="pdm-short">{project.shortDescription}</p>
            </div>

            {/* Media gallery */}
            <div className="pdm-gallery">
              {project.images.length > 0 ? (
                project.images.map((img, i) => (
                  <div key={i} className="pdm-gallery-item">
                    <div className="pdm-gallery-placeholder">
                      <span className="pdm-gallery-icon">&#9670;</span>
                      <span className="pdm-gallery-label">Hinh {i + 1}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="pdm-gallery-item">
                  <div className="pdm-gallery-placeholder">
                    <span className="pdm-gallery-icon">&#9670;</span>
                    <span className="pdm-gallery-label">Chua co hinh</span>
                  </div>
                </div>
              )}
            </div>

            {/* Video section */}
            {project.videos.length > 0 && (
              <div className="pdm-video-section">
                <div className="pdm-video-placeholder">
                  <span className="pdm-gallery-icon">&#9654;</span>
                  <span className="pdm-gallery-label">Video demo</span>
                </div>
              </div>
            )}

            {/* Story / Case study */}
            <div className="pdm-story">
              {sections.map((section, i) => (
                <p key={i} className="pdm-story-paragraph">{section}</p>
              ))}
            </div>

            {/* Tech stack */}
            <div className="pdm-tech">
              <h4 className="pdm-tech-label">Cong cu su dung</h4>
              <div className="pdm-tech-list">
                {project.tools.map((tool) => (
                  <span key={tool} className="pdm-tech-item">{tool}</span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pdm-actions">
              {project.websiteUrl && (
                <a
                  href={project.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pdm-btn pdm-btn--primary"
                >
                  Xem website demo &#8594;
                </a>
              )}
              <button className="pdm-btn pdm-btn--secondary" onClick={onClose}>
                Quay lai san khau
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
