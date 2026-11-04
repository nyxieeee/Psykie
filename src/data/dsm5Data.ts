// ─── DSM-5-TR Complete Diagnostic Criteria Reference ─────────────────────────
// American Psychiatric Association. (2022). Diagnostic and Statistical Manual of
// Mental Disorders (5th ed., text rev.). https://doi.org/10.1176/appi.books.9780890425787
// Comprehensive educational study manual for psychology students.

export interface DSMCriterion {
  code: string
  label: string
  note?: string
}

export interface DSMDisorder {
  id: string
  name: string
  icdCode?: string
  specifiers?: string[]
  criteriaGroups: {
    label: string
    description: string
    criteria?: DSMCriterion[]
    note?: string
  }[]
  duration?: string
  exclusions?: string[]
  clinicalNote?: string
  pageNumber?: number
}

export interface DSMChapter {
  id: string
  title: string
  color: string
  pageRange: string
  description: string
  disorders: DSMDisorder[]
}

export const DSM5_TR_CHAPTERS: DSMChapter[] = [
  // ── 1. Neurodevelopmental Disorders ──────────────────────────────────────────
  {
    id: 'neurodevelopmental',
    title: 'Neurodevelopmental Disorders',
    color: '#7c3aed',
    pageRange: 'pp. 35–98',
    description: 'Disorders with onset in the developmental period, characterized by developmental deficits that produce impairments of personal, social, academic, or occupational functioning.',
    disorders: [
      {
        id: 'adhd',
        name: 'Attention-Deficit/Hyperactivity Disorder (ADHD)',
        icdCode: 'F90.0 / F90.1 / F90.2',
        pageNumber: 68,
        specifiers: ['Predominantly Inattentive Presentation (F90.0)', 'Predominantly Hyperactive/Impulsive Presentation (F90.1)', 'Combined Presentation (F90.2)', 'In partial remission', 'Mild / Moderate / Severe'],
        criteriaGroups: [
          {
            label: 'Criterion A1 — Inattention (≥6 symptoms for ≥6 months; ≥5 for ages 17+)',
            description: 'Persistent pattern of inattention interfering with functioning or development:',
            criteria: [
              { code: 'A1a', label: 'Often fails to give close attention to details or makes careless mistakes in schoolwork, at work, or during other activities' },
              { code: 'A1b', label: 'Often has difficulty sustaining attention in tasks or play activities' },
              { code: 'A1c', label: 'Often does not seem to listen when spoken to directly' },
              { code: 'A1d', label: 'Often does not follow through on instructions and fails to finish schoolwork, chores, or duties in the workplace' },
              { code: 'A1e', label: 'Often has difficulty organizing tasks and activities' },
              { code: 'A1f', label: 'Often avoids, dislikes, or is reluctant to engage in tasks requiring sustained mental effort' },
              { code: 'A1g', label: 'Often loses things necessary for tasks or activities' },
              { code: 'A1h', label: 'Is often easily distracted by extraneous stimuli (or unrelated thoughts in adolescents/adults)' },
              { code: 'A1i', label: 'Is often forgetful in daily activities (errands, paying bills, keeping appointments)' },
            ],
          },
          {
            label: 'Criterion A2 — Hyperactivity & Impulsivity (≥6 symptoms for ≥6 months; ≥5 for ages 17+)',
            description: 'Persistent pattern of hyperactivity-impulsivity interfering with functioning:',
            criteria: [
              { code: 'A2a', label: 'Often fidgets with or taps hands or feet or squirms in seat' },
              { code: 'A2b', label: 'Often leaves seat in situations when remaining seated is expected' },
              { code: 'A2c', label: 'Often runs about or climbs in situations where it is inappropriate (in adults, may be limited to feeling restless)' },
              { code: 'A2d', label: 'Often unable to play or engage in leisure activities quietly' },
              { code: 'A2e', label: 'Is often "on the go," acting as if "driven by a motor"' },
              { code: 'A2f', label: 'Often talks excessively' },
              { code: 'A2g', label: 'Often blurts out an answer before a question has been completed' },
              { code: 'A2h', label: 'Often has difficulty waiting his or her turn' },
              { code: 'A2i', label: 'Often interrupts or intrudes on others (butts into conversations, games, or activities)' },
            ],
          },
          { label: 'Criterion B', description: 'Several inattentive or hyperactive-impulsive symptoms were present prior to age 12 years.' },
          { label: 'Criterion C', description: 'Several inattentive or hyperactive-impulsive symptoms are present in two or more settings (e.g., at home, school, work; with friends or relatives; in other activities).' },
          { label: 'Criterion D', description: 'Clear evidence that symptoms interfere with, or reduce quality of, social, academic, or occupational functioning.' },
          { label: 'Criterion E', description: 'Symptoms do not occur exclusively during schizophrenia or another psychotic disorder and are not better explained by another mental disorder.' },
        ],
        clinicalNote: 'Adult diagnostic threshold is 5 symptoms (vs. 6 in children). Stimulant medications (methylphenidate, amphetamines) and behavioral interventions are gold standard.',
      },
      {
        id: 'asd',
        name: 'Autism Spectrum Disorder (ASD)',
        icdCode: 'F84.0',
        pageNumber: 56,
        criteriaGroups: [
          {
            label: 'Criterion A — Social Communication & Interaction Deficits (All 3 required)',
            description: 'Persistent deficits across multiple contexts, currently or by history:',
            criteria: [
              { code: 'A1', label: 'Deficits in social-emotional reciprocity (ranging from abnormal social approach and failure of normal back-and-forth conversation to reduced sharing of interests/emotions)' },
              { code: 'A2', label: 'Deficits in nonverbal communicative behaviors used for social interaction (abnormalities in eye contact, body language, deficits in understanding gestures, lack of facial expressions)' },
              { code: 'A3', label: 'Deficits in developing, maintaining, and understanding relationships (adjusting behavior to social contexts, difficulties in sharing imaginative play, absence of interest in peers)' },
            ],
          },
          {
            label: 'Criterion B — Restricted, Repetitive Patterns of Behavior (≥2 required)',
            description: 'Restricted, repetitive patterns of behavior, interests, or activities, currently or by history:',
            criteria: [
              { code: 'B1', label: 'Stereotyped or repetitive motor movements, use of objects, or speech (simple motor stereotypies, lining up toys, echolalia, idiosyncratic phrases)' },
              { code: 'B2', label: 'Insistence on sameness, inflexible adherence to routines, or ritualized patterns of verbal/nonverbal behavior (extreme distress at small changes, rigid greeting rituals)' },
              { code: 'B3', label: 'Highly restricted, fixated interests that are abnormal in intensity or focus (strong attachment to unusual objects, excessively circumscribed interests)' },
              { code: 'B4', label: 'Hyper- or hyporeactivity to sensory input or unusual interest in sensory aspects of environment (apparent indifference to pain/temperature, adverse response to specific sounds/textures, visual fascination with lights/movement)' },
            ],
          },
          { label: 'Criterion C', description: 'Symptoms must be present in the early developmental period (may not fully manifest until social demands exceed capacities, or may be masked by learned strategies).' },
          { label: 'Criterion D', description: 'Symptoms cause clinically significant impairment in social, occupational, or other important areas of current functioning.' },
          { label: 'Criterion E', description: 'Not better explained by intellectual disability or global developmental delay (though intellectual disability and ASD frequently co-occur).' },
        ],
        specifiers: ['With/without accompanying intellectual impairment', 'With/without accompanying language impairment', 'Associated with known medical/genetic condition or environmental factor', 'Associated with neurodevelopmental/mental/behavioral disorder', 'With catatonia', 'Severity: Level 1 (Requiring support), Level 2 (Substantial support), Level 3 (Very substantial support)'],
      },
      {
        id: 'intellectual-disability',
        name: 'Intellectual Disability (Intellectual Developmental Disorder)',
        icdCode: 'F70–F73',
        pageNumber: 41,
        criteriaGroups: [
          { label: 'Criterion A — Intellectual Deficits', description: 'Deficits in intellectual functions, such as reasoning, problem solving, planning, abstract thinking, judgment, academic learning, and learning from experience, confirmed by both clinical assessment and individualized, standardized intelligence testing (typically IQ < 70 ± 5).' },
          { label: 'Criterion B — Adaptive Functioning Deficits', description: 'Deficits in adaptive functioning that result in failure to meet developmental and sociocultural standards for personal independence and social responsibility across conceptual, social, and practical domains.' },
          { label: 'Criterion C — Developmental Onset', description: 'Onset of intellectual and adaptive deficits during the developmental period.' },
        ],
        specifiers: ['Mild (F70)', 'Moderate (F71)', 'Severe (F72)', 'Profound (F73) — Severity is defined on the basis of adaptive functioning, NOT IQ score, because adaptive functioning determines level of supports required.'],
      },
      {
        id: 'specific-learning-disorder',
        name: 'Specific Learning Disorder',
        icdCode: 'F81.0 / F81.2 / F81.81',
        pageNumber: 74,
        criteriaGroups: [
          {
            label: 'Criterion A — Learning Difficulties (≥1 symptom for ≥6 months despite intervention)',
            description: 'Difficulties learning and using academic skills:',
            criteria: [
              { code: '1', label: 'Inaccurate or slow and effortful word reading' },
              { code: '2', label: 'Difficulty understanding the meaning of what is read' },
              { code: '3', label: 'Difficulties with spelling' },
              { code: '4', label: 'Difficulties with written expression (grammatical or punctuation errors, poor paragraph organization)' },
              { code: '5', label: 'Difficulties mastering number sense, number facts, or calculation' },
              { code: '6', label: 'Difficulties with mathematical reasoning' },
            ],
          },
          { label: 'Criterion B', description: 'Academic skills are substantially and quantifiably below those expected for chronological age, causing significant interference with academic or occupational performance.' },
          { label: 'Criterion C', description: 'Learning difficulties begin during school-age years but may not fully manifest until demands for those skills exceed capacities.' },
          { label: 'Criterion D', description: 'Not better accounted for by intellectual disabilities, uncorrected visual/auditory acuity, or inadequate educational instruction.' },
        ],
        specifiers: ['With impairment in reading (Dyslexia)', 'With impairment in written expression', 'With impairment in mathematics (Dyscalculia)', 'Severity: Mild / Moderate / Severe'],
      },
      {
        id: 'tourette-disorder',
        name: "Tourette's Disorder",
        icdCode: 'F95.2',
        pageNumber: 89,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Both multiple motor and one or more vocal tics have been present at some time during the illness, although not necessarily concurrently.' },
          { label: 'Criterion B', description: 'The tics may wax and wane in frequency but have persisted for more than 1 year since first tic onset.' },
          { label: 'Criterion C', description: 'Onset is before age 18 years.' },
          { label: 'Criterion D', description: 'The disturbance is not attributable to the physiological effects of a substance (e.g., cocaine) or another medical condition (e.g., Huntington\'s disease, postviral encephalitis).' },
        ],
        clinicalNote: 'Coprolalia (involuntary uttering of obscene words) is present in only 10–15% of Tourette\'s cases despite media depictions. High comorbidity with OCD and ADHD.',
      },
    ],
  },

  // ── 2. Schizophrenia Spectrum & Other Psychotic Disorders ────────────────────
  {
    id: 'schizophrenia-spectrum',
    title: 'Schizophrenia Spectrum & Other Psychotic Disorders',
    color: '#dc2626',
    pageRange: 'pp. 101–152',
    description: 'Disorders defined by abnormalities in one or more of five domains: delusions, hallucinations, disorganized thinking (speech), grossly disorganized or abnormal motor behavior (including catatonia), and negative symptoms.',
    disorders: [
      {
        id: 'schizophrenia',
        name: 'Schizophrenia',
        icdCode: 'F20.9',
        pageNumber: 114,
        criteriaGroups: [
          {
            label: 'Criterion A — Characteristic Active-Phase Symptoms (≥2 for ≥1 month; ≥1 must be 1, 2, or 3)',
            description: 'Two or more of the following, each present for a significant portion of time during a 1-month period:',
            criteria: [
              { code: '1', label: 'Delusions (fixed, false beliefs unamenable to change in light of conflicting evidence)' },
              { code: '2', label: 'Hallucinations (perception-like experiences that occur without an external stimulus; auditory most common)' },
              { code: '3', label: 'Disorganized speech (frequent derailment, loose associations, incoherence/word salad)' },
              { code: '4', label: 'Grossly disorganized or catatonic behavior (ranging from childlike silliness to unpredictable agitation)' },
              { code: '5', label: 'Negative symptoms (diminished emotional expression, avolition, alogia, anhedonia, asociality)' },
            ],
          },
          { label: 'Criterion B — Social/Occupational Dysfunction', description: 'For a significant portion of time since onset, level of functioning in one or more major areas (work, interpersonal relations, self-care) is markedly below baseline.' },
          { label: 'Criterion C — Duration (≥6 months)', description: 'Continuous signs of the disturbance persist for at least 6 months. Must include at least 1 month of active-phase Criterion A symptoms, and may include prodromal or residual periods.' },
          { label: 'Criterion D — Mood Exclusion', description: 'Schizoaffective disorder and depressive or bipolar disorder with psychotic features have been ruled out.' },
          { label: 'Criterion E — Substance/Medical Exclusion', description: 'Disturbance is not attributable to physiological effects of a substance (drug of abuse, medication) or another medical condition.' },
          { label: 'Criterion F — Relationship to ASD/Communication Disorders', description: 'If ASD or a communication disorder is present, diagnosis is made only if prominent delusions or hallucinations are present for ≥1 month.' },
        ],
        specifiers: ['First episode, currently in acute episode', 'First episode, currently in partial/full remission', 'Multiple episodes', 'Continuous', 'With catatonia'],
      },
      {
        id: 'schizoaffective',
        name: 'Schizoaffective Disorder',
        icdCode: 'F25.0 / F25.1',
        pageNumber: 122,
        criteriaGroups: [
          { label: 'Criterion A', description: 'An uninterrupted period of illness during which there is a major mood episode (major depressive or manic) concurrent with Criterion A of schizophrenia.' },
          { label: 'Criterion B', description: 'Delusions or hallucinations for 2 or more weeks in the absence of a major mood episode (depressive or manic) during the lifetime duration of the illness.' },
          { label: 'Criterion C', description: 'Symptoms that meet criteria for a major mood episode are present for the majority of the total duration of the active and residual portions of the illness.' },
          { label: 'Criterion D', description: 'Not attributable to the effects of a substance or another medical condition.' },
        ],
        specifiers: ['Bipolar type (manic or mixed episode; F25.0)', 'Depressive type (only major depressive episodes; F25.1)'],
      },
      {
        id: 'delusional-disorder',
        name: 'Delusional Disorder',
        icdCode: 'F22',
        pageNumber: 104,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Presence of one (or more) delusions with a duration of 1 month or longer.' },
          { label: 'Criterion B', description: 'Criterion A for schizophrenia has never been met (hallucinations, if present, are not prominent and are related to the delusional theme).' },
          { label: 'Criterion C', description: 'Apart from the impact of the delusion(s) or its ramifications, functioning is not markedly impaired, and behavior is not obviously bizarre or odd.' },
          { label: 'Criterion D', description: 'If mood episodes have occurred, their total duration has been brief relative to the duration of the delusional periods.' },
          { label: 'Criterion E', description: 'The disturbance is not attributable to a substance or medical condition and is not better explained by another mental disorder.' },
        ],
        specifiers: ['Erotomanic type', 'Grandiose type', 'Jealous type (Othello syndrome)', 'Persecutory type', 'Somatic type', 'Mixed type', 'Unspecified type', 'With bizarre content'],
      },
      {
        id: 'brief-psychotic-disorder',
        name: 'Brief Psychotic Disorder',
        icdCode: 'F23',
        pageNumber: 108,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Presence of ≥1 of: delusions, hallucinations, disorganized speech, grossly disorganized/catatonic behavior (at least one must be delusions, hallucinations, or disorganized speech).' },
          { label: 'Criterion B', description: 'Duration of an episode of the disturbance is at least 1 day but less than 1 month, with eventual full return to premorbid level of functioning.' },
          { label: 'Criterion C', description: 'Not better explained by major depressive or bipolar disorder with psychotic features, schizophrenia, or catatonia, and not due to a substance or medical condition.' },
        ],
        specifiers: ['With marked stressor(s) (brief reactive psychosis)', 'Without marked stressor(s)', 'With postpartum onset (during pregnancy or within 4 weeks postpartum)'],
      },
    ],
  },

  // ── 3. Bipolar and Related Disorders ──────────────────────────────────────────
  {
    id: 'bipolar-disorders',
    title: 'Bipolar and Related Disorders',
    color: '#d97706',
    pageRange: 'pp. 155–198',
    description: 'Separated from depressive disorders in DSM-5, positioned between schizophrenia spectrum and depressive disorders in recognition of their place as a bridge regarding symptomology, family history, and genetics.',
    disorders: [
      {
        id: 'bipolar-i',
        name: 'Bipolar I Disorder',
        icdCode: 'F31.x',
        pageNumber: 157,
        criteriaGroups: [
          {
            label: 'Manic Episode Criteria (≥1 required for lifetime diagnosis; duration ≥1 week)',
            description: 'A distinct period of abnormally and persistently elevated, expansive, or irritable mood and abnormally increased goal-directed activity or energy, lasting at least 1 week and present most of the day, nearly every day (or any duration if hospitalization is necessary):',
            criteria: [
              { code: '1', label: 'Inflated self-esteem or grandiosity' },
              { code: '2', label: 'Decreased need for sleep (feels rested after only 3 hours)' },
              { code: '3', label: 'More talkative than usual or pressure to keep talking' },
              { code: '4', label: 'Flight of ideas or subjective experience that thoughts are racing' },
              { code: '5', label: 'Distractibility (reported or observed)' },
              { code: '6', label: 'Increase in goal-directed activity (socially, work/school, sexually) or psychomotor agitation' },
              { code: '7', label: 'Excessive involvement in activities that have high potential for painful consequences (unrestrained buying sprees, sexual indiscretions, foolish business investments)' },
            ],
            note: '≥3 symptoms required (≥4 if mood is only irritable). Must cause marked impairment, necessitate hospitalization, or involve psychotic features.',
          },
          { label: 'Diagnostic Requirement', description: 'Criteria have been met for at least one manic episode. Major depressive and hypomanic episodes are common but NOT required for diagnosis.' },
        ],
        specifiers: ['Current or most recent episode: Manic / Depressed / Hypomanic / Unspecified', 'With anxious distress', 'With mixed features', 'With rapid cycling (≥4 mood episodes in 12 months)', 'With melancholic features', 'With atypical features', 'With psychotic features', 'With catatonia', 'With peripartum onset', 'With seasonal pattern'],
      },
      {
        id: 'bipolar-ii',
        name: 'Bipolar II Disorder',
        icdCode: 'F31.81',
        pageNumber: 167,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Criteria have been met for at least one hypomanic episode (≥4 consecutive days of elevated mood and ≥3 manic symptoms, without marked impairment or hospitalization) AND at least one major depressive episode (≥2 weeks).' },
          { label: 'Criterion B', description: 'There has NEVER been a manic episode in the individual\'s lifetime (the occurrence of even one manic episode changes the diagnosis to Bipolar I).' },
          { label: 'Criterion C', description: 'The occurrence of the hypomanic and major depressive episodes is not better explained by schizoaffective disorder or another psychotic disorder.' },
          { label: 'Criterion D', description: 'The symptoms of depression or the unpredictability caused by frequent alternation between periods of depression and hypomania causes clinically significant distress or impairment.' },
        ],
      },
      {
        id: 'cyclothymia',
        name: 'Cyclothymic Disorder',
        icdCode: 'F34.0',
        pageNumber: 175,
        criteriaGroups: [
          { label: 'Criterion A', description: 'For at least 2 years (at least 1 year in children/adolescents), there have been numerous periods with hypomanic symptoms that do not meet criteria for a hypomanic episode and numerous periods with depressive symptoms that do not meet criteria for a major depressive episode.' },
          { label: 'Criterion B', description: 'During the 2-year period, hypomanic and depressive periods have been present for at least half the time, and the individual has not been without symptoms for more than 2 months at a time.' },
          { label: 'Criterion C', description: 'Criteria for major depressive, manic, or hypomanic episode have never been met.' },
        ],
      },
    ],
  },

  // ── 4. Depressive Disorders ──────────────────────────────────────────────────
  {
    id: 'depressive-disorders',
    title: 'Depressive Disorders',
    color: '#2563eb',
    pageRange: 'pp. 183–232',
    description: 'The common feature of all these disorders is the presence of sad, empty, or irritable mood, accompanied by somatic and cognitive changes that significantly affect the individual\'s capacity to function.',
    disorders: [
      {
        id: 'mdd',
        name: 'Major Depressive Disorder (MDD)',
        icdCode: 'F32.x / F33.x',
        pageNumber: 187,
        criteriaGroups: [
          {
            label: 'Criterion A — Major Depressive Episode (≥5 symptoms for ≥2 weeks; ≥1 must be #1 or #2)',
            description: 'Five (or more) of the following symptoms have been present during the same 2-week period and represent a change from previous functioning:',
            criteria: [
              { code: '1', label: 'Depressed mood most of the day, nearly every day, as indicated by subjective report (e.g., feels sad, empty, hopeless) or observation by others' },
              { code: '2', label: 'Markedly diminished interest or pleasure in all, or almost all, activities most of the day, nearly every day (anhedonia)' },
              { code: '3', label: 'Significant weight loss when not dieting or weight gain (e.g., a change of >5% body weight in a month), or decrease or increase in appetite nearly every day' },
              { code: '4', label: 'Insomnia or hypersomnia nearly every day' },
              { code: '5', label: 'Psychomotor agitation or retardation nearly every day (observable by others, not merely subjective feelings)' },
              { code: '6', label: 'Fatigue or loss of energy nearly every day' },
              { code: '7', label: 'Feelings of worthlessness or excessive or inappropriate guilt (which may be delusional) nearly every day' },
              { code: '8', label: 'Diminished ability to think or concentrate, or indecisiveness, nearly every day' },
              { code: '9', label: 'Recurrent thoughts of death (not just fear of dying), recurrent suicidal ideation without a specific plan, or a suicide attempt or a specific plan' },
            ],
          },
          { label: 'Criterion B', description: 'Symptoms cause clinically significant distress or impairment in social, occupational, or other important areas of functioning.' },
          { label: 'Criterion C', description: 'Episode is not attributable to physiological effects of a substance or another medical condition.' },
          { label: 'Criterion D & E', description: 'Not better explained by schizoaffective or psychotic disorders. There has never been a manic or hypomanic episode.' },
        ],
        specifiers: ['Single episode (F32) / Recurrent (F33)', 'Mild / Moderate / Severe', 'With anxious distress', 'With mixed features', 'With melancholic features', 'With atypical features', 'With mood-congruent psychotic features', 'With mood-incongruent psychotic features', 'With catatonia', 'With peripartum onset', 'With seasonal pattern'],
      },
      {
        id: 'persistent-depressive',
        name: 'Persistent Depressive Disorder (Dysthymia)',
        icdCode: 'F34.1',
        pageNumber: 196,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Depressed mood for most of the day, for more days than not, as indicated by subjective account or observation by others, for at least 2 years (at least 1 year for children and adolescents).' },
          {
            label: 'Criterion B — Presence of ≥2 of the following while depressed:',
            description: 'Symptom requirements:',
            criteria: [
              { code: '1', label: 'Poor appetite or overeating' },
              { code: '2', label: 'Insomnia or hypersomnia' },
              { code: '3', label: 'Low energy or fatigue' },
              { code: '4', label: 'Low self-esteem' },
              { code: '5', label: 'Poor concentration or difficulty making decisions' },
              { code: '6', label: 'Feelings of hopelessness' },
            ],
          },
          { label: 'Criterion C', description: 'During the 2-year period (1 year for youth), the individual has never been without the symptoms in Criteria A and B for more than 2 months at a time.' },
        ],
      },
      {
        id: 'dmdd',
        name: 'Disruptive Mood Dysregulation Disorder (DMDD)',
        icdCode: 'F34.81',
        pageNumber: 184,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Severe recurrent temper outbursts manifested verbally (e.g., verbal rages) and/or behaviorally (e.g., physical aggression toward people or property) that are grossly out of proportion in intensity or duration to the situation or provocation.' },
          { label: 'Criterion B & C', description: 'The temper outbursts are inconsistent with developmental level and occur, on average, three or more times per week.' },
          { label: 'Criterion D', description: 'The mood between temper outbursts is persistently irritable or angry most of the day, nearly every day, and is observable by others (e.g., parents, teachers, peers).' },
          { label: 'Criterion E–G', description: 'Criteria A–D have been present for 12 or more months in at least two of three settings (home, school, with peers), and onset is before age 10 years. Diagnosis should not be made for first time before age 6 or after age 18.' },
        ],
      },
      {
        id: 'pmdd',
        name: 'Premenstrual Dysphoric Disorder (PMDD)',
        icdCode: 'F32.81',
        pageNumber: 200,
        criteriaGroups: [
          { label: 'Criterion A', description: 'In the majority of menstrual cycles, at least 5 symptoms must be present in the final week before menses onset, start to improve within a few days after onset of menses, and become minimal or absent in the week postmenses.' },
          { label: 'Criterion B (≥1 required)', description: 'Marked affective lability, marked irritability or anger, marked depressed mood/hopelessness, or marked anxiety/tension.' },
          { label: 'Criterion C (≥1 required to reach 5 total)', description: 'Decreased interest in activities, difficulty concentrating, lethargy/fatigue, change in appetite, hypersomnia/insomnia, feeling overwhelmed/out of control, physical symptoms (breast tenderness, joint pain, bloating).' },
        ],
      },
    ],
  },

  // ── 5. Anxiety Disorders ─────────────────────────────────────────────────────
  {
    id: 'anxiety-disorders',
    title: 'Anxiety Disorders',
    color: '#059669',
    pageRange: 'pp. 215–262',
    description: 'Anxiety disorders include disorders that share features of excessive fear and anxiety and related behavioral disturbances. Fear is the emotional response to real or perceived imminent threat; anxiety is anticipation of future threat.',
    disorders: [
      {
        id: 'gad',
        name: 'Generalized Anxiety Disorder (GAD)',
        icdCode: 'F41.1',
        pageNumber: 250,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Excessive anxiety and worry (apprehensive expectation), occurring more days than not for at least 6 months, about a number of events or activities (such as work or school performance).' },
          { label: 'Criterion B', description: 'The individual finds it difficult to control the worry.' },
          {
            label: 'Criterion C — Associated with ≥3 of the following (≥1 in children):',
            description: 'Present for more days than not for the past 6 months:',
            criteria: [
              { code: '1', label: 'Restlessness or feeling keyed up or on edge' },
              { code: '2', label: 'Being easily fatigued' },
              { code: '3', label: 'Difficulty concentrating or mind going blank' },
              { code: '4', label: 'Irritability' },
              { code: '5', label: 'Muscle tension' },
              { code: '6', label: 'Sleep disturbance (difficulty falling or staying asleep, or restless, unsatisfying sleep)' },
            ],
          },
          { label: 'Criterion D', description: 'Anxiety, worry, or physical symptoms cause clinically significant distress or impairment in social, occupational, or other important areas of functioning.' },
        ],
      },
      {
        id: 'panic-disorder',
        name: 'Panic Disorder',
        icdCode: 'F41.0',
        pageNumber: 236,
        criteriaGroups: [
          {
            label: 'Criterion A — Recurrent Unexpected Panic Attacks (≥4 of 13 symptoms):',
            description: 'Abrupt surge of intense fear or intense discomfort that reaches a peak within minutes:',
            criteria: [
              { code: '1', label: 'Palpitations, pounding heart, or accelerated heart rate' },
              { code: '2', label: 'Sweating' },
              { code: '3', label: 'Trembling or shaking' },
              { code: '4', label: 'Sensations of shortness of breath or smothering' },
              { code: '5', label: 'Feelings of choking' },
              { code: '6', label: 'Chest pain or discomfort' },
              { code: '7', label: 'Nausea or abdominal distress' },
              { code: '8', label: 'Feeling dizzy, unsteady, light-headed, or faint' },
              { code: '9', label: 'Chills or heat sensations' },
              { code: '10', label: 'Paresthesias (numbness or tingling sensations)' },
              { code: '11', label: 'Derealization (feelings of unreality) or depersonalization (detached from self)' },
              { code: '12', label: 'Fear of losing control or "going crazy"' },
              { code: '13', label: 'Fear of dying' },
            ],
          },
          { label: 'Criterion B', description: 'At least one attack has been followed by 1 month (or more) of persistent concern/worry about additional panic attacks or their consequences, and/or a significant maladaptive change in behavior related to the attacks.' },
        ],
      },
      {
        id: 'agoraphobia',
        name: 'Agoraphobia',
        icdCode: 'F40.00',
        pageNumber: 245,
        criteriaGroups: [
          {
            label: 'Criterion A — Marked Fear or Anxiety in ≥2 of 5 Situations:',
            description: 'Situations feared or avoided:',
            criteria: [
              { code: '1', label: 'Using public transportation (automobiles, buses, trains, ships, planes)' },
              { code: '2', label: 'Being in open spaces (parking lots, marketplaces, bridges)' },
              { code: '3', label: 'Being in enclosed places (shops, theaters, cinemas)' },
              { code: '4', label: 'Standing in line or being in a crowd' },
              { code: '5', label: 'Being outside of the home alone' },
            ],
          },
          { label: 'Criterion B', description: 'The individual fears or avoids these situations because of thoughts that escape might be difficult or help might not be available in the event of developing panic-like symptoms or other incapacitating or embarrassing symptoms.' },
          { label: 'Criterion C–E', description: 'The situations almost always provoke fear, are actively avoided or require companion, fear is out of proportion to actual danger, and typically lasts for 6 months or more.' },
        ],
      },
      {
        id: 'social-anxiety-disorder',
        name: 'Social Anxiety Disorder (Social Phobia)',
        icdCode: 'F40.10',
        pageNumber: 229,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Marked fear or anxiety about one or more social situations in which the individual is exposed to possible scrutiny by others (social interactions, being observed, performing in front of others).' },
          { label: 'Criterion B', description: 'The individual fears that he or she will act in a way or show anxiety symptoms that will be negatively evaluated (i.e., will be humiliating or embarrassing; will lead to rejection or offend others).' },
          { label: 'Criterion C–F', description: 'Social situations almost always provoke fear/anxiety, are avoided or endured with intense fear, fear is out of proportion to actual threat, and typically lasts 6 months or more.' },
        ],
        specifiers: ['Performance only (if fear is restricted to speaking or performing in public)'],
      },
      {
        id: 'specific-phobia',
        name: 'Specific Phobia',
        icdCode: 'F40.2x',
        pageNumber: 222,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Marked fear or anxiety about a specific object or situation (e.g., flying, heights, animals, receiving an injection, seeing blood).' },
          { label: 'Criterion B–E', description: 'The phobic object/situation almost always provokes immediate fear, is actively avoided, fear is out of proportion to danger, and is persistent (typically 6 months or more).' },
        ],
        specifiers: ['Animal (spiders, insects, dogs)', 'Natural environment (heights, storms, water)', 'Blood-injection-injury (needles, invasive medical procedures)', 'Situational (airplanes, elevators, enclosed places)', 'Other'],
      },
    ],
  },

  // ── 6. Obsessive-Compulsive and Related Disorders ─────────────────────────────
  {
    id: 'ocd-related',
    title: 'Obsessive-Compulsive and Related Disorders',
    color: '#db2777',
    pageRange: 'pp. 265–298',
    description: 'Characterized by obsessions (intrusive, unwanted thoughts, urges, or images) and/or compulsions (repetitive behaviors or mental acts performed to reduce anxiety or prevent a dreaded event), as well as preoccupations and body-focused repetitive behaviors.',
    disorders: [
      {
        id: 'ocd',
        name: 'Obsessive-Compulsive Disorder (OCD)',
        icdCode: 'F42.2',
        pageNumber: 267,
        criteriaGroups: [
          {
            label: 'Criterion A — Presence of Obsessions, Compulsions, or Both:',
            description: 'Definitions of core features:',
            criteria: [
              { code: 'Obsessions 1', label: 'Recurrent and persistent thoughts, urges, or images that are experienced, at some time during the disturbance, as intrusive and unwanted, and that in most individuals cause marked anxiety or distress.' },
              { code: 'Obsessions 2', label: 'The individual attempts to ignore or suppress such thoughts, urges, or images, or to neutralize them with some other thought or action (i.e., by performing a compulsion).' },
              { code: 'Compulsions 1', label: 'Repetitive behaviors (e.g., hand washing, ordering, checking) or mental acts (e.g., praying, counting, repeating words silently) that the individual feels driven to perform in response to an obsession or according to rules that must be applied rigidly.' },
              { code: 'Compulsions 2', label: 'The behaviors or mental acts are aimed at preventing or reducing anxiety or distress, or preventing some dreaded event or situation; however, these behaviors or mental acts are not connected in a realistic way or are clearly excessive.' },
            ],
          },
          { label: 'Criterion B', description: 'The obsessions or compulsions are time-consuming (e.g., take more than 1 hour per day) or cause clinically significant distress or impairment in social, occupational, or other important areas of functioning.' },
        ],
        specifiers: ['With good or fair insight', 'With poor insight', 'With absent insight/delusional beliefs', 'Tic-related (current or past history of a tic disorder)'],
      },
      {
        id: 'bdd',
        name: 'Body Dysmorphic Disorder (BDD)',
        icdCode: 'F45.22',
        pageNumber: 273,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Preoccupation with one or more perceived defects or flaws in physical appearance that are not observable or appear slight to others.' },
          { label: 'Criterion B', description: 'At some point during the course of the disorder, the individual has performed repetitive behaviors (e.g., mirror checking, excessive grooming, skin picking, reassurance seeking) or mental acts (e.g., comparing appearance with that of others) in response to appearance concerns.' },
          { label: 'Criterion C', description: 'Causes clinically significant distress or impairment.' },
        ],
        specifiers: ['With muscle dysmorphia', 'With good/fair/poor/absent insight'],
      },
      {
        id: 'hoarding',
        name: 'Hoarding Disorder',
        icdCode: 'F42.3',
        pageNumber: 279,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Persistent difficulty discarding or parting with possessions, regardless of their actual value.' },
          { label: 'Criterion B', description: 'This difficulty is due to a perceived need to save the items and to distress associated with discarding them.' },
          { label: 'Criterion C', description: 'The difficulty discarding possessions results in the accumulation of possessions that congest and clutter active living areas and substantially compromises their intended use.' },
        ],
        specifiers: ['With excessive acquisition', 'With good/fair/poor/absent insight'],
      },
      {
        id: 'trichotillomania',
        name: 'Trichotillomania (Hair-Pulling Disorder)',
        icdCode: 'F63.3',
        pageNumber: 284,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Recurrent pulling out of one\'s hair, resulting in hair loss.' },
          { label: 'Criterion B', description: 'Repeated attempts to decrease or stop hair pulling.' },
          { label: 'Criterion C', description: 'The hair pulling causes clinically significant distress or impairment in social, occupational, or other important areas of functioning.' },
        ],
      },
      {
        id: 'excoriation',
        name: 'Excoriation (Skin-Picking) Disorder',
        icdCode: 'L98.1',
        pageNumber: 288,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Recurrent skin picking resulting in skin lesions.' },
          { label: 'Criterion B', description: 'Repeated attempts to decrease or stop skin picking.' },
          { label: 'Criterion C', description: 'Causes clinically significant distress or impairment.' },
        ],
      },
    ],
  },

  // ── 7. Trauma- and Stressor-Related Disorders ────────────────────────────────
  {
    id: 'trauma-stressor',
    title: 'Trauma- and Stressor-Related Disorders',
    color: '#8b5cf6',
    pageRange: 'pp. 301–348',
    description: 'Disorders in which exposure to a traumatic or stressful event is listed explicitly as a diagnostic criterion. Includes PTSD, Acute Stress Disorder, Adjustment Disorders, and the new DSM-5-TR Prolonged Grief Disorder.',
    disorders: [
      {
        id: 'ptsd',
        name: 'Post-Traumatic Stress Disorder (PTSD)',
        icdCode: 'F43.10',
        pageNumber: 303,
        criteriaGroups: [
          { label: 'Criterion A — Trauma Exposure', description: 'Exposure to actual or threatened death, serious injury, or sexual violence by: (1) direct experience, (2) witnessing in person, (3) learning it happened to a close family member/friend, or (4) repeated/extreme exposure to aversive details (e.g., first responders).' },
          {
            label: 'Criterion B — Intrusion Symptoms (≥1 required):',
            description: 'Intrusion symptoms beginning after the traumatic event:',
            criteria: [
              { code: 'B1', label: 'Recurrent, involuntary, and intrusive distressing memories of the traumatic event' },
              { code: 'B2', label: 'Recurrent distressing dreams related to the event' },
              { code: 'B3', label: 'Dissociative reactions (e.g., flashbacks) in which the individual feels or acts as if the traumatic event were recurring' },
              { code: 'B4', label: 'Intense or prolonged psychological distress at exposure to internal or external cues that symbolize or resemble an aspect of the traumatic event' },
              { code: 'B5', label: 'Marked physiological reactions to internal or external cues that symbolize or resemble an aspect of the traumatic event' },
            ],
          },
          {
            label: 'Criterion C — Persistent Avoidance (≥1 required):',
            description: 'Avoidance of stimuli associated with the traumatic event:',
            criteria: [
              { code: 'C1', label: 'Avoidance of or efforts to avoid distressing memories, thoughts, or feelings about or closely associated with the event' },
              { code: 'C2', label: 'Avoidance of or efforts to avoid external reminders (people, places, conversations, activities, objects, situations) that arouse distressing memories' },
            ],
          },
          {
            label: 'Criterion D — Negative Alterations in Cognitions & Mood (≥2 required):',
            description: 'Worsening after the event:',
            criteria: [
              { code: 'D1', label: 'Inability to remember an important aspect of the traumatic event (dissociative amnesia)' },
              { code: 'D2', label: 'Persistent and exaggerated negative beliefs or expectations about oneself, others, or the world ("I am bad," "No one can be trusted")' },
              { code: 'D3', label: 'Persistent, distorted cognitions about cause or consequences that lead the individual to blame himself/herself or others' },
              { code: 'D4', label: 'Persistent negative emotional state (fear, horror, anger, guilt, shame)' },
              { code: 'D5', label: 'Markedly diminished interest or participation in significant activities' },
              { code: 'D6', label: 'Feelings of detachment or estrangement from others' },
              { code: 'D7', label: 'Persistent inability to experience positive emotions (happiness, satisfaction, loving feelings)' },
            ],
          },
          {
            label: 'Criterion E — Alterations in Arousal & Reactivity (≥2 required):',
            description: 'Marked arousal alterations beginning or worsening after the event:',
            criteria: [
              { code: 'E1', label: 'Irritable behavior and angry outbursts (with little or no provocation) typically expressed as verbal or physical aggression toward people or objects' },
              { code: 'E2', label: 'Reckless or self-destructive behavior' },
              { code: 'E3', label: 'Hypervigilance' },
              { code: 'E4', label: 'Exaggerated startle response' },
              { code: 'E5', label: 'Problems with concentration' },
              { code: 'E6', label: 'Sleep disturbance (difficulty falling or staying asleep, or restless sleep)' },
            ],
          },
          { label: 'Criterion F — Duration', description: 'Duration of the disturbance (Criteria B, C, D, and E) is more than 1 month.' },
        ],
        specifiers: ['With dissociative symptoms (Depersonalization or Derealization)', 'With delayed expression (if full diagnostic criteria are not met until at least 6 months after the event)'],
      },
      {
        id: 'prolonged-grief-disorder',
        name: 'Prolonged Grief Disorder (New in DSM-5-TR)',
        icdCode: 'F43.8',
        pageNumber: 326,
        criteriaGroups: [
          { label: 'Criterion A', description: 'The death, at least 12 months ago (at least 6 months for children/adolescents), of a person who was close to the bereaved individual.' },
          { label: 'Criterion B', description: 'Since the death, there is a persistent grief response characterized by one or both of: (1) intense yearning/longing for the deceased person, (2) preoccupation with thoughts or memories of the deceased person, occurring nearly every day for at least the last month.' },
          {
            label: 'Criterion C — ≥3 of the following 8 symptoms present most days:',
            description: 'Grief-related clinical symptoms:',
            criteria: [
              { code: '1', label: 'Identity disruption (feeling as though part of oneself has died) since the death' },
              { code: '2', label: 'Marked sense of disbelief about the death' },
              { code: '3', label: 'Avoidance of reminders that the person is dead' },
              { code: '4', label: 'Intense emotional pain (anger, bitterness, sorrow) related to the death' },
              { code: '5', label: 'Difficulty reintegrating into one\'s relationships and activities after the death (problems engaging with friends, pursuing interests)' },
              { code: '6', label: 'Emotional numbness (absence or marked reduction of emotional experience) as a result of the death' },
              { code: '7', label: 'Feeling that life is meaningless as a result of the death' },
              { code: '8', label: 'Intense loneliness as a result of the death' },
            ],
          },
          { label: 'Criterion D–E', description: 'Causes clinically significant distress/impairment, exceeds cultural, religious, or age-appropriate norms, and not better explained by MDD or PTSD.' },
        ],
        clinicalNote: 'Major new diagnosis added in DSM-5-TR (March 2022). It recognizes that pathological, unresolving grief is distinct from normal bereavement and depression.',
      },
      {
        id: 'acute-stress-disorder',
        name: 'Acute Stress Disorder',
        icdCode: 'F43.0',
        pageNumber: 317,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Exposure to actual or threatened death, serious injury, or sexual violation (same as PTSD Criterion A).' },
          { label: 'Criterion B', description: 'Presence of 9 (or more) of the 14 symptoms from any of the five categories: intrusion, negative mood, dissociation, avoidance, and arousal, beginning or worsening after the event.' },
          { label: 'Criterion C', description: 'Duration of the disturbance is 3 days to 1 month after trauma exposure (if symptoms persist beyond 1 month, PTSD is considered).' },
        ],
      },
      {
        id: 'adjustment-disorder',
        name: 'Adjustment Disorders',
        icdCode: 'F43.2x',
        pageNumber: 331,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Development of emotional or behavioral symptoms in response to an identifiable stressor(s) occurring within 3 months of the onset of the stressor(s).' },
          { label: 'Criterion B', description: 'Clinically significant as evidenced by: (1) marked distress out of proportion to stressor severity, and/or (2) significant impairment in social/occupational functioning.' },
          { label: 'Criterion E', description: 'Once the stressor or its consequences have terminated, symptoms do not persist for more than an additional 6 months.' },
        ],
        specifiers: ['With depressed mood (F43.21)', 'With anxiety (F43.22)', 'With mixed anxiety and depressed mood (F43.23)', 'With disturbance of conduct (F43.24)', 'With mixed disturbance of emotions and conduct (F43.25)', 'Unspecified (F43.20)'],
      },
    ],
  },

  // ── 8. Dissociative Disorders ────────────────────────────────────────────────
  {
    id: 'dissociative-disorders',
    title: 'Dissociative Disorders',
    color: '#0891b2',
    pageRange: 'pp. 351–370',
    description: 'Characterized by a disruption of and/or discontinuity in the normal integration of consciousness, memory, identity, emotion, perception, body representation, motor control, and behavior.',
    disorders: [
      {
        id: 'did',
        name: 'Dissociative Identity Disorder (DID)',
        icdCode: 'F44.81',
        pageNumber: 353,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Disruption of identity characterized by two or more distinct personality states (which may be described in some cultures as an experience of possession). Involves marked discontinuity in sense of self and sense of agency, accompanied by related alterations in affect, behavior, consciousness, memory, perception, cognition, and/or sensory-motor functioning.' },
          { label: 'Criterion B', description: 'Recurrent gaps in the recall of everyday events, important personal information, and/or traumatic events that are inconsistent with ordinary forgetting.' },
          { label: 'Criterion C–E', description: 'Causes clinically significant distress/impairment, not a normal part of accepted cultural/religious practice, and not attributable to substances (alcohol blackouts) or another medical condition (complex partial seizures).' },
        ],
      },
      {
        id: 'dissociative-amnesia',
        name: 'Dissociative Amnesia',
        icdCode: 'F44.0',
        pageNumber: 358,
        criteriaGroups: [
          { label: 'Criterion A', description: 'An inability to recall important personal/autobiographical information, usually of a traumatic or stressful nature, that is inconsistent with ordinary forgetting.' },
          { label: 'Criterion B–D', description: 'Causes clinically significant distress/impairment, not due to substance (alcohol, medication) or neurological condition (closed head injury), and not better explained by DID or PTSD.' },
        ],
        specifiers: ['With dissociative fugue (apparently purposeful travel or bewildered wandering associated with amnesia for identity or other autobiographical information)'],
      },
      {
        id: 'depersonalization-derealization',
        name: 'Depersonalization/Derealization Disorder',
        icdCode: 'F48.1',
        pageNumber: 364,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Persistent or recurrent experiences of depersonalization (unreality, detachment, or being an outside observer of one\'s thoughts, feelings, sensations, body) and/or derealization (unreality or detachment with respect to surroundings; individuals or objects experienced as unreal, dreamlike, foggy, lifeless, or visually distorted).' },
          { label: 'Criterion B', description: 'During the depersonalization or derealization experiences, reality testing remains INTACT (distinguishing it from psychosis).' },
        ],
      },
    ],
  },

  // ── 9. Somatic Symptom and Related Disorders ─────────────────────────────────
  {
    id: 'somatic-disorders',
    title: 'Somatic Symptom and Related Disorders',
    color: '#0284c7',
    pageRange: 'pp. 373–396',
    description: 'Prominence of somatic symptoms associated with significant distress and impairment. In DSM-5, the focus shifted from "medically unexplained symptoms" to excessive thoughts, feelings, and behaviors in response to symptoms.',
    disorders: [
      {
        id: 'somatic-symptom-disorder',
        name: 'Somatic Symptom Disorder',
        icdCode: 'F45.1',
        pageNumber: 375,
        criteriaGroups: [
          { label: 'Criterion A', description: 'One or more somatic symptoms that are distressing or result in significant disruption of daily life.' },
          {
            label: 'Criterion B — Excessive Thoughts, Feelings, or Behaviors (≥1 required):',
            description: 'Related to somatic symptoms or health concerns:',
            criteria: [
              { code: '1', label: 'Disproportionate and persistent thoughts about the seriousness of one\'s symptoms' },
              { code: '2', label: 'Persistently high level of anxiety about health or symptoms' },
              { code: '3', label: 'Excessive time and energy devoted to these symptoms or health concerns' },
            ],
          },
          { label: 'Criterion C', description: 'Although any one somatic symptom may not be continuously present, the state of being symptomatic is persistent (typically >6 months).' },
        ],
        specifiers: ['With predominant pain', 'Persistent', 'Mild / Moderate / Severe'],
      },
      {
        id: 'illness-anxiety',
        name: 'Illness Anxiety Disorder (Health Anxiety)',
        icdCode: 'F45.21',
        pageNumber: 381,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Preoccupation with having or acquiring a serious illness.' },
          { label: 'Criterion B', description: 'Somatic symptoms are not present or, if present, are only mild in intensity. If another medical condition is present, the preoccupation is clearly excessive.' },
          { label: 'Criterion C', description: 'High level of anxiety about health; individual is easily alarmed about personal health status.' },
          { label: 'Criterion D', description: 'Performs excessive health-related behaviors (checking body repeatedly) or exhibits maladaptive avoidance (avoids doctors, hospitals).' },
          { label: 'Criterion E', description: 'Illness preoccupation has been present for at least 6 months (though specific feared illness may change).' },
        ],
        specifiers: ['Care-seeking type', 'Care-avoidant type'],
      },
      {
        id: 'conversion-disorder',
        name: 'Conversion Disorder (Functional Neurological Symptom Disorder)',
        icdCode: 'F44.4–F44.7',
        pageNumber: 386,
        criteriaGroups: [
          { label: 'Criterion A', description: 'One or more symptoms of altered voluntary motor or sensory function (e.g., paralysis, blindness, seizures, speech difficulty).' },
          { label: 'Criterion B', description: 'Clinical findings provide evidence of incompatibility between the symptom and recognized neurological or medical conditions (e.g., Hoover\'s sign positive, non-epileptic seizures without EEG correlate).' },
          { label: 'Criterion C–D', description: 'Symptom is not better explained by another medical or mental disorder, and causes clinically significant distress or impairment.' },
        ],
      },
      {
        id: 'factitious-disorder',
        name: 'Factitious Disorder (Munchausen)',
        icdCode: 'F68.10',
        pageNumber: 391,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Falsification of physical or psychological signs or symptoms, or induction of injury or disease, associated with identified deception.' },
          { label: 'Criterion B', description: 'The individual presents himself or herself (or another person in Factitious Disorder Imposed on Another) to others as ill, impaired, or injured.' },
          { label: 'Criterion C', description: 'The deceptive behavior is evident even in the ABSENCE of obvious external rewards (distinguishing it from Malingering, where motivation is financial gain, dodging duty, or obtaining drugs).' },
        ],
        specifiers: ['Factitious Disorder Imposed on Self', 'Factitious Disorder Imposed on Another (by proxy)'],
      },
    ],
  },

  // ── 10. Feeding and Eating Disorders ─────────────────────────────────────────
  {
    id: 'eating-disorders',
    title: 'Feeding and Eating Disorders',
    color: '#be185d',
    pageRange: 'pp. 399–428',
    description: 'Characterized by a persistent disturbance of eating or eating-related behavior that results in the altered consumption or absorption of food and that significantly impairs physical health or psychosocial functioning.',
    disorders: [
      {
        id: 'anorexia-nervosa',
        name: 'Anorexia Nervosa',
        icdCode: 'F50.0x',
        pageNumber: 401,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Restriction of energy intake relative to requirements, leading to a significantly low body weight in the context of age, sex, developmental trajectory, and physical health (defined as a weight that is less than minimally normal or expected).' },
          { label: 'Criterion B', description: 'Intense fear of gaining weight or of becoming fat, or persistent behavior that interferes with weight gain, even though at a significantly low weight.' },
          { label: 'Criterion C', description: 'Disturbance in the way in which one\'s body weight or shape is experienced, undue influence of body weight or shape on self-evaluation, or persistent lack of recognition of the seriousness of the current low body weight.' },
        ],
        specifiers: ['Restricting type (F50.01)', 'Binge-eating/purging type (F50.02)', 'Severity by adult BMI: Mild (≥17), Moderate (16–16.99), Severe (15–15.99), Extreme (<15)'],
      },
      {
        id: 'bulimia-nervosa',
        name: 'Bulimia Nervosa',
        icdCode: 'F50.2',
        pageNumber: 409,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Recurrent episodes of binge eating, characterized by: (1) eating in a discrete period of time an amount definitely larger than most people would eat, and (2) a sense of lack of control over eating during the episode.' },
          { label: 'Criterion B', description: 'Recurrent inappropriate compensatory behaviors in order to prevent weight gain (self-induced vomiting; misuse of laxatives, diuretics, or other medications; fasting; excessive exercise).' },
          { label: 'Criterion C', description: 'The binge eating and inappropriate compensatory behaviors both occur, on average, at least once a week for 3 months.' },
          { label: 'Criterion D–E', description: 'Self-evaluation is unduly influenced by body shape and weight, and does not occur exclusively during episodes of anorexia nervosa.' },
        ],
        specifiers: ['Severity by compensatory behaviors/week: Mild (1–3), Moderate (4–7), Severe (8–13), Extreme (≥14)'],
      },
      {
        id: 'binge-eating-disorder',
        name: 'Binge-Eating Disorder (BED)',
        icdCode: 'F50.81',
        pageNumber: 414,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Recurrent episodes of binge eating (same definition as bulimia nervosa).' },
          {
            label: 'Criterion B — Associated with ≥3 of the following:',
            description: 'Binge characteristics:',
            criteria: [
              { code: '1', label: 'Eating much more rapidly than normal' },
              { code: '2', label: 'Eating until feeling uncomfortably full' },
              { code: '3', label: 'Eating large amounts of food when not feeling physically hungry' },
              { code: '4', label: 'Eating alone because of feeling embarrassed by how much one is eating' },
              { code: '5', label: 'Feeling disgusted with oneself, depressed, or very guilty afterward' },
            ],
          },
          { label: 'Criterion C–E', description: 'Marked distress regarding binge eating; occurs at least once a week for 3 months; NOT associated with recurrent inappropriate compensatory behaviors (unlike bulimia).' },
        ],
      },
      {
        id: 'arfid',
        name: 'Avoidant/Restrictive Food Intake Disorder (ARFID)',
        icdCode: 'F50.82',
        pageNumber: 419,
        criteriaGroups: [
          { label: 'Criterion A', description: 'An eating or feeding disturbance (e.g., apparent lack of interest in eating or food; avoidance based on sensory characteristics of food; concern about aversive consequences of eating) manifested by persistent failure to meet nutritional/energy needs, with ≥1 of: significant weight loss, nutritional deficiency, dependence on enteral feeding/supplements, marked interference with psychosocial functioning.' },
          { label: 'Criterion B', description: 'There is NO evidence of a disturbance in the way in which body weight or shape is experienced (distinguishing it from Anorexia and Bulimia).' },
        ],
      },
    ],
  },

  // ── 11. Elimination Disorders ────────────────────────────────────────────────
  {
    id: 'elimination-disorders',
    title: 'Elimination Disorders',
    color: '#047857',
    pageRange: 'pp. 431–438',
    description: 'Involve the inappropriate elimination of urine or feces and are usually first diagnosed in childhood or adolescence.',
    disorders: [
      {
        id: 'enuresis',
        name: 'Enuresis',
        icdCode: 'F98.0 / F98.1',
        pageNumber: 431,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Repeated voiding of urine into bed or clothes, whether involuntary or intentional.' },
          { label: 'Criterion B', description: 'The behavior is clinically significant as manifested by either a frequency of at least twice a week for at least 3 consecutive months or the presence of clinically significant distress or impairment.' },
          { label: 'Criterion C', description: 'Chronological age is at least 5 years (or equivalent developmental level).' },
          { label: 'Criterion D', description: 'The behavior is not attributable exclusively to the physiological effects of a substance (e.g., a diuretic, an antipsychotic medication) or another medical condition (e.g., diabetes, spina bifida, a seizure disorder).' },
        ],
        specifiers: ['Nocturnal only', 'Diurnal only', 'Nocturnal and diurnal'],
      },
      {
        id: 'encopresis',
        name: 'Encopresis',
        icdCode: 'F98.1 / R15.9',
        pageNumber: 434,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Repeated passage of feces into inappropriate places (e.g., clothing, floor), whether involuntary or intentional.' },
          { label: 'Criterion B', description: 'At least one such event occurs each month for at least 3 months.' },
          { label: 'Criterion C', description: 'Chronological age is at least 4 years (or equivalent developmental level).' },
          { label: 'Criterion D', description: 'Not attributable to a substance (laxatives) or another medical condition except through a mechanism involving constipation.' },
        ],
        specifiers: ['With constipation and overflow incontinence', 'Without constipation and overflow incontinence'],
      },
    ],
  },

  // ── 12. Sleep-Wake Disorders ─────────────────────────────────────────────────
  {
    id: 'sleep-wake-disorders',
    title: 'Sleep-Wake Disorders',
    color: '#1e3a8a',
    pageRange: 'pp. 441–508',
    description: 'Comprise 10 disorders or disorder groups that present with complaints of dissatisfaction regarding the quality, timing, and amount of sleep, resulting in daytime distress and impairment.',
    disorders: [
      {
        id: 'insomnia-disorder',
        name: 'Insomnia Disorder',
        icdCode: 'G47.00',
        pageNumber: 443,
        criteriaGroups: [
          { label: 'Criterion A', description: 'A predominant complaint of dissatisfaction with sleep quantity or quality, associated with ≥1 of: (1) difficulty initiating sleep, (2) difficulty maintaining sleep (frequent awakenings or problems returning to sleep), (3) early-morning awakening with inability to return to sleep.' },
          { label: 'Criterion B–C', description: 'Causes clinically significant distress or daytime impairment (fatigue, daytime sleepiness, mood disturbance, cognitive impairment).' },
          { label: 'Criterion D–E', description: 'Occurs at least 3 nights per week, is present for at least 3 months, and occurs despite adequate opportunity for sleep.' },
        ],
      },
      {
        id: 'narcolepsy',
        name: 'Narcolepsy',
        icdCode: 'G47.41x',
        pageNumber: 454,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Recurrent periods of an irrepressible need to sleep, lapsing into sleep, or napping occurring within the same day, occurring at least three times per week over the past 3 months.' },
          { label: 'Criterion B (≥1 required)', description: '(1) Cataplexy (sudden bilateral loss of muscle tone triggered by laughter or joking); (2) Hypocretin/orexin deficiency in cerebrospinal fluid; (3) Nocturnal sleep polysomnography showing REM latency ≤15 minutes or multiple sleep latency test showing sleep latency ≤8 min and ≥2 sleep-onset REM periods.' },
        ],
      },
      {
        id: 'nightmare-disorder',
        name: 'Nightmare Disorder',
        icdCode: 'F51.5',
        pageNumber: 494,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Repeated occurrences of extended, extremely dysphoric, and well-remembered dreams that usually involve efforts to avoid threats to survival, security, or physical integrity, occurring generally during the second half of the sleep episode.' },
          { label: 'Criterion B', description: 'On awakening from the dream, the individual rapidly becomes oriented and alert.' },
        ],
      },
    ],
  },

  // ── 13. Sexual Dysfunctions ──────────────────────────────────────────────────
  {
    id: 'sexual-dysfunctions',
    title: 'Sexual Dysfunctions',
    color: '#e11d48',
    pageRange: 'pp. 511–544',
    description: 'Heterogeneous group of disorders typically characterized by a clinically significant disturbance in a person\'s ability to respond sexually or to experience sexual pleasure.',
    disorders: [
      {
        id: 'erectile-disorder',
        name: 'Erectile Disorder',
        icdCode: 'F52.21',
        pageNumber: 516,
        criteriaGroups: [
          { label: 'Criterion A (≥1 on almost all [75%–100%] sexual occasions for ≥6 months)', description: '(1) Marked difficulty in obtaining an erection during sexual activity; (2) Marked difficulty in maintaining an erection until completion; (3) Marked decrease in erectile rigidity.' },
          { label: 'Criterion B–C', description: 'Causes clinically significant distress, and not better explained by a nonsexual mental disorder, severe relationship distress, or effects of substance/medication/medical condition.' },
        ],
      },
      {
        id: 'female-orgasmic-disorder',
        name: 'Female Orgasmic Disorder',
        icdCode: 'F52.31',
        pageNumber: 522,
        criteriaGroups: [
          { label: 'Criterion A (≥6 months)', description: 'Marked delay in, marked infrequency of, or absence of orgasm; or markedly reduced intensity of orgasmic sensations on almost all sexual activity occasions.' },
        ],
      },
      {
        id: 'premature-ejaculation',
        name: 'Premature (Early) Ejaculation',
        icdCode: 'F52.4',
        pageNumber: 538,
        criteriaGroups: [
          { label: 'Criterion A', description: 'A persistent or recurrent pattern of ejaculation occurring during partnered sexual activity within approximately 1 minute following vaginal penetration and before the individual wishes it, for at least 6 months on 75%–100% of occasions.' },
        ],
      },
    ],
  },

  // ── 14. Gender Dysphoria ─────────────────────────────────────────────────────
  {
    id: 'gender-dysphoria',
    title: 'Gender Dysphoria',
    color: '#06b6d4',
    pageRange: 'pp. 547–562',
    description: 'Refers to the distress that may accompany the incongruence between one\'s experienced or expressed gender and one\'s assigned gender.',
    disorders: [
      {
        id: 'gender-dysphoria-adolescents-adults',
        name: 'Gender Dysphoria in Adolescents and Adults',
        icdCode: 'F64.0',
        pageNumber: 552,
        criteriaGroups: [
          {
            label: 'Criterion A — Marked Incongruence (≥6 months, manifested by ≥2 of 6):',
            description: 'Incongruence between experienced/expressed gender and assigned gender:',
            criteria: [
              { code: '1', label: 'A marked incongruence between one\'s experienced/expressed gender and primary and/or secondary sex characteristics' },
              { code: '2', label: 'A strong desire to be rid of one\'s primary and/or secondary sex characteristics because of a marked incongruence' },
              { code: '3', label: 'A strong desire for the primary and/or secondary sex characteristics of the other gender' },
              { code: '4', label: 'A strong desire to be of the other gender (or some alternative gender different from one\'s assigned gender)' },
              { code: '5', label: 'A strong desire to be treated as the other gender' },
              { code: '6', label: 'A strong conviction that one has the typical feelings and reactions of the other gender' },
            ],
          },
          { label: 'Criterion B', description: 'The condition is associated with clinically significant distress or impairment in social, occupational, or other important areas of functioning.' },
        ],
        specifiers: ['With a disorder of sex development', 'Post-transition (individual has transitioned to full-time living in the desired gender)'],
      },
    ],
  },

  // ── 15. Disruptive, Impulse-Control, and Conduct Disorders ───────────────────
  {
    id: 'disruptive-conduct',
    title: 'Disruptive, Impulse-Control, and Conduct Disorders',
    color: '#ea580c',
    pageRange: 'pp. 565–590',
    description: 'Conditions involving problems in the self-control of emotions and behaviors, characterized by behaviors that violate the rights of others or bring the individual into significant conflict with societal norms or authority figures.',
    disorders: [
      {
        id: 'odd',
        name: 'Oppositional Defiant Disorder (ODD)',
        icdCode: 'F91.3',
        pageNumber: 566,
        criteriaGroups: [
          {
            label: 'Criterion A — Pattern of Angry/Irritable Mood, Argumentative/Defiant Behavior, or Vindictiveness (≥4 symptoms for ≥6 months):',
            description: 'Exhibited during interaction with at least one individual who is not a sibling:',
            criteria: [
              { code: 'Angry 1', label: 'Often loses temper' },
              { code: 'Angry 2', label: 'Is often touchy or easily annoyed' },
              { code: 'Angry 3', label: 'Is often angry and resentful' },
              { code: 'Defiant 4', label: 'Often argues with authority figures or, for children/adolescents, with adults' },
              { code: 'Defiant 5', label: 'Often actively defies or refuses to comply with requests from authority figures or with rules' },
              { code: 'Defiant 6', label: 'Often deliberately annoys others' },
              { code: 'Defiant 7', label: 'Often blames others for his or her mistakes or misbehavior' },
              { code: 'Vindictive 8', label: 'Has been spiteful or vindictive at least twice within the past 6 months' },
            ],
          },
          { label: 'Criterion B', description: 'The disturbance in behavior is associated with distress in the individual or others in immediate social context, or impacts negatively on social, educational, occupational areas.' },
        ],
        specifiers: ['Mild (confined to 1 setting)', 'Moderate (present in ≥2 settings)', 'Severe (present in ≥3 settings)'],
      },
      {
        id: 'conduct-disorder',
        name: 'Conduct Disorder',
        icdCode: 'F91.1 / F91.2 / F91.9',
        pageNumber: 574,
        criteriaGroups: [
          {
            label: 'Criterion A — Repetitive Pattern Violating Rights of Others or Societal Norms (≥3 of 15 in past 12 months, ≥1 in past 6 months):',
            description: 'Categories of behavior:',
            criteria: [
              { code: 'Aggression 1', label: 'Often bullies, threatens, or intimidates others' },
              { code: 'Aggression 2', label: 'Often initiates physical fights' },
              { code: 'Aggression 3', label: 'Has used a weapon that can cause serious physical harm (bat, brick, broken bottle, knife, gun)' },
              { code: 'Aggression 4', label: 'Has been physically cruel to people' },
              { code: 'Aggression 5', label: 'Has been physically cruel to animals' },
              { code: 'Aggression 6', label: 'Has stolen while confronting a victim (mugging, purse snatching, extortion, armed robbery)' },
              { code: 'Aggression 7', label: 'Has forced someone into sexual activity' },
              { code: 'Property 8', label: 'Has deliberately engaged in fire setting with intention of causing serious damage' },
              { code: 'Property 9', label: 'Has deliberately destroyed others\' property (other than by fire setting)' },
              { code: 'Deceit 10', label: 'Has broken into someone else\'s house, building, or car' },
              { code: 'Deceit 11', label: 'Often lies to obtain goods or favors or to avoid obligations ("cons" others)' },
              { code: 'Deceit 12', label: 'Has stolen items of nontrivial value without confronting a victim (shoplifting, forgery)' },
              { code: 'Rule Violations 13', label: 'Often stays out at night despite parental prohibitions, beginning before age 13 years' },
              { code: 'Rule Violations 14', label: 'Has run away from home overnight at least twice while living in parental home' },
              { code: 'Rule Violations 15', label: 'Is often truant from school, beginning before age 13 years' },
            ],
          },
        ],
        specifiers: ['Childhood-onset type (≥1 symptom before age 10; F91.1)', 'Adolescent-onset type (no symptoms before age 10; F91.2)', 'With limited prosocial emotions (callous-unemotional traits: lack of remorse, callous/lack of empathy, unconcerned about performance, shallow affect)'],
      },
      {
        id: 'intermittent-explosive-disorder',
        name: 'Intermittent Explosive Disorder (IED)',
        icdCode: 'F63.81',
        pageNumber: 570,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Recurrent behavioral outbursts representing a failure to control aggressive impulses, as manifested by either: (1) Verbal or physical aggression occurring twice weekly for 3 months (not resulting in damage/injury); or (2) Three behavioral outbursts involving damage/injury occurring within a 12-month period.' },
          { label: 'Criterion B', description: 'The magnitude of aggressiveness expressed is grossly out of proportion to provocation or precipitating psychosocial stressors.' },
          { label: 'Criterion C', description: 'The recurrent aggressive outbursts are NOT premeditated and are not committed to achieve some tangible objective.' },
        ],
      },
    ],
  },

  // ── 16. Substance-Related and Addictive Disorders ─────────────────────────────
  {
    id: 'substance-addictive',
    title: 'Substance-Related and Addictive Disorders',
    color: '#16a34a',
    pageRange: 'pp. 593–690',
    description: 'Encompasses 10 separate classes of drugs plus Gambling Disorder (the sole non-substance behavioral addiction). All drugs taken in excess directly activate the brain reward system.',
    disorders: [
      {
        id: 'substance-use-disorder',
        name: 'Substance Use Disorder (11 Diagnostic Criteria, 12-Month Period)',
        icdCode: 'F10–F19',
        pageNumber: 595,
        criteriaGroups: [
          {
            label: '11 DSM-5 Criteria (Impaired Control, Social Impairment, Risky Use, Pharmacological):',
            description: 'Problematic pattern leading to clinically significant impairment or distress:',
            criteria: [
              { code: '1 (Control)', label: 'Substance is taken in larger amounts or over a longer period than intended' },
              { code: '2 (Control)', label: 'Persistent desire or unsuccessful efforts to cut down or control use' },
              { code: '3 (Control)', label: 'Great deal of time spent in activities necessary to obtain, use, or recover from substance' },
              { code: '4 (Control)', label: 'Craving, or a strong desire or urge to use the substance' },
              { code: '5 (Social)', label: 'Recurrent use resulting in failure to fulfill major role obligations at work, school, or home' },
              { code: '6 (Social)', label: 'Continued use despite persistent or recurrent social/interpersonal problems caused by use' },
              { code: '7 (Social)', label: 'Important social, occupational, or recreational activities given up or reduced because of use' },
              { code: '8 (Risky)', label: 'Recurrent substance use in situations in which it is physically hazardous (e.g., driving)' },
              { code: '9 (Risky)', label: 'Use continued despite knowledge of having a persistent physical or psychological problem likely caused or exacerbated by the substance' },
              { code: '10 (Pharm)', label: 'Tolerance: (a) need for markedly increased amounts to achieve intoxication, or (b) markedly diminished effect with continued use of same amount' },
              { code: '11 (Pharm)', label: 'Withdrawal: (a) characteristic withdrawal syndrome, or (b) substance taken to relieve or avoid withdrawal symptoms' },
            ],
            note: 'Severity: Mild (2–3 criteria), Moderate (4–5 criteria), Severe (≥6 criteria).',
          },
        ],
        specifiers: ['In early remission (≥3 but <12 months without criteria)', 'In sustained remission (≥12 months)', 'In a controlled environment', 'On maintenance therapy'],
      },
      {
        id: 'gambling-disorder',
        name: 'Gambling Disorder (Behavioral Addiction)',
        icdCode: 'F63.0',
        pageNumber: 686,
        criteriaGroups: [
          {
            label: 'Diagnostic Criteria (≥4 of 9 in a 12-month period):',
            description: 'Persistent and recurrent problematic gambling behavior:',
            criteria: [
              { code: '1', label: 'Needs to gamble with increasing amounts of money to achieve desired excitement' },
              { code: '2', label: 'Is restless or irritable when attempting to cut down or stop gambling' },
              { code: '3', label: 'Has made repeated unsuccessful efforts to control, cut back, or stop gambling' },
              { code: '4', label: 'Is often preoccupied with gambling (reliving past experiences, handicapping, planning)' },
              { code: '5', label: 'Often gambles when feeling distressed (helpless, guilty, anxious, depressed)' },
              { code: '6', label: 'After losing money gambling, often returns another day to get even ("chasing" losses)' },
              { code: '7', label: 'Lies to conceal the extent of involvement with gambling' },
              { code: '8', label: 'Has jeopardized or lost a significant relationship, job, or educational/career opportunity' },
              { code: '9', label: 'Relies on others to provide money to relieve desperate financial situations caused by gambling' },
            ],
          },
        ],
      },
    ],
  },

  // ── 17. Neurocognitive Disorders ─────────────────────────────────────────────
  {
    id: 'neurocognitive-disorders',
    title: 'Neurocognitive Disorders (NCD)',
    color: '#334155',
    pageRange: 'pp. 693–760',
    description: 'Disorders in which the primary clinical deficit is in cognitive function, and that are acquired rather than developmental. Six cognitive domains: complex attention, executive function, learning and memory, language, perceptual-motor, social cognition.',
    disorders: [
      {
        id: 'delirium',
        name: 'Delirium',
        icdCode: 'F05',
        pageNumber: 695,
        criteriaGroups: [
          { label: 'Criterion A', description: 'A disturbance in attention (reduced ability to direct, focus, sustain, and shift attention) and awareness (reduced orientation to the environment).' },
          { label: 'Criterion B', description: 'The disturbance develops over a short period of time (usually hours to a few days), represents a change from baseline attention and awareness, and tends to fluctuate in severity during the course of a day.' },
          { label: 'Criterion C', description: 'An additional disturbance in cognition (memory deficit, disorientation, language, visuospatial ability, or perception).' },
          { label: 'Criterion D–E', description: 'Not better explained by an established neurocognitive disorder, and evidence that disturbance is a direct physiological consequence of another medical condition, substance intoxication/withdrawal, or toxin exposure.' },
        ],
        specifiers: ['Hyperactive', 'Hypoactive', 'Mixed'],
      },
      {
        id: 'major-ncd',
        name: 'Major Neurocognitive Disorder (Dementia)',
        icdCode: 'F01 / F02 / G30',
        pageNumber: 701,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Evidence of significant cognitive decline from a previous level of performance in one or more cognitive domains (complex attention, executive function, learning and memory, language, perceptual-motor, or social cognition) based on: (1) concern of individual, informant, or clinician, and (2) substantial impairment in cognitive performance (typically >2 standard deviations below mean).' },
          { label: 'Criterion B', description: 'The cognitive deficits INTERFERE with independence in everyday activities (at a minimum, requiring assistance with complex instrumental activities of daily living such as paying bills or managing medications).' },
          { label: 'Criterion C–D', description: 'Cognitive deficits do not occur exclusively in context of delirium and are not better explained by another mental disorder (e.g., MDD, schizophrenia).' },
        ],
        specifiers: ['Due to Alzheimer\'s disease', 'Frontotemporal NCD', 'With Lewy bodies', 'Vascular NCD', 'Due to TBI', 'Substance/medication-induced', 'Due to HIV infection', 'Due to Prion disease', 'Due to Parkinson\'s disease', 'Due to Huntington\'s disease'],
      },
      {
        id: 'mild-ncd',
        name: 'Mild Neurocognitive Disorder (Mild Cognitive Impairment / MCI)',
        icdCode: 'G31.84',
        pageNumber: 704,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Evidence of modest cognitive decline from a previous level of performance in one or more cognitive domains (typically 1 to 2 standard deviations below mean).' },
          { label: 'Criterion B', description: 'The cognitive deficits DO NOT interfere with capacity for independence in everyday activities (complex instrumental activities of daily living are preserved, but greater effort, compensatory strategies, or accommodation may be required).' },
        ],
      },
    ],
  },

  // ── 18. Personality Disorders ────────────────────────────────────────────────
  {
    id: 'personality-disorders',
    title: 'Personality Disorders (Clusters A, B, and C)',
    color: '#b45309',
    pageRange: 'pp. 763–814',
    description: 'An enduring pattern of inner experience and behavior that deviates markedly from the expectations of the individual\'s culture, is pervasive and inflexible, has an onset in adolescence or early adulthood, is stable over time, and leads to distress or impairment.',
    disorders: [
      // Cluster A: Odd / Eccentric
      {
        id: 'paranoid-pd',
        name: 'Paranoid Personality Disorder (Cluster A)',
        icdCode: 'F60.0',
        pageNumber: 767,
        criteriaGroups: [
          {
            label: 'Diagnostic Criteria (≥4 of 7, pervasive distrust and suspiciousness):',
            description: 'Beginning by early adulthood:',
            criteria: [
              { code: '1', label: 'Suspects, without sufficient basis, that others are exploiting, harming, or deceiving him or her' },
              { code: '2', label: 'Is preoccupied with unjustified doubts about the loyalty or trustworthiness of friends or associates' },
              { code: '3', label: 'Is reluctant to confide in others because of unwarranted fear that information will be used maliciously against him/her' },
              { code: '4', label: 'Reads hidden demeaning or threatening meanings into benign remarks or events' },
              { code: '5', label: 'Persistently bears grudges (i.e., is unforgiving of insults, injuries, or slights)' },
              { code: '6', label: 'Perceives attacks on character/reputation that are not apparent to others and is quick to react angrily or to counterattack' },
              { code: '7', label: 'Has recurrent suspicions, without justification, regarding fidelity of spouse or sexual partner' },
            ],
          },
        ],
      },
      {
        id: 'schizoid-pd',
        name: 'Schizoid Personality Disorder (Cluster A)',
        icdCode: 'F60.1',
        pageNumber: 770,
        criteriaGroups: [
          {
            label: 'Diagnostic Criteria (≥4 of 7, detachment from social relationships, restricted emotional expression):',
            description: 'Beginning by early adulthood:',
            criteria: [
              { code: '1', label: 'Neither desires nor enjoys close relationships, including being part of a family' },
              { code: '2', label: 'Almost always chooses solitary activities' },
              { code: '3', label: 'Has little, if any, interest in having sexual experiences with another person' },
              { code: '4', label: 'Takes pleasure in few, if any, activities' },
              { code: '5', label: 'Lacks close friends or confidants other than first-degree relatives' },
              { code: '6', label: 'Appears indifferent to the praise or criticism of others' },
              { code: '7', label: 'Shows emotional coldness, detachment, or flattened affectivity' },
            ],
          },
        ],
      },
      {
        id: 'schizotypal-pd',
        name: 'Schizotypal Personality Disorder (Cluster A)',
        icdCode: 'F21',
        pageNumber: 773,
        criteriaGroups: [
          {
            label: 'Diagnostic Criteria (≥5 of 9, acute discomfort with relationships, cognitive/perceptual distortions, eccentricities):',
            description: 'Beginning by early adulthood:',
            criteria: [
              { code: '1', label: 'Ideas of reference (excluding delusions of reference)' },
              { code: '2', label: 'Odd beliefs or magical thinking that influences behavior and is inconsistent with subcultural norms (superstitiousness, clairvoyance, telepathy)' },
              { code: '3', label: 'Unusual perceptual experiences, including bodily illusions' },
              { code: '4', label: 'Odd thinking and speech (vague, circumstantial, metaphorical, overelaborate, or stereotyped)' },
              { code: '5', label: 'Suspiciousness or paranoid ideation' },
              { code: '6', label: 'Inappropriate or constricted affect' },
              { code: '7', label: 'Behavior or appearance that is odd, eccentric, or peculiar' },
              { code: '8', label: 'Lack of close friends or confidants other than first-degree relatives' },
              { code: '9', label: 'Excessive social anxiety that does not diminish with familiarity and tends to be associated with paranoid fears rather than negative self-judgments' },
            ],
          },
        ],
      },

      // Cluster B: Dramatic / Emotional / Erratic
      {
        id: 'bpd',
        name: 'Borderline Personality Disorder (Cluster B)',
        icdCode: 'F60.3',
        pageNumber: 780,
        criteriaGroups: [
          {
            label: 'Diagnostic Criteria (≥5 of 9, instability of relationships, self-image, affects, and marked impulsivity):',
            description: 'Beginning by early adulthood across multiple contexts:',
            criteria: [
              { code: '1', label: 'Frantic efforts to avoid real or imagined abandonment' },
              { code: '2', label: 'Pattern of unstable and intense interpersonal relationships characterized by alternating between extremes of idealization and devaluation (splitting)' },
              { code: '3', label: 'Identity disturbance: markedly and persistently unstable self-image or sense of self' },
              { code: '4', label: 'Impulsivity in at least two areas that are potentially self-damaging (spending, sex, substance abuse, reckless driving, binge eating)' },
              { code: '5', label: 'Recurrent suicidal behavior, gestures, or threats, or self-mutilating behavior' },
              { code: '6', label: 'Affective instability due to a marked reactivity of mood (intense episodic dysphoria, irritability, or anxiety usually lasting a few hours)' },
              { code: '7', label: 'Chronic feelings of emptiness' },
              { code: '8', label: 'Inappropriate, intense anger or difficulty controlling anger (frequent displays of temper, constant anger, recurrent physical fights)' },
              { code: '9', label: 'Transient, stress-related paranoid ideation or severe dissociative symptoms' },
            ],
          },
        ],
        clinicalNote: 'First-line therapy: Dialectical Behavior Therapy (DBT). Mnemonic: DESPAIR (Disturbance of identity, Emotion dysregulation, Suicidal/self-harm, Paranoid/dissociative, Abandonment, Impulsivity, Relationships unstable).',
      },
      {
        id: 'aspd',
        name: 'Antisocial Personality Disorder (Cluster B)',
        icdCode: 'F60.2',
        pageNumber: 776,
        criteriaGroups: [
          {
            label: 'Criterion A (≥3 of 7, disregard for and violation of rights of others since age 15):',
            description: 'Pervasive pattern:',
            criteria: [
              { code: '1', label: 'Failure to conform to social norms with respect to lawful behaviors (repeatedly performing acts that are grounds for arrest)' },
              { code: '2', label: 'Deceitfulness, as indicated by repeated lying, use of aliases, or conning others for personal profit or pleasure' },
              { code: '3', label: 'Impulsivity or failure to plan ahead' },
              { code: '4', label: 'Irritability and aggressiveness, as indicated by repeated physical fights or assaults' },
              { code: '5', label: 'Reckless disregard for safety of self or others' },
              { code: '6', label: 'Consistent irresponsibility, as indicated by repeated failure to sustain consistent work behavior or honor financial obligations' },
              { code: '7', label: 'Lack of remorse, as indicated by being indifferent to or rationalizing having hurt, mistreated, or stolen from another' },
            ],
          },
          { label: 'Criterion B & C', description: 'The individual is at least age 18 years, and there is evidence of Conduct Disorder with onset before age 15 years.' },
        ],
      },
      {
        id: 'npd',
        name: 'Narcissistic Personality Disorder (Cluster B)',
        icdCode: 'F60.81',
        pageNumber: 789,
        criteriaGroups: [
          {
            label: 'Diagnostic Criteria (≥5 of 9, grandiosity, need for admiration, lack of empathy):',
            description: 'Beginning by early adulthood:',
            criteria: [
              { code: '1', label: 'Has a grandiose sense of self-importance (exaggerates achievements and talents, expects to be recognized as superior without commensurate achievements)' },
              { code: '2', label: 'Is preoccupied with fantasies of unlimited success, power, brilliance, beauty, or ideal love' },
              { code: '3', label: 'Believes that he or she is "special" and unique and can only be understood by other special or high-status people' },
              { code: '4', label: 'Requires excessive admiration' },
              { code: '5', label: 'Has a sense of entitlement (unreasonable expectations of especially favorable treatment or automatic compliance)' },
              { code: '6', label: 'Is interpersonally exploitative (takes advantage of others to achieve his or her own ends)' },
              { code: '7', label: 'Lacks empathy: is unwilling to recognize or identify with the feelings and needs of others' },
              { code: '8', label: 'Is often envious of others or believes that others are envious of him or her' },
              { code: '9', label: 'Shows arrogant, haughty behaviors or attitudes' },
            ],
          },
        ],
      },
      {
        id: 'histrionic-pd',
        name: 'Histrionic Personality Disorder (Cluster B)',
        icdCode: 'F60.4',
        pageNumber: 785,
        criteriaGroups: [
          {
            label: 'Diagnostic Criteria (≥5 of 8, excessive emotionality and attention seeking):',
            description: 'Beginning by early adulthood:',
            criteria: [
              { code: '1', label: 'Is uncomfortable in situations in which he or she is not the center of attention' },
              { code: '2', label: 'Interaction with others is often characterized by inappropriate sexually seductive or provocative behavior' },
              { code: '3', label: 'Displays rapidly shifting and shallow expression of emotions' },
              { code: '4', label: 'Consistently uses physical appearance to draw attention to self' },
              { code: '5', label: 'Has a style of speech that is excessively impressionistic and lacking in detail' },
              { code: '6', label: 'Shows self-dramatization, theatricality, and exaggerated expression of emotion' },
              { code: '7', label: 'Is suggestible (i.e., easily influenced by others or circumstances)' },
              { code: '8', label: 'Considers relationships to be more intimate than they actually are' },
            ],
          },
        ],
      },

      // Cluster C: Anxious / Fearful
      {
        id: 'avoidant-pd',
        name: 'Avoidant Personality Disorder (Cluster C)',
        icdCode: 'F60.6',
        pageNumber: 793,
        criteriaGroups: [
          {
            label: 'Diagnostic Criteria (≥4 of 7, social inhibition, feelings of inadequacy, hypersensitivity to criticism):',
            description: 'Beginning by early adulthood:',
            criteria: [
              { code: '1', label: 'Avoids occupational activities that involve significant interpersonal contact because of fears of criticism, disapproval, or rejection' },
              { code: '2', label: 'Is unwilling to get involved with people unless certain of being liked' },
              { code: '3', label: 'Shows restraint within intimate relationships because of the fear of being shamed or ridiculed' },
              { code: '4', label: 'Is preoccupied with being criticized or rejected in social situations' },
              { code: '5', label: 'Is inhibited in new interpersonal situations because of feelings of inadequacy' },
              { code: '6', label: 'Views self as socially inept, personally unappealing, or inferior to others' },
              { code: '7', label: 'Is unusually reluctant to take personal risks or to engage in any new activities because they may prove embarrassing' },
            ],
          },
        ],
      },
      {
        id: 'dependent-pd',
        name: 'Dependent Personality Disorder (Cluster C)',
        icdCode: 'F60.7',
        pageNumber: 797,
        criteriaGroups: [
          {
            label: 'Diagnostic Criteria (≥5 of 8, excessive need to be taken care of leading to submissive, clinging behavior):',
            description: 'Beginning by early adulthood:',
            criteria: [
              { code: '1', label: 'Has difficulty making everyday decisions without an excessive amount of advice and reassurance from others' },
              { code: '2', label: 'Needs others to assume responsibility for most major areas of his or her life' },
              { code: '3', label: 'Has difficulty expressing disagreement with others because of fear of loss of support or approval' },
              { code: '4', label: 'Has difficulty initiating projects or doing things on his or her own (because of lack of self-confidence)' },
              { code: '5', label: 'Goes to excessive lengths to obtain nurturance and support from others, to the point of volunteering for unpleasant tasks' },
              { code: '6', label: 'Feels uncomfortable or helpless when alone because of exaggerated fears of being unable to care for himself or herself' },
              { code: '7', label: 'Urgently seeks another relationship as a source of care and support when a close relationship ends' },
              { code: '8', label: 'Is unrealistically preoccupied with fears of being left to take care of himself or herself' },
            ],
          },
        ],
      },
      {
        id: 'ocpd',
        name: 'Obsessive-Compulsive Personality Disorder (OCPD - Cluster C)',
        icdCode: 'F60.5',
        pageNumber: 801,
        criteriaGroups: [
          {
            label: 'Diagnostic Criteria (≥4 of 8, preoccupation with orderliness, perfectionism, control):',
            description: 'At expense of flexibility, openness, and efficiency, beginning by early adulthood:',
            criteria: [
              { code: '1', label: 'Is preoccupied with details, rules, lists, order, organization, or schedules to the extent that the major point of the activity is lost' },
              { code: '2', label: 'Shows perfectionism that interferes with task completion (e.g., unable to complete a project because overly strict standards are not met)' },
              { code: '3', label: 'Is excessively devoted to work and productivity to the exclusion of leisure activities and friendships (not accounted for by financial necessity)' },
              { code: '4', label: 'Is overconscientious, scrupulous, and inflexible about matters of morality, ethics, or values' },
              { code: '5', label: 'Is unable to discard worn-out or worthless objects even when they have no sentimental value' },
              { code: '6', label: 'Is reluctant to delegate tasks or to work with others unless they submit to exactly his or her way of doing things' },
              { code: '7', label: 'Adopts a miserly spending style toward both self and others; money is viewed as something to be hoarded for future catastrophes' },
              { code: '8', label: 'Shows rigidity and stubbornness' },
            ],
          },
        ],
        clinicalNote: 'Crucial distinction: OCD involves unwanted intrusive obsessions & compulsions (ego-dystonic); OCPD is an enduring pervasive personality style of perfectionism and control (ego-syntonic).',
      },
    ],
  },

  // ── 19. Paraphilic Disorders ─────────────────────────────────────────────────
  {
    id: 'paraphilic-disorders',
    title: 'Paraphilic Disorders',
    color: '#9333ea',
    pageRange: 'pp. 817–844',
    description: 'A paraphilia is any intense and persistent sexual interest other than sexual interest in genital stimulation or preparatory fondling with phenotypically normal, consenting human partners. A paraphilia becomes a disorder when it causes distress or impairment, or causes harm/risk of harm to others.',
    disorders: [
      {
        id: 'exhibitionistic',
        name: 'Exhibitionistic Disorder',
        icdCode: 'F65.2',
        pageNumber: 820,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Over a period of at least 6 months, recurrent and intense sexual arousal from the exposure of one\'s genitals to an unsuspecting person, as manifested by fantasies, urges, or behaviors.' },
          { label: 'Criterion B', description: 'The individual has acted on these sexual urges with a nonconsenting person, or the sexual urges or fantasies cause clinically significant distress or impairment.' },
        ],
      },
      {
        id: 'voyeuristic',
        name: 'Voyeuristic Disorder',
        icdCode: 'F65.3',
        pageNumber: 818,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Over a period of at least 6 months, recurrent and intense sexual arousal from observing an unsuspecting person who is naked, disrobing, or engaging in sexual activity.' },
          { label: 'Criterion B', description: 'The individual has acted on these urges with a nonconsenting person, or causes clinically significant distress or impairment. Individual must be at least 18 years of age.' },
        ],
      },
      {
        id: 'pedophilic',
        name: 'Pedophilic Disorder',
        icdCode: 'F65.4',
        pageNumber: 830,
        criteriaGroups: [
          { label: 'Criterion A', description: 'Over a period of at least 6 months, recurrent and intense sexual arousal from sexual activity with a prepubescent child or children (generally age 13 years or younger).' },
          { label: 'Criterion B', description: 'The individual has acted on these sexual urges, or the sexual urges or fantasies cause marked distress or interpersonal difficulty.' },
          { label: 'Criterion C', description: 'The individual is at least 16 years of age and at least 5 years older than the child or children in Criterion A.' },
        ],
      },
    ],
  },

  // ── 20. Other Conditions & Assessment ────────────────────────────────────────
  {
    id: 'other-conditions',
    title: 'Assessment Measures & Other Clinical Foci',
    color: '#475569',
    pageRange: 'pp. 847–888',
    description: 'Conditions that may be a focus of clinical attention (V-Codes/Z-Codes), plus clinical assessment measures, cultural formulation, and emerging conditions.',
    disorders: [
      {
        id: 'suicidal-behavior',
        name: 'Suicidal Behavior & Non-Suicidal Self-Injury (Section III)',
        icdCode: 'T14.91 / R45.88',
        pageNumber: 868,
        criteriaGroups: [
          { label: 'Suicidal Behavior Disorder (Proposed Criteria)', description: 'Within the last 24 months, the individual has made a suicide attempt (a self-initiated sequence of behaviors with at least some intent to die). The attempt does not meet criteria for non-suicidal self-injury (NSSI).' },
          { label: 'Non-Suicidal Self-Injury (NSSI Proposed Criteria)', description: 'In the last year, the individual has, on 5 or more days, engaged in intentional, direct self-inflicted damage to the surface of his or her body of a sort likely to induce bleeding, bruising, or pain (e.g., cutting, burning, stabbing, hitting, excessively rubbing), with the expectation that the injury will lead to only minor or moderate physical harm (NO suicidal intent).' },
        ],
        clinicalNote: 'NSSI is performed to obtain relief from a negative feeling or cognitive state, to resolve an interpersonal difficulty, or to induce a positive feeling state.',
      },
      {
        id: 'cultural-formulation',
        name: 'Cultural Formulation Interview (CFI)',
        pageNumber: 875,
        criteriaGroups: [
          { label: '16-Question Tool', description: 'Assesses cultural identity of the individual, cultural conceptualizations of distress (idioms of distress, explanatory models), cultural stressors and supports, and cultural features of the relationship between clinician and patient.' },
        ],
      },
    ],
  },
]
