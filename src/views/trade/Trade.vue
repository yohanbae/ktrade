<template>
  <div>
		<div class="trade-header">
			<div><strong>ITEM LIST</strong></div>
			<input type="text" class="text-class" aria-label="SEARCH KEYWORD" placeholder="Search keyword" v-model="keyword" />
			<v-select v-model="searchType" class="theselect" :items="searchTypes" item-text="label" label="Category" solo dense @change="typeChange()"></v-select>
			<button class="search-btns" @click="findButton"><v-icon small left dark>mdi-magnify</v-icon>SEARCH</button>
		</div>
		<v-divider class="mt-0 mb-4"></v-divider>

		<v-lazy
			v-model="isActive"
			:options="{
				threshold: .5
			}"
			min-height="200"
			transition="fade-transition"
		>
		<div class="trade-wrap">
			<div v-for="item in itemsPage" v-bind:key="item.id" @click="onView(item.id, item.status)">
				<v-card class="trade-item" max-width="374">
					<img class="myimg" alt="ho" :src="item.image" />
					<div class="have-wrap">				
						<div class="mb-3">
							<div>I HAVE</div>
							<div><strong>{{item.have}}</strong></div>
						</div>
						<div class="mb-3">
							<div>I WANT</div>
							<div><strong>{{item.want}}</strong></div>
						</div>
					</div>
					<v-divider></v-divider>
					<div class="trusted" v-if="item.staff">
						<b>TRUSTED KT Staff</b>
					</div>
					<div class="fromstyle text-center">From {{item.location}}</div>

					<v-overlay v-if="item.status === 'closed'" :absolute="true" opacity="0.6" value="true">
						<v-btn color="#262222">CLOSED</v-btn>
					</v-overlay>
				</v-card>
			</div>

		</div>
		</v-lazy>
		<v-divider class="mt-6"></v-divider>
		<div class="trade-bottom my-3">
			<v-pagination v-model="page" :length="totalPage" @input="onPageChange" color="#262222"></v-pagination>
			<v-btn class="post-btn" text outlined color="#262222" @click="onPost"><v-icon small left dark>mdi-pencil</v-icon>POST</v-btn>
		</div>
  </div>
</template>

<style lang="scss" scoped>
.trade-header {
	margin-bottom:30px;
	font-size:12px;
	text-align: center;
	.theselect {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		margin-top:25px;
	}
	.text-class{
		background:#ededed;
		height:40px;
		font-size:14px;
		padding:0 10px;
		border-radius:5px;
		margin-top:10px;
		width:100%;
		text-align: center;
		&:focus { outline: none; }
	}
	.search-btns {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		padding: 0 10px;
		background: #262222;
		color:white;
		height:40px;
		font-size:14px;
		font-weight:100;
		border-radius:5px;
		width:100%;
		&:hover{ opacity: 0.8; }
		&:focus { outline: none; }
	}

	@media only screen and (min-width: 768px) {
		text-align: left;
		display:grid;
		grid-template-columns: 200px 1fr 150px 120px;
		grid-gap: 20px;
		align-items: center;
		margin-bottom:30px;
		.text-class { margin-top:0px; }
	}
}

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
	.have-wrap {
		font-size: 12px;
		padding:5px 20px;
	}
	.fromstyle {
		font-size:12px;
		padding:5px 0;
	}
	@media only screen and (min-width: 768px) {
		grid-template-columns:repeat(4, 1fr);		

		.have-wrap {
			display:grid;
			grid-template-columns: 1fr 1fr;
			grid-gap:10px;			
		}
	}

}

.trade-bottom{
	.post-btn { 
		text-align: center; width: 100%; 
		margin-top:20px;
	}
	@media only screen and (min-width: 768px) {
		display:grid;
		grid-template-columns: 1fr 100px;
		.post-btn { margin-top: 0px; }
	}
}

.trusted {
	font-size:10px;
	text-align:center;
	color:#c44127;
	margin-top:5px;
}

</style>


<script>
import firebase from "firebase/app"
import 'firebase/storage';

export default {
  name: 'TradePost',
  components: {
    // HelloWorld
  },
  data: function() {
    return {  
			isActive: false,
			page:1,
			totalPage:5,
			items: [],
			itemsPage: [],
			searchTypes: ['HAVE', 'WANT', 'LOCATION'],
			searchType: "HAVE",
			keyword: "",
			locations: [],
			location: ""
    }
  },
  methods: {
		onPost: function() {
			this.$router.push('/post')
		},
    filesChange: function(files) {
      this.files = files
		},
		typeChange: function() {
			//
		},
		findButton: function() {
			let list = []
			let postsPerPage = 8

			switch(this.searchType) {
				// case "TITLE": 				
				// 	list = this.items.filter(val => val.title.toLowerCase().includes(this.keyword.toLowerCase()))
				// 	break;
				case "HAVE": 				
					list = this.items.filter(val => val.have.toLowerCase().includes(this.keyword.toLowerCase()))
					break;
				case "WANT": 				
					list = this.items.filter(val => val.want.toLowerCase().includes(this.keyword.toLowerCase()))
					break;
				case "LOCATION": 				
					list = this.items.filter(val => val.location.toLowerCase().includes(this.keyword.toLowerCase()))
					break;					
			}
			this.page = 1
			list = list.sort((a,b) => b.date - a.date)
			this.totalPage = Math.ceil(list.length / postsPerPage)
			this.itemsPage = list.slice(0, postsPerPage)			
		},
		onPageChange: function(newPage) {
			let postsPerPage = 8
			let start = (postsPerPage * newPage) - postsPerPage
			let end = postsPerPage * newPage
			this.itemsPage = this.items.slice(start, end)
		},
		onView: function(id, status) {
			if(status === 'open'){
				this.$router.push(`/trade/${id}`)
			}
		},

  },
  mounted: async function() {
		const postsPerPage = 8
    try {
		// let result = await firebase.firestore().collection('items').where("status", "==", "open").get()
		let result = await firebase.firestore().collection('items').get()

		let list = []
		result.forEach(v => list.push(v.data()))
		list = list.sort((a,b) => b.date - a.date)
		this.items = list
		this.totalPage = Math.ceil(this.items.length / postsPerPage)
		this.itemsPage = this.items.slice(0, postsPerPage)
    } catch(err) {
      console.log(err)
		}

  }
}
</script>
