<template lang="pug">
footer.footer.has-background-white
  .content.has-text-centered.is-size-6
    p 
      | Coded at night under caffeine by 
      a(href="https://twitter.com/eduardsi" rel="nofollow noopener noreferrer") @eduardsi
      | . No ads, no tracking, open source.
    p
      strong
        | 🚀 Inspired by 
        a(href='https://devternity.com' target='_blank') DevTernity 
        | &ndash; the top software developer conference.
    p.is-size-6
      a.mr-3.has-text-grey-dark(href='https://github.com/watch-devtube/web' rel="nofollow noopener noreferrer"): font-awesome-icon(:icon="['fab', 'github']")
      a.mr-3.has-text-grey-dark(href='https://twitter.com/watchdevtube' rel="nofollow noopener noreferrer"): font-awesome-icon(:icon="['fab', 'twitter']")
      a.mr-3.has-text-grey-dark(href='mailto:hello@dev.tube'): font-awesome-icon(:icon="['fa', 'envelope']")
      a.mr-3.has-text-grey-dark(href='https://dev.tube/rss.xml'): font-awesome-icon(:icon="['fa', 'square-rss']")
</template>
