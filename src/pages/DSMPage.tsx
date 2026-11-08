import { useMotionPreference } from '../hooks/useMotionPreference'
import { AnimatePresence, motion } from 'framer-motion'
import { BookTurn } from '../components/BookTurn'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  MagnifyingGlass, CaretRight, CaretDown, BookOpen, Warning, Info,
  ArrowRight, Sparkle, Bookmarks, CaretLeft, FilePdf, UploadSimple, X,
  Rows, BookBookmark
} from '@phosphor-icons/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { DSM5_TR_CHAPTERS, DSMDisorder, DSMCriterion } from '../data/dsm5Data'
import { getDSMPage, TOTAL_DSM5_PAGES, DSM_BOOK_TOC, BookPage } from '../data/dsm5BookEngine'

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
      <div className="mb-2.5 px-4 py-3 rounded-2xl bg-white border border-pink-100 shadow-2xs">
        <p className="text-xs font-black text-neutral-800 mb-1">{group.label}</p>
        <p className="text-xs text-neutral-600 leading-relaxed">{group.description}</p>
        {group.note && <p className="mt-2 text-[11px] text-pink-600 italic bg-pink-50/70 px-2.5 py-1 rounded-xl border border-pink-100">{group.note}</p>}
      </div>
    )
  }
  return (
    <div className="mb-2.5 rounded-2xl border border-pink-100/90 overflow-hidden shadow-2xs bg-white transition-all">
      <button
        className="w-full flex items-center justify-between gap-3 px-4 py-3.5 bg-gradient-to-r from-pink-50/40 via-white to-purple-50/20 hover:from-pink-50/80 hover:to-purple-50/50 transition-all text-left group"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: chapterColor }} />
            <p className="text-xs font-black text-neutral-800 tracking-tight">{group.label}</p>
          </div>
          {!open && <p className="text-[11px] text-neutral-500 mt-0.5 line-clamp-1">{group.description}</p>}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white text-pink-600 border border-pink-200/80 shadow-2xs">
            {group.criteria.length} criteria
          </span>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 border ${
            open
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white border-transparent shadow-xs rotate-180'
              : 'bg-pink-50 text-pink-600 border-pink-200/70 group-hover:bg-pink-100 group-hover:scale-105'
          }`}>
            <CaretDown size={14} weight="bold" />
          </div>
        </div>
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 bg-white border-t border-pink-100/70">
          <p className="text-xs text-neutral-600 mb-3 leading-relaxed">{group.description}</p>
          <ul className="list-none space-y-1">
            {group.criteria.map(c => <CriterionRow key={c.code} c={c} />)}
          </ul>
          {group.note && <p className="mt-3 text-[11px] text-pink-600 italic bg-pink-50 px-3 py-2 rounded-xl border border-pink-100">{group.note}</p>}
        </div>
      )}
    </div>
  )
}

function DisorderCard({ disorder, chapterColor }: { disorder: DSMDisorder; chapterColor: string }) {
  const [expanded, setExpanded] = useState(false)
  const navigate = useNavigate()

  return (
    <div className={`rounded-3xl border bg-white transition-all duration-200 mb-3.5 overflow-hidden ${
      expanded ? 'border-pink-300 shadow-md shadow-pink-100/70' : 'border-pink-100/90 shadow-sm shadow-pink-100/30 hover:border-pink-200'
    }`}>
      <button
        className="w-full flex items-start justify-between gap-3 px-5 py-4 hover:bg-pink-50/30 transition-colors text-left group"
        onClick={() => setExpanded(e => !e)}
        aria-expanded={expanded}
      >
        <div className="flex-1 min-w-0 pr-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-extrabold text-neutral-800">{disorder.name}</h3>
            {disorder.icdCode && (
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-2xs" style={{ color: chapterColor, borderColor: chapterColor + '44', background: chapterColor + '14' }}>
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
            <p className="text-xs text-neutral-500 mt-1.5 line-clamp-2 leading-relaxed">{disorder.criteriaGroups[0].description}</p>
          )}
        </div>
        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 border ${
          expanded
            ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white border-transparent shadow-xs shadow-pink-300 rotate-180'
            : 'bg-pink-50/80 text-pink-600 border-pink-200/70 group-hover:bg-pink-100 group-hover:scale-105'
        }`}>
          <CaretDown size={16} weight="bold" />
        </div>
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

