<script setup lang="ts">
import type { CategoryItem } from 'types/type'
import { getCategoryInfos } from '@/utils'

const route = useRoute()
function isActive(path: string) {
  return path === route.path
}

const category = ref<CategoryItem[]>([])
watchEffect(async () => {
  category.value = await getCategoryInfos()
})
</script>

<template>
  <div class="category prose" flex>
    <template v-for="item of category" :key="item.path">
      <RouterLink :to="item.path" class="category-item mr4" :class="{ active: isActive(item.path) }">
        {{ item.title }}
      </RouterLink>
    </template>
  </div>
</template>

<style scoped>
.category {
  font-size: 28px;
}

.category-item {
  opacity: 0.8;
}

.active {
  font-weight: bold;
    opacity: 1;
}
</style>
