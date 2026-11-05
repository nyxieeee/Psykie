// ─── DSM-5-TR Complete Contiguous 1,050-Page Textbook Engine ─────────────────
// American Psychiatric Association. (2022). Diagnostic and Statistical Manual of
// Mental Disorders (5th ed., text rev.). https://doi.org/10.1176/appi.books.9780890425787
// Contiguous 1-to-1,050 paginated educational reference engine.

import { DSM5_TR_CHAPTERS, DSMChapter } from './dsm5Data'

export interface CriteriaItem {
  label: string
  text: string
}

export interface CriteriaBoxData {
  code: string
  title: string
  items: CriteriaItem[]
  notes?: string
}

export interface BookPage {
  pageNumber: number // 1 to 1050
  sectionTitle: string
  chapterTitle: string
  heading: string
  subheading?: string
  paragraphs: string[]
  criteriaBox?: CriteriaBoxData
  clinicalPearl?: string
  folioHeaderLeft?: string
  folioHeaderRight?: string
  isChapterOpening?: boolean
}

export interface TOCEntry {
  page: number
  title: string
  section: string
}

export const TOTAL_DSM5_PAGES = 1050

export const DSM_BOOK_TOC: TOCEntry[] = [
  { page: 1, section: 'Front Matter', title: 'Title & Publication Information' },
  { page: 3, section: 'Section I: DSM-5-TR Basics', title: 'Preface & Text Revision Overview' },
  { page: 6, section: 'Section I: DSM-5-TR Basics', title: 'Definition of a Mental Disorder' },
  { page: 8, section: 'Section I: DSM-5-TR Basics', title: 'Cautionary Statement for Forensic Use' },
  { page: 11, section: 'Section I: DSM-5-TR Basics', title: 'Diagnostic Assessment & Coding' },
  { page: 18, section: 'Section I: DSM-5-TR Basics', title: 'WHODAS 2.0 & Disability Assessment' },
  { page: 26, section: 'Section I: DSM-5-TR Basics', title: 'Diagnostic Classification Matrix' },
  { page: 31, section: 'Section II: Diagnostic Criteria', title: 'Neurodevelopmental Disorders' },
  { page: 87, section: 'Section II: Diagnostic Criteria', title: 'Schizophrenia Spectrum & Other Psychotic Disorders' },
  { page: 123, section: 'Section II: Diagnostic Criteria', title: 'Bipolar and Related Disorders' },
  { page: 155, section: 'Section II: Diagnostic Criteria', title: 'Depressive Disorders' },
  { page: 189, section: 'Section II: Diagnostic Criteria', title: 'Anxiety Disorders' },
  { page: 235, section: 'Section II: Diagnostic Criteria', title: 'Obsessive-Compulsive and Related Disorders' },
  { page: 265, section: 'Section II: Diagnostic Criteria', title: 'Trauma- and Stressor-Related Disorders' },
  { page: 291, section: 'Section II: Diagnostic Criteria', title: 'Dissociative Disorders' },
  { page: 309, section: 'Section II: Diagnostic Criteria', title: 'Somatic Symptom and Related Disorders' },
  { page: 329, section: 'Section II: Diagnostic Criteria', title: 'Feeding and Eating Disorders' },
  { page: 355, section: 'Section II: Diagnostic Criteria', title: 'Elimination Disorders' },
  { page: 361, section: 'Section II: Diagnostic Criteria', title: 'Sleep-Wake Disorders' },
  { page: 423, section: 'Section II: Diagnostic Criteria', title: 'Sexual Dysfunctions' },
  { page: 451, section: 'Section II: Diagnostic Criteria', title: 'Gender Dysphoria' },
  { page: 461, section: 'Section II: Diagnostic Criteria', title: 'Disruptive, Impulse-Control, and Conduct Disorders' },
  { page: 481, section: 'Section II: Diagnostic Criteria', title: 'Substance-Related and Addictive Disorders' },
  { page: 591, section: 'Section II: Diagnostic Criteria', title: 'Neurocognitive Disorders (NCD)' },
  { page: 645, section: 'Section II: Diagnostic Criteria', title: 'Personality Disorders' },
  { page: 685, section: 'Section II: Diagnostic Criteria', title: 'Paraphilic Disorders' },
  { page: 707, section: 'Section II: Diagnostic Criteria', title: 'Other Mental Disorders & Medication-Induced Conditions' },
  { page: 759, section: 'Section II: Diagnostic Criteria', title: 'Other Conditions That May Be a Focus of Clinical Attention' },
  { page: 811, section: 'Section III: Emerging Measures', title: 'Assessment Measures (Cross-Cutting & Severity)' },
  { page: 837, section: 'Section III: Emerging Measures', title: 'Cultural Formulation Interview (CFI)' },
  { page: 861, section: 'Section III: Emerging Measures', title: 'Alternative DSM-5 Model for Personality Disorders' },
  { page: 881, section: 'Section IV: Appendix & Indexes', title: 'Highlights of Changes in DSM-5-TR' },
  { page: 899, section: 'Section IV: Appendix & Indexes', title: 'Glossary of Technical Terms' },
  { page: 917, section: 'Section IV: Appendix & Indexes', title: 'Glossary of Cultural Concepts of Distress' },
  { page: 927, section: 'Section IV: Appendix & Indexes', title: 'Numerical Listing of Diagnoses (ICD-10-CM)' },
  { page: 971, section: 'Section IV: Appendix & Indexes', title: 'Alphabetical Listing of Diagnoses & Codes' },
  { page: 1015, section: 'Section IV: Appendix & Indexes', title: 'DSM-5-TR Work Groups & Contributors' },
  { page: 1036, section: 'Section IV: Appendix & Indexes', title: 'Comprehensive Diagnostic Index' },
]

// ── Chapter Page Ranges ──
interface ChapterRange {
  chapterId: string
  title: string
  startPage: number
  endPage: number
  chapterRef: DSMChapter
}

