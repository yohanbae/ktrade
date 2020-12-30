<template>
  <div v-if="loaded">
    <div class="view-wrap my-4">
		<img class="onimage" alt="item" :src="pageData.image" @click="showSingle(pageData.image)" />
    <div class="mt-5">
		<div class="title"><strong>{{pageData.have}}</strong></div>
		<p class="mt-3">{{pageData.description}}</p>
      <v-divider class="my-6"></v-divider>
      <div>Uploader wants <strong>{{pageData.want}}</strong></div>
      <v-divider class="my-6"></v-divider>
			<div class="thetwo">
				<div>Posted by <strong>{{pageData.uploader}}</strong></div>
				<Ratings :userUid="pageData.uploaderUid" />
			</div>
			<div class="trusted" v-if="pageData.staff">
				<b>TRUSTED KT Staff</b>
			</div>
      <div class="mt-3">From <strong>{{pageData.location}}</strong></div>
      <v-divider class="my-6"></v-divider>
		<div class="text-small">If you have the <b>WANTED ITEM</b>, click <b>TRADE REQUEST</b> button</div>
		<div class="text-small">Once you send a request, you will be able to chat with the uploader</div>


      <div class="trade-btn-wrap">
        <div></div>
        <div class="text-right" v-if="myUser">
          <v-btn small color='#262222' class="white--text" v-if="requested.status" @click="onTransaction(requested.id)">Move to Transaction</v-btn>
          <v-btn small color='#262222' class="white--text" v-else @click="requestTrade">Request Trade</v-btn>
        </div>
      </div>

			<div v-if="myUser">
				<div class="mt-6" v-if="myUser.userMore && myUser.userMore.uid === pageData.uploaderUid">UPLOADER OPTION</div>
			</div>
			<v-divider class="my-2"></v-divider>
			<div v-if="myUser" class="uploader-btn-wrap">			
				<v-btn small color="#262222" class="white--text" @click="updateItem" v-if="myUser.userMore && myUser.userMore.uid === pageData.uploaderUid">UPDATE</v-btn>
				<v-btn small color="#262222" outlined class="ml-4" @click="closeItem" v-if="myUser.userMore && myUser.userMore.uid === pageData.uploaderUid">CLOSE</v-btn>
      </div>

      </div>
    </div>

		<VueEasyLightbox :visible="visible" :imgs="imgs" :index="index" @hide="handleHide"></VueEasyLightbox>

		<div class="text-center">
			<v-dialog v-model="dialog" width="500">
				<v-card>
					<v-card-title class="dialog-top headline lighten-2">
						Request Trade
					</v-card-title>

					<v-card-text>
						<v-form>
							<v-container>
								<v-text-field label="Item Name" v-model="title"></v-text-field>
								<v-textarea outlined name="input-7-4" label="Item description" v-model="description"></v-textarea>
								<v-file-input label="Please upload your item image" accept="image/*" name="uploadFieldName" @change="fileChange" class="input-file"></v-file-input>
							</v-container>
						</v-form>
						<v-divider></v-divider>
						<v-card-actions>
							<v-spacer></v-spacer>
							<v-btn small color="#262222" class="white--text" @click="sendRequest" :disabled="onWait">
								{{ onWait ? 'SENDING' : 'SEND REQUEST' }}								
							</v-btn>
						</v-card-actions>
					</v-card-text>
				</v-card>
			</v-dialog>

			<v-dialog v-model="dialogUpdate" width="500" v-if="myUser">
				<v-card v-if="myUser.userMore && myUser.userMore.uid == pageData.uploaderUid">
					<v-card-title class="dialog-top" color="white">
						Update Trade Item
					</v-card-title>
					<v-card-text>
						<v-form>
							<v-container>
								<v-text-field label="Title" v-model="updateTitle"></v-text-field>
								<v-textarea outlined name="input-7-4" label="Item description" v-model="updateDescription"></v-textarea>
								<v-text-field label="I want" v-model="updateWant"></v-text-field>
							</v-container>
						</v-form>
					</v-card-text>

					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn small text @click="confirmUpdate">
							Update Item
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>


			<v-dialog v-model="dialogClose" width="500" v-if="myUser">
				<v-card v-if="myUser.userMore && myUser.userMore.uid == pageData.uploaderUid">
					<v-card-title small class="dialog-top headline lighten-2">
						Are you sure to close?
					</v-card-title>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn small color="#262222" text @click="confirmClose">
							Close Item
						</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>			
		</div>


  </div>
  <div v-else>
    loading.. 
  </div>
</template>

<style lang="scss" scoped>

