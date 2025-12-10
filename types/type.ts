export interface CategoryItem {
  title: string
  path: string
}

export interface BlogInfo {
  id: string | number
  title: string
  path: string
  /**
   * @default zh
   */
  lang?: string
  catgory: string
  date: string
}