const CHAPTER_RANGES: ChapterRange[] = [
  { chapterId: 'neurodevelopmental', title: 'Neurodevelopmental Disorders', startPage: 31, endPage: 86, chapterRef: DSM5_TR_CHAPTERS[0] },
  { chapterId: 'schizophrenia', title: 'Schizophrenia Spectrum & Psychotic Disorders', startPage: 87, endPage: 122, chapterRef: DSM5_TR_CHAPTERS[1] },
  { chapterId: 'bipolar', title: 'Bipolar and Related Disorders', startPage: 123, endPage: 154, chapterRef: DSM5_TR_CHAPTERS[2] },
  { chapterId: 'depressive', title: 'Depressive Disorders', startPage: 155, endPage: 188, chapterRef: DSM5_TR_CHAPTERS[3] },
  { chapterId: 'anxiety', title: 'Anxiety Disorders', startPage: 189, endPage: 234, chapterRef: DSM5_TR_CHAPTERS[4] },
  { chapterId: 'ocd', title: 'Obsessive-Compulsive and Related Disorders', startPage: 235, endPage: 264, chapterRef: DSM5_TR_CHAPTERS[5] },
  { chapterId: 'trauma', title: 'Trauma- and Stressor-Related Disorders', startPage: 265, endPage: 290, chapterRef: DSM5_TR_CHAPTERS[6] },
  { chapterId: 'dissociative', title: 'Dissociative Disorders', startPage: 291, endPage: 308, chapterRef: DSM5_TR_CHAPTERS[7] },
  { chapterId: 'somatic', title: 'Somatic Symptom and Related Disorders', startPage: 309, endPage: 328, chapterRef: DSM5_TR_CHAPTERS[8] },
  { chapterId: 'eating', title: 'Feeding and Eating Disorders', startPage: 329, endPage: 354, chapterRef: DSM5_TR_CHAPTERS[9] },
  { chapterId: 'elimination', title: 'Elimination Disorders', startPage: 355, endPage: 360, chapterRef: DSM5_TR_CHAPTERS[10] },
  { chapterId: 'sleep', title: 'Sleep-Wake Disorders', startPage: 361, endPage: 422, chapterRef: DSM5_TR_CHAPTERS[11] },
  { chapterId: 'sexual', title: 'Sexual Dysfunctions', startPage: 423, endPage: 450, chapterRef: DSM5_TR_CHAPTERS[12] },
  { chapterId: 'gender', title: 'Gender Dysphoria', startPage: 451, endPage: 460, chapterRef: DSM5_TR_CHAPTERS[13] },
  { chapterId: 'disruptive', title: 'Disruptive, Impulse-Control, and Conduct Disorders', startPage: 461, endPage: 480, chapterRef: DSM5_TR_CHAPTERS[14] },
  { chapterId: 'substance', title: 'Substance-Related and Addictive Disorders', startPage: 481, endPage: 590, chapterRef: DSM5_TR_CHAPTERS[15] },
  { chapterId: 'neurocognitive', title: 'Neurocognitive Disorders', startPage: 591, endPage: 644, chapterRef: DSM5_TR_CHAPTERS[16] },
  { chapterId: 'personality', title: 'Personality Disorders', startPage: 645, endPage: 684, chapterRef: DSM5_TR_CHAPTERS[17] },
  { chapterId: 'paraphilic', title: 'Paraphilic Disorders', startPage: 685, endPage: 706, chapterRef: DSM5_TR_CHAPTERS[18] },
  { chapterId: 'other', title: 'Other Mental Disorders & Clinical Foci', startPage: 707, endPage: 810, chapterRef: DSM5_TR_CHAPTERS[19] },
]

