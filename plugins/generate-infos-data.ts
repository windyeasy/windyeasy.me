import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fg from 'fast-glob'
import matter from 'gray-matter'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * '/pages/**'用于自动生成路由，使用import.glob读取信息vite-ssg打包后会出现问题，使用异步的方式可能导致不能被爬虫爬取
 * 在打包时通过这个脚本生成json数据，用于打包后的静态文件使用
 */
const postsDataInfosFileName = 'postsinfos-data.json'
const categoryInfosFileName = 'categoryinfos-data.json'

function resolveConfigPath(configArg: string) {
  return path.isAbsolute(configArg) ? configArg : path.resolve(__dirname, configArg)
}

async function readFilePathsByPath(filePath: string, filterKeys: string[] = []) {
  const files = await fg(filePath, { cwd: __dirname, absolute: true })
  return files.filter((file) => {
    for (const key of filterKeys) {
      if (file.includes(key)) {
        return false
      }
    }
    return true
  })
}

async function readInfosByPath(filePath: string, filterKeys: string[] = []) {
  const files = await readFilePathsByPath(filePath, filterKeys)

  const result = files.map((file, index) => {
    const raw = fs.readFileSync(file, 'utf-8')
    const { data } = matter(raw)
    const path = /pages[/\\](.*?)\.md$/.exec(file)![1]
    const info = {
      id: index + 1,
      path,
      ...data,
    }
    return info
  })
  return result
}

async function writePostsInfos() {
  const postsInfos = await readInfosByPath('../pages/posts/**/*.md')
  fs.writeFileSync(resolveConfigPath(`../src/data/${postsDataInfosFileName}`), JSON.stringify(postsInfos))
}
export function firstLetterToUpperCase(str: string) {
  if (!str || typeof str !== 'string')
    return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

async function writeCategoryInfos() {
  const files = await readFilePathsByPath('../pages/**/*.md', ['posts', 'index', '404'])
  const data = files.map((key) => {
    const title = /pages[/\\](.*?)\.md$/.exec(key)![1]
    return {
      title: firstLetterToUpperCase(title),
      path: `/${title}`,
    }
  })
  fs.writeFileSync(resolveConfigPath(`../src/data/${categoryInfosFileName}`), JSON.stringify(data))
}

async function main() {
  await writePostsInfos()
  await writeCategoryInfos()
}

export default function GenerateInfosData(): Plugin {
  return {
    name: 'generate-infos-data',
    apply: 'serve',
    buildStart() {
      main()
    },
    handleHotUpdate(ctx) {
      if (ctx.file.endsWith('.md')) {
        main()
      }
    },
  }
}
