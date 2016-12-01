export function ordinal(grade) {
  grade = parseInt(grade, 10)
  switch (grade) {
    case 0:
      return 'Kindergarten'
    case 1:
      return '1st Grade'
    case 2:
      return '2nd Grade'
    case 3:
      return '3rd Grade'
    case 4:
      return '4th Grade'
    case 5:
      return '5th Grade'
    case 6:
      return '6th Grade'
    case 7:
      return '7th Grade'
    case 8:
      return '8th Grade'
    default:
      return null
  }
}

export function round(value, decimals) {
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
}

export const sectionTranslations = {
  avgBehavior: 'Average Behavior',
  avgTestScore: 'Average Score',
  females: 'Girls',
  males: 'Boys',
  genderRatio: 'M/F',
  avgDial4: 'Average Dial 4',
  avgAge: 'Average Age',
  potentialDelays: 'Potential Delays',
  advancedMaths: 'Advanced Math',
  medicalConcerns: 'Medical Concerns',
  facultyStudents: 'Faculty Students',
  newStudents: 'New Students',
  testAvg: 'Average Score',
  asps: 'ASP',
  hmps: 'HMP'
}

export const studentTranslations = {
  sex: 'Gender',
  potentialDelay: 'Potential Delay',
  advancedMath: 'Advanced Math',
  medicalConcern: 'Medical Concern',
  facultyStudent: 'Faculty Student',
  newStudent: 'New Student',
  hmp: 'High Maintenence Parent',
  behavior: 'Behavior',
  workEthic: 'Work Ethic',
  mathBench: 'Math Bench',
  cogAT: 'cogAT',
  dra: 'DRA',
  elaTotal: 'ELA Total',
  mathTotal: 'Math Total',
  asp: 'ASP',
  behaviorObservation: 'Behavior Observation',
  dial4: 'Dial 4',
  age: 'Age',
  comments: 'Comments'
}

export function forHumanAttr(key, val) {
  //first switch non test scores that expect an empty string
  switch (key) {
    case 'potentialDelay':
    case 'advancedMath':
    case 'medicalConcern':
    case 'facultyStudent':
    case 'newStudent':
    case 'hmp':
    case 'asp':
      return (`${studentTranslations[key]}: 
              ${(val) ? 'Yes' : 'No'}`)
    default:
      // for rest of the keys, an empty string is ok
      if (!val){
        val = ''
      }
      switch(key){
        case 'mathBench':
        case 'cogAT':
        case 'dra':
        case 'elaTotal':
        case 'mathTotal':
        case 'behaviorObservation':
        case 'dial4':
        case 'comments':
          return `${studentTranslations[key]}: ${val}`
        case 'behavior':
        case 'workEthic':
          const mark = (val === 0 || val === '0') ? '-' : (val === 1 || val === '1') ? '\u2713' : (val === 2 || val === '2') ? '+' : 'N/A'
          return `${studentTranslations[key]}: ${mark}`
        case 'sex':
          return `${studentTranslations[key]}: ${val}`
        case 'age':
          return `${studentTranslations[key]}: ${round(val / 12, 0)} y. ${round(val % 12, 0)} mo.`
        default:
          return `${key}: ${val}`
      }
  }
}

const sectionStatPrecedence = {
  avgBehavior: 4,
  avgTestScore: 3,
  females: 0,
  males: 1,
  genderRatio: 2,
  avgDial4: 4,
  avgAge: 5,
  potentialDelays: 6,
  advancedMaths: 8,
  medicalConcerns: 7,
  facultyStudents: 9,
  newStudents: 10,
  testAvg: 4,
  asps: 11,
  hmps: 12
}

export function sortSectionStats(a, b) {
    return sectionStatPrecedence[a] - sectionStatPrecedence[b]
}

const studentStatPrecendence = {
  sex: 0,
  potentialDelay: 9,
  advancedMath: 11,
  medicalConcern: 10,
  facultyStudent: 12,
  newStudent: 13,
  hmp: 15,
  behavior: 7,
  workEthic: 8,
  mathBench: 2,
  cogAT: 3,
  dra: 4,
  elaTotal: 5,
  mathTotal: 6,
  asp: 14,
  behaviorObservation: 7,
  dial4: 3,
  age: 1,
  comments: 16
}

export function sortStudentStats(a, b) {
  return studentStatPrecendence[a] - studentStatPrecendence[b]
}

export const cardKeys = ['potentialDelay','advancedMath','medicalConcern','facultyStudent',
                         'newStudent', 'hmp', 'asp', 'behavior', 'workEthic', 'sex', 'mathBench',
                         'cogAT', 'dra', 'elaTotal', 'mathTotal', 'behaviorObservation', 'dial4',
                         'age', 'comments']

export function validateScore(key, val){
    if (typeof val === 'undefined' || val === null) {
      return 'success'
    } else if (isNaN(val)) {
      return 'error'
    } else if (typeof val === 'string') {
      if(!val)
        return 'success'
      else {
        val = parseInt(val,10)
        if(isNaN(val))
          return 'error'
      }
    } else if(!val){
      return 'error'
    }
    switch(key){
      case 'mathBench':
        if(val < 0 || val > 100)
          return 'error'
        else
          return 'success'
      case 'cogAT':
        if(val < 0 || val > 160)
          return 'error'
        else
          return 'success'
      case 'dra':
        if(val < 0 || val > 70)
          return 'error'
        else
          return 'success'
      case 'elaTotal':
        if(val < 0 || val > 100)
          return 'error'
        else
          return 'success'
      case 'mathTotal':
        if(val < 0 || val > 100)
          return 'error'
        else
          return 'success'
      case 'behaviorObservation':
        if(val < 0 || val > 54)
          return 'error'
        else
          return 'success'
      case 'dial4':
        if(val < 0 || val > 105)
          return 'error'
        else
          return 'success'
      default:
        return null
    }
  }