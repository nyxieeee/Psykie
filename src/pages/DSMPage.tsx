import { useState, useRef } from 'react'
import {
  MagnifyingGlass, CaretRight, CaretDown, BookOpen, Warning, Info,
  ArrowRight, Sparkle, Bookmarks, CaretLeft, FilePdf, UploadSimple, X
} from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'
import { DSM5_TR_CHAPTERS, DSMDisorder, DSMCriterion } from '../data/dsm5Data'

// Re-export for compatibility with AppLayout and global search
export const DSM5_TR = DSM5_TR_CHAPTERS

// ─── Individual Criteria Components ──────────────────────────────────────────

function CriterionRow({ c }: { c: DSMCriterion }) {
  return (
    <li className="flex gap-2.5 py-1.5 border-b border-pink-50 last:border-0 items-start">
      <span className="font-mono font-bold text-pink-600 text-[11px] mt-0.5 shrink-0 bg-pink-50 px-1.5 py-0.5 rounded">
        {c.code}
      </span>
      <span className="text-xs text-neutral-700 leading-relaxed">{c.label}</span>
    </li>
  )
}

function CriteriaGroup({ group, chapterColor }: { group: DSMDisorder['criteriaGroups'][0]; chapterColor: string }) {
  const [open, setOpen] = useState(false)
  if (!group.criteria) {
    return (
      <div className="mb-3 px-4 py-3 rounded-xl bg-white border border-pink-100/70 shadow-xs">
        <p className="text-xs font-black text-neutral-800 mb-1">{group.label}</p>
        <p className="text-xs text-neutral-600 leading-relaxed">{group.description}</p>
        {group.note && <p className="mt-2 text-[11px] text-pink-600 italic bg-pink-50/60 px-2.5 py-1 rounded-md">{group.note}</p>}
      </div>
    )
  }
  return (
    <div className="mb-3 rounded-xl border border-pink-100/70 overflow-hidden shadow-xs">
      <button
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white hover:bg-pink-50/40 transition-colors text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div>
          <p className="text-xs font-black text-neutral-800">{group.label}</p>
          {!open && <p className="text-[11px] text-neutral-500 mt-0.5">{group.description.slice(0, 85)}…</p>}
        </div>
        {open ? <CaretDown size={16} style={{ color: chapterColor, flexShrink: 0 }} /> : <CaretRight size={16} className="text-neutral-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 bg-white/70">
          <p className="text-xs text-neutral-600 mb-3 leading-relaxed">{group.description}</p>
          <ul className="list-none space-y-0.5">
            {group.criteria.map(c => <CriterionRow key={c.code} c={c} />)}
          </ul>
          {group.note && <p className="mt-3 text-[11px] text-pink-600 italic bg-pink-50 px-3 py-2 rounded-lg">{group.note}</p>}
        </div>
      )}
    </div>
  )
}

