<template lang="pug">
.modal.is-active
  .modal-background
  .modal-content  
    .columns.is-mobile
      .column.is-10.is-offset-1.window
        h1.title.has-text-weight-bold.is-4.has-text-centered Submit a talk to DevTube
        p.has-text-centered 
          font-awesome-icon(:icon="['far', 'heart']").has-text-danger
          span  You'll get karma points if the talk gets published (and for every like the talk gets).
        br
        .beforeFetching(v-if="!video.objectID")
          .columns        
            .column
              .field
                label.label Video URL
                .control(v-bind:class="{ 'is-loading': isLoading }")
                  input.input(type="text", v-model="url" @input="urlChanged()" :disabled="isLoading" placeholder="https://youtube.com/watch?v=AEtCEt44vlE?x")
                p.help(v-if="isLoading") Fetching video from YouTube...
                p.help.has-text-danger(v-if="error") {{error}}
        .whenFetchingDone(v-else)
          .columns        
            .column
              .field
                .control
                  input.input(type="text", v-model="video.title" placeholder="Title")
                p.help {{video.duration | durationFull}} • {{video.recordingDate | year}} • {{video.channelTitle}}
          .columns
            .column
              .field.is-grouped.is-grouped-multiline
                .control(v-for="(speakerName, index) in video.speakerNames")             
                  .tags.has-addons
                    span.tag.is-medium {{speakerName}}
                    a.tag.is-delete.is-medium(@click="removeSpeaker(index)")                                  
          .columns        
            .column
              .field
                .control
                  input.input(type="text", v-model="newSpeakerName" placeholder="Elon Musk")
                p.help(v-if="suggestedSpeaker")
                  a(@click="addSpeaker(suggestedSpeaker.name, suggestedSpeaker.twitter)")
                    font-awesome-icon(:icon="['fa', 'plus']")
                    |  {{suggestedSpeaker.name}}
          .columns        
            .column
              .field
                .control.has-icons-left
                  input.input(type="text", v-model="newSpeakerTwitter" placeholder="elonmusk")
                  .icon.is-small.is-left
                    font-awesome-icon(:icon="['fab', 'twitter']")   
              button.button.is-pulled-right.is-text(@click="addSpeaker(newSpeakerName, newSpeakerTwitter)") Add speaker   
          .columns
            .column
              .field.is-grouped.is-grouped-multiline
                .control(v-for="(topic, index) in video.topics" :key="topic")             
                  .tags.has-addons
                    span.tag.is-medium {{topic}}
                    a.tag.is-delete.is-medium(@click="removeTopic(index)")                
          .columns
            .column
              .field
                .control.has-icons-left
                  input.input(type="text" placeholder="Future" v-model="newTopic" v-on:keyup.enter="addTopic(newTopic)")
                  .icon.is-small.is-left
                    font-awesome-icon(:icon="['fa', 'hashtag']")
                p.help(v-if="suggestedTopic")
                  a(@click="addTopic(suggestedTopic)")
                    font-awesome-icon(:icon="['fa', 'plus']")
                    |  {{suggestedTopic}}
              button.button.is-pulled-right.is-text(@click="addTopic(newTopic)") Add topic
        .columns
          .column
            .field
              .control
                .buttons.is-pulled-right
                  button.button.is-success(@click="submitVideo()" v-bind:class="{'is-loading': isSaving}" :disabled="isSubmitButtonDisabled") Submit
                  button.button(@click="close()") Cancel
    .modal-close.is-large(aria-label="close" @click="close()")
</template>
<script>
export default {};
</script>
<style scoped>
.window {
  margin-top: 5rem;
  background: white;
  border-radius: 10px;
  padding: 4.5rem;
}
.title {
  letter-spacing: -1px;
}
</style>
<script>
import { api } from "./api";
import parseUrl from "parse-url";

export default {
  data: () => {
    return {
      url: "",
      allSpeakers: [],
      allTopics: [],

      isSaving: false,
      isLoading: false,

      newSpeakerName: "",
      newSpeakerTwitter: "",
      newTopic: "",

      error: "",

      video: {
        objectID: undefined,
        speakerNames: [],
        speakerTwitters: [],
        topics: []
      }
    };
  },
  computed: {
    isSubmitButtonDisabled() {
      return (
        !this.video.objectID ||
        !this.video.title ||
        !this.video.speakerNames?.length ||
        !this.video.topics?.length
      );
    },
    suggestedSpeaker() {
      const by = this.newSpeakerName;
      if (by?.length < 2) {
        return "";
      }
      return this.allSpeakers.find(speaker => speaker.name.startsWith(by));
    },
    suggestedTopic() {
      const by = this.newTopic;
      if (by?.length < 2) {
        return "";
      }
      return this.allTopics.find(topic => topic.startsWith(by));
    }
  },
  created() {
    api.get("/stats").then(({ data: { speakers, topics } }) => {
      this.allSpeakers = speakers.map(({ key, name }) => ({
        twitter: key,
        name
      }));
      this.allTopics = topics.map(({ key }) => key);
      document.documentElement.classList?.add("is-clipped");
    });
  },
  methods: {
    urlChanged() {
      // https://youtube.com/watch?v=AEtCEt44vlE
      const videoID = this.url && parseUrl(this.url)?.query?.v;
      if (videoID) {
        this.isLoading = true;
        api
          .get("/youtube/" + videoID)
          .then(({ data }) => {
            this.error = data.error;
            if (!data.error) {
              Object.assign(this.video, data);
            }
          })
          .finally(() => (this.isLoading = false));
      }
    },
    addSpeaker(name, twitter) {
      if (!name || !twitter) {
        return;
      }

      this.video.speakerNames.push(name);
      this.video.speakerTwitters.push(twitter);

      this.newSpeakerName = "";
      this.newSpeakerTwitter = "";
    },
    addTopic(topic) {
      if (!topic) {
        return;
      }

      this.video.topics.push(topic);
      this.newTopic = "";
    },
    removeSpeaker(index) {
      this.video.speakerNames.splice(index, 1);
      this.video.speakerTwitters.splice(index, 1);
    },
    removeTopic(index) {
      this.video.topics.splice(index, 1);
    },
    submitVideo() {
      this.isSaving = true;
      api
        .post("/videos", this.video)
        .then(() => this.close())
        .finally(() => (this.isSaving = false));
    },
    close() {
      this.$emit("close");
      document.documentElement.classList?.remove("is-clipped");
    }
  }
};
</script>
