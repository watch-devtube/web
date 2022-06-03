<template lang="pug">
.container
  h2.title.is-5 Topics
  .item.is-size-7.mb-1(v-for="topic in allTopics")
    router-link.has-text-grey.has-text-weight-bold(:to="'/~' + encodeURIComponent(topic.key)") {{topic.key}}
    | &nbsp;
    span.tag.is-small.is-light {{topic.count}}      
  br
  br
  h2.title.is-5 Speakers
  .item.is-size-7.mb-1(v-for="speaker in allSpeakers")
    router-link.has-text-grey.has-text-weight-bold(:to="'/@' + speaker.key") {{speaker.name}}
    | &nbsp;
    span.tag.is-small.is-light {{speaker.count}}
</template>
<script>
import { api } from "../src/api";
export default {
  data: () => {
    return {
      component: "",
      allSpeakers: [],
      allTopics: []
    };
  },
  created() {
    api.get("/stats").then(({ data: { speakers, topics } }) => {
      this.allSpeakers = speakers;
      this.allTopics = topics;
    });
  }
};
</script>
<style lang="scss">
a {
  color: #4a4a4a;
}
.tag.is-light {
  font-size: 10px;
  color: hsl(0, 0%, 29%);
  background-color: #fff !important;
  border: 1px solid #f5f5f5 !important;
}
</style>