function DisorderCard({ disorder, chapterColor }: { disorder: DSMDisorder; chapterColor: string }) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="rounded-2xl border border-pink-100/80 bg-white shadow-sm shadow-pink-100/40 overflow-hidden mb-3">
      <button
        className="w-full flex items-start gap-3 px-5 py-4 hover:bg-pink-50/30 transition-colors text-left"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-extrabold text-neutral-800">{disorder.name}</h3>
            {disorder.icdCode && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ color: chapterColor, borderColor: chapterColor + '33', background: chapterColor + '11' }}>
                ICD: {disorder.icdCode}
              </span>
            )}
            {disorder.pageNumber && (
              <span className="text-[10px] font-semibold text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                p. {disorder.pageNumber}
              </span>
            )}
          </div>
          {!expanded && disorder.criteriaGroups[0] && (
            <p className="text-xs text-neutral-500 mt-1 line-clamp-2">{disorder.criteriaGroups[0].description}</p>
          )}
        </div>
        {expanded ? <CaretDown size={18} style={{ color: chapterColor }} className="mt-0.5 flex-shrink-0" /> : <CaretRight size={18} className="text-neutral-400 mt-0.5 flex-shrink-0" />}
      </button>

      {expanded && (
        <div className="px-5 pb-5 border-t border-pink-50">
          <div className="pt-4 space-y-1">
            {disorder.criteriaGroups.map((group, idx) => (
              <CriteriaGroup key={idx} group={group} chapterColor={chapterColor} />
            ))}
          </div>

          {disorder.specifiers && disorder.specifiers.length > 0 && (
            <div className="mt-4 p-3 rounded-xl bg-violet-50/80 border border-violet-100">
              <p className="text-[11px] font-black text-violet-700 mb-2 uppercase tracking-wider">Specifiers & Subtypes</p>
              <div className="flex flex-wrap gap-1.5">
                {disorder.specifiers.map(s => (
                  <span key={s} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">{s}</span>
                ))}
              </div>
            </div>
          )}

          {disorder.clinicalNote && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50/80 border border-amber-100">
              <div className="flex items-start gap-2">
                <Sparkle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" weight="fill" />
                <p className="text-xs text-amber-900 leading-relaxed">{disorder.clinicalNote}</p>
              </div>
            </div>
          )}

          {disorder.duration && (
            <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
              <Info size={13} className="text-sky-500" />
              <span>Duration requirement: <strong className="text-neutral-700">{disorder.duration}</strong></span>
            </div>
          )}

          {disorder.exclusions && disorder.exclusions.length > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50/80 border border-rose-100">
              <div className="flex items-start gap-2">
                <Warning size={15} className="text-rose-500 mt-0.5 flex-shrink-0" weight="fill" />
                <div>
                  <p className="text-[11px] font-black text-rose-700 mb-1">Exclusion criteria</p>
                  <ul className="text-xs text-rose-700 list-disc list-inside space-y-0.5">
                    {disorder.exclusions.map(e => <li key={e}>{e}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2 pt-2 border-t border-neutral-100">
            <button
              onClick={() => navigate(`/mindy?q=${encodeURIComponent(`Explain the DSM-5-TR diagnostic criteria, etiology, and differential diagnosis for ${disorder.name}`)}`)}
              className="flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-3.5 py-1.5 rounded-full transition-colors"
            >
              <Sparkle size={14} />Ask Mindy about {disorder.name}
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Paginated Textbook Reader View ──────────────────────────────────────────

interface BookPage {
  pageNumber: number
  sectionTitle: string
  chapterTitle: string
  heading: string
  content: string[]
  diagnosticSummary?: {
    code: string
    title: string
    keyPoints: string[]
  }
  clinicalPearls?: string
}

function generateBookPages(): BookPage[] {
  const pages: BookPage[] = [
    {
      pageNumber: 1,
      sectionTitle: 'DSM-5-TR Classification',
      chapterTitle: 'Front Matter',
      heading: 'Preface and Introduction to the Text Revision',
      content: [
        'The Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition, Text Revision (DSM-5-TR), represents the most comprehensive update to the psychiatric classification system since the publication of DSM-5 in 2013.',
        'This Text Revision features fully updated text incorporating advances from over a thousand biological, epidemiological, and cross-cultural studies, as well as the addition of Prolonged Grief Disorder and updated terminology reflecting nonstigmatizing, inclusive language.',
        'The manual is divided into three sections: Section I (Basics and guidance for clinical use), Section II (Diagnostic criteria and codes across 20 diagnostic classes), and Section III (Emerging measures and models, including cultural formulation).',
      ],
      clinicalPearls: 'The DSM-5-TR is designed as a practical clinical, research, and educational guide. Diagnosis requires clinical judgment and should not be applied mechanistically.',
    },
    {
      pageNumber: 2,
      sectionTitle: 'Section I: DSM-5-TR Basics',
      chapterTitle: 'Clinical Judgment & Guidelines',
      heading: 'Use of the Manual and Cautionary Statement',
      content: [
        'A mental disorder is a syndrome characterized by clinically significant disturbance in an individual\'s cognition, emotion regulation, or behavior that reflects a dysfunction in the psychological, biological, or developmental processes underlying mental functioning.',
        'An expectable or culturally approved response to a common stressor or loss, such as the death of a loved one, is not a mental disorder. Socially deviant behavior (e.g., political, religious, or sexual) and conflicts that are primarily between the individual and society are not mental disorders unless the deviance or conflict results from a dysfunction in the individual.',
        'Diagnostic criteria are offered as guidelines for making diagnoses, and their use should be informed by clinical training and comprehensive assessment.',
      ],
    },
  ]

  // Convert each disorder into authentic textbook pages
  let currentPage = 35
  for (const chapter of DSM5_TR_CHAPTERS) {
    // Chapter Title / Overview Page
    pages.push({
      pageNumber: currentPage++,
      sectionTitle: 'Section II: Diagnostic Criteria and Codes',
      chapterTitle: chapter.title,
      heading: `Chapter Overview: ${chapter.title} (${chapter.pageRange})`,
      content: [
        chapter.description,
        `This section contains the official criteria for all recognized disorders within the class of ${chapter.title}.`,
        'Each disorder entry details essential diagnostic features, associated features supporting diagnosis, prevalence rates, development and course, risk and prognostic factors, culture- and gender-related diagnostic issues, and differential diagnosis.',
      ],
      clinicalPearls: `Review all diagnostic exclusions, organic medical mimics, and duration thresholds prior to establishing a primary diagnosis in this class.`,
    })

    // Individual disorder pages
    for (const disorder of chapter.disorders) {
      pages.push({
        pageNumber: disorder.pageNumber || currentPage++,
        sectionTitle: chapter.title,
        chapterTitle: disorder.name,
        heading: `Diagnostic Criteria: ${disorder.name} (${disorder.icdCode || 'ICD-10'})`,
        content: disorder.criteriaGroups.map(g => `${g.label}:\n${g.description}`),
        diagnosticSummary: {
          code: disorder.icdCode || 'ICD-10',
          title: disorder.name,
          keyPoints: disorder.specifiers || [
            disorder.clinicalNote || 'Criteria must cause clinically significant distress or functional impairment.',
          ],
        },
        clinicalPearls: disorder.clinicalNote,
      })
    }
  }

  return pages.sort((a, b) => a.pageNumber - b.pageNumber)
}

const ALL_BOOK_PAGES = generateBookPages()

// ─── Main Component ──────────────────────────────────────────────────────────

export function DSMPage() {
  const [activeTab, setActiveTab] = useState<'criteria' | 'reader' | 'pdf'>('criteria')
  const [search, setSearch] = useState('')
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)

  // Reader state
  const [pageIndex, setPageIndex] = useState(0)
  const [jumpPageInput, setJumpPageInput] = useState('')
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1)

  // PDF file upload state
  const [customPdfUrl, setCustomPdfUrl] = useState<string | null>(null)
  const [pdfFileName, setPdfFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const q = search.toLowerCase().trim()
  const filtered = DSM5_TR_CHAPTERS.map(chapter => ({
    ...chapter,
    disorders: chapter.disorders.filter(d =>
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.icdCode?.toLowerCase().includes(q) ||
      d.criteriaGroups.some(g =>
        g.description.toLowerCase().includes(q) ||
        g.label.toLowerCase().includes(q) ||
        (g.criteria || []).some(c => c.label.toLowerCase().includes(q))
      )
    ),
  })).filter(chapter => !q || chapter.disorders.length > 0)

  const displayed = selectedChapter
    ? filtered.filter(ch => ch.id === selectedChapter)
    : filtered

  const totalDisorders = DSM5_TR_CHAPTERS.reduce((acc, ch) => acc + ch.disorders.length, 0)

  // Handle PDF file selection
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setCustomPdfUrl(url)
    setPdfFileName(file.name)
    setActiveTab('pdf')
  }

  const currentPage = ALL_BOOK_PAGES[pageIndex] || ALL_BOOK_PAGES[0]

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseInt(jumpPageInput, 10)
    if (!isNaN(num)) {
      const idx = ALL_BOOK_PAGES.findIndex(p => p.pageNumber >= num)
      if (idx !== -1) setPageIndex(idx)
      else setPageIndex(ALL_BOOK_PAGES.length - 1)
      setJumpPageInput('')
    }
  }

  return (
    <div className="reference-page" style={{ maxWidth: 1140 }}>
      {/* Header Banner */}
      <div className="ref-panel" style={{ marginBottom: 20, background: 'linear-gradient(135deg, #fdf2f8 0%, #f5f3ff 100%)', borderColor: '#f9a8d4' }}>
        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
            <BookOpen size={26} className="text-white" weight="duotone" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl font-black text-neutral-800">DSM-5-TR Complete Reference Manual</h1>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700">
                Text Revision (2022)
              </span>
            </div>
            <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
              Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition, Text Revision. American Psychiatric Association.
              All <strong className="text-neutral-800">20 diagnostic classes</strong>, {totalDisorders}+ disorders, specifiers, and page citations.
            </p>
            <div className="mt-2.5 flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-amber-800 bg-amber-50/90 border border-amber-200/80 rounded-lg px-2.5 py-1">
                ⚠️ Academic study reference for psychology students. Use with clinical supervision.
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs between Manual View, Paginated Book Reader, and PDF Viewer */}
        <div className="mt-5 pt-4 border-t border-pink-200/60 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('criteria')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'criteria' ? 'bg-pink-500 text-white shadow-sm' : 'bg-white/80 text-neutral-600 hover:bg-pink-50'}`}
            >
              <Bookmarks size={16} />Diagnostic Manual (All 20 Classes)
            </button>
            <button
              onClick={() => setActiveTab('reader')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'reader' ? 'bg-pink-500 text-white shadow-sm' : 'bg-white/80 text-neutral-600 hover:bg-pink-50'}`}
            >
              <BookOpen size={16} />Book Reader (Page-by-Page)
            </button>
            <button
              onClick={() => customPdfUrl ? setActiveTab('pdf') : fileInputRef.current?.click()}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'pdf' ? 'bg-pink-500 text-white shadow-sm' : 'bg-white/80 text-neutral-600 hover:bg-pink-50'}`}
            >
              <FilePdf size={16} />{customPdfUrl ? 'Loaded DSM-5 PDF' : 'Open DSM-5 PDF'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={handlePdfUpload}
            />
          </div>

          {activeTab === 'criteria' && (
            <div className="flex items-center gap-2 bg-white border border-pink-200 rounded-full px-3.5 py-1.5 shadow-xs w-full sm:w-72">
              <MagnifyingGlass size={16} className="text-pink-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search criteria, symptoms, codes…"
                className="flex-1 text-xs outline-none bg-transparent text-neutral-700 placeholder:text-neutral-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* ── TAB 1: Structured Diagnostic Manual (All 20 Classes) ─────────────── */}
      {activeTab === 'criteria' && (
        <div className="flex gap-5">
          {/* Scrollable Chapter Sidebar */}
          <aside style={{ width: 260, flexShrink: 0 }}>
            <div
              className="rounded-3xl bg-white/95 backdrop-blur-md border border-pink-100 p-3.5 shadow-sm sticky top-4 flex flex-col"
              style={{ maxHeight: 'calc(100vh - 100px)' }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-3 mb-2.5 border-b border-pink-100/70 px-1 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                  <h2 className="text-[11px] font-black uppercase tracking-wider text-neutral-600">Chapters</h2>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-200/50">
                  {DSM5_TR_CHAPTERS.length}
                </span>
              </div>

              {/* All chapters filter button */}
              <button
                onClick={() => setSelectedChapter(null)}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold mb-2 transition-all flex items-center justify-between flex-shrink-0 ${
                  !selectedChapter
                    ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-sm'
                    : 'text-neutral-700 hover:bg-pink-50/80 bg-neutral-50/70 border border-neutral-100'
                }`}
              >
                <span>All 20 Classes</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    !selectedChapter ? 'bg-white/20 text-white' : 'bg-neutral-200/70 text-neutral-600'
                  }`}
                >
                  {totalDisorders}
                </span>
              </button>

              {/* Scrollable list of chapters with sleek, non-intrusive scrollbar */}
              <div
                className="space-y-1 overflow-y-auto flex-1 pr-1"
                style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#fbcfe8 transparent',
                }}
              >
                {DSM5_TR_CHAPTERS.map(ch => {
                  const isSelected = selectedChapter === ch.id
                  return (
                    <button
                      key={ch.id}
                      onClick={() => setSelectedChapter(isSelected ? null : ch.id)}
                      className={`w-full text-left p-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-pink-100/90 text-pink-700 font-bold shadow-xs'
                          : 'text-neutral-700 hover:bg-pink-50/70'
                      }`}
                    >
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: ch.color }} />
                      <span className="line-clamp-2 leading-tight flex-1">{ch.title}</span>
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                          isSelected ? 'bg-white text-pink-700 font-bold' : 'bg-neutral-100 text-neutral-400'
                        }`}
                      >
                        {ch.disorders.length}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </aside>

          {/* Main Content List */}
          <main className="flex-1 min-w-0">
            {displayed.length === 0 && (
              <div className="ref-panel text-center py-12">
                <BookOpen size={40} className="text-pink-200 mx-auto mb-3" />
                <p className="text-sm font-bold text-neutral-500">No disorders match your query.</p>
                <p className="text-xs text-neutral-400 mt-1">Try another symptom, ICD code, or disorder name.</p>
              </div>
            )}

            {displayed.map(chapter => (
              <section key={chapter.id} className="mb-8">
                <div className="flex items-center justify-between mb-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="h-5 w-1.5 rounded-full" style={{ background: chapter.color }} />
                    <h2 className="text-base font-black text-neutral-800">{chapter.title}</h2>
                    <span className="text-[11px] font-bold text-neutral-400">({chapter.pageRange})</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600">
                    {chapter.disorders.length} disorders
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mb-3 px-1 leading-relaxed">{chapter.description}</p>
                {chapter.disorders.map(disorder => (
                  <DisorderCard key={disorder.id} disorder={disorder} chapterColor={chapter.color} />
                ))}
              </section>
            ))}
          </main>
        </div>
      )}

      {/* ── TAB 2: Paginated Book Reader (Page-by-Page) ──────────────────────── */}
      {activeTab === 'reader' && (
        <div className="space-y-4">
          {/* Reader Top Controls */}
          <div className="ref-panel p-3 flex items-center justify-between gap-4 flex-wrap bg-white border border-pink-100 shadow-sm">
            <div className="flex items-center gap-2">
              <button
                disabled={pageIndex <= 0}
                onClick={() => setPageIndex(p => Math.max(0, p - 1))}
                className="p-2 rounded-xl text-neutral-600 hover:bg-pink-50 disabled:opacity-30 transition-colors"
                title="Previous page"
              >
                <CaretLeft size={20} weight="bold" />
              </button>

              <span className="text-xs font-bold text-neutral-700 min-w-28 text-center">
                Page <strong className="text-pink-600">{currentPage.pageNumber}</strong> of {ALL_BOOK_PAGES[ALL_BOOK_PAGES.length - 1].pageNumber}
              </span>

              <button
                disabled={pageIndex >= ALL_BOOK_PAGES.length - 1}
                onClick={() => setPageIndex(p => Math.min(ALL_BOOK_PAGES.length - 1, p + 1))}
                className="p-2 rounded-xl text-neutral-600 hover:bg-pink-50 disabled:opacity-30 transition-colors"
                title="Next page"
              >
                <CaretRight size={20} weight="bold" />
              </button>
            </div>

            {/* Jump to Page Form */}
            <form onSubmit={handleJumpToPage} className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-neutral-500">Go to p.</span>
              <input
                type="number"
                min={1}
                max={947}
                placeholder="1–947"
                value={jumpPageInput}
                onChange={e => setJumpPageInput(e.target.value)}
                className="w-20 px-2 py-1 text-xs border border-pink-200 rounded-lg text-center outline-none focus:ring-1 focus:ring-pink-400"
              />
              <button type="submit" className="px-2.5 py-1 text-xs font-bold text-white bg-pink-500 rounded-lg hover:bg-pink-600">
                Go
              </button>
            </form>

            {/* Font Zoom */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-neutral-400">Text size:</span>
              <button
                onClick={() => setFontSizeMultiplier(f => Math.max(0.85, f - 0.1))}
                className="w-7 h-7 rounded-lg border border-pink-100 flex items-center justify-center text-xs font-bold text-neutral-600 hover:bg-pink-50"
              >
                A-
              </button>
              <button
                onClick={() => setFontSizeMultiplier(f => Math.min(1.35, f + 0.1))}
                className="w-7 h-7 rounded-lg border border-pink-100 flex items-center justify-center text-xs font-bold text-neutral-600 hover:bg-pink-50"
              >
                A+
              </button>
            </div>
          </div>

          {/* Book Page Sheet */}
          <div
            className="ref-panel bg-white p-8 sm:p-12 shadow-lg border border-neutral-200/80 rounded-2xl mx-auto transition-all"
            style={{
              maxWidth: 820,
              minHeight: 640,
              fontSize: `${fontSizeMultiplier * 14}px`,
              lineHeight: 1.8,
              fontFamily: 'Georgia, Cambria, "Times New Roman", serif',
            }}
          >
            {/* Header / Page Folio */}
            <div className="flex items-center justify-between border-b border-neutral-200 pb-3 mb-6 text-xs font-sans tracking-wide uppercase text-neutral-400">
              <span>{currentPage.sectionTitle}</span>
              <span>DSM-5-TR · Page {currentPage.pageNumber}</span>
            </div>

            {/* Chapter and Heading */}
            <div className="mb-6 font-sans">
              <span className="text-xs font-bold text-pink-600 tracking-wider uppercase">
                {currentPage.chapterTitle}
              </span>
              <h2 className="text-2xl font-black text-neutral-900 mt-1 font-serif">
                {currentPage.heading}
              </h2>
            </div>

            {/* Page Body Content */}
            <div className="space-y-4 text-neutral-800">
              {currentPage.content.map((paragraph, idx) => (
                <p key={idx} className="whitespace-pre-line leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Diagnostic Box if present */}
            {currentPage.diagnosticSummary && (
              <div className="mt-8 p-5 rounded-xl border border-pink-200 bg-pink-50/40 font-sans">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-black uppercase text-pink-700 tracking-wider">
                    Diagnostic Criteria Box
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-pink-100 text-pink-800">
                    {currentPage.diagnosticSummary.code}
                  </span>
                </div>
                <p className="text-sm font-bold text-neutral-900 mb-2 font-serif">
                  {currentPage.diagnosticSummary.title}
                </p>
                <ul className="text-xs text-neutral-700 space-y-1 list-disc list-inside">
                  {currentPage.diagnosticSummary.keyPoints.map((point, i) => (
                    <li key={i}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Clinical Pearls Footnote */}
            {currentPage.clinicalPearls && (
              <div className="mt-8 pt-4 border-t border-neutral-200 font-sans text-xs text-neutral-500">
                <strong className="text-neutral-700">Clinical Formulation & Guidance: </strong>
                {currentPage.clinicalPearls}
              </div>
            )}

            {/* Bottom Page Number */}
            <div className="mt-12 pt-4 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-400 font-sans">
              <span>American Psychiatric Association</span>
              <span className="font-bold text-neutral-600">{currentPage.pageNumber}</span>
            </div>
          </div>

          {/* Quick Page Navigator Buttons */}
          <div className="flex items-center justify-between max-w-3xl mx-auto pt-2">
            <button
              disabled={pageIndex <= 0}
              onClick={() => setPageIndex(p => Math.max(0, p - 1))}
              className="flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 px-4 py-2 rounded-xl disabled:opacity-40"
            >
              <CaretLeft size={16} />Previous Page
            </button>
            <span className="text-xs text-neutral-400">
              Use arrow keys or jump above to navigate all pages
            </span>
            <button
              disabled={pageIndex >= ALL_BOOK_PAGES.length - 1}
              onClick={() => setPageIndex(p => Math.min(ALL_BOOK_PAGES.length - 1, p + 1))}
              className="flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 px-4 py-2 rounded-xl disabled:opacity-40"
            >
              Next Page<CaretRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* ── TAB 3: Embedded University / Official PDF Viewer ────────────────── */}
      {activeTab === 'pdf' && (
        <div className="space-y-4">
          <div className="ref-panel p-3 flex items-center justify-between gap-3 bg-white border border-pink-100 shadow-sm flex-wrap">
            <div className="flex items-center gap-2">
              <FilePdf size={22} className="text-rose-500" />
              <div>
                <p className="text-xs font-bold text-neutral-800">{pdfFileName || 'DSM-5-TR Document'}</p>
                <p className="text-[10px] text-neutral-400">Full textbook document mode</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-600 hover:bg-pink-50 border border-pink-200"
              >
                <UploadSimple size={14} />Replace PDF
              </button>
              {customPdfUrl && (
                <button
                  onClick={() => { setCustomPdfUrl(null); setActiveTab('criteria') }}
                  className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-lg"
                  title="Close PDF"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {customPdfUrl ? (
            <div className="rounded-2xl border border-neutral-300 overflow-hidden shadow-xl bg-neutral-900" style={{ height: '78vh' }}>
              <iframe
                title="DSM-5 Document Reader"
                src={customPdfUrl}
                className="w-full h-full border-none"
              />
            </div>
          ) : (
            <div className="ref-panel text-center py-16 bg-white border-dashed border-2 border-pink-200">
              <FilePdf size={48} className="text-pink-300 mx-auto mb-3" />
              <h3 className="text-sm font-black text-neutral-800">Open Full DSM-5 / DSM-5-TR PDF</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto leading-relaxed">
                If you have the complete official DSM-5 or DSM-5-TR PDF textbook from your university or program, you can load it here to read every single page with full zoom and text search.
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="mt-4 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-pink-500 hover:bg-pink-600 shadow-md shadow-pink-500/20"
              >
                Select DSM-5 PDF from Computer
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
