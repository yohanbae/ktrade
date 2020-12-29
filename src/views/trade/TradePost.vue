<template>
  <div class="home">
    <div class="container-top">
			<div><b>POST NEW ITEM</b></div>
		</div>

    <div v-if="loaded">
      <v-form>
        <v-text-field outlined label="Title" v-model="title"></v-text-field>
        <v-text-field outlined label="Category" v-model="category"></v-text-field>
        <v-text-field outlined label="What item do you have?" v-model="have"></v-text-field>
        <v-text-field outlined label="What item do you want?" v-model="want"></v-text-field>
        <v-textarea outlined name="input-7-4" label="Describe about what you have and want" placeholder="ex) Item type: photocard or poster, size of item" v-model="description"></v-textarea>
        <v-file-input
          label="Upload a photo of your item"
          accept="image/*"
          name="uploadFieldName"
          @change="filesChange"
          class="input-file"
        ></v-file-input>
        <div class="text-right">
          <v-btn class="white--text" color="#262222" @click="upload()" :disabled="onWait">
            {{ onWait ? 'Uploading' : 'Post Item' }}
          </v-btn>
        </div>
      </v-form>
    </div>
    <div v-else>Loading..</div>
  </div>
</template>

<style lang="scss" scoped>
.home { margin-bottom:10px;}
.container-top{
	margin: 20px 0;
  margin-bottom:30px;
}
</style>

<script>
import firebase from "firebase/app"
import 'firebase/storage';  // <----
import GenerateID from "../../library/GenerateID"

export default {
  name: 'TradePost',
  components: {
    // HelloWorld
  },
  data: function() {
    return {  
      title: "",      
      category:"photocard",
      uploader:"",
      location:"",
      have:"",
      want:"",
      description: "",
      file:[],
      loaded: false,
      onWait: false
    }
  },
  methods: {
    upload: async function() { // Upload to Firebase DB
      let id = GenerateID()
      const imgId = GenerateID()
      
      if (this.file && this.title !== "" && this.have !== "" && this.want !== "" && this.description !== "'") {
        // Filter IMG files only
        let title = this.title
        let want = this.want
        let have = this.have
        let category = this.category
        let description = this.description
        let location = this.$store.state.user.userMore.location
        let uploader = this.$store.state.user.userMore.nickname
        let uploaderUid = this.$store.state.user.userMore.uid
        let staff = this.$store.state.user.userMore.staff ? true : false

        let fileExt = this.file.name.slice(this.file.name.length - 3, this.file.name.length)
        if(fileExt !== "jpg" && fileExt !== "png") {
          this.$root.$refs.A.triggerError("ONLY JPG OR PNG FORMAT AVAILABLE");
          return false
        }

        this.onWait = true
        // If all images are confirmed, then go to next step
        //create a storage reference
        // let storage = firebase.storage().ref(`images/${this.files[i].name}`);
        let storageRef = firebase.storage().ref();
        let currentUpload = storageRef.child(`images/${id}_${imgId}_${this.file.name}`); // 여기 안에 들어간게, "참조코드". 이거를 가지고 나중엥 삭제도 하고 그러는 거다.

        //upload file
        let metadata = {
          contentType: 'image/jpeg',
        };

        let upload = currentUpload.put(this.file, metadata)
        let path = this
        upload.on("state_changed", function progress() {
            console.log("Uploading")
          },  
          function error() {
            path.$root.$refs.A.triggerError("UPLOADING FAILED. TRY AGAIN");
            this.onWait = false
          },
          function complete() {              
            upload.snapshot.ref.getDownloadURL()
              .then(async function(url) {
                try {
                  await firebase.firestore().collection("items").doc(id).set({
                    title,
                    id,
                    location,
                    uploader,
                    uploaderUid,
                    want,
                    have,
                    category,
                    image: url,
                    trader: "",
                    description,
                    status: "open",
                    staff,
                    date: firebase.firestore.Timestamp.now()
                  })
                }catch {
                  path.$root.$refs.A.triggerError("NETWORK ERROR");
                  console.log("nerwork problem. Uploade File success but couldnt write document")
                }
              })
              .catch(function() {
                path.$root.$refs.A.triggerError("NETWORK ERROR");
                this.onWait = true
              })
              path.$root.$refs.A.triggerError("TRADE ITEM POSTING");
              setTimeout(() => {
                path.$router.push('/trade')                
              }, 1500);
          }
        );        
      } else {
        this.$root.$refs.A.triggerError("PLEASE FILL ALL INFORMATION");
      }
    },
    filesChange: function(file) {
      this.file = file
    },
    checkUser: function(){
      if(!this.$store.state.user) {
        this.$root.$refs.A.triggerError("PLEASE LOGIN FIRST");
        this.$router.push('/register')
      }      
            
      if(this.myUser && !this.myUser.completed) {
        this.$root.$refs.A.triggerError("PLEASE LOGIN FIRST");
        this.$router.push('/register')
      }

			if(this.myUser && this.myUser.completed) {
        this.loaded = true
      }          
    }
  },
	computed: {
		myUser() { return this.$store.state.user },
	},
	watch: {
		myUser: async function() {
      this.checkUser()
		}
	},
  mounted: async function() {
    if(this.myUser) {
      this.checkUser()      
    }
  }
}
</script>
