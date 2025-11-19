<script setup lang="ts">
import type { BlogInfo } from 'types/type'
import { formatDate, getPostsInfos } from '@/utils'

const props = defineProps<{
  category: string
}>()
const postsInfos = ref<BlogInfo[]>([])
watchEffect(async () => {
  const infos = await getPostsInfos()
  // 过滤掉不是同一分类的
  postsInfos.value = infos.filter((item) => {
    return item.catgory === props.category
  }).sort((a, b) => {
    const date1 = new Date(formatDate(a.date))
    const date2 = new Date(formatDate(b.date))
    return date2.getTime() - date1.getTime()
  })
})

const router = useRouter()
function toDetail(path: string) {
  router.push(path)
}

// todo: 添加时间轴
</script>

<template>
  <div class="article-list prose w-600px">
    <template v-for="item of postsInfos" :key="item.path">
      <div class="article-item mb-15px" @click="toDetail(item.path)">
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

.article-item {
  position: relative;
  cursor: pointer;
   opacity: 0.7;
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
