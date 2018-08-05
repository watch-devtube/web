export default {
  namespaced: true,
  state: {
      show: false,
      title: '',
      text: '',
      type: '' 
  },
  mutations: {
    error(state, { error, text = 'Please see logs and submit an issue: bit.ly/devtube-issue', title = 'Something went wrong!' }) {
        state.show = true
        state.title = title
        state.text = text
        state.type = 'error'
        console.error(error)
    },
    disableNotify(state) {
        state.show = false
    }
  }
}