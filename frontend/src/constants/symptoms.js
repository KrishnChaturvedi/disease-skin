export const symptomQuestions = [
  {
    key: 'age',
    label: 'What is your age?',
    type: 'number',
    min: 1,
    max: 120,
    placeholder: 'e.g. 25',
  },
  {
    key: 'durationDays',
    label: 'How many days has this been present?',
    type: 'number',
    min: 1,
    max: 3650,
    placeholder: 'e.g. 14',
  },
  {
    key: 'evolution',
    label: 'Has the spot changed in size, shape, or color?',
    type: 'select',
    options: ['No change', 'Growing larger', 'Changing color', 'Becoming irregular'],
  },
  {
    key: 'itchingLevel',
    label: 'Itching level',
    type: 'select',
    options: ['None', 'Mild', 'Moderate', 'Severe'],
  },
  {
    key: 'physicalChanges',
    label: 'Physical symptoms (if any)',
    type: 'select',
    options: ['None', 'Bleeding', 'Crusting/Scabbing', 'Painful'],
  },
  {
    key: 'sunExposure',
    label: 'Daily sun exposure level',
    type: 'select',
    options: ['Low (Mostly indoors)', 'Medium (Commute/Short walks)', 'High (Outdoor work/Sports)'],
  },
  {
    key: 'familyHistory',
    label: 'Family history of skin disease/cancer',
    type: 'select',
    options: ['No', 'Yes', 'Not sure'],
  },
]

export const initialSymptoms = {
  age: '',
  durationDays: '',
  evolution: 'No change',
  itchingLevel: 'None',
  physicalChanges: 'None',
  sunExposure: 'Medium (Commute/Short walks)',
  familyHistory: 'No',
}