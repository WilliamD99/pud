import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function throttle(mainFunction: (...args: any[]) => void, delay: number) {
  let timerFlag: NodeJS.Timeout | null = null // Variable to keep track of the timer

  // Returning a throttled version
  return (...args: any[]) => {
    if (timerFlag === null) {
      mainFunction(...args)
      timerFlag = setTimeout(() => {
        timerFlag = null
      }, delay)
    }
  }
}
