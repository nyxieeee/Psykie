import { useState } from 'react'
import { MagnifyingGlass, CaretRight, CaretDown, BookOpen, Warning, Info, ArrowRight, Sparkle } from '@phosphor-icons/react'
import { useNavigate } from 'react-router-dom'

// ─── DSM-5-TR Diagnostic Criteria Data ───────────────────────────────────────
// Source: DSM-5-TR (Diagnostic and Statistical Manual of Mental Disorders,
// Fifth Edition, Text Revision). American Psychiatric Association. (2022).
// This is a study reference summary for psychology students. Not for clinical use.

interface DSMCriterion {
  code: string
  label: string
  note?: string
}

interface DSMDisorder {
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
}

interface DSMChapter {
  id: string
  title: string
  color: string
  disorders: DSMDisorder[]
}

export const DSM5_TR: DSMChapter[] = [
  {
    id: 'neurodevelopmental',
    title: 'Neurodevelopmental Disorders',
    color: '#7c3aed',
    disorders: [
      {
        id: 'adhd',
        name: 'Attention-Deficit/Hyperactivity Disorder (ADHD)',
        icdCode: 'F90',
        specifiers: ['Predominantly Inattentive', 'Predominantly Hyperactive-Impulsive', 'Combined Presentation', 'Partial remission'],
        criteriaGroups: [
          {
            label: 'Criterion A — Inattention (≥6 symptoms for ≥6 months)',
            description: 'A persistent pattern of inattention and/or hyperactivity-impulsivity that interferes with functioning.',
            criteria: [
              { code: 'A1a', label: 'Often fails to give close attention to details or makes careless mistakes' },
              { code: 'A1b', label: 'Often has difficulty sustaining attention in tasks or play activities' },
              { code: 'A1c', label: 'Often does not seem to listen when spoken to directly' },
              { code: 'A1d', label: 'Often does not follow through on instructions; fails to finish schoolwork or chores' },
              { code: 'A1e', label: 'Often has difficulty organizing tasks and activities' },
              { code: 'A1f', label: 'Often avoids tasks requiring sustained mental effort' },
              { code: 'A1g', label: 'Often loses things necessary for tasks' },
              { code: 'A1h', label: 'Is often easily distracted by extraneous stimuli' },
              { code: 'A1i', label: 'Is often forgetful in daily activities' },
            ],
          },
          {
            label: 'Criterion A — Hyperactivity-Impulsivity (≥6 symptoms for ≥6 months)',
            description: 'Hyperactive and impulsive symptoms causing functional impairment.',
            criteria: [
              { code: 'A2a', label: 'Often fidgets with or taps hands or squirms in seat' },
              { code: 'A2b', label: 'Often leaves seat in situations when remaining seated is expected' },
              { code: 'A2c', label: 'Often runs about or climbs in situations where it is inappropriate' },
              { code: 'A2d', label: 'Often unable to play or engage in leisure activities quietly' },
              { code: 'A2e', label: 'Is often "on the go," acting as if "driven by a motor"' },
              { code: 'A2f', label: 'Often talks excessively' },
              { code: 'A2g', label: 'Often blurts out an answer before a question has been completed' },
              { code: 'A2h', label: 'Often has difficulty waiting his or her turn' },
              { code: 'A2i', label: 'Often interrupts or intrudes on others' },
            ],
          },
          { label: 'Criterion B', description: 'Several inattentive or hyperactive-impulsive symptoms were present before age 12 years.' },
          { label: 'Criterion C', description: 'Several symptoms are present in two or more settings (e.g., at home, school, or work; with friends or relatives).' },
          { label: 'Criterion D', description: 'There is clear evidence that the symptoms interfere with, or reduce the quality of, social, academic, or occupational functioning.' },
          { label: 'Criterion E', description: 'The symptoms do not occur exclusively during the course of schizophrenia or another psychotic disorder and are not better explained by another mental disorder.' },
        ],
        clinicalNote: 'For adults and adolescents (17+), only 5 symptoms are required. Severity: Mild, Moderate, Severe.',
      },
      {
        id: 'asd',
        name: 'Autism Spectrum Disorder (ASD)',
        icdCode: 'F84.0',
        criteriaGroups: [
          {
            label: 'Criterion A — Social Communication Deficits (all 3)',
            description: 'Persistent deficits in social communication and social interaction across multiple contexts.',
            criteria: [
              { code: 'A1', label: 'Deficits in social-emotional reciprocity (e.g., abnormal social approach, failure of normal back-and-forth conversation)' },
              { code: 'A2', label: 'Deficits in nonverbal communicative behaviors (e.g., poorly integrated verbal and nonverbal communication, abnormalities in eye contact and body language)' },
              { code: 'A3', label: 'Deficits in developing, maintaining, and understanding relationships' },
            ],
          },
          {
            label: 'Criterion B — Restricted/Repetitive Behaviors (≥2 of 4)',
            description: 'Restricted, repetitive patterns of behavior, interests, or activities.',
            criteria: [
              { code: 'B1', label: 'Stereotyped or repetitive motor movements, use of objects, or speech' },
              { code: 'B2', label: 'Insistence on sameness, inflexible adherence to routines, or ritualized patterns' },
              { code: 'B3', label: 'Highly restricted, fixated interests that are abnormal in intensity or focus' },
              { code: 'B4', label: 'Hyper- or hyporeactivity to sensory input or unusual interest in sensory aspects of the environment' },
            ],
          },
          { label: 'Criterion C', description: 'Symptoms must be present in the early developmental period (but may not fully manifest until social demands exceed limited capacities).' },
          { label: 'Criterion D', description: 'Symptoms cause clinically significant impairment in social, occupational, or other areas of functioning.' },
          { label: 'Criterion E', description: 'These disturbances are not better explained by intellectual disability or global developmental delay.' },
        ],
        specifiers: ['With/Without intellectual impairment', 'With/Without language impairment', 'Associated with known medical/genetic condition', 'Requiring support Level 1/2/3'],
        clinicalNote: 'Severity is specified separately for social communication and restricted repetitive behaviors using Levels 1–3.',
      },
    ],
  },
  {
    id: 'schizophrenia',
    title: 'Schizophrenia Spectrum & Other Psychotic Disorders',
    color: '#dc2626',
    disorders: [
      {
        id: 'schizophrenia',
        name: 'Schizophrenia',
        icdCode: 'F20.9',
        criteriaGroups: [
          {
            label: 'Criterion A — Characteristic Symptoms (≥2, for ≥1 month; at least 1 must be 1–3)',
            description: 'Two or more of the following, each present for a significant portion of time during a 1-month period.',
            criteria: [
              { code: '1', label: 'Delusions' },
              { code: '2', label: 'Hallucinations' },
              { code: '3', label: 'Disorganized speech (e.g., frequent derailment or incoherence)' },
              { code: '4', label: 'Grossly disorganized or catatonic behavior' },
              { code: '5', label: 'Negative symptoms (e.g., diminished emotional expression or avolition)' },
            ],
          },
          { label: 'Criterion B', description: 'Level of functioning in work, interpersonal relations, or self-care is markedly below level prior to onset.' },
          { label: 'Criterion C', description: 'Continuous signs of disturbance persist for at least 6 months (including at least 1 month of Criterion A symptoms).' },
          { label: 'Criterion D', description: 'Schizoaffective disorder and depressive or bipolar disorder with psychotic features have been ruled out.' },
          { label: 'Criterion E', description: 'The disturbance is not attributable to the physiological effects of a substance or another medical condition.' },
          { label: 'Criterion F', description: 'If there is a history of ASD or childhood communication disorder, the additional diagnosis requires prominent delusions or hallucinations for ≥1 month.' },
        ],
        specifiers: ['First episode, currently in acute episode', 'First episode, currently in partial/full remission', 'Multiple episodes', 'Continuous', 'Unspecified', 'With catatonia'],
        clinicalNote: 'Positive symptoms: delusions, hallucinations, disorganized speech. Negative symptoms: flat affect, avolition, alogia, anhedonia, asociality.',
      },
      {
        id: 'schizoaffective',
        name: 'Schizoaffective Disorder',
        icdCode: 'F25',
        criteriaGroups: [
          { label: 'Criterion A', description: 'An uninterrupted period of illness during which there is a major mood episode (major depressive or manic) concurrent with Criterion A of schizophrenia.' },
          { label: 'Criterion B', description: 'Delusions or hallucinations for ≥2 weeks in the absence of a major mood episode during the lifetime of the illness.' },
          { label: 'Criterion C', description: 'Symptoms meeting criteria for a major mood episode are present for the majority of the total duration of the active and residual portions of the illness.' },
          { label: 'Criterion D', description: 'The disturbance is not attributable to the effects of a substance or another medical condition.' },
        ],
        specifiers: ['Bipolar type (manic or mixed episode)', 'Depressive type'],
      },
      {
        id: 'brief-psychotic',
        name: 'Brief Psychotic Disorder',
        icdCode: 'F23',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Presence of ≥1 of the following: delusions, hallucinations, disorganized speech, grossly disorganized or catatonic behavior (at least 1 must be 1, 2, or 3).' },
          { label: 'Criterion B', description: 'Duration of disturbance is at least 1 day but less than 1 month, with eventual full return to premorbid level of functioning.' },
          { label: 'Criterion C', description: 'The disturbance is not better explained by major depressive or bipolar disorder with psychotic features or another psychotic disorder, and is not attributable to a substance or medical condition.' },
        ],
        specifiers: ['With marked stressor(s)', 'Without marked stressor(s)', 'With peripartum onset', 'With catatonia'],
      },
    ],
  },
  {
    id: 'bipolar',
    title: 'Bipolar and Related Disorders',
    color: '#d97706',
    disorders: [
      {
        id: 'bipolar-i',
        name: 'Bipolar I Disorder',
        icdCode: 'F31',
        criteriaGroups: [
          {
            label: 'Criterion A — Manic Episode (≥1 week, present most of day, nearly every day)',
            description: 'A distinct period of abnormally and persistently elevated, expansive, or irritable mood and increased goal-directed activity or energy.',
            criteria: [
              { code: '1', label: 'Inflated self-esteem or grandiosity' },
              { code: '2', label: 'Decreased need for sleep (feels rested after only 3 hours)' },
              { code: '3', label: 'More talkative than usual or pressure to keep talking' },
              { code: '4', label: 'Flight of ideas or subjective experience that thoughts are racing' },
              { code: '5', label: 'Distractibility (attention too easily drawn to unimportant stimuli)' },
              { code: '6', label: 'Increase in goal-directed activity or psychomotor agitation' },
              { code: '7', label: 'Excessive involvement in activities that have a high potential for painful consequences' },
            ],
            note: 'At least 3 symptoms required (4 if mood is only irritable). Must represent noticeable change and be observable by others.',
          },
          { label: 'Criterion B', description: 'The manic episode is not attributable to the physiological effects of a substance or another medical condition.' },
          { label: 'Criterion C', description: 'At least 1 manic episode is required for Bipolar I. The occurrence of the manic episode(s) is not better explained by schizoaffective disorder.' },
        ],
        specifiers: ['With anxious distress', 'With mixed features', 'With rapid cycling', 'With melancholic features', 'With atypical features', 'With psychotic features', 'With catatonia', 'With peripartum onset', 'With seasonal pattern'],
        clinicalNote: 'Bipolar I requires at least ONE lifetime manic episode. Major depressive episodes are common but not required for diagnosis.',
      },
      {
        id: 'bipolar-ii',
        name: 'Bipolar II Disorder',
        icdCode: 'F31.81',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Criteria have been met for at least one hypomanic episode and at least one major depressive episode.' },
          { label: 'Criterion B', description: 'There has never been a manic episode.' },
          { label: 'Criterion C', description: 'At least one major depressive episode and the hypomanic or depressive episodes are not better accounted for by schizoaffective disorder.' },
          { label: 'Criterion D', description: 'The symptoms of depression or the unpredictability caused by frequent alternation between depression and hypomania causes clinically significant distress or impairment.' },
        ],
        clinicalNote: 'Hypomanic episode: same symptoms as manic episode but lasts only ≥4 consecutive days and does NOT cause marked impairment or require hospitalization.',
      },
      {
        id: 'cyclothymic',
        name: 'Cyclothymic Disorder',
        icdCode: 'F34.0',
        criteriaGroups: [
          { label: 'Criterion A', description: 'For at least 2 years (1 year in children/adolescents), numerous periods with hypomanic symptoms that do not meet criteria for a hypomanic episode AND numerous periods with depressive symptoms that do not meet criteria for a major depressive episode.' },
          { label: 'Criterion B', description: 'During the 2-year period, the hypomanic and depressive periods have been present for at least half the time, and the individual has not been without symptoms for more than 2 months at a time.' },
          { label: 'Criterion C', description: 'Criteria for a major depressive, manic, or hypomanic episode have never been met.' },
          { label: 'Criterion D', description: 'The symptoms in Criterion A are not better explained by schizoaffective disorder, schizophrenia, schizophreniform disorder, brief psychotic disorder, or another psychotic disorder.' },
          { label: 'Criterion E', description: 'The symptoms are not attributable to the physiological effects of a substance or another medical/general condition.' },
          { label: 'Criterion F', description: 'The symptoms cause clinically significant distress or impairment in social, occupational, or other important areas of functioning.' },
        ],
      },
    ],
  },
  {
    id: 'depressive',
    title: 'Depressive Disorders',
    color: '#2563eb',
    disorders: [
      {
        id: 'mdd',
        name: 'Major Depressive Disorder (MDD)',
        icdCode: 'F32 / F33',
        criteriaGroups: [
          {
            label: 'Criterion A — Depressive Episode (≥5 symptoms for ≥2 weeks; at least 1 must be #1 or #2)',
            description: 'Five (or more) of the following during the same 2-week period:',
            criteria: [
              { code: '1', label: 'Depressed mood most of the day, nearly every day (subjective or observed)' },
              { code: '2', label: 'Markedly diminished interest or pleasure in all, or almost all, activities (anhedonia)' },
              { code: '3', label: 'Significant weight loss/gain or decrease/increase in appetite' },
              { code: '4', label: 'Insomnia or hypersomnia' },
              { code: '5', label: 'Psychomotor agitation or retardation (observable by others)' },
              { code: '6', label: 'Fatigue or loss of energy' },
              { code: '7', label: 'Feelings of worthlessness or excessive/inappropriate guilt' },
              { code: '8', label: 'Diminished ability to think, concentrate, or indecisiveness' },
              { code: '9', label: 'Recurrent thoughts of death, suicidal ideation, or suicide attempt' },
            ],
          },
          { label: 'Criterion B', description: 'The symptoms cause clinically significant distress or impairment in social, occupational, or other important areas of functioning.' },
          { label: 'Criterion C', description: 'The episode is not attributable to the physiological effects of a substance or another medical condition.' },
          { label: 'Criterion D', description: 'The occurrence of the major depressive episode is not better explained by schizoaffective disorder or another schizophrenia spectrum disorder.' },
          { label: 'Criterion E', description: 'There has never been a manic or hypomanic episode.' },
        ],
        specifiers: ['Single episode / Recurrent', 'Mild / Moderate / Severe', 'With anxious distress', 'With mixed features', 'With melancholic features', 'With atypical features', 'With psychotic features', 'With catatonia', 'With peripartum onset', 'With seasonal pattern', 'In partial/full remission'],
        clinicalNote: 'The mnemonic SIG E CAPS: Sleep, Interest, Guilt, Energy, Concentration, Appetite, Psychomotor, Suicidality.',
      },
      {
        id: 'persistent-dd',
        name: 'Persistent Depressive Disorder (Dysthymia)',
        icdCode: 'F34.1',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Depressed mood for most of the day, for more days than not, for at least 2 years (1 year for children/adolescents).' },
          {
            label: 'Criterion B — ≥2 of the following',
            description: 'While depressed, presence of two or more of:',
            criteria: [
              { code: '1', label: 'Poor appetite or overeating' },
              { code: '2', label: 'Insomnia or hypersomnia' },
              { code: '3', label: 'Low energy or fatigue' },
              { code: '4', label: 'Low self-esteem' },
              { code: '5', label: 'Poor concentration or difficulty making decisions' },
              { code: '6', label: 'Feelings of hopelessness' },
            ],
          },
          { label: 'Criterion C', description: 'During the 2-year period, the individual has never been without the symptoms in A and B for more than 2 months at a time.' },
          { label: 'Criterion D', description: 'Criteria for a major depressive disorder may be continuously present for 2 years.' },
          { label: 'Criterion E', description: 'There has never been a manic or hypomanic episode, and criteria have never been met for cyclothymic disorder.' },
          { label: 'Criterion F', description: 'Not better explained by a psychotic disorder or substance/medical condition.' },
          { label: 'Criterion G', description: 'The symptoms cause clinically significant distress or impairment.' },
        ],
        specifiers: ['With anxious distress', 'With atypical features', 'With mood-congruent psychotic features', 'With pure dysthymic syndrome', 'With persistent MDE', 'With intermittent MDE'],
      },
      {
        id: 'pmdd',
        name: 'Premenstrual Dysphoric Disorder (PMDD)',
        icdCode: 'F32.81',
        criteriaGroups: [
          { label: 'Criterion A', description: 'In the majority of menstrual cycles, at least 5 symptoms must be present in the final week before the onset of menses, start to improve within a few days after the onset of menses, and become minimal or absent in the week post-menses.' },
          {
            label: 'Criterion B — ≥1 of the following (required)',
            description: 'At least one of:',
            criteria: [
              { code: '1', label: 'Marked affective lability (mood swings, feeling suddenly sad, tearful, or increased sensitivity to rejection)' },
              { code: '2', label: 'Marked irritability or anger or increased interpersonal conflicts' },
              { code: '3', label: 'Marked depressed mood, feelings of hopelessness, or self-deprecating thoughts' },
              { code: '4', label: 'Marked anxiety, tension, feeling of being keyed up or on edge' },
            ],
          },
          {
            label: 'Criterion C — Additional symptoms to reach total of 5',
            description: 'One or more of:',
            criteria: [
              { code: '1', label: 'Decreased interest in usual activities' },
              { code: '2', label: 'Subjective difficulty in concentration' },
              { code: '3', label: 'Lethargy, easy fatigability, or marked lack of energy' },
              { code: '4', label: 'Marked change in appetite; overeating; specific food cravings' },
              { code: '5', label: 'Hypersomnia or insomnia' },
              { code: '6', label: 'A sense of being overwhelmed or out of control' },
              { code: '7', label: 'Physical symptoms: breast tenderness, joint/muscle pain, bloating, weight gain' },
            ],
          },
          { label: 'Criterion D', description: 'The symptoms are associated with clinically significant distress or interference with work, school, usual social activities, or relationships.' },
          { label: 'Criterion E', description: 'The disturbance is not merely an exacerbation of another disorder.' },
          { label: 'Criterion F', description: 'Criterion A should be confirmed by prospective daily ratings during at least two symptomatic cycles (provisional diagnosis may be made prior to confirmation).' },
          { label: 'Criterion G', description: 'The symptoms are not attributable to the physiological effects of a substance or another medical condition.' },
        ],
      },
    ],
  },
  {
    id: 'anxiety',
    title: 'Anxiety Disorders',
    color: '#059669',
    disorders: [
      {
        id: 'gad',
        name: 'Generalized Anxiety Disorder (GAD)',
        icdCode: 'F41.1',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Excessive anxiety and worry (apprehensive expectation), occurring more days than not for at least 6 months, about a number of events or activities.' },
          { label: 'Criterion B', description: 'The individual finds it difficult to control the worry.' },
          {
            label: 'Criterion C — ≥3 of the following (≥1 in children)',
            description: 'The anxiety and worry are associated with 3 or more of:',
            criteria: [
              { code: '1', label: 'Restlessness or feeling keyed up or on edge' },
              { code: '2', label: 'Being easily fatigued' },
              { code: '3', label: 'Difficulty concentrating or mind going blank' },
              { code: '4', label: 'Irritability' },
              { code: '5', label: 'Muscle tension' },
              { code: '6', label: 'Sleep disturbance (difficulty falling/staying asleep, or restless, unsatisfying sleep)' },
            ],
          },
          { label: 'Criterion D', description: 'The anxiety, worry, or physical symptoms cause clinically significant distress or impairment in social, occupational, or other important areas of functioning.' },
          { label: 'Criterion E', description: 'The disturbance is not attributable to the physiological effects of a substance or another medical condition.' },
          { label: 'Criterion F', description: 'The disturbance is not better explained by another mental disorder.' },
        ],
        clinicalNote: 'GAD worry tends to be diffuse (many topics) vs. panic disorder (worry about panic itself) or social anxiety (social situations). Worry is experienced as uncontrollable.',
      },
      {
        id: 'panic-disorder',
        name: 'Panic Disorder',
        icdCode: 'F41.0',
        criteriaGroups: [
          {
            label: 'Criterion A — Recurrent unexpected panic attacks (≥4 of the following)',
            description: 'An abrupt surge of intense fear or discomfort that reaches a peak within minutes:',
            criteria: [
              { code: '1', label: 'Palpitations, pounding heart, or accelerated heart rate' },
              { code: '2', label: 'Sweating' },
              { code: '3', label: 'Trembling or shaking' },
              { code: '4', label: 'Sensations of shortness of breath or smothering' },
              { code: '5', label: 'Feelings of choking' },
              { code: '6', label: 'Chest pain or discomfort' },
              { code: '7', label: 'Nausea or abdominal distress' },
              { code: '8', label: 'Feeling dizzy, unsteady, light-headed, or faint' },
              { code: '9', label: 'Chills or hot flushes' },
              { code: '10', label: 'Paresthesias (numbness or tingling sensations)' },
              { code: '11', label: 'Derealization or depersonalization' },
              { code: '12', label: 'Fear of losing control or "going crazy"' },
              { code: '13', label: 'Fear of dying' },
            ],
          },
          {
            label: 'Criterion B — ≥1 month of ≥1 of the following after ≥1 attack',
            description: 'At least one attack has been followed by 1 month or more of:',
            criteria: [
              { code: '1', label: 'Persistent concern or worry about additional panic attacks or their consequences' },
              { code: '2', label: 'A significant maladaptive change in behavior related to the attacks (e.g., avoidance)' },
            ],
          },
          { label: 'Criterion C', description: 'The disturbance is not attributable to the physiological effects of a substance or another medical condition.' },
          { label: 'Criterion D', description: 'The disturbance is not better explained by another mental disorder.' },
        ],
        specifiers: ['With agoraphobia', 'Without agoraphobia'],
      },
      {
        id: 'social-anxiety',
        name: 'Social Anxiety Disorder (Social Phobia)',
        icdCode: 'F40.10',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Marked fear or anxiety about one or more social situations in which the individual is exposed to possible scrutiny by others.' },
          { label: 'Criterion B', description: 'The individual fears that he or she will act in a way or show anxiety symptoms that will be negatively evaluated (embarrassing, humiliating, or lead to rejection).' },
          { label: 'Criterion C', description: 'The social situations almost always provoke fear or anxiety.' },
          { label: 'Criterion D', description: 'The social situations are avoided or endured with intense fear or anxiety.' },
          { label: 'Criterion E', description: 'The fear or anxiety is out of proportion to the actual threat posed by the social situation.' },
          { label: 'Criterion F', description: 'The fear, anxiety, or avoidance is persistent, typically lasting for 6 months or more.' },
          { label: 'Criterion G', description: 'The fear, anxiety, or avoidance causes clinically significant distress or impairment.' },
          { label: 'Criterion H', description: 'The fear, anxiety, or avoidance is not attributable to the physiological effects of a substance or another medical condition.' },
          { label: 'Criterion I', description: 'The fear, anxiety, or avoidance is not better explained by another mental disorder.' },
          { label: 'Criterion J', description: 'If another medical condition is present, the fear, anxiety, or avoidance is clearly unrelated or is excessive.' },
        ],
        specifiers: ['Performance only'],
        clinicalNote: 'Key distinction: fear of negative evaluation and scrutiny in social situations. Blushing, trembling, or sweating are common physical manifestations.',
      },
      {
        id: 'specific-phobia',
        name: 'Specific Phobia',
        icdCode: 'F40.2',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Marked fear or anxiety about a specific object or situation (e.g., flying, heights, animals, receiving an injection, seeing blood).' },
          { label: 'Criterion B', description: 'The phobic object or situation almost always provokes immediate fear or anxiety.' },
          { label: 'Criterion C', description: 'The phobic object or situation is actively avoided or endured with intense fear or anxiety.' },
          { label: 'Criterion D', description: 'The fear or anxiety is out of proportion to the actual danger posed by the specific object or situation.' },
          { label: 'Criterion E', description: 'The fear, anxiety, or avoidance is persistent, typically lasting for 6 months or more.' },
          { label: 'Criterion F', description: 'The fear, anxiety, or avoidance causes clinically significant distress or impairment.' },
          { label: 'Criterion G', description: 'The disturbance is not better explained by symptoms of another mental disorder.' },
        ],
        specifiers: ['Animal type', 'Natural environment type', 'Blood-injection-injury type', 'Situational type', 'Other type'],
      },
      {
        id: 'separation-anxiety',
        name: 'Separation Anxiety Disorder',
        icdCode: 'F93.0',
        criteriaGroups: [
          {
            label: 'Criterion A — ≥3 of the following',
            description: 'Developmentally inappropriate and excessive fear or anxiety concerning separation from attachment figures:',
            criteria: [
              { code: '1', label: 'Recurrent excessive distress when anticipating or experiencing separation from home or attachment figures' },
              { code: '2', label: 'Persistent and excessive worry about losing, or about possible harm befalling, attachment figures' },
              { code: '3', label: 'Persistent and excessive worry about experiencing an untoward event causing separation from attachment figures' },
              { code: '4', label: 'Persistent reluctance or refusal to go out, away from home, to school, to work, or elsewhere because of fear of separation' },
              { code: '5', label: 'Persistent and excessive fear of or reluctance about being alone or without major attachment figures at home or in other settings' },
              { code: '6', label: 'Persistent reluctance or refusal to sleep away from home or to go to sleep without being near a major attachment figure' },
              { code: '7', label: 'Repeated nightmares involving the theme of separation' },
              { code: '8', label: 'Repeated complaints of physical symptoms when separation from attachment figures occurs or is anticipated' },
            ],
          },
          { label: 'Criterion B', description: 'The fear, anxiety, or avoidance is persistent, lasting at least 4 weeks in children/adolescents and typically 6 months or more in adults.' },
          { label: 'Criterion C', description: 'The disturbance causes clinically significant distress or impairment.' },
          { label: 'Criterion D', description: 'The disturbance is not better explained by another mental disorder.' },
        ],
      },
    ],
  },
  {
    id: 'ocd',
    title: 'Obsessive-Compulsive and Related Disorders',
    color: '#db2777',
    disorders: [
      {
        id: 'ocd-disorder',
        name: 'Obsessive-Compulsive Disorder (OCD)',
        icdCode: 'F42',
        criteriaGroups: [
          {
            label: 'Criterion A — Obsessions, Compulsions, or Both',
            description: 'Obsessions are defined by: (1) recurrent and persistent thoughts/urges experienced as intrusive and unwanted; (2) attempts to suppress or neutralize them. Compulsions are defined by: (1) repetitive behaviors/mental acts the individual feels driven to perform; (2) aimed at reducing anxiety or preventing a dreaded event.',
          },
          { label: 'Criterion B', description: 'The obsessions or compulsions are time-consuming (>1 hour/day) or cause significant distress or impairment.' },
          { label: 'Criterion C', description: 'The obsessive-compulsive symptoms are not attributable to the physiological effects of a substance or another medical condition.' },
          { label: 'Criterion D', description: 'The disturbance is not better explained by symptoms of another mental disorder.' },
        ],
        specifiers: ['With good or fair insight', 'With poor insight', 'With absent insight/delusional beliefs', 'Tic-related'],
        clinicalNote: 'Common OCD themes: contamination (washing compulsions), symmetry (ordering), forbidden/taboo thoughts, harm (checking). Pure O (obsessions only) is a misnomer — mental compulsions are often present.',
      },
      {
        id: 'bdd',
        name: 'Body Dysmorphic Disorder (BDD)',
        icdCode: 'F45.22',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Preoccupation with one or more perceived defects or flaws in physical appearance that are not observable or appear slight to others.' },
          { label: 'Criterion B', description: 'At some point during the course of the disorder, the individual has performed repetitive behaviors (e.g., mirror checking, excessive grooming, skin picking, reassurance seeking) or mental acts (e.g., comparing appearance) in response to the appearance concerns.' },
          { label: 'Criterion C', description: 'The preoccupation causes clinically significant distress or impairment.' },
          { label: 'Criterion D', description: 'The appearance preoccupation is not better explained by concerns with body fat or weight in an individual whose symptoms meet diagnostic criteria for an eating disorder.' },
        ],
        specifiers: ['With muscle dysmorphia', 'With good/fair/poor insight'],
      },
      {
        id: 'hoarding',
        name: 'Hoarding Disorder',
        icdCode: 'F42.3',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Persistent difficulty discarding or parting with possessions, regardless of their actual value.' },
          { label: 'Criterion B', description: 'This difficulty is due to a perceived need to save items and to distress associated with discarding them.' },
          { label: 'Criterion C', description: 'The difficulty discarding possessions results in the accumulation of possessions that congest and clutter active living areas and substantially compromises their intended use.' },
          { label: 'Criterion D', description: 'The hoarding causes clinically significant distress or impairment.' },
          { label: 'Criterion E', description: 'The hoarding is not attributable to another medical condition.' },
          { label: 'Criterion F', description: 'The hoarding is not better explained by another mental disorder.' },
        ],
        specifiers: ['With excessive acquisition', 'With good/fair/poor insight'],
      },
    ],
  },
  {
    id: 'trauma',
    title: 'Trauma- and Stressor-Related Disorders',
    color: '#7c3aed',
    disorders: [
      {
        id: 'ptsd',
        name: 'Post-Traumatic Stress Disorder (PTSD)',
        icdCode: 'F43.1',
        criteriaGroups: [
          { label: 'Criterion A — Exposure to Trauma', description: 'Exposure to actual or threatened death, serious injury, or sexual violence in one or more ways: (1) direct experience; (2) witnessing; (3) learning that it happened to a close family member or friend; (4) experiencing repeated or extreme exposure to aversive details.' },
          {
            label: 'Criterion B — Intrusion (≥1)',
            description: 'Intrusion symptoms associated with the traumatic event:',
            criteria: [
              { code: '1', label: 'Recurrent, involuntary, intrusive distressing memories' },
              { code: '2', label: 'Recurrent distressing dreams related to the event' },
              { code: '3', label: 'Dissociative reactions (flashbacks) in which the person feels as if the event were recurring' },
              { code: '4', label: 'Intense or prolonged psychological distress at exposure to internal/external cues' },
              { code: '5', label: 'Marked physiological reactions to internal/external cues' },
            ],
          },
          {
            label: 'Criterion C — Avoidance (≥1)',
            description: 'Persistent avoidance of stimuli associated with the traumatic event:',
            criteria: [
              { code: '1', label: 'Avoidance of distressing memories, thoughts, or feelings about the event' },
              { code: '2', label: 'Avoidance of external reminders (people, places, conversations, activities, objects, situations)' },
            ],
          },
          {
            label: 'Criterion D — Negative Cognitions/Mood (≥2)',
            description: 'Negative alterations in cognitions and mood:',
            criteria: [
              { code: '1', label: 'Inability to remember an important aspect of the traumatic event' },
              { code: '2', label: 'Persistent and exaggerated negative beliefs about oneself, others, or the world' },
              { code: '3', label: 'Persistent distorted cognitions about the cause or consequences of the event leading to self-blame or blame of others' },
              { code: '4', label: 'Persistent negative emotional state (fear, horror, anger, guilt, shame)' },
              { code: '5', label: 'Markedly diminished interest or participation in significant activities' },
              { code: '6', label: 'Feelings of detachment or estrangement from others' },
              { code: '7', label: 'Persistent inability to experience positive emotions (emotional numbing)' },
            ],
          },
          {
            label: 'Criterion E — Hyperarousal/Reactivity (≥2)',
            description: 'Marked alterations in arousal and reactivity:',
            criteria: [
              { code: '1', label: 'Irritable behavior and angry outbursts, with little or no provocation' },
              { code: '2', label: 'Reckless or self-destructive behavior' },
              { code: '3', label: 'Hypervigilance' },
              { code: '4', label: 'Exaggerated startle response' },
              { code: '5', label: 'Problems with concentration' },
              { code: '6', label: 'Sleep disturbance' },
            ],
          },
          { label: 'Criterion F', description: 'Duration of Criteria B, C, D, and E: more than 1 month.' },
          { label: 'Criterion G', description: 'The disturbance causes clinically significant distress or impairment.' },
          { label: 'Criterion H', description: 'The disturbance is not attributable to the physiological effects of a substance or another medical condition.' },
        ],
        specifiers: ['With dissociative symptoms (depersonalization/derealization)', 'With delayed expression (≥6 months after event)'],
        clinicalNote: 'Mnemonic for clusters: IAAN — Intrusion, Avoidance, Alterations in cognition/mood, Numbing/hyperarousal. PTSD requires all four clusters.',
      },
      {
        id: 'acute-stress',
        name: 'Acute Stress Disorder',
        icdCode: 'F43.0',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Exposure to actual or threatened death, serious injury, or sexual violation (same exposure criteria as PTSD).' },
          {
            label: 'Criterion B — ≥9 of 14 symptoms across 5 categories',
            description: 'Presence of 9 or more of the following from any of the five categories: Intrusion, Negative mood, Dissociative, Avoidance, Arousal.',
            criteria: [
              { code: 'Intrusion 1', label: 'Recurrent, involuntary, intrusive distressing memories' },
              { code: 'Intrusion 2', label: 'Recurrent distressing dreams' },
              { code: 'Intrusion 3', label: 'Dissociative reactions (flashbacks)' },
              { code: 'Intrusion 4', label: 'Intense or prolonged psychological distress at reminders' },
              { code: 'Neg mood', label: 'Persistent inability to experience positive emotions' },
              { code: 'Dissoc 1', label: 'Altered sense of reality of self or surroundings (depersonalization/derealization)' },
              { code: 'Dissoc 2', label: 'Inability to remember an important aspect of the traumatic event' },
              { code: 'Avoid 1', label: 'Avoidance of distressing memories, thoughts, or feelings' },
              { code: 'Avoid 2', label: 'Avoidance of external reminders' },
              { code: 'Arousal 1', label: 'Sleep disturbance' },
              { code: 'Arousal 2', label: 'Irritable behavior and angry outbursts' },
              { code: 'Arousal 3', label: 'Hypervigilance' },
              { code: 'Arousal 4', label: 'Problems with concentration' },
              { code: 'Arousal 5', label: 'Exaggerated startle response' },
            ],
          },
          { label: 'Criterion C', description: 'Duration of disturbance: 3 days to 1 month after trauma exposure.' },
          { label: 'Criterion D', description: 'The disturbance causes clinically significant distress or impairment.' },
          { label: 'Criterion E', description: 'Not attributable to a substance or another medical condition and not better explained by brief psychotic disorder.' },
        ],
        clinicalNote: 'ASD precedes PTSD criteria. If symptoms persist beyond 1 month, PTSD diagnosis should be considered.',
      },
      {
        id: 'adjustment',
        name: 'Adjustment Disorders',
        icdCode: 'F43.2',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Emotional or behavioral symptoms in response to an identifiable stressor(s), occurring within 3 months of the onset of the stressor.' },
          { label: 'Criterion B', description: 'These symptoms or behaviors are clinically significant, as evidenced by one or both: (1) marked distress out of proportion to the severity or intensity of the stressor; (2) significant impairment in social, occupational, or other areas of functioning.' },
          { label: 'Criterion C', description: 'The stress-related disturbance does not meet the criteria for another mental disorder and is not merely an exacerbation of a preexisting mental disorder.' },
          { label: 'Criterion D', description: 'The symptoms do not represent normal bereavement.' },
          { label: 'Criterion E', description: 'Once the stressor or its consequences have terminated, the symptoms do not persist for more than an additional 6 months.' },
        ],
        specifiers: ['With depressed mood', 'With anxiety', 'With mixed anxiety and depressed mood', 'With disturbance of conduct', 'With mixed disturbance of emotions and conduct', 'Unspecified'],
      },
    ],
  },
  {
    id: 'dissociative',
    title: 'Dissociative Disorders',
    color: '#0891b2',
    disorders: [
      {
        id: 'did',
        name: 'Dissociative Identity Disorder (DID)',
        icdCode: 'F44.81',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Disruption of identity characterized by two or more distinct personality states, which may be described in some cultures as an experience of possession. The disruption is marked by discontinuity in sense of self, consciousness, memory, perception, behavior, and/or cognition.' },
          { label: 'Criterion B', description: 'Recurrent gaps in the recall of everyday events, important personal information, and/or traumatic events that are inconsistent with ordinary forgetting.' },
          { label: 'Criterion C', description: 'The symptoms cause clinically significant distress or impairment in social, occupational, or other important areas of functioning.' },
          { label: 'Criterion D', description: 'The disturbance is not a normal part of a broadly accepted cultural or religious practice.' },
          { label: 'Criterion E', description: 'The symptoms are not attributable to the physiological effects of a substance or another medical condition.' },
        ],
        clinicalNote: 'Formerly called Multiple Personality Disorder. The alternate identities (alters) often have distinct names, ages, genders, and mannerisms.',
      },
      {
        id: 'dissociative-amnesia',
        name: 'Dissociative Amnesia',
        icdCode: 'F44.0',
        criteriaGroups: [
          { label: 'Criterion A', description: 'An inability to recall important autobiographical information, usually of a traumatic or stressful nature, that is inconsistent with ordinary forgetting.' },
          { label: 'Criterion B', description: 'The symptoms cause clinically significant distress or impairment.' },
          { label: 'Criterion C', description: 'The disturbance is not attributable to the physiological effects of a substance or another medical or neurological condition.' },
          { label: 'Criterion D', description: 'The disturbance is not better explained by DID, PTSD, ASD, somatic symptom disorder, or another mental disorder.' },
        ],
        specifiers: ['With dissociative fugue: apparently purposeful travel or bewildered wandering with amnesia for identity or other important autobiographical information'],
      },
      {
        id: 'depersonalization',
        name: 'Depersonalization/Derealization Disorder',
        icdCode: 'F48.1',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Persistent or recurrent experiences of depersonalization, derealization, or both: (1) Depersonalization: experiences of unreality, detachment, or being an outside observer with respect to one\'s thoughts, feelings, sensations, body, or actions; (2) Derealization: experiences of unreality or detachment with respect to surroundings.' },
          { label: 'Criterion B', description: 'During depersonalization or derealization experiences, reality testing remains intact.' },
          { label: 'Criterion C', description: 'The symptoms cause clinically significant distress or impairment.' },
          { label: 'Criterion D', description: 'The disturbance is not attributable to the physiological effects of a substance or another medical condition.' },
          { label: 'Criterion E', description: 'The disturbance is not better explained by another mental disorder.' },
        ],
      },
    ],
  },
  {
    id: 'personality',
    title: 'Personality Disorders',
    color: '#b45309',
    disorders: [
      {
        id: 'bpd',
        name: 'Borderline Personality Disorder (BPD)',
        icdCode: 'F60.3',
        criteriaGroups: [
          {
            label: 'Diagnostic Criteria — ≥5 of 9',
            description: 'A pervasive pattern of instability of interpersonal relationships, self-image, and affects, and marked impulsivity, beginning by early adulthood:',
            criteria: [
              { code: '1', label: 'Frantic efforts to avoid real or imagined abandonment' },
              { code: '2', label: 'A pattern of unstable and intense interpersonal relationships characterized by alternating between extremes of idealization and devaluation (splitting)' },
              { code: '3', label: 'Identity disturbance: markedly and persistently unstable self-image or sense of self' },
              { code: '4', label: 'Impulsivity in at least 2 areas that are potentially self-damaging (spending, sex, substance abuse, reckless driving, binge eating)' },
              { code: '5', label: 'Recurrent suicidal behavior, gestures, or threats, or self-mutilating behavior' },
              { code: '6', label: 'Affective instability due to marked reactivity of mood (intense dysphoria, irritability, or anxiety usually lasting hours and rarely more than a few days)' },
              { code: '7', label: 'Chronic feelings of emptiness' },
              { code: '8', label: 'Inappropriate, intense anger or difficulty controlling anger' },
              { code: '9', label: 'Transient, stress-related paranoid ideation or severe dissociative symptoms' },
            ],
          },
        ],
        clinicalNote: 'Mnemonic: PRAISE (Paranoid ideation/dissociation, Relationships unstable, Abandonment fears, Impulsivity, Self-harm, Emptiness, Emotional instability, Identity disturbance). Treatment: DBT (Dialectical Behavior Therapy) is first-line.',
      },
      {
        id: 'npd',
        name: 'Narcissistic Personality Disorder (NPD)',
        icdCode: 'F60.81',
        criteriaGroups: [
          {
            label: 'Diagnostic Criteria — ≥5 of 9',
            description: 'A pervasive pattern of grandiosity (in fantasy or behavior), need for admiration, and lack of empathy, beginning by early adulthood:',
            criteria: [
              { code: '1', label: 'Grandiose sense of self-importance' },
              { code: '2', label: 'Preoccupied with fantasies of unlimited success, power, brilliance, beauty, or ideal love' },
              { code: '3', label: 'Believes that he or she is "special" and unique and can only be understood by other high-status people/institutions' },
              { code: '4', label: 'Requires excessive admiration' },
              { code: '5', label: 'Has a sense of entitlement' },
              { code: '6', label: 'Is interpersonally exploitative' },
              { code: '7', label: 'Lacks empathy' },
              { code: '8', label: 'Is often envious of others or believes that others are envious of him or her' },
              { code: '9', label: 'Shows arrogant, haughty behaviors or attitudes' },
            ],
          },
        ],
        clinicalNote: 'Mnemonic: SPECIAL — Special, Preoccupied, Entitlement, Conceited, Interpersonally exploitative, Admiration, Lacks empathy.',
      },
      {
        id: 'aspd',
        name: 'Antisocial Personality Disorder (ASPD)',
        icdCode: 'F60.2',
        criteriaGroups: [
          {
            label: 'Criterion A — ≥3 of 7 (since age 15)',
            description: 'A pervasive pattern of disregard for and violation of the rights of others, occurring since age 15:',
            criteria: [
              { code: '1', label: 'Failure to conform to social norms with respect to lawful behaviors (repeatedly performing acts that are grounds for arrest)' },
              { code: '2', label: 'Deceitfulness, as indicated by repeated lying, use of aliases, or conning others for personal profit or pleasure' },
              { code: '3', label: 'Impulsivity or failure to plan ahead' },
              { code: '4', label: 'Irritability and aggressiveness, as indicated by repeated physical fights or assaults' },
              { code: '5', label: 'Reckless disregard for safety of self or others' },
              { code: '6', label: 'Consistent irresponsibility (failure to sustain consistent work behavior or honor financial obligations)' },
              { code: '7', label: 'Lack of remorse, as indicated by being indifferent to or rationalizing having hurt, mistreated, or stolen from another' },
            ],
          },
          { label: 'Criterion B', description: 'The individual is at least age 18 years.' },
          { label: 'Criterion C', description: 'There is evidence of conduct disorder with onset before age 15 years.' },
          { label: 'Criterion D', description: 'The occurrence of antisocial behavior is not exclusively during the course of schizophrenia or bipolar disorder.' },
        ],
        clinicalNote: 'Conduct disorder is a prerequisite for ASPD. Psychopathy (PCL-R) overlaps but is not synonymous — psychopathy includes emotional features (callousness, shallow affect) not explicitly in ASPD criteria.',
      },
    ],
  },
  {
    id: 'eating',
    title: 'Feeding and Eating Disorders',
    color: '#be185d',
    disorders: [
      {
        id: 'anorexia',
        name: 'Anorexia Nervosa',
        icdCode: 'F50.0',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Restriction of energy intake relative to requirements, leading to a significantly low body weight in the context of age, sex, developmental trajectory, and physical health.' },
          { label: 'Criterion B', description: 'Intense fear of gaining weight or of becoming fat, or persistent behavior that interferes with weight gain, even though at a significantly low weight.' },
          { label: 'Criterion C', description: 'Disturbance in the way in which one\'s body weight or shape is experienced; undue influence of body weight or shape on self-evaluation; or persistent lack of recognition of the seriousness of the current low body weight.' },
        ],
        specifiers: ['Restricting type', 'Binge-eating/purging type', 'In partial/full remission', 'Mild (BMI ≥17), Moderate (16–16.99), Severe (15–15.99), Extreme (<15)'],
        clinicalNote: 'Highest mortality rate of any psychiatric disorder. Medical complications: amenorrhea, bradycardia, lanugo, electrolyte imbalances (hypokalemia), osteoporosis.',
      },
      {
        id: 'bulimia',
        name: 'Bulimia Nervosa',
        icdCode: 'F50.2',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Recurrent episodes of binge eating, characterized by: (1) eating in a discrete period of time an amount of food that is definitely larger than what most individuals would eat; (2) a sense of lack of control over eating during the episode.' },
          { label: 'Criterion B', description: 'Recurrent inappropriate compensatory behaviors in order to prevent weight gain, such as self-induced vomiting; misuse of laxatives, diuretics, or other medications; fasting; or excessive exercise.' },
          { label: 'Criterion C', description: 'The binge eating and inappropriate compensatory behaviors both occur, on average, at least once a week for 3 months.' },
          { label: 'Criterion D', description: 'Self-evaluation is unduly influenced by body shape and weight.' },
          { label: 'Criterion E', description: 'The disturbance does not occur exclusively during episodes of anorexia nervosa.' },
        ],
        specifiers: ['Mild (1–3 episodes/week)', 'Moderate (4–7)', 'Severe (8–13)', 'Extreme (≥14)', 'In partial/full remission'],
        clinicalNote: 'Russell\'s sign: calluses on knuckles from self-induced vomiting. Dental erosion, parotid gland enlargement, electrolyte imbalances (hypokalemia, metabolic alkalosis).',
      },
      {
        id: 'bed',
        name: 'Binge-Eating Disorder (BED)',
        icdCode: 'F50.81',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Recurrent episodes of binge eating (same definition as bulimia nervosa, Criterion A).' },
          {
            label: 'Criterion B — ≥3 of the following',
            description: 'The binge-eating episodes are associated with 3 or more of:',
            criteria: [
              { code: '1', label: 'Eating much more rapidly than normal' },
              { code: '2', label: 'Eating until feeling uncomfortably full' },
              { code: '3', label: 'Eating large amounts of food when not feeling physically hungry' },
              { code: '4', label: 'Eating alone because of feeling embarrassed by how much one is eating' },
              { code: '5', label: 'Feeling disgusted with oneself, depressed, or very guilty afterward' },
            ],
          },
          { label: 'Criterion C', description: 'Marked distress regarding binge eating is present.' },
          { label: 'Criterion D', description: 'The binge eating occurs, on average, at least once a week for 3 months.' },
          { label: 'Criterion E', description: 'The binge eating is not associated with the recurrent use of inappropriate compensatory behavior and does not occur exclusively during AN or BN.' },
        ],
        specifiers: ['Mild (1 episode/week)', 'Moderate (2–3)', 'Severe (4–7)', 'Extreme (≥8)', 'In partial/full remission'],
      },
    ],
  },
  {
    id: 'neurocognitive',
    title: 'Neurocognitive Disorders',
    color: '#374151',
    disorders: [
      {
        id: 'major-ncd',
        name: 'Major Neurocognitive Disorder (Dementia)',
        icdCode: 'F02 / G30',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Evidence of significant cognitive decline from a previous level of performance in one or more cognitive domains: complex attention, executive function, learning and memory, language, perceptual-motor, social cognition. Concerns from patient, knowledgeable informant, or clinician; AND substantial cognitive test impairment.' },
          { label: 'Criterion B', description: 'The cognitive deficits interfere with independence in everyday activities (at minimum, requiring assistance with complex instrumental activities of daily living).' },
          { label: 'Criterion C', description: 'The cognitive deficits do not occur exclusively in the context of a delirium.' },
          { label: 'Criterion D', description: 'The cognitive deficits are not better explained by another mental disorder.' },
        ],
        specifiers: ['Due to Alzheimer\'s disease', 'Frontotemporal', 'Lewy body', 'Vascular', 'TBI', 'HIV', 'Prion disease', 'Parkinson\'s', 'Huntington\'s', 'Multiple etiologies', 'Unspecified'],
        clinicalNote: 'Alzheimer\'s: insidious onset, gradual progression, primarily memory and language. Lewy body: visual hallucinations, parkinsonism, REM sleep disorder, fluctuating cognition. FTD: behavior/personality changes, executive dysfunction, relative sparing of memory.',
      },
      {
        id: 'mild-ncd',
        name: 'Mild Neurocognitive Disorder (MCI)',
        icdCode: 'G31.84',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Evidence of modest cognitive decline from a previous level of performance in one or more cognitive domains (same domains as major NCD).' },
          { label: 'Criterion B', description: 'The cognitive deficits do not interfere with capacity for independence in everyday activities (complex instrumental activities preserved but require greater effort or compensatory strategies).' },
          { label: 'Criterion C', description: 'The cognitive deficits do not occur exclusively in the context of a delirium.' },
          { label: 'Criterion D', description: 'Not better explained by another mental disorder.' },
        ],
        clinicalNote: 'Mild NCD = "Mild Cognitive Impairment (MCI)" in prior literature. Many but not all individuals progress to major NCD.',
      },
      {
        id: 'delirium',
        name: 'Delirium',
        icdCode: 'F05',
        criteriaGroups: [
          { label: 'Criterion A', description: 'A disturbance in attention (reduced ability to direct, focus, sustain, and shift attention) and awareness (reduced orientation to the environment).' },
          { label: 'Criterion B', description: 'The disturbance develops over a short period of time (usually hours to a few days), represents a change from baseline attention and awareness, and tends to fluctuate in severity during the course of a day.' },
          { label: 'Criterion C', description: 'An additional disturbance in cognition (memory deficit, disorientation, language, visuospatial ability, or perception).' },
          { label: 'Criterion D', description: 'The disturbances in Criteria A and C are not better explained by another preexisting, established, or evolving neurocognitive disorder and do not occur in the context of severely reduced level of arousal, such as coma.' },
          { label: 'Criterion E', description: 'There is evidence that the disturbance is a direct physiological consequence of another medical condition, substance intoxication or withdrawal, or exposure to a toxin, or is due to multiple etiologies.' },
        ],
        specifiers: ['Hyperactive (agitated, hypervigilant)', 'Hypoactive (quiet, withdrawn)', 'Mixed level of activity'],
        clinicalNote: 'Delirium is ALWAYS due to an organic cause. Key features: acute onset, fluctuating course, impaired attention. Sundowning = worsening symptoms in the evening.',
      },
    ],
  },
  {
    id: 'substance',
    title: 'Substance-Related and Addictive Disorders',
    color: '#16a34a',
    disorders: [
      {
        id: 'substance-use',
        name: 'Substance Use Disorder (General Criteria)',
        icdCode: 'F1x.1x',
        criteriaGroups: [
          {
            label: 'Diagnostic Criteria — ≥2 within a 12-month period (applies across substance classes)',
            description: 'A problematic pattern of substance use leading to clinically significant impairment or distress:',
            criteria: [
              { code: '1', label: 'The substance is often taken in larger amounts or over a longer period than was intended (loss of control)' },
              { code: '2', label: 'There is a persistent desire or unsuccessful efforts to cut down or control substance use' },
              { code: '3', label: 'A great deal of time is spent in activities necessary to obtain the substance, use it, or recover from its effects' },
              { code: '4', label: 'Craving, or a strong desire or urge to use the substance' },
              { code: '5', label: 'Recurrent substance use resulting in a failure to fulfill major role obligations at work, school, or home' },
              { code: '6', label: 'Continued substance use despite having persistent or recurrent social or interpersonal problems caused or exacerbated by the effects of the substance' },
              { code: '7', label: 'Important social, occupational, or recreational activities are given up or reduced because of substance use' },
              { code: '8', label: 'Recurrent substance use in situations in which it is physically hazardous' },
              { code: '9', label: 'Substance use is continued despite knowledge of having a persistent or recurrent physical or psychological problem' },
              { code: '10', label: 'Tolerance: a need for markedly increased amounts to achieve the desired effect, or markedly diminished effect with the same amount' },
              { code: '11', label: 'Withdrawal: characteristic withdrawal syndrome, or the substance is taken to relieve or avoid withdrawal symptoms' },
            ],
          },
        ],
        specifiers: ['Mild (2–3 criteria)', 'Moderate (4–5 criteria)', 'Severe (≥6 criteria)', 'In early/sustained remission', 'In a controlled environment'],
        clinicalNote: 'Tolerance and withdrawal are NOT counted for caffeine use disorder or when using medications as prescribed. Gambling Disorder is included in this chapter as the first non-substance "behavioral addiction."',
      },
    ],
  },
  {
    id: 'somatic',
    title: 'Somatic Symptom and Related Disorders',
    color: '#0284c7',
    disorders: [
      {
        id: 'somatic-symptom',
        name: 'Somatic Symptom Disorder',
        icdCode: 'F45.1',
        criteriaGroups: [
          { label: 'Criterion A', description: 'One or more somatic symptoms that are distressing or result in significant disruption of daily life.' },
          {
            label: 'Criterion B — ≥1 of the following',
            description: 'Excessive thoughts, feelings, or behaviors related to the somatic symptoms or associated health concerns:',
            criteria: [
              { code: '1', label: 'Disproportionate and persistent thoughts about the seriousness of one\'s symptoms' },
              { code: '2', label: 'Persistently high level of anxiety about health or symptoms' },
              { code: '3', label: 'Excessive time and energy devoted to these symptoms or health concerns' },
            ],
          },
          { label: 'Criterion C', description: 'Although any one somatic symptom may not be continuously present, the state of being symptomatic is persistent (typically more than 6 months).' },
        ],
        specifiers: ['With predominant pain', 'Persistent', 'Mild/Moderate/Severe'],
        clinicalNote: 'Key DSM-5 change: replaced Somatization Disorder, Pain Disorder, Hypochondriasis, and Undifferentiated Somatoform Disorder. Focus shifted from "medically unexplained" to psychological response to symptoms.',
      },
      {
        id: 'illness-anxiety',
        name: 'Illness Anxiety Disorder (Health Anxiety)',
        icdCode: 'F45.21',
        criteriaGroups: [
          { label: 'Criterion A', description: 'Preoccupation with having or acquiring a serious illness.' },
          { label: 'Criterion B', description: 'Somatic symptoms are not present or, if present, are only mild in intensity. If another medical condition is present or there is a high risk of developing a medical condition (e.g., strong family history), the preoccupation is clearly excessive or disproportionate.' },
          { label: 'Criterion C', description: 'There is a high level of anxiety about health, and the individual is easily alarmed about personal health status.' },
          { label: 'Criterion D', description: 'The individual performs excessive health-related behaviors or exhibits maladaptive avoidance.' },
          { label: 'Criterion E', description: 'Illness preoccupation has been present for at least 6 months, but the specific illness that is feared may change over that period.' },
          { label: 'Criterion F', description: 'The illness-related preoccupation is not better explained by another mental disorder.' },
        ],
        specifiers: ['Care-seeking type (excessively uses medical care)', 'Care-avoidant type (avoids medical care)'],
      },
    ],
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

function CriterionRow({ c }: { c: DSMCriterion }) {
  return (
    <li className="flex gap-2 py-1.5 border-b border-pink-50 last:border-0">
      <span className="font-black text-pink-500 text-[11px] mt-0.5 shrink-0 w-14">{c.code}</span>
      <span className="text-xs text-neutral-700 leading-relaxed">{c.label}</span>
    </li>
  )
}

function CriteriaGroup({ group, chapterColor }: { group: DSMDisorder['criteriaGroups'][0]; chapterColor: string }) {
  const [open, setOpen] = useState(group.criteria ? false : false)
  if (!group.criteria) {
    return (
      <div className="mb-3 px-4 py-3 rounded-xl bg-white border border-pink-100/60">
        <p className="text-xs font-black text-neutral-800 mb-1">{group.label}</p>
        <p className="text-xs text-neutral-600 leading-relaxed">{group.description}</p>
        {group.note && <p className="mt-2 text-[11px] text-pink-600 italic">{group.note}</p>}
      </div>
    )
  }
  return (
    <div className="mb-3 rounded-xl border border-pink-100/60 overflow-hidden">
      <button
        className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white hover:bg-pink-50/40 transition-colors text-left"
        onClick={() => setOpen(o => !o)}
      >
        <div>
          <p className="text-xs font-black text-neutral-800">{group.label}</p>
          {!open && <p className="text-[11px] text-neutral-500 mt-0.5">{group.description.slice(0, 80)}…</p>}
        </div>
        {open ? <CaretDown size={16} style={{ color: chapterColor, flexShrink: 0 }} /> : <CaretRight size={16} className="text-neutral-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 bg-white/60">
          <p className="text-xs text-neutral-600 mb-3 leading-relaxed">{group.description}</p>
          <ul className="list-none">
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
                ICD-10: {disorder.icdCode}
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
            <div className="mt-4 p-3 rounded-xl bg-violet-50 border border-violet-100">
              <p className="text-[11px] font-black text-violet-700 mb-2 uppercase tracking-wider">Specifiers</p>
              <div className="flex flex-wrap gap-1.5">
                {disorder.specifiers.map(s => (
                  <span key={s} className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-violet-100 text-violet-700">{s}</span>
                ))}
              </div>
            </div>
          )}

          {disorder.clinicalNote && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
              <div className="flex items-start gap-2">
                <Sparkle size={15} className="text-amber-500 mt-0.5 flex-shrink-0" weight="fill" />
                <p className="text-xs text-amber-800 leading-relaxed">{disorder.clinicalNote}</p>
              </div>
            </div>
          )}

          {disorder.duration && (
            <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
              <Info size={13} className="text-sky-500" />
              <span>Duration: <strong className="text-neutral-700">{disorder.duration}</strong></span>
            </div>
          )}

          {disorder.exclusions && disorder.exclusions.length > 0 && (
            <div className="mt-3 p-3 rounded-xl bg-rose-50 border border-rose-100">
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

          <button
            onClick={() => navigate(`/mindy?q=${encodeURIComponent(`Explain ${disorder.name} diagnostic criteria in simple terms for a psychology student`)}`)}
            className="mt-4 flex items-center gap-2 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-3 py-1.5 rounded-full transition-colors"
          >
            <Sparkle size={13} />Ask Mindy to explain this
            <ArrowRight size={13} />
          </button>
        </div>
      )}
    </div>
  )
}

