<template>
  <div class="home">
    <div class="container-top">
			<div><b>LET'S CHAT!</b></div>
		</div>
		<div v-if="loaded">
			<div class="transaction-wrap mb-6">
				<div>
					<img :src="theData.originalFile" alt="ff" @click="showSingle(theData.originalFile)" />
					<div class="twowrap">
						<div>
							<div class="text-large"><b>Item have</b> {{theData.have}}</div>
							<div><b>Location</b> {{theData.uploaderLocation}}</div>
							<div class="mb-3"><b>Uploader</b> {{theData.uploader}}</div>
						</div>
						<Ratings :userUid="theData.uploaderUid" />
					</div>
				</div>
				<div>		
					<img :src="theData.file" alt="ee" @click="showSingle(theData.file)" />
					<div class="twowrap">
						<div>
							<div class="text-large"><b>Item wanted</b> {{theData.want}}</div>
							<div><b>Location</b> {{theData.tradeeLocation}}</div>
							<div class="mb-3"><b>Requester</b> {{theData.tradee}}</div>
						</div>
						<Ratings :userUid="theData.tradeeUid" />
					</div>
				</div>
			</div>

			<div class="message-wrap">			
				<div class="msg-title">MESSAGE</div>
				<div class="msgbox" v-for="(msg, i) in theData.messages" v-bind:key="i" >
					<div :class="msg.senderUid === myUser.userMore.uid ? `mss msg-box1` : 'mss msg-box2'">
						<div class="small-text">{{msg.sender}} from {{msg.senderLocation}}</div>
						<div class="msg-date text-right">{{dateFormat(msg.time)}}</div>	
					</div>
					<div class="mt-2">{{msg.message}}</div>
				</div>
			</div>
			<textarea class="msg-text" placeholder="Type Message" v-model="newMessage"></textarea>
			<div class="text-right"><v-btn color="#262222" class="white--text" small @click="onSendMessage">Send Message</v-btn></div>

			<v-divider class="my-5"></v-divider>
			<div class="text-right" v-if="isOpened">
				<v-btn color="#262222" outlined @click="onTrade" v-if="theData.uploaderAgree!==true || theData.tradeeAgree!==true" :disabled="position==`uploader`&&theData.uploaderAgree || position==`tradee`&&theData.tradeeAgree ? true : false">
					{{ position==`uploader`&&theData.uploaderAgree || position==`tradee`&&theData.tradeeAgree ? "Waiting" : "Trade"	}}
				</v-btn>
				<div class="btn-wrap" v-else>
					<v-btn color="#262222" class="b-btn white--text" @click="onInformation">
						{{ position=='uploader' ? `View ${theData.tradee}'s Info` : `View ${theData.uploader}'s Info` }}
					</v-btn>
					<v-btn color="#262222" class="b-btn" outlined v-if="position===`uploader`" @click="onCloseCase">
						Close this ITEM
					</v-btn>
					<v-btn color="#262222" class="b-btn" outlined @click="onRating">Give a rating</v-btn>
				</div>
			</div>
			<div class="text-center" font-color color="red" v-else>THE ITEM CLOSED. YOU CANNOT TRADE THIS ITEM ANYMORE</div>

			<VueEasyLightbox :visible="visible" :imgs="imgs" :index="index" @hide="handleHide"></VueEasyLightbox>

			<v-dialog v-model="dialogTrade" width="500">
				<v-card>
					<v-card-title class="topdeco headline lighten-2">
						Notice
					</v-card-title>
					<v-card-text>
						<div class="mt-4">Once both of you agree to trade, your information(phone number and email address) will be reveled to each other. Are you sure to continue?</div>
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="#262222" text @click="tradeConfirm">Continue</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>

			<v-dialog v-model="dialogInformation" width="500">
				<v-card>
					<v-card-title class="topdeco headline lighten-2">
						Traders Information
					</v-card-title>
					<v-card-text>
						<h5>{{theData.uploader}}: {{infos.uploaderPhone}} : {{infos.uploaderEmail}}</h5>
						<h5>{{theData.tradee}}: {{infos.tradeePhone}} : {{infos.tradeeEmail}}</h5>
					</v-card-text>
				</v-card>
			</v-dialog>

			<v-dialog v-model="dialogRating" width="500">
				<v-card>
					<v-card-title class="topdeco headline lighten-2">
						Give a Rating after Trade
					</v-card-title>
					<v-card-text>

					<v-radio-group v-model="rating" row>
						<v-radio label="Positive" value="positive"></v-radio>
						<v-radio label="Negative" value="negative"></v-radio>
					</v-radio-group>
					</v-card-text>
					<v-text-field v-model="feedback"></v-text-field>
					<v-btn color="#262222" @click="confirmRating">Leave a feedback</v-btn>
				</v-card>
			</v-dialog>

			<v-dialog v-model="dialogClose" width="500">
				<v-card>
					<v-card-title class="topdeco headline lighten-2">
						Are you sure to close this case?
					</v-card-title>
					<v-card-text>
						Once you close this case, the other users will not able to see your items on the trade list. This conversation records will be remained even after close this item.
					</v-card-text>
					<v-divider></v-divider>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn color="#262222" text @click="confirmCloseCase">CLOSE THIS CASE</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>


		</div>
		<div v-else>
			Loading..
		</div>
  </div>
