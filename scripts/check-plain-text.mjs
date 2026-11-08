import assert from 'node:assert/strict'
import { plainText } from '../supabase/functions/_shared/plainText.ts'
import { validateDraft } from '../supabase/functions/_shared/contracts.ts'
assert.equal(plainText('## Memory\n\n**Encoding** and *retrieval* with `practice`.'),'Memory\n\nEncoding and retrieval with practice.')
assert.equal(plainText('[APA](https://apa.org)'),'APA (https://apa.org)')
assert.equal(plainText('5 * 2 = 10; A_B_C; C#; p < .05'),'5 * 2 = 10; A_B_C; C#; p < .05')
assert.equal(plainText('```text\nMemory\n```'),'Memory')
assert.equal(plainText('```Memory```'),'Memory')
assert.equal(plainText('- First\n- Second'),'• First\n• Second')
assert.equal(plainText('~~outdated~~ and __important__'),'outdated and important')
const draft={title:'**Memory**',summary:'# Guide',keyPoints:['**Encoding**'],cards:[{question:'What is **memory**?',answer:'`Stored` information.'}],questions:[]}
const clean=validateDraft(draft,'flashcards')
assert.equal(clean.title,'Memory')
assert.equal(clean.cards[0].question,'What is memory?')
assert.equal(clean.cards[0].answer,'Stored information.')
assert.equal(draft.title,'**Memory**')
console.log('Passed: plain-text conversion, links, equations, identifiers, code fences, and generated draft normalization without mutating source data.')
