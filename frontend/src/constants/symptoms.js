// getSymptomQuestions takes the t() function and returns translated questions
// This is called inside SymptomForm so it re-renders when language changes
export function getSymptomQuestions(t) {
  return [
    {
      key: 'age',
      label: t('q_age'),
      type: 'number',
      min: 1,
      max: 120,
      placeholder: 'e.g. 25',
    },
    {
      key: 'durationDays',
      label: t('q_duration'),
      type: 'number',
      min: 1,
      max: 3650,
      placeholder: 'e.g. 14',
    },
    {
      key: 'evolution',
      label: t('q_evolution'),
      type: 'select',
      options: [
        { value: 'No change',           label: t('evo_no_change') },
        { value: 'Growing larger',      label: t('evo_growing') },
        { value: 'Changing color',      label: t('evo_color') },
        { value: 'Becoming irregular',  label: t('evo_irregular') },
      ],
    },
    {
      key: 'itchingLevel',
      label: t('q_itching'),
      type: 'select',
      options: [
        { value: 'None',     label: t('opt_none') },
        { value: 'Mild',     label: t('itch_mild') },
        { value: 'Moderate', label: t('itch_moderate') },
        { value: 'Severe',   label: t('itch_severe') },
      ],
    },
    {
      key: 'physicalChanges',
      label: t('q_physical'),
      type: 'select',
      options: [
        { value: 'None',              label: t('opt_none') },
        { value: 'Bleeding',          label: t('phys_bleeding') },
        { value: 'Crusting/Scabbing', label: t('phys_crusting') },
        { value: 'Painful',           label: t('phys_painful') },
      ],
    },
    {
      key: 'sunExposure',
      label: t('q_sun'),
      type: 'select',
      options: [
        { value: 'Low (Mostly indoors)',            label: t('sun_low') },
        { value: 'Medium (Commute/Short walks)',    label: t('sun_medium') },
        { value: 'High (Outdoor work/Sports)',      label: t('sun_high') },
      ],
    },
    {
      key: 'familyHistory',
      label: t('q_family'),
      type: 'select',
      options: [
        { value: 'No',       label: t('opt_no') },
        { value: 'Yes',      label: t('opt_yes') },
        { value: 'Not sure', label: t('opt_not_sure') },
      ],
    },
  ]
}

// Keep initialSymptoms — values sent to backend stay in English
// Only labels change, not the actual stored values
export const initialSymptoms = {
  age: '',
  durationDays: '',
  evolution: 'No change',
  itchingLevel: 'None',
  physicalChanges: 'None',
  sunExposure: 'Medium (Commute/Short walks)',
  familyHistory: 'No',
}
