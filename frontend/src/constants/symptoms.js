export const symptomQuestions = [
  {
    key: 'durationDays',
    label: 'How many days have you had this patch/rash?',
    type: 'number',
    min: 1,
    max: 3650,
    placeholder: 'e.g. 14',
  },
  {
    key: 'itchingLevel',
    label: 'Itching level',
    type: 'select',
    options: ['None', 'Mild', 'Moderate', 'Severe'],
  },
  {
    key: 'painLevel',
    label: 'Pain level',
    type: 'select',
    options: ['None', 'Mild', 'Moderate', 'Severe'],
  },
  {
    key: 'sunExposure',
    label: 'Daily sun exposure',
    type: 'select',
    options: ['Low', 'Medium', 'High'],
  },
  {
    key: 'familyHistory',
    label: 'Family history of skin disease/cancer',
    type: 'select',
    options: ['No', 'Yes', 'Not sure'],
  },
]

export const initialSymptoms = {
  durationDays: '',
  itchingLevel: 'None',
  painLevel: 'None',
  sunExposure: 'Medium',
  familyHistory: 'No',
}
