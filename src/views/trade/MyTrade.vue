<template>
  <div class="home">
    <div class="container-top">
			<div>MY POSTINGS</div>
			<v-tabs color="deep-dark accent-4" right>
				<v-tab @click="onTab(1)">ACTIVE</v-tab>
				<v-tab @click="onTab(2)">CLOSED</v-tab>
			</v-tabs>
		</div>
		<div v-if="loaded">
			<div v-if="active">
			<div class="trade-wrap" v-if="tradeList.length > 0">
				<div v-for="item in tradeList" v-bind:key="item.id">
				<v-card max-width="374">
					<img class="myimg" alt="ho" :src="item.image" @click="onTrade(item.id)" />
					<v-divider></v-divider>
					<v-card-text class="text-center">
						<div>I HAVE</div>
						<div><strong>{{item.have}}</strong></div>
					</v-card-text>
					<v-divider class="mx-1"></v-divider>
					<v-card-text class="text-center">
						<div>I WANT</div>
						<div><strong>{{item.want}}</strong></div>
						<div class="hover" @click="onRequests(item.requests)">{{item.requests.length}} Requests(click to view requests)</div>
					</v-card-text>
				</v-card>
				</div>
			</div>
			<div class="small-text" v-else>NO ITEM POSTED</div>
			</div>

			<div v-else>
			<div class="trade-wrap" v-if="closedTradeList.length > 0">
				<div v-for="item in closedTradeList" v-bind:key="item.id" @click="onTrade(item.id)">
				<v-card max-width="374">
					<img class="myimg" alt="ho" :src="item.image" @click="onTrade(item.id)" />
					<v-divider></v-divider>
					<v-card-text class="text-center">
						<div>I HAVE</div>
						<div><strong>{{item.have}}</strong></div>
					</v-card-text>
					<v-divider class="mx-1"></v-divider>
					<v-card-text class="text-center">
						<div>I WANT</div>
						<div><strong>{{item.want}}</strong></div>
					</v-card-text>
				</v-card>
				</div>
			</div>
			<div class="small-text" v-else>NO ITEM POSTED</div>
			</div>

			<v-dialog v-model="dialog" width="500">
				<v-card>
					<v-card-title class="topdeco headline lighten-2">
						Requests
					</v-card-title>
					<v-card-text v-if="dialog === true">
						<div v-for="item in requests" v-bind:key="item.id">
							<span @click="onMoveRequest(item.id)">Request from {{item.tradee}}</span>
						</div>
					</v-card-text>
				</v-card>
			</v-dialog>
		</div>
		<div v-else>
			Loading..
		</div>
  </div>
</template>

<style lang="scss" scoped>
.trade-wrap {
	display:grid;
	grid-template-columns:repeat(2, 1fr);	
	grid-gap: 20px;
	grid-row-gap:50px;
	.myimg {
		height:200px;
		width:100%;
		object-fit: cover;
	}
	.trade-item {
		cursor:pointer;
		&:hover{
			opacity: 0.8;
		}
	}
	@media only screen and (min-width: 768px) {
		grid-template-columns:repeat(4, 1fr);		

	}
}
.hover{ cursor: pointer; }

.container-top {
	display:grid;
	grid-template-columns: 1fr 300px;
	grid-gap: 20px;
	margin-bottom:30px;
	align-items:center;
}
.topdeco {
	background:#262222;
	color:white;
}
.small-text {
	font-size:12px;
}

.home {
	margin-bottom:20px;
}
</style>


<script>
import firebase from "firebase/app"
import 'firebase/storage';  // <----

export default {
  name: 'MyTrade',
  components: {
    // HelloWorld
  },
  data: function() {
    return {  
			username: "IZONE",
			loaded: false,
			tradeList: [],
			closedTradeList: [],
			requests: [],
			dialog: false,
			active: true
    }
  },
  methods: {
		onTab: function(mode){
			if(mode === 1) {
				this.active = true
			}else{
				this.active = false
			}
		},
    onTrade: function(id) {
			this.$router.push(`/trade/${id}`)
		},
		onRequests: function(req) {
			this.requests = req
			this.dialog = true
		},
		onMoveRequest: function(id) {
			this.$router.push(`/transaction/${id}`)
		},
		refreshData: async function() {
			try {
				let tradeListResult = await firebase.firestore().collection('items').where("uploaderUid", "==", this.myUser.userMore.uid).get()
				let tradeListRes = []
				tradeListResult.forEach(v => tradeListRes.push(v.data()))

				let transactions = await firebase.firestore().collection('transactions').where("uploaderUid", "==", this.myUser.userMore.uid).get()

				let openResult = tradeListRes.filter(v => v.status === "open")
				this.tradeList = openResult.map(val => {
					let trans = []
					transactions.forEach(v => trans.push(v.data()))
					let requests = trans.filter(vol => vol.tradeId === val.id)
					return {...val, requests: requests}
				})

				this.closedTradeList = tradeListRes.filter(v => v.status === "closed")
				// console.log(r)
				this.loaded = true
			} catch {
				this.$root.$refs.A.triggerError("NO DATA. REDIRECTO MAIN PAGE");
				this.$router.push('/trade')
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