.view-wrap{

	font-size:14px;
	font-weight:500;
	.onimage {
		cursor: pointer;
		transition: 500ms;
		&:hover { opacity: 0.8; }
	}	
	.title {
		font-size:24px;
	}		
	
	.thetwo {
		display:grid;
		grid-template-columns: 1fr 1fr;
		align-items: flex-start;
	}		
  img{
    width:100%;		
  }

	.trade-btn-wrap{
		display:grid;
		grid-template-columns: 1fr 1fr;
		align-items:center;
		margin-top:20px;
	}

	.uploader-btn-wrap{
		display:grid;
		grid-template-columns: 1fr 1fr;
		align-items:center;
	}

	@media only screen and (min-width: 768px) {
		display:grid;
		grid-template-columns: 1fr 1fr;
		grid-gap:50px;
	}

}
.dialog-top{
  background:#262222;
  color:white;
}
.text-small {font-size:11px;}
.trusted {
	font-size:12px;
	text-align:left;
	color:white;
	background:#c44127;
	margin-top:5px;
	display:inline-block;
	padding:4px 15px;
}
</style>

<script>
import firebase from "firebase/app"
import 'firebase/storage'
import GenerateID from '../../library/GenerateID'
import Ratings from '@/components/Ratings.vue'
import VueEasyLightbox from 'vue-easy-lightbox'
import axios from "axios"

