<script setup lang="ts">
const router = useRouter()
const route = useRoute()

const isShowBackPage = computed(() => {
  return route.path.includes('posts')
})

function goBack() {
  router.back()
}
</script>

<template>
  <button v-if="isShowBackPage" class="back-page flex items-center justify-end" @click="goBack">
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
  position: fixed;
  z-index: 100;
  top: 70px;
  width: 820px;
  border: none;
  outline: none;
  border-radius: 4px;
  padding: 0px 20px 0px;
  color: var(--fg-deeper);
  opacity: 0.6;
  cursor: pointer;
  background-color: var(--bg);
}

@media screen and (max-width: 820px){
  .back-page {
    width: 100%;
  }
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
