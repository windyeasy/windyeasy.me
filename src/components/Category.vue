<script setup lang="ts">
import { categoryInfos } from '@/data'

const route = useRoute()
function isActive(path: string) {
  return path === route.path
}

const category = computed(() => {
  return categoryInfos
})
</script>

<template>
  <div class="category prose" flex>
    <template v-for="item of category" :key="item.path">
      <RouterLink :to="item.path" replace class="category-item mr4" :class="{ active: isActive(item.path) }">
        {{ item.title }}
      </RouterLink>
    </template>
  </div>
</template>

<style scoped>
.category {
  font-size: 28px;
}

.category a {
  border: none;
}

.category a:hover {
  border: none;
}

.category-item {
  opacity: 0.8;
}

.active {
  font-weight: bold;
    opacity: 1;
}
</style>
