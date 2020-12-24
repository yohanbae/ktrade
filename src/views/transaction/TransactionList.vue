<template>
  <div class="home" v-if="loaded">
    <div class="container-top">
			<div><b>MY MESSAGES</b></div>
		</div>

   <v-list two-line>
		<v-list-item-group active-class="pink--text" multiple>
		<div class="thewrap" v-for="(item, index) in theData" v-bind:key="item.id" @click="onTransaction(item.id)">
			<v-list-item :key="item.id">
					<v-list-item-content>
						<v-list-item-subtitle class="text--primary"><b>Item</b> {{item.have}}</v-list-item-subtitle>
						<v-list-item-subtitle v-text="item.messages[item.messages.length - 1].message.slice(0, 100)"></v-list-item-subtitle>
					</v-list-item-content>

					<v-list-item-action>
						<v-list-item-subtitle>From {{item.tradee}}</v-list-item-subtitle>
						<v-list-item-action-text v-text="dateFormat(item.time)"></v-list-item-action-text>
					</v-list-item-action>

			</v-list-item>
			<v-divider v-if="index < theData.length" :key="index"></v-divider>
		</div>
		</v-list-item-group>
		</v-list>
	</div>
	<div v-else>
		Loading
	</div>
</template>


<style lang="scss" scoped>
.items-wrap {
	border:2px solid yellow;
	display:grid;
	grid-template-columns: 1fr 1fr;
	grid-gap: 30px;

	.item-wrap{}
}

.container-top {
	margin-bottom:30px;

}

.tran-wrap, .tran-wraps{
	display:grid;
	grid-template-columns: 150px 150px 1fr 200px;
	grid-gap: 20px;
}
.tran-wraps{
	cursor:pointer;
	margin-bottom:3px;
	font-size:14px;
	&:hover{
		opacity:0.7;
	}
}

.home{
	margin: 10px 0;
}
.thewrap {
	// background:yellow;
}
</style>


<script>
import firebase from "firebase/app"
import 'firebase/storage';
import moment from "moment"

export default {
  name: 'TransactionList',
  components: {
    // HelloWorld
  },
  data: function() {
    return {  
			username: "IZONE",
			loaded: false,
			theData: []
    }
  },
  methods: {
		dateFormat: function(time) {
			return moment(time.toDate()).format("dddd MMM Do YYYY")
			},
		onTransaction: function(id){
			this.$router.push(`/transaction/${id}`)
		},
		refreshData: async function() {
			try {
				let theview = this
				let trans = []
				// 이게 별로 좋은 방법은 아님
				let transactions = await firebase.firestore().collection('transactions').where("tradeeUid", "==", this.myUser.userMore.uid).get()
				let transactionsTwo = await firebase.firestore().collection('transactions').where("uploaderUid", "==", this.myUser.userMore.uid).get()

				if(transactions && transactionsTwo){
					transactions.forEach(val => {trans.push(val.data())})
					transactionsTwo.forEach(val => {trans.push(val.data())})

					trans.sort((x, y) => { return y.time - x.time })
					theview.theData = trans
					theview.loaded = true
				}
			} catch {
				console.log("No user data. Redirect to main page.")
        this.$root.$refs.A.triggerError("PLEASE LOGIN FIRST");
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
