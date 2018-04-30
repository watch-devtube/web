<template lang="pug">
	.watch
		iframe(:src="'https://www.youtube.com/embed/' + id" width="560" height="315" frameborder="0")
</template>

<script>
export default {
  props: ['id']
}
 </script>