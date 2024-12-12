import { BREAK } from './const'
import { TBreak, TSetlist } from './types'

// validate form of GEMA-Werknummer
const gemaRegex = '^\\d{1,8}-\\d{3}$'

export const hasMatchingBrackets = (str: string): boolean => {
  let depth = 0
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '[') {
      depth++
      if (depth > 1) return false
    } else if (str[i] === ']') {
      depth--
      if (depth < 0) return false
    }
  }
  return depth === 0
}

export const displayDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export const validateGemaWerknummer = (gemaWerknummer: string): boolean => {
  return new RegExp(gemaRegex).test(gemaWerknummer)
}

export const validateDuration = (minutes: number, seconds: number): boolean => {
  return minutes >= 0 && seconds >= 0 && seconds < 60
}

/**
 * Flattens a 2D array of numbers (setlist) into a 1D array with a specific format.
 * Each sub-array is prefixed with a BREAK element and the final array is also suffixed with a BREAK element.
 **/

export const flattenSetlist = (setlist: number[][]): TSetlist => {
  setlist = setlist.filter((subArray) => subArray.length > 0)
  if (setlist.length === 0) return [BREAK as TBreak]
  if (setlist.length === 1 && setlist[0].length === 1) return [setlist[0][0]]

  return setlist
    .flatMap((subArray) => [BREAK as TBreak, ...subArray.map(Number)])
    .concat([BREAK as TBreak])
}
