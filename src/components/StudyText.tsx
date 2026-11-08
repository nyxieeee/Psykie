import { plainText } from '../../supabase/functions/_shared/plainText'
/** AI text stays plain; interface labels keep their own visual hierarchy. */
export function StudyText({text}:{text:string}) {
  return <>{plainText(text)}</>
}
