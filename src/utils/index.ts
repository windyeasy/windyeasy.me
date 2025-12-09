import { format } from 'date-fns'

export const isDark = useDark()
export function toggleDark() {
  isDark.value = !isDark.value
}

/**
 * 将字符串首字母变小写
 * @param str 传入的字符串
 * @returns 返回首字母变小字符
 */
export function firstLetterToUpperCase(str: string): string {
  if (!str || typeof str !== 'string')
    return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function formatDate(date: string | number, fmt = 'yyyy-MM-dd') {
  return format(date, fmt)
}
