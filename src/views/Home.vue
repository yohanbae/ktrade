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
      files:[]
    }
  },
  methods: {
    upload: function() {
      if (this.files.length != 0) {
        // Filter IMG files only
        // let nonImageCount = 0
        // this.files.forEach(val => {
        //   let fileExt = val.name.slice(val.name.length - 3, val.name.length)
        //   if(fileExt !== "jpg" && fileExt !== "png" && fileExt !== "jpeg") nonImageCount += 1
        // })
        // if(nonImageCount > 0) return false


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
