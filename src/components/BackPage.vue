<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const isShowBackPage = computed(() => {
  return route.path.includes('posts')
})
// todo: 完善返回以及路由的切换
function goBack() {
  router.back()
}
</script>

<template>
  <button v-if="isShowBackPage" class="back-page flex items-center" @click="goBack">
    <span class="icon ">
      &lt;-
    </span>
    <span class="ml-2">
      上一页
    </span>
  </button>
</template>

<style scoped>
.back-page {
  position: absolute;
  right: 0;
  top: -40px;
  border: none;
  outline: none;
  border-radius: 4px;
  background-color: transparent;
  padding: 6px 20px 8px;
  color: var(--fg-deeper);
  opacity: 0.6;
  cursor: pointer;
}

.back-page:hover {
  opacity: 1;
}

.back-page .icon {
  border-radius: 50%;
  border: 1px solid var(--fg-deeper);
  padding: 2px 4px 4px;
  font-size: 12px;
}
</style>