export default {
  name: 'TradeView',
  components: {
		Ratings, VueEasyLightbox
  },
  data: function() {
    return {  
			dialog: false,
			dialogClose: false,
			dialogUpdate: false,
			file: null,
			title: "",
			description: "",
			location:"",
			pageData: null,
			loaded: false,
			updateTitle: "",
			updateDescription: "",
			updateWant: "",
			requested: {status: false, id: null},
			visible: false,
			imgs: '',
			index: 0,
			onWait: false
    }
  },
  methods: {
    showSingle(img) {
      this.imgs = img
      this.show()
    },
    show() {
      this.visible = true
    },
    handleHide() {
      this.visible = false
    },		
		requestTrade: function() {
			if(!this.myUser.userMore) {
				this.$root.$refs.A.triggerError("PLEASE LOGIN FIRST");
				return false				
			}

			if(!this.myUser.userMore.email) {
				this.$root.$refs.A.triggerError("YOU MUST FINISH SIGNUP. GO TO MANAGE ACCOUNT PAGE");
				this.$router.push('/account')
				return false
			}

			if(this.myUser && this.myUser.userMore && this.pageData) {
				if(this.myUser.userMore.uid === this.pageData.uploaderUid) {
					this.$root.$refs.A.triggerError("THIS IS YOUR POST");
				} else {
					// need to check if the trade is still open // no lets just pass
					this.dialog = true
				}
			}else{
				this.$root.$refs.A.triggerError("LOGIN PLEASE");
			}
		},
    sendRequest: async function() {
			const imgId = GenerateID()
			if(this.title !== "" && this.description !== "" && this.file) {				

        let fileExt = this.file.name.slice(this.file.name.length - 3, this.file.name.length)
        if(fileExt !== "jpg" && fileExt !== "png") {
          this.$root.$refs.A.triggerError("ONLY JPG OR PNG FORMAT AVAILABLE");
          return false
        }
				this.onWait = true

        let storageRef = firebase.storage().ref();
        let currentUpload = storageRef.child(`images/${imgId}_${this.file.name}`); // 여기 안에 들어간게, "참조코드". 이거를 가지고 나중엥 삭제도 하고 그러는 거다.

        //upload file
        let metadata = {
          contentType: 'image/jpeg',
        };

				// Set data variables outside of callback
				const id = GenerateID()
				const tradeId = this.pageData.id
				const uploader = this.pageData.uploader
				const uploaderUid = this.pageData.uploaderUid
				const title = this.title
				const description = this.description
				const firstMsg = this.description
				const have = this.pageData.have
				const want = this.pageData.want
				const tradee = this.myUser.userMore.nickname
				const tradeeUid = this.myUser.userMore.uid
        const originalFile = this.pageData.image
        const uploaderLocation = this.pageData.location
        const tradeeLocation = this.myUser.userMore.location        

				const uploaderEmail = await firebase.firestore().collection('users').where("uid", "==", uploaderUid).get()
				let theEmail = []
				uploaderEmail.forEach(v => theEmail.push(v)) // theEmail[0].data().email == is the email
				// const email = theEmail[0].data().email

        let upload = currentUpload.put(this.file, metadata)
				let path = this
        upload.on("state_changed", function progress(snapshot) {
            console.log("progress bar", snapshot)
          },  
          function error() {
            alert("error uploading file");
          },
          function complete() {               
            upload.snapshot.ref.getDownloadURL()
              .then(async function(url) {
                try {
                  let transactionRef = await firebase.firestore().collection("transactions").doc(id)
                  await transactionRef.set({
										id,
										tradeId,
										uploader,
										uploaderUid,
										title,
										description,
										file: url,
										have,
										want,
										tradee,
										tradeeUid,
                    uploaderAgree: false,
                    originalFile,
                    uploaderLocation,
                    tradeeLocation,
										tradeeAgree: false,
										checkedByUploader: false,
										time: firebase.firestore.Timestamp.now(),
										messages: [{message: firstMsg, sender: tradee, senderUid: tradeeUid, senderLocation: tradeeLocation, time:firebase.firestore.Timestamp.now()}]
									})

									// SEND EMAIL
									try {
										let meme = await axios.post('https://tradeemail.herokuapp.com/email',
											{
												email: theEmail[0].data().email,
												nickname: tradee,
												transactionId: id,
												tradeItem: have,
												verifycode: process.env.VUE_APP_VERIFYCODE       
											},{
												headers: {}
											})
										if(meme.status === 200) {
											console.log("Working")
										}
									} catch(error) {
											console.log(error)
									}

									path.dialog = false
									// console.log("transaction created")
									path.$root.$refs.A.triggerError("REQUEST SENT");
									path.$router.push(`/transaction/${id}`)								
                }catch(err) {
					path.$root.$refs.A.triggerError("NETWORK ERROR");
                  console.log("nerwork problem. Uploade File success but couldnt write document", err, id)
                }
              })
						.catch(function(error) {
							path.$root.$refs.A.triggerError("NETWORK ERROR");
							console.log("error encountered", error);
						})
					}
				);

			} else {
				this.$root.$refs.A.triggerError("PLEASE FILL ALL INFORMATION");
			}
		},
		fileChange: function(file) {
      this.file = file
		},
		updateItem: function() {
			this.dialogUpdate = true
		},
		confirmUpdate: async function() {
			await firebase.firestore().collection("items").doc(this.pageData.id).update({
				title: this.updateTitle,
				want: this.updateWant,
				description: this.updateDescription
			});

			let newItem = {...this.pageData}
			newItem.title = this.updateTitle
			newItem.want = this.updateWant
			newItem.description = this.updateDescription
			this.pageData = newItem
			this.dialogUpdate = false
		},
		closeItem: function() {
			this.dialogClose = true
		},
		confirmClose: async function() {
			await firebase.firestore().collection("items").doc(this.pageData.id).update({
				status: "closed"
			})
			this.$root.$refs.A.triggerError("CLOSING THIS ITEM");
			setTimeout(() => {				
				this.$router.push('/trade')
			}, 1500);
		},
		checkForRequested: async function() {
			if(!this.pageData) return false

			try {
				let ifExist = await firebase.firestore().collection("transactions")
					.where("tradeId", "==", this.pageData.id)
					.where("tradeeUid", "==", this.myUser.userMore.uid)
					.get()
				let meme = []
				ifExist.forEach(v => meme.push(v.data()))
				if(meme.length > 0) {
					this.requested = {
						status: true, id: meme[0].id
					}
				}
			} catch {
				console.log("Success: User can request to trade this item")
			}
		},
		onTransaction: function(id) {
			this.$router.push(`/transaction/${id}`)
		}
	},
	computed: {
		myUser() { return this.$store.state.user },
	},
	watch: {
		myUser: async function() {
			if(this.myUser) this.checkForRequested()
		}
	},
  mounted: async function() {		
		try {
			const result = await firebase.firestore().collection('items').where("status", "==", "open").get()
			let res = []
			result.forEach(v => res.push(v.data()))

			if(res && res.length > 0) {
				this.pageData = await res.find(v => v.id === this.$route.params.id)

				// this.pageData = await result.data().trade.find(val => val.id === this.$route.params.id)
				this.updateTitle = this.pageData.title
				this.updateWant = this.pageData.want
				this.updateDescription = this.pageData.description
				this.loaded = true
			} else {
				this.$root.$refs.A.triggerError("CANNOT FIND THIS ITEM");
				this.$router.push('/trade')
			}
		}catch {
			this.$root.$refs.A.triggerError("CANNOT FIND THIS PAGE");
			this.$router.push('/trade')			
		}
		if(this.myUser){
			this.checkForRequested()
		}
  },
}
</script>
