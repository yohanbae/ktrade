import Vue from 'vue'
import Vuex from 'vuex'
import firebase from "firebase/app"
import 'firebase/storage';  // <----
// import router from './router'


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    user: null
  },
  mutations: {
    loggedIn(state, payload) {
      state.user = payload
    },
    updateUser(state, payload) {
      state.user.userMore = {
        phone: payload.phone,
        nickname: payload.nickname,
        email: payload.email,
        location: payload.location,
        uid: state.user.userMore.uid
      }
      state.user.completed = true
      return "good"
    }
  },
  actions: {
    async afterRegister(context, payload) {
      let user = await firebase.auth().currentUser
      context.commit('loggedIn', {loggedIn: true, user, userMore: payload.userMore, completed: true})
    },
    async loggedIn(context) {
      if(!this.state.user) {
        try {
          await firebase.auth().onAuthStateChanged(async function(user) {
            try {
              let userPhone = await firebase.firestore().collection("users").doc(user.phoneNumber).get()
              if(userPhone.data().email) {
                context.commit('loggedIn', {loggedIn: true, user, userMore: userPhone.data(), completed: true})
              } else {
                context.commit('loggedIn', {loggedIn: true, user, userMore: userPhone.data(), completed: false})                
                console.log("Login: Success | But no signup completed")
              }
            } catch {
              console.log("Login: False")
              context.commit('loggedIn', {loggedIn: false})
            }  
          })
        } catch {
          console.log("Nerwork Error. Failed Login. Try again")
          context.commit('loggedIn', {loggedIn: false})
        }
      }
    },
    async updateUser(context, payload) {
      return new Promise((resolve, reject) => {
        if(!this.state.user) return "Not logged In"
        try {
          firebase.firestore().collection("users").doc(this.state.user.userMore.phone).set({
            phone: this.state.user.userMore.phone,
            nickname: payload.nickname,
            email: payload.email,
            location: payload.location,
            uid: this.state.user.userMore.uid
          }).then(async function() {
            await context.commit('updateUser', payload)
            resolve(true)
          }).catch(function(err) {
            console.log("Error. Information is not in the Database.", err)
            reject()
          })
        }catch(err){
          console.log("Network error, please try again.", err)
        }
      })
    },
    async getUserUid() {
      console.log('getUserUID working', this.$state.user.userMore.uid)
      return this.$state.user.userMore.uid
    }
  }
})

export default store