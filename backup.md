<template>
  <div class="home">
    Hello HelloWorld
    {{username}}


    <div>
      Upload Files<br />
      <input type="file" multiple name="uploadFieldName" @change="filesChange($event.target.name, $event.target.files)" accept="image/*" class="input-file">
      <button @click="upload()">Upload</button>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import firebase from "firebase/app"
import 'firebase/storage';  // <----


export default {
  name: 'Home',
  components: {
    // HelloWorld
  },
  data: function() {
    return {  
      username: "IZONE",
      files:null
    }
  },
  methods: {
    upload: function() {
      if (this.files.length != 0) {
        //Loops through all the selected files
        for (let i = 0; i < this.files.length; i++) {

          //create a storage reference
          let storage = firebase.storage().ref(`images/${this.files[i].name}`);

          //upload file

          let metadata = {
            contentType: 'image/jpeg',
          };

          let upload = storage.put(this.files[i], metadata)

          upload.on("state_changed", function progress(snapshot) {
              console.log("progress bar", snapshot)
            },  
            function error() {
              alert("error uploading file");
            },
            function complete() {              
              storage
                .getDownloadURL()
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
        alert("No file chosen");
      }
    },

    filesChange: function(a, files) {
      this.files = files
    }
  },
  mounted: async function() {
    try {
      let meme = await firebase.firestore().collection('testcol').doc("minju").get()
      console.log(meme.data().name)
    } catch(err) {
      console.log(err)
    }
  }
}
</script>