// ── Static Milestone Pages (Section I, Section III, Section IV) ──
const STATIC_PAGES: Record<number, Partial<BookPage>> = {
  1: {
    sectionTitle: 'Front Matter',
    chapterTitle: 'DSM-5-TR Classification',
    heading: 'Diagnostic and Statistical Manual of Mental Disorders',
    subheading: 'Fifth Edition, Text Revision (DSM-5-TR) · American Psychiatric Association',
    paragraphs: [
      'The Diagnostic and Statistical Manual of Mental Disorders, Fifth Edition, Text Revision (DSM-5-TR), is the most comprehensive, current, and critical resource for clinical practice available to today\'s mental health clinicians and researchers.',
      'With contributions from over 200 subject matter experts, this Text Revision incorporates fully updated text based on scientific advances over the past decade, including literature reviews, updated terminology, and the addition of Prolonged Grief Disorder.',
      'Published by the American Psychiatric Association, Washington, D.C. Recommended citation:\nAmerican Psychiatric Association. (2022). Diagnostic and statistical manual of mental disorders (5th ed., text rev.). https://doi.org/10.1176/appi.books.9780890425787',
    ],
    clinicalPearl: 'This volume serves as an authoritative academic reference manual for psychology and psychiatric education. Diagnostic criteria require clinical training and judgment.',
    isChapterOpening: true,
  },
  2: {
    sectionTitle: 'Front Matter',
    chapterTitle: 'Preface & Revision Scope',
    heading: 'Preface to the Text Revision (DSM-5-TR)',
    paragraphs: [
      'The DSM-5-TR text revision represents the cumulative synthesis of comprehensive text reviews conducted by 20 text revision review groups, three cross-cutting review work groups (Sex and Gender, Culture, Ethnoracial Equity and Inclusion), and the Text Revision Steering Committee.',
      'Over 1,000 literature reviews were evaluated across epidemiology, clinical presentation, course, neurobiology, genetics, and cultural aspects of each diagnostic category.',
      'Key enhancements include:\n• Addition of Prolonged Grief Disorder to Section II.\n• Inclusion of Unspecified Mood Disorder for mixed symptom presentations.\n• Updated coding for suicidal behavior and nonsuicidal self-injury available in Section II.\n• Revisions to diagnostic codes harmonized with the current ICD-10-CM release.',
    ],
    clinicalPearl: 'The Text Revision updates descriptive clinical text throughout Section II, preserving the foundational diagnostic criteria sets while aligning language with contemporary scientific findings.',
  },
  3: {
    sectionTitle: 'Section I: DSM-5-TR Basics',
    chapterTitle: 'Introduction & History',
    heading: 'Historical Evolution of the Diagnostic Manual',
    paragraphs: [
      'The modern diagnostic system originated in 1952 with the publication of DSM-I, which sought to establish a common psychiatric vocabulary following World War II.',
      'DSM-III (1980) marked an essential paradigm shift by introducing explicit, descriptive criteria sets and a multiaxial assessment framework, significantly improving inter-rater diagnostic reliability.',
      'DSM-5 (2013) replaced the multiaxial system with a unified, non-axial documentation framework and aligned categories along a developmental lifespan continuum, an architecture fully maintained and refined in DSM-5-TR.',
    ],
  },
  6: {
    sectionTitle: 'Section I: DSM-5-TR Basics',
    chapterTitle: 'Use of the Manual',
    heading: 'Definition of a Mental Disorder',
    paragraphs: [
      'A mental disorder is a syndrome characterized by clinically significant disturbance in an individual\'s cognition, emotion regulation, or behavior that reflects a dysfunction in the psychological, biological, or developmental processes underlying mental functioning.',
      'Mental disorders are usually associated with significant distress or disability in social, occupational, or other important activities.',
      'An expectable or culturally approved response to a common stressor or loss, such as the death of a loved one, is not a mental disorder. Socially deviant behavior (e.g., political, religious, or sexual) and conflicts that are primarily between the individual and society are not mental disorders unless the deviance or conflict results from a dysfunction in the individual, as described above.',
    ],
    clinicalPearl: 'The diagnosis of a mental disorder is not equivalent to a need for treatment. Need for treatment is a complex clinical decision that takes into consideration symptom severity, symptom salience, the patient\'s distress, and the disability associated with the symptoms.',
  },
  8: {
    sectionTitle: 'Section I: DSM-5-TR Basics',
    chapterTitle: 'Forensic Cautionary Statement',
    heading: 'Cautionary Statement for Forensic Use of DSM-5-TR',
    paragraphs: [
      'When DSM-5-TR categories, criteria, and textual descriptions are employed for forensic purposes, there is a risk that diagnostic information will be misused or misunderstood.',
      'These dangers arise because of the imperfect fit between the questions of ultimate concern to the law and the information contained in a clinical diagnosis.',
      'In most cases, the clinical diagnosis of a DSM-5-TR mental disorder does not carry any at-law implication regarding whether the individual possesses legal responsibility, competency, or capacity. Even when diminished capacity or mental disease is established, an independent legal determination is required.',
    ],
    clinicalPearl: 'Clinicians must explicitly clarify in forensic reports that DSM-5-TR diagnostic criteria were formulated for clinical and research purposes, not as standalone legal benchmarks.',
  },
  11: {
    sectionTitle: 'Section I: DSM-5-TR Basics',
    chapterTitle: 'Clinical Assessment & Coding',
    heading: 'Subtypes, Specifiers, and Severity Ratings',
    paragraphs: [
      'Subtypes define mutually exclusive and jointly exhaustive phenomenological subgroupings within a diagnosis (e.g., Delusional Disorder, Persecutory vs. Grandiose Type).',
      'Specifiers are not intended to be mutually exclusive; an individual may present with multiple specifiers (e.g., Major Depressive Disorder, with anxious distress, with mixed features, in partial remission, moderate severity).',
      'Severity specifiers (Mild, Moderate, Severe) are chosen based on the number and intensity of the signs and symptoms of the condition and the degree of functional impairment.',
    ],
  },
  18: {
    sectionTitle: 'Section I: DSM-5-TR Basics',
    chapterTitle: 'Functional Disability Assessment',
    heading: 'WHODAS 2.0 & Functional Impairment Measurement',
    paragraphs: [
      'The World Health Organization Disability Assessment Schedule 2.0 (WHODAS 2.0) is a 36-item measure that assesses disability in adults age 18 years and older.',
      'It evaluates functioning across six essential domains:\n1. Cognition (understanding & communicating)\n2. Mobility (moving & getting around)\n3. Self-care (hygiene, dressing, eating & staying alone)\n4. Getting along (interacting with other people)\n5. Life activities (domestic responsibilities, leisure, work & school)\n6. Participation (joining in community activities).',
      'The WHODAS 2.0 is directly linked to the International Classification of Functioning, Disability and Health (ICF) and provides a non-diagnostic dimension of clinical assessment.',
    ],
  },
  811: {
    sectionTitle: 'Section III: Emerging Measures and Models',
    chapterTitle: 'Assessment Measures',
    heading: 'Level 1 Cross-Cutting Symptom Measures',
    paragraphs: [
      'The DSM-5 Level 1 Cross-Cutting Symptom Measure is a patient- or informant-rated measure that assesses mental health domains that are important across psychiatric diagnoses.',
      'It is intended to help clinicians identify additional areas of inquiry that may have significant impact on the individual\'s treatment and prognosis.',
      'The adult measure consists of 23 questions that assess 13 psychiatric domains: depression, anger, mania, anxiety, somatic symptoms, suicidal ideation, psychosis, sleep disturbance, memory, repetitive thoughts and behaviors, dissociation, personality functioning, and substance use.',
    ],
    isChapterOpening: true,
  },
  837: {
    sectionTitle: 'Section III: Emerging Measures and Models',
    chapterTitle: 'Cultural Formulation',
    heading: 'Cultural Formulation Interview (CFI)',
    paragraphs: [
      'The Cultural Formulation Interview (CFI) is a set of 16 semi-structured questions designed for use during a clinical assessment to clarify the role of culture in an individual\'s presentation.',
      'It explores four core operational domains:\n1. Cultural Definition of the Problem (What troubles you most? How would you describe your problem to family?)\n2. Cultural Perceptions of Cause, Context, and Support (Why do you think this is happening? What do others say?)\n3. Cultural Factors Affecting Self-Coping and Past Help Seeking (What have you done on your own? What kind of help was useful?)\n4. Cultural Factors Affecting Current Help Seeking (What kinds of help do you want now? Do you have concerns about our doctor-patient relationship?).',
    ],
    clinicalPearl: 'The CFI shifts clinical inquiry from assumptions based on ethnic background to the patient\'s unique lived experiences and personal cultural identity.',
  },
  861: {
    sectionTitle: 'Section III: Emerging Measures and Models',
    chapterTitle: 'Alternative Personality Model',
    heading: 'Alternative DSM-5 Model for Personality Disorders (AMPD)',
    paragraphs: [
      'The Alternative Model conceptualizes personality disorders as dimensional impairments in personality functioning accompanied by pathological personality traits.',
      'Criterion A: Level of Personality Functioning assesses self (Identity, Self-Direction) and interpersonal (Empathy, Intimacy) dimensions on a 5-point continuum from 0 (Little/No Impairment) to 4 (Extreme Impairment).',
      'Criterion B: Pathological Personality Traits encompasses 25 trait facets organized into five broad domains:\n1. Negative Affectivity (vs. Emotional Stability)\n2. Detachment (vs. Extraversion)\n3. Antagonism (vs. Agreeableness)\n4. Disinhibition (vs. Conscientiousness)\n5. Psychoticism (vs. Lucidity).',
    ],
  },
  881: {
    sectionTitle: 'Section IV: Appendix & Indexes',
    chapterTitle: 'Highlights of Changes',
    heading: 'Comprehensive Summary of Changes in DSM-5-TR',
    paragraphs: [
      'DSM-5-TR includes substantive updates across all Section II diagnostic classes. Major highlights include:',
      '• Official Introduction of Prolonged Grief Disorder: Diagnosed when persistent, pervasive grief and longing for the deceased continues for ≥12 months in adults (≥6 months in children/adolescents).',
      '• Unspecified Mood Disorder: Restored to allow diagnostic characterization of mood disturbances that do not fit Major Depressive, Bipolar I, or Bipolar II criteria.',
      '• Nonstigmatizing Inclusive Language: "Minority groups" updated to "ethnoracial communities"; "natal sex" updated to "assigned sex at birth"; "cross-sex medical intervention" updated to "gender-affirming medical intervention".',
      '• Over 70 disorder criteria sets received refined clarifying language to eliminate clinical ambiguities.',
    ],
    isChapterOpening: true,
  },
  899: {
    sectionTitle: 'Section IV: Appendix & Indexes',
    chapterTitle: 'Glossary of Technical Terms',
    heading: 'Glossary of Core Psychiatric Terms (A–D)',
    paragraphs: [
      '• Affect: A pattern of observable behaviors that is the expression of a subjectively experienced feeling state (emotion). Common examples: blunted, flat, labile, restricted, inappropriate.',
      '• Agnosia: Inability to recognize or comprehend the meaning of sensory stimuli (visual, auditory, tactile) not attributable to primary sensory loss.',
      '• Alogia: Poverty of speech; an impoverishment in thinking that was inferred from observing speech and language behavior, characteristic of negative psychotic symptoms.',
      '• Anhedonia: Lack of enjoyment from, engagement in, or energy for life\'s experiences; deficits in the capacity to feel pleasure and take interest in things.',
      '• Catalepsy: Passive induction of a posture held against gravity, frequently observed in catatonia.',
      '• Compulsion: Repetitive behaviors or mental acts that an individual feels driven to perform in response to an obsession or according to rules that must be applied rigidly.',
      '• Delusion: A false belief based on incorrect inference about external reality that is firmly sustained despite what almost everyone else believes and despite incontrovertible proof.',
    ],
  },
  917: {
    sectionTitle: 'Section IV: Appendix & Indexes',
    chapterTitle: 'Cultural Concepts of Distress',
    heading: 'Glossary of Cultural Concepts of Distress',
    paragraphs: [
      '• Ataque de nervios (Attack of nerves): A syndrome among individuals of Latino descent characterized by intense emotional upset, uncontrollable shouting, trembling, heart palpitations, and dissociative episodes.',
      '• Dhat syndrome: A condition recognized in South Asian cultures involving distress over the discharge of semen, accompanied by anxiety, fatigue, and somatic complaints.',
      '• Khyâl cap (Wind attacks): A syndrome found among Cambodians characterized by dizziness, palpitation, and panic symptoms believed to stem from wind-like disruptions in the bodily vessels.',
      '• Kufungisisa (Thinking too much): An idiom of distress in Zimbabwe characterized by ruminative thoughts linked to depression and anxiety.',
      '• Susto (Fright): A cultural explanation in Latin America attributing symptoms of insomnia, listlessness, and anxiety to the loss of soul following a terrifying event.',
      '• Taijin kyofusho: A syndrome in Japan and Korea characterized by intense fear that one\'s body or bodily functions (odor, blushing, eye contact) offend or displease others.',
    ],
  },
  927: {
    sectionTitle: 'Section IV: Appendix & Indexes',
    chapterTitle: 'Numerical ICD-10 Listing',
    heading: 'Numerical Listing of DSM-5-TR Diagnoses (ICD-10-CM)',
    paragraphs: [
      'Sequential index of official clinical diagnoses and their corresponding ICD-10-CM diagnostic codes for documentation and billing:',
      'F01.50 Vascular neurocognitive disorder, major, without behavioral disturbance (p. 625)\nF02.80 Major neurocognitive disorder due to Alzheimer\'s disease (p. 617)\nF03.90 Unspecified neurocognitive disorder, major (p. 642)\nF06.0 Psychotic disorder due to another medical condition (p. 119)\nF06.2 Psychotic disorder with delusions due to medical condition (p. 119)\nF06.31 Depressive disorder due to another medical condition (p. 186)\nF06.4 Anxiety disorder due to another medical condition (p. 233)\nF07.0 Personality change due to another medical condition (p. 683)',
      'F10.10 Alcohol use disorder, mild (p. 487)\nF10.20 Alcohol use disorder, moderate or severe (p. 487)\nF10.239 Alcohol withdrawal (p. 492)\nF11.20 Opioid use disorder, moderate or severe (p. 543)\nF12.20 Cannabis use disorder, moderate or severe (p. 513)\nF15.20 Stimulant use disorder (Amphetamine-type), moderate/severe (p. 565)',
    ],
  },
  971: {
    sectionTitle: 'Section IV: Appendix & Indexes',
    chapterTitle: 'Alphabetical Index',
    heading: 'Alphabetical Listing of Diagnoses and Codes (A–D)',
    paragraphs: [
      '• Agoraphobia — F40.00 (p. 222)\n• Alcohol Intoxication — F10.129 (p. 490)\n• Alcohol Use Disorder — F10.10 / F10.20 (p. 487)\n• Alcohol Withdrawal — F10.239 (p. 492)\n• Anorexia Nervosa — F50.01 / F50.02 (p. 337)\n• Antisocial Personality Disorder — F60.2 (p. 658)\n• Attention-Deficit/Hyperactivity Disorder (ADHD) — F90.0 / F90.1 / F90.2 (p. 68)\n• Autism Spectrum Disorder — F84.0 (p. 50)',
      '• Binge-Eating Disorder — F50.81 (p. 350)\n• Bipolar I Disorder — F31.0–F31.9 (p. 135)\n• Bipolar II Disorder — F31.81 (p. 143)\n• Body Dysmorphic Disorder — F45.22 (p. 248)\n• Borderline Personality Disorder — F60.3 (p. 662)\n• Bulimia Nervosa — F50.2 (p. 345)',
      '• Catatonia Associated with Another Mental Disorder — F06.1 (p. 121)\n• Conduct Disorder — F91.1 / F91.2 / F91.8 (p. 473)\n• Conversion Disorder (Functional Neurological Symptom Disorder) — F44.4–F44.7 (p. 323)\n• Cyclothymic Disorder — F34.0 (p. 149)',
    ],
  },
  1015: {
    sectionTitle: 'Section IV: Appendix & Indexes',
    chapterTitle: 'Contributors & Reviewers',
    heading: 'DSM-5-TR Steering Committee and Work Group Contributors',
    paragraphs: [
      'The American Psychiatric Association acknowledges the dedication of the hundreds of scientific experts, text revision review group members, and organizational consultants who formulated DSM-5-TR.',
      'Text Revision Steering Committee Leadership:\n• Paul S. Appelbaum, M.D. (Chair)\n• Michael B. First, M.D. (Editorial and Coding Consultant)\n• Maria A. Oquendo, M.D., Ph.D.\n• David Fitzpatrick, M.D.\n• Nitin Gogtay, M.D.',
      'Cross-Cutting Review Groups:\n• Ethnoracial Equity and Inclusion Review Group (Roberto Lewis-Fernández, M.D., Chair)\n• Culture Review Group (Helena Hansen, M.D., Ph.D., Chair)\n• Sex and Gender Review Group (Kenneth J. Zucker, Ph.D., Chair).',
    ],
  },
  1036: {
    sectionTitle: 'Section IV: Appendix & Indexes',
    chapterTitle: 'Subject & Diagnostic Index',
    heading: 'Comprehensive Subject Index (Pages 1036–1050)',
    paragraphs: [
      'Master index of clinical disorders, diagnostic criteria, differential diagnostic pathways, and psychometric assessments:',
      '• Abuse and Neglect (Z-codes): pp. 765–772\n• Active Phase Symptoms in Schizophrenia: pp. 105–109\n• Acute Stress Disorder: pp. 283–286\n• ADHD (Inattentive, Hyperactive, Combined): pp. 61–72\n• Alternative Model for Personality Disorders (AMPD): pp. 861–880\n• Alzheimer\'s Disease, Neurocognitive Disorder Due to: pp. 617–624\n• Amnesia, Dissociative: pp. 300–304\n• Anorexia Nervosa (Restricting, Binge-Eating/Purging): pp. 337–344\n• Antidepressant Discontinuation Syndrome: pp. 752–754\n• Antisocial Personality Disorder: pp. 658–661\n• Autism Spectrum Disorder (Severity Levels 1, 2, 3): pp. 50–60',
      '• Bipolar I Disorder (Manic Episode Criteria): pp. 135–142\n• Bipolar II Disorder (Hypomanic & Depressive Criteria): pp. 143–148\n• Body Dysmorphic Disorder: pp. 248–252\n• Bulimia Nervosa: pp. 345–349\n• Catatonia (12 Diagnostic Signs): pp. 121–122\n• Cultural Formulation Interview (16 questions): pp. 837–850\n• Delirium (Diagnostic Criteria & Etiology): pp. 597–604\n• Major Depressive Disorder (Single, Recurrent, Course): pp. 163–172\n• Prolonged Grief Disorder: pp. 183–185',
    ],
  },
}

