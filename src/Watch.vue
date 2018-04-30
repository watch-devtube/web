<template lang="pug">
	.watch
		iframe(:src="'https://www.youtube.com/embed/' + id" width="853" height="505" frameborder="0")
</template>

<script>
export default {
  props: ['id']
}
 </script>