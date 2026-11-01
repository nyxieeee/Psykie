/**
 * PsykieIcons — Custom icon wrappers over Phosphor Icons
 * Duotone, weight-aware, with micro-animation support.
 * Replaces Lucide completely for a premium, non-generic look.
 */
import {
  HouseSimple,
  Brain,
  NoteBlank,
  Cards,
  Question,
  MagnifyingGlass,
  FolderSimple,
  CalendarCheck,
  Users,
  GearSix,
  Lifebuoy,
  SignOut,
  Bell,
  MagnifyingGlass as SearchIcon,
  CaretLeft,
  CaretRight,
  X,
  List,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  Warning,
  Info,
  Star,
  Sparkle,
  Lightning,
  FloppyDisk,
  Trash,
  PencilSimple,
  Plus,
  Minus,
  Eye,
  EyeSlash,
  Heart,
  BookOpen,
  FileText,
  DownloadSimple,
  UploadSimple,
  Link,
  Copy,
  DotsThree,
  SlidersHorizontal,
  Tag,
  Image,
  VideoCamera,
  ChatCircle,
  PaperPlaneRight,
  MapPin,
  Globe,
  Lock,
  LockOpen,
  Robot,
  Cpu,
  ChartBar,
  TrendUp,
  TrendDown,
  ShieldCheck,
  MoonStars,
  Sun,
  Palette,
  TextT,
  Keyboard,
  ToggleLeft,
  ToggleRight,
} from '@phosphor-icons/react'

// ── Re-export all Phosphor icons we use ──
export {
  HouseSimple as HomeIcon,
  Brain as BrainIcon,
  NoteBlank as NoteIcon,
  Cards as FlashcardsIcon,
  Question as QuizIcon,
  MagnifyingGlass as ResearchIcon,
  FolderSimple as DocumentsIcon,
  CalendarCheck as CalendarIcon,
  Users as ClientsIcon,
  GearSix as SettingsIcon,
  Lifebuoy as HelpIcon,
  SignOut as LogoutIcon,
  Bell as NotificationIcon,
  Bell as BellIcon,
  SearchIcon as SearchIconPhosphor,
  CaretLeft,
  CaretRight,
  X as CloseIcon,
  List as MenuIcon,
  Clock as ClockIcon,
  ArrowRight,
  ArrowLeft,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Star as StarIcon,
  Sparkle as SparkleIcon,
  Lightning as LightningIcon,
  FloppyDisk as SaveIcon,
  Trash as DeleteIcon,
  PencilSimple as EditIcon,
  Plus as PlusIcon,
  Minus as MinusIcon,
  Eye as EyeIcon,
  EyeSlash as EyeSlashIcon,
  Heart as HeartIcon,
  BookOpen as BookIcon,
  FileText as FileIcon,
  DownloadSimple as DownloadIcon,
  UploadSimple as UploadIcon,
  Link as LinkIcon,
  Copy as CopyIcon,
  DotsThree as DotsIcon,
  SlidersHorizontal as FiltersIcon,
  Tag as TagIcon,
  Image as ImageIcon,
  VideoCamera as VideoIcon,
  ChatCircle as ChatIcon,
  PaperPlaneRight as SendIcon,
  MapPin as LocationIcon,
  Globe as GlobeIcon,
  Lock as LockIcon,
  LockOpen as UnlockIcon,
  Robot as AIIcon,
  Cpu as CpuIcon,
  ChartBar as ChartIcon,
  TrendUp as TrendUpIcon,
  TrendDown as TrendDownIcon,
  ShieldCheck as ShieldIcon,
  MoonStars as MoonIcon,
  Sun as SunIcon,
  Palette as PaletteIcon,
  TextT as FontIcon,
  Keyboard as KeyboardIcon,
  ToggleLeft as ToggleLeftIcon,
  ToggleRight as ToggleRightIcon,
}

// ── Nav Icon Config — used by Sidebar + Bottom Dock ──
import type { Icon as PhosphorIcon } from '@phosphor-icons/react'

export type NavIconWeight = 'thin' | 'light' | 'regular' | 'bold' | 'fill' | 'duotone'

export interface NavItem {
  id: string
  label: string
  path: string
  icon: PhosphorIcon
  badge?: string
  section?: 'main' | 'professional' | 'bottom'
}

export const mainNavItems: NavItem[] = [
  { id: 'dashboard',  label: 'Overview',               path: '/dashboard',  icon: HouseSimple,     section: 'main' },
  { id: 'mindy',      label: 'Mindy AI',     path: '/mindy',      icon: Brain,           section: 'main' },
  { id: 'flashcards', label: 'Flashcards',         path: '/flashcards', icon: Cards,           section: 'main' },
  { id: 'quizzes',    label: 'Quizzes',            path: '/quizzes',    icon: Question,        section: 'main' },
  { id: 'calendar',   label: 'Calendar',      path: '/calendar',   icon: CalendarCheck,   section: 'main' },
  { id: 'notes',      label: 'Notes',              path: '/notes',      icon: NoteBlank,       section: 'main' },
  { id: 'research',   label: 'Research', path: '/research',   icon: MagnifyingGlass, section: 'main' },
  { id: 'library', label: 'Documents', path: '/documents', icon: FolderSimple, section: 'main' },
]

export const professionalNavItems: NavItem[] = [
  { id: 'clients',    label: 'Clients',   path: '/clients',   icon: Users,        section: 'professional' },
]

export const bottomNavItems: NavItem[] = [
  { id: 'settings', label: 'Settings', path: '/settings', icon: GearSix, section: 'bottom' },
  { id: 'help', label: 'Help', path: '/help', icon: Lifebuoy, section: 'bottom' },
]

// Dock items (mobile bottom bar — subset of main nav)
export const dockNavItems: NavItem[] = [
  { id: 'dashboard', label: 'Overview', path: '/dashboard', icon: HouseSimple },
  { id: 'flashcards', label: 'Study', path: '/flashcards', icon: Cards },
  { id: 'mindy', label: 'Mindy', path: '/mindy', icon: Sparkle },
  { id: 'notes', label: 'Notes', path: '/notes', icon: NoteBlank },
  { id: 'documents', label: 'Library', path: '/documents', icon: BookOpen },
]
