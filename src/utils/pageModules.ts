export const pageModules = {
  '/dashboard':()=>import('../pages/DashboardPage'),
  '/mindy':()=>import('../pages/MindyPage'),
  '/notes':()=>import('../pages/NotesPage'),
  '/flashcards':()=>import('../pages/FlashcardsPage'),
  '/quizzes':()=>import('../pages/QuizzesPage'),
  '/research':()=>import('../pages/ResearchPage'),
  '/calendar':()=>import('../pages/CalendarPage'),
  '/sessions':()=>import('../pages/CalendarPage'),
  '/library':()=>import('../pages/StudyBoxPage'),
  '/documents':()=>import('../pages/DocumentsPage'),
  '/clients':()=>import('../pages/ClientsPage'),
  '/settings':()=>import('../pages/SettingsPage'),
  '/help':()=>import('../pages/HelpPage'),
  '/dsm':()=>import('../pages/DSMPage'),
}
const warmed=new Set<string>()
export function preloadPage(path:string) {
  const load=pageModules[path as keyof typeof pageModules]
  if(!load||warmed.has(path))return
  warmed.add(path)
  void load().catch(()=>warmed.delete(path))
}
