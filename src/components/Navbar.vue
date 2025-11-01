<script setup lang="ts">

</script>

<template>
  <div class="navbar flex justify-between p4">
    <div class="logo">
      <RouterLink to="/">
        <img src="../assets/vue.svg" alt="Logo">
      </RouterLink>
    </div>
    <div class="nav-list prose text-base flex items-center">
      <div class="nav mr-4 op50 hover:op100">
        <a href="">blog</a>
      </div>
      <div class="nav mr-4 op50 hover:op100">
        <a href="https://github.com/windyeasy">github</a>
      </div>
    </div>
  </div>
</template>
