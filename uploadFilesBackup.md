<template>
  <div class="home">

    <div>
      <h5>Post Item for the TRADE</h5>
      <v-form>
        <v-container>
          <v-text-field outlined label="Title" v-model="title"></v-text-field>
          <v-text-field outlined label="Category" v-model="category"></v-text-field>
          <v-text-field outlined label="I have" v-model="have"></v-text-field>
          <v-text-field outlined label="I want" v-model="want"></v-text-field>
          <v-file-input
            multiple
            label="Please upload your item images"
            accept="image/*"
            name="uploadFieldName"
            @change="filesChange"
            class="input-file"
          ></v-file-input>
          <v-btn @click="upload()">Post Item</v-btn>
        </v-container>
      </v-form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import firebase from "firebase/app"
import 'firebase/storage';  // <----

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
      files:[]
    }
  },
  methods: {
    upload: function() { // Upload to Firebase DB
      if (this.files.length != 0) {
        // Filter IMG files only
        let nonImageCount = 0
        this.files.forEach(val => {
          let fileExt = val.name.slice(val.name.length - 3, val.name.length)
          if(fileExt !== "jpg" && fileExt !== "png" && fileExt !== "jpeg") nonImageCount += 1
        })
        if(nonImageCount > 0) return false
        // If all images are confirmed, then go to next step
        for (let i = 0; i < this.files.length; i++) {
          //create a storage reference
          // let storage = firebase.storage().ref(`images/${this.files[i].name}`);
          let storageRef = firebase.storage().ref();
          let currentUpload = storageRef.child(`images/${this.files[i].name}`); // 여기 안에 들어간게, "참조코드". 이거를 가지고 나중엥 삭제도 하고 그러는 거다.
          //upload file

          let metadata = {
            contentType: 'image/jpeg',
          };

          let upload = currentUpload.put(this.files[i], metadata)

          upload.on("state_changed", function progress(snapshot) {
              console.log("progress bar", snapshot)
            },  
            function error() {
              alert("error uploading file");
            },
            function complete() {              
              upload.snapshot.ref.getDownloadURL()
                .then(function(url) {
                  console.log(url);
                })
                .catch(function(error) {
                  console.log("error encountered", error);
                })
              console.log(`upoaded`)
            }
          );

        }
      } else {
        console.log("no file chosen")
      }
    },
    filesChange: function(files) {
      this.files = files
    }
  },
  mounted: async function() {
    // try {
    //   let meme = await firebase.firestore().collection('testcol').doc("minju").get()
    //   console.log(meme.data().name)
    // } catch(err) {
    //   console.log(err)
    // }
  }
}
</script>