// ─── Paginated Authentic Book Component ──────────────────────────────────────

function BookSheet({
  page,
  isLeftPage,
  isSpread,
  paperTheme,
  fontSizeMultiplier,
}: {
  page: BookPage
  isLeftPage?: boolean
  isSpread?: boolean
  paperTheme: 'cream' | 'rose' | 'slate'
  fontSizeMultiplier: number
}) {
  const isSlate = paperTheme === 'slate'
  const isRose = paperTheme === 'rose'

  const bgClass = isSlate
    ? 'bg-[#1C1917] text-[#E7E5E4] border-[#292524]'
    : isRose
    ? 'bg-[#FFF9FB] text-[#2c242a] border-[#FCE7F3]'
    : 'bg-[#FAF7F2] text-[#2c2825] border-[#E8E2D9]'

  const roundedCorners = isSpread
    ? isLeftPage
      ? 'rounded-l-3xl rounded-r-md'
      : 'rounded-r-3xl rounded-l-md'
    : 'rounded-3xl'

  const gutterShadow = isSpread
    ? isLeftPage
      ? 'shadow-[inset_-16px_0_24px_rgba(0,0,0,0.06),-4px_6px_20px_rgba(0,0,0,0.07)]'
      : 'shadow-[inset_16px_0_24px_rgba(0,0,0,0.06),4px_6px_20px_rgba(0,0,0,0.07)]'
    : 'shadow-xl shadow-neutral-900/5'

  const boxBg = isSlate
    ? 'bg-[#262220] border-[#3f3a36] text-[#F5F5F4]'
    : isRose
    ? 'bg-[#FDF2F8]/90 border-[#F9A8D4] text-[#2c242a]'
    : 'bg-[#F4EFE6] border-[#D6CDBC] text-[#2c2825]'

  const headingColor = isSlate ? 'text-white' : isRose ? 'text-[#831843]' : 'text-[#1c1917]'
  const accentColor = isSlate ? 'text-pink-400' : 'text-pink-600'
  const folioColor = isSlate ? 'text-neutral-400' : 'text-neutral-500'

  return (
    <div
      data-paper={paperTheme}
      className={`dsm-paper p-8 sm:p-11 border flex flex-col justify-between select-text w-full h-full ${bgClass} ${roundedCorners} ${gutterShadow}`}
      style={{
        minHeight: 700,
        fontSize: `${fontSizeMultiplier * 13.5}px`,
        lineHeight: 1.85,
        fontFamily: 'Georgia, Cambria, "Times New Roman", serif',
      }}
    >
      <div>
        {/* Running Header Folio */}
        <div className={`flex items-center justify-between border-b pb-3 mb-7 text-[10.5px] font-sans tracking-widest uppercase ${folioColor} ${isSlate ? 'border-neutral-800' : 'border-neutral-200/80'}`}>
          <span className="truncate max-w-[65%] font-medium">{isLeftPage ? page.sectionTitle : page.chapterTitle}</span>
          <span className="font-mono font-bold tracking-normal text-pink-600">DSM-5-TR · p. {page.pageNumber}</span>
        </div>

        {/* Chapter / Heading Header */}
        <div className="mb-6 font-sans">
          <span className={`text-[11px] font-black tracking-wider uppercase ${accentColor}`}>
            {page.chapterTitle}
          </span>
          <h2 className={`text-xl sm:text-2xl font-black mt-1 font-serif leading-snug tracking-tight ${headingColor}`}>
            {page.heading}
          </h2>
          {page.subheading && (
            <p className={`text-xs mt-1.5 italic font-serif ${isSlate ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {page.subheading}
            </p>
          )}
        </div>

        {/* Body Paragraphs with clean spacing */}
        <div className="space-y-4">
          {page.paragraphs.map((p, idx) => (
            <p key={idx} className="whitespace-pre-line leading-relaxed text-left">
              {idx === 0 && page.isChapterOpening ? (
                <span>
                  <span className={`float-left text-4xl sm:text-5xl font-black font-serif leading-none pr-3 pt-1 ${accentColor}`}>
                    {p.charAt(0)}
                  </span>
                  {p.slice(1)}
                </span>
              ) : (
                p
              )}
            </p>
          ))}
        </div>

        {/* Diagnostic Criteria Box */}
        {page.criteriaBox && (
          <div className={`mt-7 p-4 sm:p-5 rounded-2xl border font-sans ${boxBg}`}>
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-black/10">
              <span className="text-[10px] font-black uppercase tracking-wider text-pink-700">
                Official Diagnostic Criteria Box
              </span>
              <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-pink-500 text-white shadow-xs">
                {page.criteriaBox.code}
              </span>
            </div>
            <h4 className="text-xs font-bold mb-2.5 font-serif">{page.criteriaBox.title}</h4>
            <div className="space-y-2.5 text-xs">
              {page.criteriaBox.items.map((item, i) => (
                <div key={i} className="pl-3 border-l-2 border-pink-400">
                  <strong className="block text-[11px] uppercase tracking-wide opacity-90 mb-0.5">{item.label}</strong>
                  <p className="whitespace-pre-line leading-relaxed opacity-95">{item.text}</p>
                </div>
              ))}
            </div>
            {page.criteriaBox.notes && (
              <p className="mt-3.5 text-[11px] italic pt-2.5 border-t border-black/10 opacity-80">
                {page.criteriaBox.notes}
              </p>
            )}
          </div>
        )}

        {/* Clinical Pearls / Guidance Box */}
        {page.clinicalPearl && (
          <div className={`mt-6 p-3.5 rounded-xl border-l-4 border-pink-500 font-sans text-xs ${isSlate ? 'bg-neutral-800/70 text-neutral-300' : 'bg-pink-50/60 text-neutral-700'}`}>
            <strong className="text-pink-600 font-black uppercase tracking-wider text-[10px] block mb-1">
              Clinical Formulation Pearl
            </strong>
            <p className="leading-relaxed">{page.clinicalPearl}</p>
          </div>
        )}
      </div>

      {/* Running Bottom Folio */}
      <div className={`mt-10 pt-3.5 border-t flex items-center justify-between text-[11px] font-sans ${folioColor} ${isSlate ? 'border-neutral-800' : 'border-neutral-200/80'}`}>
        <span>American Psychiatric Association (2022)</span>
        <span className="font-bold text-xs tracking-wider">— {page.pageNumber} —</span>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export function DSMPage() {
  const reducedMotion = useMotionPreference()
  const [activeTab, setActiveTab] = useState<'criteria' | 'reader' | 'pdf'>('criteria')
  const location = useLocation()
  const [search, setSearch] = useState((location.state as {query?:string} | null)?.query || '')
  useEffect(() => {
    const query = (location.state as {query?:string} | null)?.query
    if (query) { setSearch(query); setSelectedChapter(null); setActiveTab('criteria') }
  }, [location.state])
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)

  // Reader state (Contiguous 1 to 1,050 Pages)
  const [currentPageNumber, setCurrentPageNumber] = useState(1)
  const [jumpPageInput, setJumpPageInput] = useState('')
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1)
  const [spreadMode, setSpreadMode] = useState<'single' | 'spread'>('single')
  const [paperTheme, setPaperTheme] = useState<'cream' | 'rose' | 'slate'>(() => document.documentElement.dataset.psykieTheme === 'dark' ? 'slate' : 'cream')
  const [showTOC, setShowTOC] = useState(false)

  const previousReaderPage = useCallback(() => setCurrentPageNumber(page => Math.max(1, page - (spreadMode === 'spread' ? (page === 2 ? 1 : 2) : 1))), [spreadMode])
  const nextReaderPage = useCallback(() => setCurrentPageNumber(page => Math.min(TOTAL_DSM5_PAGES, page + (spreadMode === 'spread' ? (page === 1 ? 1 : 2) : 1))), [spreadMode])

  // Keyboard navigation for authentic book flipping
  useEffect(() => {
    if (activeTab !== 'reader') return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        previousReaderPage()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        nextReaderPage()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab, previousReaderPage, nextReaderPage])

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

  useEffect(() => () => { if (customPdfUrl) URL.revokeObjectURL(customPdfUrl) }, [customPdfUrl])

  // Handle PDF file selection
  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) return
    const url = URL.createObjectURL(file)
    setCustomPdfUrl(url)
    setPdfFileName(file.name)
    setActiveTab('pdf')
  }

  const handleJumpToPage = (e: React.FormEvent) => {
    e.preventDefault()
    const num = parseInt(jumpPageInput, 10)
    if (!isNaN(num) && num >= 1 && num <= TOTAL_DSM5_PAGES) {
      setCurrentPageNumber(num)
      setJumpPageInput('')
    }
  }

  return (
    <div className="reference-page dsm-page">
      {/* Header Banner */}
      <div className="ref-panel dsm-intro">
        <div className="flex items-start gap-4 flex-wrap sm:flex-nowrap">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm" style={{ background: 'linear-gradient(135deg, var(--ref-accent), var(--fn-hover))' }}>
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
        <div className="dsm-chapter-layout">
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

      {/* ── TAB 2: Authentic Paginated Book Reader (Pages 1 to 1,050) ───────── */}
      {activeTab === 'reader' && (
        <div className="space-y-4">
          {/* Reader Top Controls Toolbar (Clean 2-Tier Layout) */}
          <div className="ref-panel p-4 bg-white border border-pink-100 shadow-sm rounded-3xl space-y-3">
            {/* Top Row: Page Turn Buttons, Current Chapter Info, Jump Form */}
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPageNumber <= 1}
                  onClick={() => previousReaderPage()}
                  className="w-9 h-9 rounded-xl border border-pink-200 text-neutral-600 hover:bg-pink-50 hover:text-pink-600 disabled:opacity-30 transition-all flex items-center justify-center shadow-2xs"
                  title="Previous page (Left Arrow)"
                >
                  <CaretLeft size={18} weight="bold" />
                </button>

                <div className="px-3.5 py-1 rounded-xl bg-pink-50/70 border border-pink-100/80 text-center min-w-36">
                  <span className="text-xs font-black text-neutral-800">
                    Page <strong className="text-pink-600">{spreadMode === 'spread' && currentPageNumber > 1 && currentPageNumber < TOTAL_DSM5_PAGES ? currentPageNumber - currentPageNumber % 2 : currentPageNumber}</strong>
                    {spreadMode === 'spread' && currentPageNumber > 1 && currentPageNumber < TOTAL_DSM5_PAGES && (
                      <span>–{Math.min(TOTAL_DSM5_PAGES, (currentPageNumber % 2 === 0 ? currentPageNumber : currentPageNumber - 1) + 1)}</span>
                    )}{' '}
                    <span className="text-neutral-400 font-normal">/ {TOTAL_DSM5_PAGES}</span>
                  </span>
                  <span className="block text-[10px] font-semibold text-pink-700/80 truncate max-w-[150px] mx-auto">
                    {getDSMPage(currentPageNumber).chapterTitle}
                  </span>
                </div>

                <button
                  disabled={currentPageNumber >= TOTAL_DSM5_PAGES}
                  onClick={() => nextReaderPage()}
                  className="w-9 h-9 rounded-xl border border-pink-200 text-neutral-600 hover:bg-pink-50 hover:text-pink-600 disabled:opacity-30 transition-all flex items-center justify-center shadow-2xs"
                  title="Next page (Right Arrow)"
                >
                  <CaretRight size={18} weight="bold" />
                </button>
              </div>

              {/* Jump to Page */}
              <form onSubmit={handleJumpToPage} className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-500">Go to page:</span>
                <input
                  type="number"
                  aria-label="Go to reader page"
                  min={1}
                  max={TOTAL_DSM5_PAGES}
                  placeholder="1–1050"
                  value={jumpPageInput}
                  onChange={e => setJumpPageInput(e.target.value)}
                  className="w-20 px-2.5 py-1.5 text-xs border border-pink-200 rounded-xl text-center outline-none focus:ring-2 focus:ring-pink-300 focus:border-pink-400 bg-white font-bold text-neutral-800 shadow-2xs"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-pink-500 to-rose-400 hover:from-pink-600 hover:to-rose-500 rounded-xl shadow-xs shadow-pink-200 transition-all"
                >
                  Turn
                </button>
              </form>
            </div>

            {/* Middle Row: Continuous Scrubber Slider */}
            <div className="pt-1">
              <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-500 mb-1.5 px-0.5">
                <span>p. 1 (Basics)</span>
                <span className="text-pink-600 font-bold truncate max-w-sm text-center">
                  p. {currentPageNumber} · {getDSMPage(currentPageNumber).heading}
                </span>
                <span>p. 1,050 (Index)</span>
              </div>
              <input
                type="range"
                aria-label="Reader page"
                min={1}
                max={TOTAL_DSM5_PAGES}
                value={currentPageNumber}
                onChange={e => setCurrentPageNumber(parseInt(e.target.value, 10))}
                className="w-full accent-pink-500 cursor-pointer h-2 bg-pink-100/90 rounded-lg"
              />
            </div>

            {/* Bottom Row: View mode, Themes, Contents, Zoom */}
            <div className="pt-2.5 border-t border-pink-100/80 flex items-center justify-between gap-3 flex-wrap">
              {/* View Mode */}
              <div className="flex items-center gap-1 bg-pink-50/80 p-1 rounded-xl border border-pink-200/60 shadow-2xs">
                <button
                  onClick={() => setSpreadMode('single')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    spreadMode === 'single' ? 'bg-white text-pink-700 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                  title="Single Page view"
                >
                  <Rows size={14} />Single
                </button>
                <button
                  onClick={() => setSpreadMode('spread')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    spreadMode === 'spread' ? 'bg-white text-pink-700 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                  title="Two-Page Spread (Open Book view)"
                >
                  <BookOpen size={14} />Open Book
                </button>
              </div>

              {/* Paper Theme Picker */}
              <div className="flex items-center gap-1 bg-pink-50/80 p-1 rounded-xl border border-pink-200/60 shadow-2xs">
                <button
                  onClick={() => setPaperTheme('cream')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    paperTheme === 'cream' ? 'bg-white text-amber-900 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                  title="Classic Ivory / Cream Paper"
                >
                  <span>📜</span>Cream
                </button>
                <button
                  onClick={() => setPaperTheme('rose')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    paperTheme === 'rose' ? 'bg-white text-pink-700 shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                  title="Psykie Blush Rose"
                >
                  <span>🌸</span>Rose
                </button>
                <button
                  onClick={() => setPaperTheme('slate')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                    paperTheme === 'slate' ? 'bg-neutral-800 text-white shadow-xs' : 'text-neutral-500 hover:text-neutral-800'
                  }`}
                  title="Midnight Dark Mode"
                >
                  <span>🌙</span>Slate
                </button>
              </div>

              {/* Contents & Font Size */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowTOC(o => !o)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border shadow-xs ${
                    showTOC
                      ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white border-transparent shadow-pink-300'
                      : 'bg-white hover:bg-pink-50/80 text-pink-700 border-pink-200'
                  }`}
                  aria-expanded={showTOC}
                >
                  <BookBookmark size={15} weight="bold" />
                  <span>Contents</span>
                  <CaretDown size={14} weight="bold" className={`transition-transform duration-200 ${showTOC ? 'rotate-180' : 'rotate-0'}`} />
                </button>

                <div className="flex items-center gap-1 border border-pink-200/80 bg-white rounded-xl p-0.5 shadow-2xs">
                  <button
                    onClick={() => setFontSizeMultiplier(f => Math.max(0.85, f - 0.1))}
                    className="w-7 h-7 rounded-lg text-xs font-bold text-neutral-600 hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center justify-center"
                    title="Decrease font size"
                  >
                    A-
                  </button>
                  <button
                    onClick={() => setFontSizeMultiplier(f => Math.min(1.35, f + 0.1))}
                    className="w-7 h-7 rounded-lg text-xs font-bold text-neutral-600 hover:bg-pink-50 hover:text-pink-600 transition-colors flex items-center justify-center"
                    title="Increase font size"
                  >
                    A+
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Table of Contents Floating Popover / Drawer */}
          <AnimatePresence initial={false}>{showTOC && (
            <motion.div initial={reducedMotion ? false : {opacity:0,y:-12}} animate={{opacity:1,y:0}} exit={{opacity:0,y:reducedMotion?0:-8}} transition={{duration:reducedMotion?0:0.25,ease:[0.22,1,0.36,1]}} className="ref-panel p-4 bg-white border border-pink-200 rounded-2xl shadow-xl max-h-96 overflow-y-auto animate-in fade-in duration-150">
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-pink-100">
                <div className="flex items-center gap-2">
                  <BookBookmark size={18} className="text-pink-500" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-700">
                    DSM-5-TR Table of Contents (Pages 1–1,050)
                  </h3>
                </div>
                <button
                  onClick={() => setShowTOC(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-600 rounded-lg"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {DSM_BOOK_TOC.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrentPageNumber(item.page)
                      setShowTOC(false)
                    }}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-all flex items-center justify-between ${
                      currentPageNumber >= item.page && (idx === DSM_BOOK_TOC.length - 1 || currentPageNumber < DSM_BOOK_TOC[idx + 1].page)
                        ? 'bg-pink-100 text-pink-800 font-bold shadow-2xs'
                        : 'hover:bg-pink-50/70 text-neutral-700'
                    }`}
                  >
                    <div className="min-w-0 pr-2">
                      <p className="font-bold truncate">{item.title}</p>
                      <span className="text-[10px] text-neutral-400">{item.section}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white border border-pink-200/80 text-pink-600 flex-shrink-0">
                      p. {item.page}
                    </span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}</AnimatePresence>

          {/* Authentic Book Spread / Single Page View */}
          {spreadMode === 'spread' && currentPageNumber > 1 && currentPageNumber < TOTAL_DSM5_PAGES ? (
            // Two-Page Open Book Spread
            <div className="dsm-book-spread">
              {/* Left Page (Even Page Number) */}
              <BookTurn page={currentPageNumber % 2 === 0 ? currentPageNumber : currentPageNumber - 1} side="left">
                <BookSheet
                  page={getDSMPage(currentPageNumber % 2 === 0 ? currentPageNumber : Math.max(1, currentPageNumber - 1))}
                  isLeftPage={true}
                  isSpread={true}
                  paperTheme={paperTheme}
                  fontSizeMultiplier={fontSizeMultiplier}
                />
              </BookTurn>

              {/* Central Spine Fold / Gutter Crease */}
              <div className="dsm-book-spine" aria-hidden="true"/>

              {/* Right Page (Odd Page Number) */}
              <BookTurn page={currentPageNumber % 2 === 0 ? currentPageNumber + 1 : currentPageNumber} side="right">
                <BookSheet
                  page={getDSMPage(
                    Math.min(
                      TOTAL_DSM5_PAGES,
                      currentPageNumber % 2 === 0 ? currentPageNumber + 1 : currentPageNumber
                    )
                  )}
                  isLeftPage={false}
                  isSpread={true}
                  paperTheme={paperTheme}
                  fontSizeMultiplier={fontSizeMultiplier}
                />
              </BookTurn>
            </div>
          ) : (
            // Single Page View
            <div className="dsm-book-single"><BookTurn page={currentPageNumber}>
              <BookSheet
                page={getDSMPage(currentPageNumber)}
                isLeftPage={currentPageNumber % 2 === 0}
                isSpread={false}
                paperTheme={paperTheme}
                fontSizeMultiplier={fontSizeMultiplier}
              />
            </BookTurn></div>
          )}

          {/* Quick Bottom Flip Bar */}
          <div className="flex items-center justify-between max-w-3xl mx-auto pt-3">
            <button
              disabled={currentPageNumber <= 1}
              onClick={() => previousReaderPage()}
              className="flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 px-4 py-2.5 rounded-xl disabled:opacity-40 transition-colors shadow-xs"
            >
              <CaretLeft size={16} />Previous {spreadMode === 'spread' ? 'Spread' : 'Page'}
            </button>

            <span className="text-[11px] text-neutral-400 text-center hidden sm:inline">
              Flip pages with Left/Right arrow keys or use the Table of Contents above
            </span>

            <button
              disabled={currentPageNumber >= TOTAL_DSM5_PAGES}
              onClick={() => nextReaderPage()}
              className="flex items-center gap-1.5 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 px-4 py-2.5 rounded-xl disabled:opacity-40 transition-colors shadow-xs"
            >
              Next {spreadMode === 'spread' ? 'Spread' : 'Page'}<CaretRight size={16} />
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