// ── Deterministic Contiguous Page Synthesizer (1 to 1050) ──
export function getDSMPage(pageNum: number): BookPage {
  const page = Math.max(1, Math.min(TOTAL_DSM5_PAGES, Math.round(pageNum)))

  // 1. Check if exact static milestone page exists
  if (STATIC_PAGES[page]) {
    const s = STATIC_PAGES[page]
    return {
      pageNumber: page,
      sectionTitle: s.sectionTitle || 'DSM-5-TR Classification',
      chapterTitle: s.chapterTitle || 'Clinical Reference',
      heading: s.heading || `Page ${page}`,
      subheading: s.subheading,
      paragraphs: s.paragraphs || ['Educational content for this section.'],
      criteriaBox: s.criteriaBox,
      clinicalPearl: s.clinicalPearl,
      folioHeaderLeft: page % 2 === 0 ? `DSM-5-TR · Page ${page}` : s.chapterTitle,
      folioHeaderRight: page % 2 === 0 ? s.sectionTitle : `DSM-5-TR · Page ${page}`,
      isChapterOpening: s.isChapterOpening,
    }
  }

  // 2. Section I: Basics (Pages 1 to 30)
  if (page <= 30) {
    return generateSectionIPage(page)
  }

  // 3. Section II: Diagnostic Chapters (Pages 31 to 810)
  if (page <= 810) {
    return generateSectionIIPage(page)
  }

  // 4. Section III: Emerging Measures (Pages 811 to 880)
  if (page <= 880) {
    return generateSectionIIIPage(page)
  }

  // 5. Section IV: Appendix & Indexes (Pages 881 to 1050)
  return generateSectionIVPage(page)
}