</template>

<style lang="scss" scoped>
.topdeco {
	background:#262222;
	color:white;
}

.container-top{
	margin: 20px 0;
	margin-bottom:30px;
}

.transaction-wrap{
	display:grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 10px;
	font-size:13px;
	.text-large { font-size: 16px; }
	img{
		width: 100%;
		height:200px;
		object-fit: cover;
		cursor:pointer;
		transition: 500ms;
		&:hover { opacity: 0.8; }
	}

	@media only screen and (min-width: 768px) {
		height:350px;
		grid-gap: 30px;

		.twowrap{
			display:grid;
			grid-template-columns: 1fr 1fr;
			padding: 20px 40px;
		}
	}
}

.message-wrap {
	margin: 20px 0 10px 0;
	background:#ededed;
	padding:20px 20px 40px 20px;
	border-radius:5px;
	max-height:500px;
	overflow-y: scroll;

	&::-webkit-scrollbar {
		width: 5px;
	}
	
	&::-webkit-scrollbar-track {
		box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
	}
	
	&::-webkit-scrollbar-thumb {
		background-color: darkgrey;
		outline: 1px solid slategrey;
	}

	.msg-date{ font-size: 10px; margin-bottom: 5px; color:gray;}
	.small-text { font-size:12px;}

	.msgbox {
		border:1px solid lightgray;
		padding: 10px 15px;
		background:white;
		margin-bottom:5px;
		font-size:12px;

		.mss {
			display:grid;
			grid-template-columns: 1fr 1fr;
		}
	}

	@media only screen and (min-width: 768px) {
		max-height:350px;
		.msg-title {
			margin: 20px 0;
		}
	}
	.msg-box1 {
		display:inline-block;
		font-size:12px;
		color: #072047;
		font-weight:bold;
	}
	.msg-box2 {
		display:inline-block;
		font-size:12px;
		color: #c95618;
		font-weight:bold;
	}	
}
.msg-text {
	height:60px;
	width:100%;
	margin:10px 0;

	border:1px solid black;
	font-size:13px;
	padding:10px;
	border-radius:5px;
	resize: none;
}

.btn-wrap {
	.b-btn {
		width:100%; margin-bottom:10px;
	}
	@media only screen and (min-width: 768px) {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
		grid-gap:20px;
	}
}

</style>


<script>
import firebase from "firebase/app"
import 'firebase/storage';  // <----
import moment from "moment"
import Ratings from '@/components/Ratings.vue'
import VueEasyLightbox from 'vue-easy-lightbox'

