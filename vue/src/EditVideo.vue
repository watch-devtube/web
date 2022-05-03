<template lang="pug">
  .modal(v-bind:class="{'is-active': isPopupVisible}")
    .modal-background
    .modal-content
      .columns.is-mobile
        .column.is-10.is-offset-1.register
          .columns
            .column.has-text-centered
              h1.title.has-text-weight-bold.is-4
              .field
                .control
                  textarea.is-small.textarea(:value="video" @input="editVideo" rows="30")
          .columns
            .column
              .field
                .control
                  label.checkbox
                    input(type="checkbox" v-model="tweet") 
                    |  Tweet        
            .column        
              .field
                .control
                  .buttons.is-pulled-right
                    button.button.is-success(@click="saveVideo()") Approve
      .modal-close.is-large(aria-label="close" @click="hidePopup()")    
</template>
<script>
export default {};
</script>
<style scoped>
.register {
  margin-top: 5rem;
  background: white;
  border-radius: 10px;
  padding: 4.5rem;
}

.title {
  letter-spacing: -1px;
}

.description {
  margin-top: 1rem;
  margin-bottom: 1rem;
  font-size: 1.15rem;
}
</style>
<script>
import { mapGetters, mapState, mapActions } from "vuex";
export default {
  data: () => {
    return {
      tweet: false
    };
  },
  computed: {
    ...mapState("edit", ["video"]),
    ...mapGetters("edit", ["isPopupVisible"])
  },
  methods: {
    saveVideo() {
      this.$store.dispatch("edit/saveVideo", { tweet: this.tweet });
    },
    editVideo(e) {
      this.$store.commit("edit/editVideo", e.target.value);
    },
    ...mapActions("edit", ["hidePopup"])
  }
};
</script>