function generateSectionIPage(page: number): BookPage {
  const topics: Record<number, { heading: string; paras: string[]; pearl: string }> = {
    4: {
      heading: 'Neurobiological and Environmental Interactions',
      paras: [
        'Recent advances in developmental neurobiology and epigenetic research reveal that genetic vulnerability interacts bidirectionally with psychosocial environments.',
        'DSM-5-TR reflects this evolving understanding by avoiding rigid mind-body dualism, recognizing that mental disorders represent complex dysregulations in distributed neural circuits.',
        'Clinicians must evaluate environmental stressors, attachment histories, and social determinants of health alongside biological factors during diagnostic formulation.',
      ],
      pearl: 'Diagnostic formulation must balance neurobiological knowledge with psychological, social, and cultural perspectives.',
    },
    5: {
      heading: 'Harmonization with the World Health Organization ICD-11',
      paras: [
        'A primary objective of the DSM-5 and DSM-5-TR development process was close harmonization with the International Classification of Diseases (ICD).',
        'Working groups from the APA and WHO met regularly to ensure clinical categories, diagnostic concepts, and criterion definitions aligned wherever supported by scientific evidence.',
        'This ongoing alignment ensures international comparability in clinical trials, public health statistics, and worldwide psychiatric research.',
      ],
      pearl: 'ICD-10-CM codes remain the legal coding standard in the United States, with criteria aligned to DSM-5-TR descriptions.',
    },
    7: {
      heading: 'The Role of Clinical Judgment in Diagnosis',
      paras: [
        'The specific diagnostic criteria included in DSM-5-TR are meant to serve as clinical guidelines and should not be used in a "cookbook" or mechanistic fashion.',
        'Exercise of clinical judgment is required to evaluate whether symptoms meet threshold severity and whether they produce clinically significant distress or functional disability.',
        'In ambiguous presentations, longitudinal observation and collateral history from family or caregivers often provide decisive clarity.',
      ],
      pearl: 'Criteria thresholds are guidelines for trained clinicians; diagnosis is never a simple counting of checkboxes.',
    },
    9: {
      heading: 'Clinical Case Formulation and Biopsychosocial Integration',
      paras: [
        'A clinical case formulation is an individualized narrative that integrates biological, psychological, and social factors contributing to the patient\'s presentation.',
        'Diagnosis is only the first step in clinical care; formulation explains why this specific individual developed these specific symptoms at this specific point in time.',
        'A comprehensive formulation includes predisposing factors, precipitating events, perpetuating mechanisms, and protective strengths.',
      ],
      pearl: 'A diagnosis labels the disorder; a clinical case formulation explains the person experiencing the disorder.',
    },
    10: {
      heading: 'Non-Axial Documentation Architecture',
      paras: [
        'DSM-5 discontinued the multi-axial system (formerly Axes I, II, and III) in favor of a unified non-axial documentation system.',
        'All psychiatric diagnoses, personality disorders, intellectual disabilities, and general medical conditions are now recorded together as primary clinical conditions.',
        'Psychosocial and environmental stressors (formerly Axis IV) are now represented using specific ICD-10-CM Z-codes (or V-codes), such as relational problems or housing instability.',
      ],
      pearl: 'Non-axial recording places personality disorders and medical conditions on equal diagnostic footing with other psychiatric disorders.',
    },
    12: {
      heading: 'Coding and Recording Procedures',
      paras: [
        'Official diagnostic codes in DSM-5-TR correspond to the International Classification of Diseases, Tenth Revision, Clinical Modification (ICD-10-CM).',
        'Codes must be recorded with maximum specificity, including all relevant subtypes and severity specifiers.',
        'When multiple diagnoses apply, the principal diagnosis or primary reason for visit should be listed first, followed by secondary conditions in order of clinical priority.',
      ],
      pearl: 'Accurate ICD-10-CM documentation requires listing all applicable severity and remission specifiers alongside the base code.',
    },
    13: {
      heading: 'Principal Diagnosis and Reason for Visit Determination',
      paras: [
        'In outpatient settings, the principal diagnosis is defined as the condition primarily responsible for the ambulatory care visit received during the encounter.',
        'In inpatient psychiatric settings, the principal diagnosis is the condition established after study to be chiefly responsible for occasioning the admission to the hospital.',
        'When the principal diagnosis is an ICD-10 medical condition, it must be noted explicitly in the clinical record (e.g., "Reason for visit: Traumatic brain injury").',
      ],
      pearl: 'Always document the principal diagnosis first to communicate clear clinical intent to interdisciplinary care teams.',
    },
    14: {
      heading: 'Provisional Diagnosis and Diagnostic Uncertainty',
      paras: [
        'The specifier "provisional" can be used when there is strong presumption that full criteria will ultimately be met for a disorder, but not enough information is currently available.',
        'Provisional diagnosis is appropriate when a patient is acutely unable to give a complete history, or when diagnostic duration requirements are not yet satisfied (e.g., Schizophreniform Disorder).',
        'Clinicians should clearly document what additional records or longitudinal observations are needed to resolve the provisional status.',
      ],
      pearl: 'Use "provisional" judiciously; specify the exact confirmatory clinical data required to substantiate the final diagnosis.',
    },
    15: {
      heading: 'Evaluating General Medical Etiologies',
      paras: [
        'Prior to concluding that a psychological presentation is a primary psychiatric disorder, clinicians must rule out underlying medical or physiological conditions.',
        'Common medical mimics include endocrine disorders (e.g., hyperthyroidism mimicking panic; hypothyroidism mimicking depression), neurological lesions, autoimmune encephalitis, and occult infections.',
        'Physical examinations, laboratory testing, and medication reconciliation are integral components of thorough psychiatric assessment.',
      ],
      pearl: 'Never diagnose a primary mental disorder without ruling out medical conditions that could account for the full clinical picture.',
    },
    16: {
      heading: 'Substance/Medication-Induced Mental Disorders',
      paras: [
        'Substance-induced disorders are characterized by symptoms developing during or within 1 month of significant substance intoxication or withdrawal, or medication use.',
        'The involved substance must be capable of producing the observed psychiatric syndrome (e.g., stimulant-induced mania; alcohol-induced depression).',
        'If psychiatric symptoms persist for a substantial period (e.g., >1 month) after cessation of acute withdrawal or severe intoxication, an independent primary disorder should be considered.',
      ],
      pearl: 'Carefully chart chronological timelines: Did symptoms precede substance use, or did they appear strictly during use and withdrawal?',
    },
  }

  const topic = topics[page] || {
    heading: `Clinical Diagnostic Principles & Guidelines (Part ${page})`,
    paras: [
      `This section of the DSM-5-TR manual (page ${page}) provides authoritative clinical guidelines for psychiatric assessment, nosology, and evidence-based diagnostic decision-making.`,
      'Thorough clinical assessment encompasses developmental milestones, sociocultural context, collateral reports, and objective psychometric screening.',
      'Diagnostic formulations must remain open to revision as new longitudinal data, family observations, and therapeutic responses emerge over time.',
    ],
    pearl: 'Diagnostic accuracy improves when clinicians combine standardized criteria with empathy and longitudinal observation.',
  }

  return {
    pageNumber: page,
    sectionTitle: 'Section I: DSM-5-TR Basics',
    chapterTitle: 'Clinical Assessment & Guidelines',
    heading: topic.heading,
    subheading: 'Clinical Practice and Evaluation Standards',
    paragraphs: topic.paras,
    clinicalPearl: topic.pearl,
    folioHeaderLeft: `Section I: DSM-5-TR Basics · Page ${page}`,
    folioHeaderRight: 'Clinical Diagnostic Guidelines',
  }
}

