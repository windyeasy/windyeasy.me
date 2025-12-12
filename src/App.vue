<script setup lang="ts">
onMounted(() => {
  const markdownBodyEl = document.querySelector('.markdown-body')
  if (markdownBodyEl) {
    const preEls = markdownBodyEl?.querySelectorAll('pre')
    if (preEls && preEls.length) {
      preEls.forEach((el: HTMLPreElement) => {
        const copyEl = document.createElement('button')

        copyEl.classList.add('copy')
        copyEl.title = 'Copy Code'
        let copyFlag = false
        copyEl.addEventListener('click', async () => {
          if (copyFlag)
            return
          const parent = copyEl.parentElement
          const text = parent?.textContent
          if (text) {
            await navigator.clipboard.writeText(text)
            copyFlag = true
            copyEl.classList.add('copied')
            copyEl.textContent = 'Copied'
            setTimeout(() => {
              copyEl.classList.remove('copied')
              copyEl.textContent = ''
              copyFlag = false
            }, 2000)
          }
        })

        el.appendChild(copyEl)
      })
    }
  }
})
</script>

<template>
  <Navbar />
  <main class="prose min-w-400px max-w-1200px m-auto">
    <BackPage />
    <RouterView />
    <Footer />
  </main>
</template>

<style>
.prose .markdown-body pre {
  position: relative;
}

/* copy */
.prose .markdown-body pre .copy {
    direction: ltr;
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 3;
    border: 1px solid var(--c-code-copy-border-color);
    border-radius: 4px;
    width: 40px;
    height: 40px;
    background-color: var(--c-code-copy-bg);
    opacity: 0;
    cursor: pointer;
    background-image: var(--icon-copy);
    background-position: 50%;
    background-size: 20px;
    background-repeat: no-repeat;
    transition: border-color .25s, background-color .25s, opacity .25s;
    text-align: center;
    box-sizing: border-box;
}

.prose .markdown-body pre:hover .copy {
  opacity: 1;
}

/* copied */
.prose .markdown-body pre .copy.copied {
   border-radius: 0 4px 4px 0;
   background-image: var(--icon-copied);
   width: 90px;
   background-position: 90% 50%;
   text-align: left;
   padding-left: 10px;
}
</style>
