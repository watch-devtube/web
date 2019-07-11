// <template lang="pug">
//   .chat
//     .type.has-background-light(style="padding: 10px")
//       p.is-size-7.is-uppercase Live chat
//     .messages(ref="chatWindow")
//       article.is-borderless.media(v-for="(msg, i) in messages")
//         figure.media-left
//           p.image.is-24x24
//             img.is-rounded(:src="msg.pic")
//         .media-content.is-size-7
//           strong {{msg.name}}
//           span.is-pulled-right.has-text-grey(style="font-size: 8px" v-if="msg.ts") {{msg.ts.seconds | dateFmt}}
//           .content {{msg.message}}
//     br    
//     .type.has-background-light(style="padding: 10px" v-if="auth.user")
//       input.input.is-borderless.is-shadowless.is-radiusless.is-small(type="text" placeholder="Say something..." v-model.trim="message" v-on:keyup.enter="send()") 
//       br
//       .columns
//         .column
//             a(@click="$emit('heart-pressed')")
//               i.fa.fa-heart
//         .column.has-text-right
//           a.button.is-small(:disabled="message.length < 1 || message.length > 120" @click="send()")
//             font-awesome-icon(:icon="['far', 'paper-plane']")
//           p.is-size-7.has-text-grey
//             | {{message.length}}/120            
//     article.message.is-danger.is-small(v-else)
//       .message-body Log in to send messages.
// </template>
// <style lang="scss" scoped>
//   .is-borderless {
//     border: none !important;
//   }

//   .messages {
//     padding: 15px;
//     height: 400px;
//     overflow-y: scroll;
//   }

//   input {
//     border-bottom: 1px solid hsl(0, 0%, 86%) !important;
//   }

//   input[type='text'] {
//     margin-bottom: 0.5rem;
//   }
// </style>
// <script>
//   import { firestore, ts } from './helpers/firebase'
//   import { mapState, mapActions, mapGetters } from 'vuex'
//   export default {
//     props: ['room'],
//     created() {
//       firestore
//         .collection('chat-rooms')
//         .doc(this.room)
//         .collection('messages')
//         .orderBy("ts", "asc")
//         .onSnapshot(messages => {          
//           this.messages = messages.docs.map(it => it.data())
//           const w = this.$refs.chatWindow
//           w.scrollTop = w.scrollHeight
//         })
//     },
//     computed: {
//       ...mapState([ 'auth' ]),
//     },
//     updated: function () {
//       this.$nextTick(() => {
//         // Code that will run only after the
//         // entire view has been re-rendered
//         const w = this.$refs.chatWindow
//         w.scrollTop = w.scrollHeight        
//       })
//     },
//     methods: {
//       send() {
//         if (this.message.length < 1 || this.message.length > 120) {
//           return
//         }
//         firestore
//           .collection('chat-rooms')
//           .doc(this.room)
//           .collection('messages')
//           .add({
//             pic: this.auth.user.photoUrl,
//             name: this.auth.user.name,
//             message: this.message,
//             ts: ts
//           })
//         this.message = ""
//       }
//     },
//     data() {
//       return {
//         messages: [],
//         message: ""
//       }
//     }
//   }
// </script>