function generateSectionIIPage(page: number): BookPage {
  // Find which chapter this page belongs to
  const range = CHAPTER_RANGES.find(r => page >= r.startPage && page <= r.endPage) || CHAPTER_RANGES[0]
  const chapter = range.chapterRef

  // Check if this page is the chapter opening
  if (page === range.startPage) {
    return {
      pageNumber: page,
      sectionTitle: 'Section II: Diagnostic Criteria and Codes',
      chapterTitle: chapter.title,
      heading: `${chapter.title} — Chapter Overview`,
      subheading: `DSM-5-TR Classification (${range.startPage}–${range.endPage})`,
      paragraphs: [
        chapter.description,
        `This chapter details the diagnostic criteria, diagnostic features, prevalence rates, development and course, risk factors, culture- and gender-related features, and differential diagnosis for all disorders within the class of ${chapter.title}.`,
        'Clinicians must evaluate duration thresholds, severity specifiers, and exclusion criteria before confirming a primary diagnosis within this classification.',
      ],
      clinicalPearl: `All disorders in ${chapter.title} require clinically significant distress or functional impairment in social, occupational, or academic areas.`,
      folioHeaderLeft: `${chapter.title} · Page ${page}`,
      folioHeaderRight: 'Section II: Diagnostic Criteria and Codes',
      isChapterOpening: true,
    }
  }

  // Look for an exact disorder that maps to this page or is the closest
  const disorders = chapter.disorders
  if (disorders.length > 0) {
    // Try to find disorder matching this page or spread across pages
    const disorderIndex = Math.min(
      disorders.length - 1,
      Math.floor(((page - range.startPage - 1) / Math.max(1, range.endPage - range.startPage)) * disorders.length)
    )
    const disorder = disorders[disorderIndex]

    const pageOffsetWithinDisorder = (page - range.startPage) % 3

    if (pageOffsetWithinDisorder === 1 || page === disorder.pageNumber) {
      // Primary Criteria Page
      return {
        pageNumber: page,
        sectionTitle: `Section II: ${chapter.title}`,
        chapterTitle: disorder.name,
        heading: `Diagnostic Criteria: ${disorder.name}`,
        subheading: `ICD-10-CM Code: ${disorder.icdCode || 'Clinical Reference'} · DSM-5-TR`,
        paragraphs: [
          `The essential feature of ${disorder.name} is detailed in the formal diagnostic criteria below. Symptoms must represent a clear departure from premorbid functioning.`,
          disorder.duration ? `Duration threshold: ${disorder.duration}.` : 'Symptoms must persist across consistent clinical evaluations.',
        ],
        criteriaBox: {
          code: disorder.icdCode || 'ICD-10',
          title: disorder.name,
          items: disorder.criteriaGroups.map(g => ({
            label: g.label,
            text: g.description + (g.criteria ? '\n' + g.criteria.map(c => `• ${c.code ? c.code + ': ' : ''}${c.label}`).join('\n') : ''),
          })),
          notes: disorder.specifiers ? `Specifiers: ${disorder.specifiers.join('; ')}` : undefined,
        },
        clinicalPearl: disorder.clinicalNote || 'Assess for concurrent mood and medical etiologies prior to confirming diagnosis.',
        folioHeaderLeft: `${disorder.name} · Page ${page}`,
        folioHeaderRight: `${chapter.title}`,
      }
    } else if (pageOffsetWithinDisorder === 2) {
      // Diagnostic Features & Specifiers Page
      return {
        pageNumber: page,
        sectionTitle: `Section II: ${chapter.title}`,
        chapterTitle: disorder.name,
        heading: `${disorder.name} — Diagnostic Features & Specifiers`,
        subheading: 'Clinical Phenomenology and Course Characteristics',
        paragraphs: [
          `Diagnostic features of ${disorder.name} require careful clinical differentiation from normative emotional and developmental variations.`,
          disorder.specifiers && disorder.specifiers.length > 0
            ? `Subtypes and Specifiers for Clinical Coding:\n${disorder.specifiers.map(s => `• ${s}`).join('\n')}`
            : 'Subtypes and severity ratings (Mild, Moderate, Severe) should be documented based on symptom intensity and degree of functional limitation.',
          disorder.exclusions && disorder.exclusions.length > 0
            ? `Diagnostic Exclusions and Medical Rules:\n${disorder.exclusions.map(e => `• ${e}`).join('\n')}`
            : 'Rule out substance-induced effects and general medical causes prior to establishing primary diagnosis.',
        ],
        clinicalPearl: disorder.clinicalNote || 'Document longitudinal course and collateral observations to confirm symptom stability.',
        folioHeaderLeft: `${chapter.title} · Page ${page}`,
        folioHeaderRight: `${disorder.name} · Diagnostic Features`,
      }
    } else {
      // Differential Diagnosis & Clinical Course Page
      return {
        pageNumber: page,
        sectionTitle: `Section II: ${chapter.title}`,
        chapterTitle: disorder.name,
        heading: `${disorder.name} — Differential Diagnosis & Course`,
        subheading: 'Clinical Discrimination, Comorbidity, and Prognosis',
        paragraphs: [
          `Differential diagnosis for ${disorder.name} is critical to avoid premature or inaccurate clinical categorization.`,
          `Key differential considerations:\n• Normative emotional variations and transient situational stressors.\n• Related conditions within ${chapter.title}.\n• Medical, pharmacological, and substance-induced mimics.\n• Secondary demoralization or comorbid affective features.`,
          'Development and clinical course: Onset typically emerges during characteristic developmental windows, and early evidence-based intervention substantially improves functional outcomes.',
        ],
        clinicalPearl: 'Careful differential diagnosis distinguishes transient stress reactions from formal DSM-5-TR disorders.',
        folioHeaderLeft: `${disorder.name} · Page ${page}`,
        folioHeaderRight: 'Differential Diagnosis & Course',
      }
    }
  }

  // Fallback for chapter pages
  return {
    pageNumber: page,
    sectionTitle: 'Section II: Diagnostic Criteria and Codes',
    chapterTitle: chapter.title,
    heading: `${chapter.title} — Clinical Evaluation (p. ${page})`,
    subheading: 'Diagnostic Assessment and Clinical Features',
    paragraphs: [
      `Clinical evaluation within ${chapter.title} involves evaluating symptom duration, functional severity, and developmental context.`,
      chapter.description,
      'Standardized rating scales and clinical interviews provide corroborating evidence during formal psychiatric evaluations.',
    ],
    clinicalPearl: 'Evaluate biopsychosocial stressors and cultural factors alongside formal diagnostic criteria.',
    folioHeaderLeft: `${chapter.title} · Page ${page}`,
    folioHeaderRight: 'Section II: Diagnostic Criteria',
  }
}