export default {
  name: 'TransactionView',
  components: {
    Ratings, VueEasyLightbox
  },
  data: function() {
    return {  
		username: "IZONE",
		loaded: false,
		theData: {},
		newMessage: "",
		position:"",
		dialogTrade: false,
		dialogInformation: false,
		dialogClose: false,
		infos: {},
		dialogRating: false,
		rating: "positive",
		feedback:"",
		ratingCount: 0,
		isOpened: false,
		visible: false,
		imgs: '',
		index: 0
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
		getRatingCount: async function() {
			let searchUid = (this.position=='uploader') ? this.theData.tradeeUid : this.theData.uploaderUid
			try{
				let result = await firebase.firestore().collection("ratings").doc("rate").get()
				if(result.data() && result.data().ratings.length > 0){
					let res = await result.data().ratings.filter(val => val.toUid === searchUid)
					this.ratingCount = res.length
				}
			}catch{
				this.$root.$refs.A.triggerError("NETWORK ERROR");
			}
		},
		onCloseCase: function() {
			this.dialogClose = true
		},
		confirmCloseCase: async function() {
			try{
				let closeRef = await firebase.firestore().collection("items").doc(this.theData.tradeId)
				await closeRef.update({
					status: "closed"
				})
				this.isOpened = false
				this.dialogClose = false
				this.$root.$refs.A.triggerError("CASE CLOSED");
			}catch(err) {
				console.log(err)
				this.$root.$refs.A.triggerError("NETWORK ERROR. TRY AGAIN");
			}
		},
		dateFormat: function(time) {
			return moment(time.toDate()).format("MMM DD LT")
			},
		onRating: async function() {
			const from = this.myUser.userMore.uid
			const to = (this.position=='uploader') ? this.theData.tradeeUid : this.theData.uploaderUid

			try{
				const result = await firebase.firestore().collection('ratings').doc('rate').get()
				const ifExist = await result.data().ratings.find(val => val.fromUid === from && val.toUid === to && val.transactionId === this.theData.id)

				if(ifExist) {
					this.$root.$refs.A.triggerError("YOU ALREADY LEFT A FEEDBACK");
				}else{
					this.dialogRating = true
				}
			}catch(error) {
				this.$root.$refs.A.triggerError("NETWORK ERROR OCCURED");
			}
		},
		confirmRating: async function() {
			const from = this.myUser.userMore.uid
			const fromNickname = this.myUser.userMore.nickname
			const to = (this.position=='uploader') ? this.theData.tradeeUid : this.theData.uploaderUid

			if(this.feedback !== ""){
				try{
					let rateRef = await firebase.firestore().collection('ratings').doc('rate')
					await rateRef.update({
						ratings: firebase.firestore.FieldValue.arrayUnion({
							feedback: this.feedback,
							fromUid: from,
							from: fromNickname,
							rating: this.rating,
							toUid: to,
							transactionId: this.theData.id
						})
					})
					this.dialogRating = false
					this.$root.$refs.A.triggerError("THANK YOU FOR THE FEEDBACK");
				}catch(error){
					this.$root.$refs.A.triggerError("NETWORK ERROR OCCURED");
				}
			}
		},
		onTrade: async function() {
			this.dialogTrade = true
		},
		onInformation: async function() {
			this.dialogInformation = true
			let uploader = await firebase.firestore().collection("users").where("uid", "==", this.theData.uploaderUid).get()
			let tradee = await firebase.firestore().collection("users").where("uid", "==", this.theData.tradeeUid).get()
			let upl = []
			uploader.forEach(v => upl.push(v))
			let trad = []
			tradee.forEach(v => trad.push(v))
			this.infos = {
				uploaderPhone: upl[0].data().phone,
				uploaderEmail: upl[0].data().email,
				tradeePhone: trad[0].data().phone,
				tradeeEmail: trad[0].data().email				
			}
		},
		tradeConfirm: async function() {
			try{
				let dataRef = await firebase.firestore().collection("transactions").doc(this.$route.params.id)
				if(this.position === "uploader"){
					dataRef.update({ uploaderAgree: true });				
				}else if(this.position === "tradee") {
					dataRef.update({ tradeeAgree: true });				
				}
				this.dialogTrade = false
			}catch{
				this.$root.$refs.A.triggerError("NETWORK ERROR");
			}
		},
		onSendMessage: async function() {
			if(this.newMessage !== "") {
				let msgRef = await firebase.firestore().collection("transactions").doc(this.$route.params.id)
				await msgRef.update({
					messages: firebase.firestore.FieldValue.arrayUnion({
						message: this.newMessage,
						sender: this.myUser.userMore.nickname,
						senderLocation: this.myUser.userMore.location,
						senderUid: this.myUser.userMore.uid,
						time: firebase.firestore.Timestamp.now()
					}),
					time: firebase.firestore.Timestamp.now()
				})

				this.newMessage = ""
			}
		},
		refreshData: async function() {
			if(!this.$store.state.user) {
				this.$root.$refs.A.triggerError("PLEASE LOGIN FIRST");
				this.$router.push('/register')
				return false
			}      
					
			if(this.myUser && !this.myUser.completed) {
				this.$root.$refs.A.triggerError("USER NOT AUTHORIZED. PLEASE CHECK YOUR ACCOUNT");
				this.$router.push('/account')
				return false
			}

			let checkTransactionId = await firebase.firestore().collection("transactions").doc(this.$route.params.id).get()
			if(!checkTransactionId.data()) {
				this.$root.$refs.A.triggerError("PAGE NOT FOUND. REDIRECT TO MAIN PAGE");
				this.$router.push('/trade')
				return false
			}

			try {
				// let data = await firebase.firestore().collection('transactions').doc(this.$route.params.id).get()
				let theview = this
				await firebase.firestore().collection("transactions").doc(this.$route.params.id)
					.onSnapshot(function(doc) {
						if(doc.data().uploaderUid === theview.myUser.userMore.uid || doc.data().tradeeUid === theview.myUser.userMore.uid) {

							if(doc.data().uploaderUid === theview.myUser.userMore.uid) theview.position = "uploader"
							if(doc.data().tradeeUid === theview.myUser.userMore.uid) theview.position = "tradee"

							theview.theData = doc.data()
							theview.getRatingCount()
							theview.confirmOpened()
							theview.loaded = true
						}else{
							this.$root.$refs.A.triggerError("NETWORK ERROR. REDIRECT TO MAIN PAGE");
							theview.$router.push('/trade')
						}
					})
			} catch {
				console.log("No User. No worry. We will try one more time after receive user data")
			}			
		},
		confirmOpened: async function() {
			let meme = await firebase.firestore().collection("items").doc(this.theData.tradeId).get()
			let opened = meme.data().status
			if(opened === "open") {
				this.isOpened = true
			}
		}
	},
	watch: {
		myUser: async function() {
			this.refreshData()
		}
	},
	computed: {
		myUser() { return this.$store.state.user },
	},
  mounted: async function() {
		if(this.$store.state.user){
			this.refreshData()
		}
  }
}
</script>
