import { useEffect, useRef } from 'react'
import { ArrowsClockwise, Lightbulb, Trash } from '@phosphor-icons/react'

type StudyFlashcardProps = {
  question: string
  answer: string
  category: string
  flipped: boolean
  showHints: boolean
  onFlip: () => void
  onDelete: () => void
}

export function StudyFlashcard({ question, answer, category, flipped, showHints, onFlip, onDelete }: StudyFlashcardProps) {
  const sceneRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const scene = sceneRef.current
    if (scene?.contains(document.activeElement)) {
      scene.querySelector<HTMLButtonElement>('.flashcard-face[aria-hidden="false"] .flashcard-face-content')?.focus({ preventScroll: true })
    }
  }, [flipped])

  return (
    <div ref={sceneRef} className="study-flip-card flashcard-scene" data-flipped={flipped}>
      <div className="flashcard-rotator">
        {(['front', 'back'] as const).map(side => {
          const isBack = side === 'back'
          const active = flipped === isBack
          return (
            <div key={side} className={`flashcard-face flashcard-${side}`} aria-hidden={!active}>
              <button
                type="button"
                className="flashcard-face-content"
                tabIndex={active ? 0 : -1}
                aria-label={isBack ? 'Show question' : 'Reveal answer'}
                onClick={onFlip}
              >
                <span className="flashcard-star" aria-hidden="true">✦</span>
                <img src="/mindy-mascot.png" alt="" className="flashcard-mascot" />
                <span className="flashcard-body">
                  <span className="flashcard-category">{isBack ? 'Answer & explanation' : category}</span>
                  {isBack
                    ? <span className="flashcard-answer">{answer}</span>
                    : <span className="flashcard-question">{question}</span>}
                  {!isBack && showHints && (
                    <span className="flashcard-hint"><Lightbulb size={14} weight="fill" />Take a moment to recall the key idea.</span>
                  )}
                </span>
                <span className="flashcard-flip-label"><ArrowsClockwise size={15} />{isBack ? 'Show question' : 'Reveal answer'}</span>
              </button>
              <button type="button" className="flashcard-delete" tabIndex={active ? 0 : -1} onClick={onDelete} aria-label="Delete card" title="Delete card"><Trash size={16} /></button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