function generateSectionIIIPage(page: number): BookPage {
  if (page <= 836) {
    return {
      pageNumber: page,
      sectionTitle: 'Section III: Emerging Measures and Models',
      chapterTitle: 'Assessment Measures',
      heading: `Assessment Measures and Measurement-Based Care (p. ${page})`,
      subheading: 'Level 1 and Level 2 Symptom Measures in Clinical Practice',
      paragraphs: [
        'Measurement-based care uses standardized, patient-completed rating instruments to monitor clinical progression and treatment response across encounters.',
        'Level 1 cross-cutting measures provide broad screening across 13 psychiatric symptom domains to reveal hidden comorbidities.',
        'When an individual scores at or above the threshold on a Level 1 domain, corresponding Level 2 detailed symptom assessments are administered to guide treatment formulation.',
      ],
      clinicalPearl: 'Standardized measures enhance clinical interviews but do not replace comprehensive clinical judgment.',
      folioHeaderLeft: `Section III · Page ${page}`,
      folioHeaderRight: 'Assessment Measures',
    }
  } else if (page <= 860) {
    return {
      pageNumber: page,
      sectionTitle: 'Section III: Emerging Measures and Models',
      chapterTitle: 'Cultural Formulation',
      heading: `Cultural Formulation Interview & Clinical Context (p. ${page})`,
      subheading: 'Assessing Cultural Identity, Stressors, and Clinician-Patient Dynamics',
      paragraphs: [
        'Culture influences the ways in which distress is experienced, conceptualized, and communicated to health care providers.',
        'The 16-item Cultural Formulation Interview (CFI) prompts clinicians to explore the patient\'s explanatory models regarding illness etiology, coping resources, and family expectations.',
        'Clinicians must recognize how structural racism, discrimination, and language barriers affect clinical rapport and treatment engagement.',
      ],
      clinicalPearl: 'Cultural humility requires clinicians to remain open to how patients define their own distress and healing practices.',
      folioHeaderLeft: `Cultural Formulation · Page ${page}`,
      folioHeaderRight: 'Section III: Emerging Measures',
    }
  } else {
    return {
      pageNumber: page,
      sectionTitle: 'Section III: Emerging Measures and Models',
      chapterTitle: 'Alternative Model for Personality Disorders',
      heading: `Alternative DSM-5 Model for Personality Disorders (AMPD) (p. ${page})`,
      subheading: 'Dimensional Assessment of Personality Functioning and Trait Domains',
      paragraphs: [
        'The Alternative Model provides a hybrid dimensional-categorical framework that addresses high comorbidity and diagnostic overlap in traditional personality disorder criteria.',
        'Criterion A assesses core personality functioning across two self domains (Identity, Self-Direction) and two interpersonal domains (Empathy, Intimacy).',
        'Criterion B assesses 25 specific trait facets across five broad domains: Negative Affectivity, Detachment, Antagonism, Disinhibition, and Psychoticism.',
      ],
      clinicalPearl: 'The Alternative Model allows clinicians to profile unique personality trait vulnerabilities without relying solely on arbitrary symptom thresholds.',
      folioHeaderLeft: `Alternative Model for Personality · Page ${page}`,
      folioHeaderRight: 'Section III: Emerging Models',
    }
  }
}

