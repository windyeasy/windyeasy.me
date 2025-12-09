<script setup lang="ts">
import type { BlogInfo } from 'types/type'
import { postsInfos as initPostsInfos } from '@/data'
import { formatDate } from '@/utils'

const props = defineProps<{
  category: string
}>()
const postsInfos = ref<BlogInfo[]>([])

const router = useRouter()
function toDetail(path: string) {
  router.push(path)
}

const timelineDates: string[] = []

function fmtDateYear(date: string) {
  return formatDate(date, 'yyyy')
}

function isShowTimeline(date: string) {
  const year = fmtDateYear(date)
  if (timelineDates.includes(year)) {
    return false
  }

  timelineDates.push(year)
  return true
}

function getData() {
  const infos = initPostsInfos
  // 过滤掉不是同一分类的
  postsInfos.value = infos.filter((item) => {
    return item.catgory === props.category
  }).sort((a, b) => {
    // 通过时间排序
    const date1 = new Date(formatDate(a.date))
    const date2 = new Date(formatDate(b.date))
    return date2.getTime() - date1.getTime()
  })
}

getData()
</script>

<template>
  <div class="article-list prose w-600px">
    <template v-for="item of postsInfos" :key="item.path">
      <div class="article-item mb-15px" @click="toDetail(item.path)">
        <div v-show="isShowTimeline(item.date)" class="timeline-date  text-[50px] fw-bold">
          {{ fmtDateYear(item.date) }}
        </div>
        <div class="item-head flex text-lg items-center">
          <div class="title">
            {{ item.title }}
          </div>
          <div class="line" />
          <div class="date ">
            {{ formatDate(item.date) }}
          </div>
        </div>
        <div class="item-category ml-20px">
          分类：{{ item.catgory }}
        </div>
      </div>
    </template>
    <div v-if="!postsInfos.length" class="none-data text-lg py-3 op60">
      ~~~~~None Data~~~~~
    </div>
  </div>
</template>

<style scoped>
.article-list {
  color: var(--fg-deeper);

}

.timeline-date {
  color: var(--bg);
  text-shadow: 0px 0px 3px var(--fg);
  transform: translateX(-30px);
  line-height: 1;
  z-index: -1;
}

.article-item {
  position: relative;
  cursor: pointer;
  opacity: 0.7;
  z-index: 1;
}

.article-item:hover {
  opacity: 1;
}

.item-head .line {
  flex: 1;
  box-sizing: border-box;
  margin: 0px 20px;
  padding-top: -30px;
  border-top: 2px dashed var(--fg-deeper);
  opacity: 0.3;
}
</style>
