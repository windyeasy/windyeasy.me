<script setup lang="ts">
// import { toggleDark } from '@/utils'
</script>

<template>
  <div class="navbar flex justify-between py-4 px-8 mb-60px">
    <div class="logo">
      <RouterLink to="/">
        <img src="../assets/logo.png" w50px h50px alt="Logo">
      </RouterLink>
    </div>
    <div class="nav-list prose text-14px flex items-center">
      <div class="nav mr-5 op60 flex items-center hover:op100">
        <RouterLink to="/" replace title="Home">
          Home
        </RouterLink>
      </div>
      <div class="nav mr-5 op60 flex items-center hover:op100">
        <RouterLink to="/blog" replace title="Blog">
          Blog
        </RouterLink>
      </div>
      <!-- <div class="nav mr-5 op60 flex items-center hover:op100">
        <RouterLink to="/Category" title="Category">
          Category
        </RouterLink>
      </div> -->
      <div class="nav mr-5 flex items-center op60 hover:op100">
        <a href="https://github.com/windyeasy" title="Github">
          <i class="i-uil-github-alt inline-block" />
        </a>
      </div>
      <!-- <div class="nav  flex items-center op60 hover:op100">
        <a href="javascript:;" cursor-pointer title="Mode" @click="toggleDark">
          <i class="i-ri-sun-line dark:i-ri-moon-line inline-block" />
        </a>
      </div> -->
    </div>
  </div>
</template>
