<template>
  <div class="home">
    <div class="container-top">
			<div><b>FEEDBACK</b></div>
		</div>
    <v-form class="thewrap">
      <v-text-field outlined label="Title" v-model="title"></v-text-field>
      <v-text-field outlined label="Name" v-model="name"></v-text-field>
      <v-text-field outlined label="Email" v-model="email"></v-text-field>
      <v-textarea outlined name="input-7-4" label="Leave your feedback" v-model="description"></v-textarea>
      <div class="text-right">
        <v-btn class="white--text" color="#262222" @click="onFeedback()">SEND FEEDBACK</v-btn>
      </div>
    </v-form>
  </div>
</template>

<style lang="scss" scoped>
.home { margin-bottom:10px;}
.container-top{
	margin: 20px 0;
  margin-bottom:30px;
}
.thewrap {
  width: 100%;
	@media only screen and (min-width: 1366px) {
    width: 600px;
  }
}
</style>

<script>

export default {
  name: 'Feedback',
  components: {
    // HelloWorld
  },
  data: function() {
    return {  
      title: "",
      name: "",
      description: "",
      email: "",
      loaded: false
    }
  },
  methods: {
    onFeedback: async function() { // Upload to Firebase DB
      if(this.title !== "" && this.name !== "" && this.email !== "" && this.description !== "") {
        // SEND EMAIL
        // const requestOptions = {
        // 	method: "POST",
        // 	headers: { "Content-Type": "application/json" },
        // 	body: { title: "Vue POST Request Example" }
        // };
        // fetch("localhost:5000/email/feedback", requestOptions)
        // 	.then(response => response.json())
      }
    }
  },
}
</script>