export function DSMPage() {
  const [search, setSearch] = useState('')
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null)

  const q = search.toLowerCase().trim()
  const filtered = DSM5_TR.map(chapter => ({
    ...chapter,
    disorders: chapter.disorders.filter(d =>
      !q ||
      d.name.toLowerCase().includes(q) ||
      d.icdCode?.toLowerCase().includes(q) ||
      d.criteriaGroups.some(g => g.description.toLowerCase().includes(q) || g.label.toLowerCase().includes(q) ||
        (g.criteria || []).some(c => c.label.toLowerCase().includes(q)))
    ),
  })).filter(chapter => !q || chapter.disorders.length > 0)

  const displayed = selectedChapter
    ? filtered.filter(ch => ch.id === selectedChapter)
    : filtered

  const totalDisorders = DSM5_TR.reduce((acc, ch) => acc + ch.disorders.length, 0)

  return (
    <div className="reference-page" style={{ maxWidth: 1100 }}>
      {/* Header */}
      <div className="ref-panel" style={{ marginBottom: 24, background: 'linear-gradient(135deg, #fdf2f8 0%, #f5f3ff 100%)', borderColor: '#f9a8d4' }}>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #ec4899, #8b5cf6)' }}>
            <BookOpen size={26} className="text-white" weight="duotone" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-black text-neutral-800">DSM-5-TR Diagnostic Criteria</h1>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              Diagnostic and Statistical Manual of Mental Disorders, 5th Edition, Text Revision (2022).
              American Psychiatric Association. <strong className="text-neutral-700">{totalDisorders} disorders</strong> across {DSM5_TR.length} chapters.
            </p>
            <p className="mt-2 text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 inline-block">
              ⚠️ For educational and study purposes only. Not for clinical diagnosis or treatment planning.
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="mt-5 flex items-center gap-2 bg-white border border-pink-200 rounded-full px-4 py-2.5 shadow-sm">
          <MagnifyingGlass size={18} className="text-pink-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search disorders, criteria, symptoms, ICD codes…"
            className="flex-1 text-sm outline-none bg-transparent text-neutral-700 placeholder:text-neutral-400"
          />
        </div>
      </div>

      <div className="flex gap-5">
        {/* Chapter sidebar */}
        <aside style={{ width: 240, flexShrink: 0 }}>
          <div
            className="ref-panel p-3 sticky top-4 flex flex-col"
            style={{
              maxHeight: 'calc(100vh - 110px)',
              overflowY: 'auto',
              scrollbarWidth: 'thin',
              scrollbarColor: '#f472b6 #fdf2f8',
            }}
          >
            <div className="sticky top-0 bg-white/95 backdrop-blur z-10 pb-2 mb-1 border-b border-pink-100/60 flex items-center justify-between">
              <h2 className="text-xs font-black text-neutral-500 uppercase tracking-wider px-1">Chapters</h2>
              <span className="text-[10px] font-bold text-neutral-400 px-1.5 py-0.5 rounded-full bg-pink-50">
                {DSM5_TR.length}
              </span>
            </div>
            <button
              onClick={() => setSelectedChapter(null)}
              className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold mb-1 transition-colors flex-shrink-0 ${!selectedChapter ? 'bg-pink-100 text-pink-700' : 'text-neutral-600 hover:bg-pink-50'}`}
            >
              All chapters
            </button>
            <div className="space-y-0.5 overflow-y-visible">
              {DSM5_TR.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChapter(ch.id === selectedChapter ? null : ch.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 ${selectedChapter === ch.id ? 'text-white' : 'text-neutral-600 hover:bg-pink-50'}`}
                  style={selectedChapter === ch.id ? { background: ch.color } : {}}
                >
                  <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ch.color }} />
                  <span className="line-clamp-2 leading-tight">{ch.title}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {displayed.length === 0 && (
            <div className="ref-panel text-center py-12">
              <BookOpen size={40} className="text-pink-200 mx-auto mb-3" />
              <p className="text-sm font-bold text-neutral-500">No disorders match your search.</p>
              <p className="text-xs text-neutral-400 mt-1">Try a different term, symptom, or ICD code.</p>
            </div>
          )}

          {displayed.map(chapter => (
            <section key={chapter.id} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-5 w-1.5 rounded-full" style={{ background: chapter.color }} />
                <h2 className="text-base font-black text-neutral-800">{chapter.title}</h2>
                <span className="text-xs font-bold text-neutral-400">{chapter.disorders.length} disorders</span>
              </div>
              {chapter.disorders.map(disorder => (
                <DisorderCard key={disorder.id} disorder={disorder} chapterColor={chapter.color} />
              ))}
            </section>
          ))}

          <div className="ref-panel mt-4 text-center py-6">
            <Info size={20} className="text-sky-400 mx-auto mb-2" />
            <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
              This is a study reference summary. Always consult the full DSM-5-TR text and qualified clinical supervisors for comprehensive diagnostic criteria and clinical application.
            </p>
            <p className="text-[11px] text-neutral-400 mt-2">
              American Psychiatric Association. (2022). <em>Diagnostic and statistical manual of mental disorders</em> (5th ed., text rev.). https://doi.org/10.1176/appi.books.9780890425787
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}

