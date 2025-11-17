import type { BlogInfo, CategoryItem } from 'types/type'
import { format } from 'date-fns'

export const isDark = useDark()
export function toggleDark() {
  isDark.value = !isDark.value
}

/**
 * 获取博客文章列表信息
 * @returns 返回博客文章列表信息
 */
export async function getPostsInfos(): Promise<BlogInfo[]> {
  const modules = await import.meta.glob<any>('../../pages/posts/*.md', { eager: true })
  const infos: BlogInfo[] = Object.entries(modules).map(([key, module]) => {
    const path = /pages[/\\](.*?)\.md$/.exec(key)![1]
    return {
      id: key,
      path,
      ...module.frontmatter,
    }
  })
  return infos
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

/**
 * 获取分类信息
 */
export async function getCategoryInfos(): Promise<CategoryItem[]> {
  const modules = await import.meta.glob<any>('../../pages/*.md', { eager: true })
  const categoryList: CategoryItem[] = []
  Object.keys(modules).forEach((key) => {
    if (!key || key.includes('index') || key.includes('posts'))
      return
    const title = /pages[/\\](.*?)\.md$/.exec(key)![1]
    categoryList.push({
      title: firstLetterToUpperCase(title),
      path: `/${title}`,

    })
  })
  return categoryList
}

export function formatDate(date: string | number, fmt = 'yyyy-MM-dd') {
  return format(date, fmt)
}
