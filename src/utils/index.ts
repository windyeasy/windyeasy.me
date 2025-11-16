import type { BlogInfo } from 'types/type'

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
  /***
   * todo: 将中文分类映射为英文分类
   * 直接定义分类配置项，或者解析pages第一层文件目录，使用全英语分类，到时候通过I18n作一个映射中文，全中文
   * 后面我可能会使用英文写博客
   */
  return infos
}

/**
 * 将字符串首字母变小写
 * @param str 传入的字符串
 * @returns 返回首字母变小字符
 */
export function firstLetterToLowerCase(str: string): string {
  if (!str || typeof str !== 'string')
    return str
  return str.charAt(0).toLowerCase() + str.slice(1)
}