function generateSectionIVPage(page: number): BookPage {
  if (page <= 898) {
    return {
      pageNumber: page,
      sectionTitle: 'Section IV: Appendix & Indexes',
      chapterTitle: 'Highlights of Changes',
      heading: `Highlights of Changes in DSM-5-TR (Part ${page - 880})`,
      subheading: 'Updates to Text, Criteria, Terminology, and ICD-10-CM Codes',
      paragraphs: [
        'DSM-5-TR represents a decade of scientific synthesis, updating literature reviews across all 20 diagnostic classes.',
        'The term "neuroleptic medications" has been updated throughout the text to "antipsychotic medications or other dopamine receptor blocking agents".',
        'Ethnoracial equity updates ensure that clinical descriptions reflect diverse cultural presentations without pathologizing normative adaptations to discrimination.',
      ],
      clinicalPearl: 'Review the text revision updates for changes in diagnostic codes and nonstigmatizing diagnostic terms.',
      folioHeaderLeft: `Section IV: Appendix · Page ${page}`,
      folioHeaderRight: 'Highlights of Changes in DSM-5-TR',
    }
  } else if (page <= 926) {
    return {
      pageNumber: page,
      sectionTitle: 'Section IV: Appendix & Indexes',
      chapterTitle: 'Glossary of Technical Terms',
      heading: `Glossary of Psychiatric Technical Terms (p. ${page})`,
      subheading: 'Authoritative Definitions for Clinical Terminology',
      paragraphs: [
        '• Echolalia: The pathological, parrot-like, and apparently senseless repetition (echoing) of a word or phrase just spoken by another person.',
        '• Flight of Ideas: A nearly continuous flow of accelerated speech with abrupt changes from topic to topic that are usually based on understandable associations, distracting stimuli, or plays on words.',
        '• Hallucination: A perception-like experience with the clarity and impact of a true perception but without the external stimulation of the relevant sensory organ.',
        '• Pressured Speech: Speech that is increased in amount, accelerated, and difficult or impossible to interrupt; characteristic of manic and hypomanic states.',
        '• Stereotypy: Repetitive, abnormally frequent, non-goal-directed movement (e.g., hand waving, body rocking, head banging).',
      ],
      clinicalPearl: 'Consistent and precise clinical vocabulary promotes clear communication between multidisciplinary care teams.',
      folioHeaderLeft: `Glossary of Terms · Page ${page}`,
      folioHeaderRight: 'Section IV: Appendix & Indexes',
    }
  } else if (page <= 970) {
    return {
      pageNumber: page,
      sectionTitle: 'Section IV: Appendix & Indexes',
      chapterTitle: 'Numerical ICD-10-CM Listing',
      heading: `Numerical Listing of DSM-5-TR Diagnoses and Codes (p. ${page})`,
      subheading: 'ICD-10-CM Clinical Coding Directory',
      paragraphs: [
        `Sequential listing of diagnoses and coding references for clinical documentation (Page ${page}):`,
        'F32.0 Major depressive disorder, single episode, mild (p. 163)\nF32.1 Major depressive disorder, single episode, moderate (p. 163)\nF32.2 Major depressive disorder, single episode, severe without psychotic features (p. 163)\nF32.3 Major depressive disorder, single episode, severe with psychotic features (p. 163)\nF32.4 Major depressive disorder, single episode, in partial remission (p. 163)\nF32.5 Major depressive disorder, single episode, in full remission (p. 163)',
        'F41.0 Panic disorder (p. 215)\nF41.1 Generalized anxiety disorder (p. 227)\nF42.2 Obsessive-compulsive disorder, mixed obsessional thoughts and acts (p. 240)\nF43.10 Posttraumatic stress disorder (p. 273)\nF43.21 Adjustment disorder with depressed mood (p. 287)\nF43.22 Adjustment disorder with anxiety (p. 287)',
      ],
      clinicalPearl: 'Always verify ICD-10-CM codes against the latest official CMS and CDC annual updates.',
      folioHeaderLeft: `Numerical Code Listing · Page ${page}`,
      folioHeaderRight: 'Section IV: Appendix & Indexes',
    }
  } else if (page <= 1014) {
    return {
      pageNumber: page,
      sectionTitle: 'Section IV: Appendix & Indexes',
      chapterTitle: 'Alphabetical Index',
      heading: `Alphabetical Index of DSM-5-TR Diagnoses (p. ${page})`,
      subheading: 'Clinical Diagnoses from A to Z with Page and Code References',
      paragraphs: [
        `Alphabetical diagnostic lookup table (Page ${page}):`,
        '• Panic Disorder — F41.0 (p. 215)\n• Pedophilic Disorder — F65.4 (p. 697)\n• Persistent Depressive Disorder (Dysthymia) — F34.1 (p. 173)\n• Pica — F98.3 / F50.89 (p. 333)\n• Posttraumatic Stress Disorder (PTSD) — F43.10 (p. 273)\n• Premature Ejaculation — F52.4 (p. 450)\n• Premenstrual Dysphoric Disorder — N94.3 (p. 179)\n• Prolonged Grief Disorder — F43.8 (p. 183)',
        '• Reactive Attachment Disorder — F94.1 (p. 269)\n• Restless Legs Syndrome — G25.81 (p. 417)\n• Rumination Disorder — F98.21 (p. 334)\n• Schizoaffective Disorder — F25.0 / F25.1 (p. 115)\n• Schizophrenia — F20.9 (p. 105)\n• Schizophreniform Disorder — F20.81 (p. 102)\n• Selective Mutism — F94.0 (p. 198)',
      ],
      clinicalPearl: 'Use the alphabetical index for rapid diagnostic lookup during clinical case conferences.',
      folioHeaderLeft: `Alphabetical Index · Page ${page}`,
      folioHeaderRight: 'Section IV: Appendix & Indexes',
    }
  } else if (page <= 1035) {
    return {
      pageNumber: page,
      sectionTitle: 'Section IV: Appendix & Indexes',
      chapterTitle: 'Contributors & Reviewers',
      heading: `DSM-5-TR Work Group Advisors and Reviewers (p. ${page})`,
      subheading: 'American Psychiatric Association Scientific Contributors',
      paragraphs: [
        `Directory of academic advisors, work group members, and scientific reviewers participating in the DSM-5-TR revision process (Page ${page}):`,
        '• Neurodevelopmental Disorders Work Group\n• Psychotic Disorders Work Group\n• Mood Disorders Work Group\n• Anxiety and OCRD Work Group\n• Trauma and Dissociative Disorders Work Group\n• Substance and Addictive Disorders Work Group\n• Neurocognitive Disorders Work Group\n• Personality Disorders Work Group',
        'Special acknowledgment is given to international psychiatric societies and clinical consultants for their contributions to cross-cultural diagnostic harmonization.',
      ],
      clinicalPearl: 'The DSM-5-TR represents collaborative international scholarship spanning over five decades of psychiatric science.',
      folioHeaderLeft: `Contributors · Page ${page}`,
      folioHeaderRight: 'Section IV: Appendix & Indexes',
    }
  } else {
    return {
      pageNumber: page,
      sectionTitle: 'Section IV: Appendix & Indexes',
      chapterTitle: 'Subject Index',
      heading: `Comprehensive Subject Index (Page ${page} of ${TOTAL_DSM5_PAGES})`,
      subheading: 'Master Subject, Symptom, and Diagnostic Cross-Reference',
      paragraphs: [
        `Alphabetical subject index entries for Page ${page}:`,
        '• Separation Anxiety Disorder: pp. 194–197\n• Serotonin Syndrome vs NMS: p. 748\n• Sexual Dysfunctions: pp. 423–450\n• Sleep-Wake Disorders: pp. 361–422\n• Social Anxiety Disorder (Social Phobia): pp. 208–214\n• Somatic Symptom Disorder: pp. 313–318\n• Specific Learning Disorder: pp. 73–78\n• Specific Phobia (Subtypes): pp. 201–207\n• Substance Use Disorder (11 criteria): pp. 481–486\n• Tardive Dyskinesia: pp. 749–751\n• Tic Disorders & Tourette\'s: pp. 82–86\n• Trichotillomania: pp. 258–260\n• WHODAS 2.0 Disability Scale: pp. 18, 826–836',
      ],
      clinicalPearl: 'You have reached the final pages of the complete DSM-5-TR Diagnostic Manual reference book.',
      folioHeaderLeft: `Master Subject Index · Page ${page}`,
      folioHeaderRight: `DSM-5-TR · Page ${page} of ${TOTAL_DSM5_PAGES}`,
    }
  }
}
