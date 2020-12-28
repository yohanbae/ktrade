<template>
  <div class="home">
		<div class="container-top">
			<div><b>MANAGE ACCOUNT</b></div>
			<v-divider class="my-6"></v-divider>
		</div>
		<div v-if="myUser">
			<div v-if="myUser.loggedIn">
				<div class="thetwo">
					<div class='outside'>PHONE NUMBER </div><div class="inside">{{myUser.userMore.phone}}</div>
				</div>
				<div v-if="!myUser.completed">
					PLEASE COMPLETE YOUR INFORMATION <v-btn @click="onManage">Manage Information</v-btn>
				</div>
			<div v-else>
				<div class="thetwo">
					<div class='outside'>NICKNAME</div><div class="inside">{{myUser.userMore.nickname}}</div>
					<div class='outside'>Email Address</div> <div class="inside">{{myUser.userMore.email}}</div>
					<div class='outside'>Location</div><div class="inside">{{myUser.userMore.location}}</div>
				</div>
				<Ratings :userUid="myUser.userMore.uid" />
				<v-divider class="my-6"></v-divider>
				<div class="btn-wrap text-right">
					<v-btn color="#262222" class="update-btn white--text" @click="onManage(true)">UPDATE INFORMATION</v-btn>				
				</div>
			</div>

				<v-dialog v-model="dialog" width="500">
					<v-card>
						<v-card-title class="topdeco headline lighten-2">
							UPDATE INFORMATION
						</v-card-title>
						<v-card-text>
							<v-container class="my-5">
								<v-text-field outlined label="Nickname" v-model="nickname"></v-text-field>
								<v-text-field outlined label="Email" v-model="email"></v-text-field>
								<!-- <v-text-field outlined label="Your city" v-model="location"></v-text-field> -->
							</v-container>
							<v-divider></v-divider>
							<v-card-actions>
								<v-spacer></v-spacer>
								<v-btn color="#262222" class="white--text" @click="updateUser">Update</v-btn>
							</v-card-actions>
						</v-card-text>

	
					</v-card>
				</v-dialog>

			</div>
			<div v-else>Please log in</div>
		</div>
		<div v-else>
			Loading
		</div>	
  </div>
</template>

<style lang="scss" scoped>
.container-top{
	margin: 20px 0;
}



.thetwo {
	display:grid;
	grid-template-columns: 150px 1fr;
	.outside{
		margin-bottom:30px;
		font-size:14px;
		padding-top:5px;
	}
	.inside{
		background:#ededed;
		margin-bottom:30px;
		height:30px;
		font-size:13px;
		padding-left:10px;
		padding-top:5px;
		border-radius:5px;
	}
	@media only screen and (min-width: 768px) {
		width: 600px;
		grid-template-columns: 200px 1fr;
	}
}
.btn-wrap {
	.update-btn {
		width: 100%;
	}
	@media only screen and (min-width: 768px) {
		width:600px;
		.update-btn {
			width:200px;
			text-align:right;
		}
	}
}
.topdeco {
	background:#262222;
	color:white;
}
.home {
	margin-bottom:10px;
}
</style>

<script>
import Ratings from '@/components/Ratings.vue'

export default {
  name: 'Home',
  components: {
    Ratings
  },
  data: function() {
    return {  
			username: "",
			nickname:"",
			email:"",
			location:"",
			dialog: false,
    }
	},
  methods: {
		onManage: function(already = false) {
			if(already) {
				// this.username = this.myUser.userMore.username
				this.nickname = this.myUser.userMore.nickname
				this.email = this.myUser.userMore.email
				this.location = this.myUser.userMore.location
			}
			this.dialog = true
		},
		updateUser: async function() {
			function validateEmail(email) {
				const re = /\S+@\S+\.\S+/;
				return re.test(String(email).toLowerCase());
			}
			let checkEmail = validateEmail(this.email)

			if(this.nickname !== "" && checkEmail && this.location !== "") {
				const result = await this.$store.dispatch({type: 'updateUser', nickname:this.nickname, email:this.email, location:this.location, phone:this.myUser.userMore.phone })
				if(result) {
					this.$root.$refs.A.triggerError("PROFILE UPDATED");
					this.dialog = false
				}				
			} else {
				this.$root.$refs.A.triggerError("FILLOUT CORRECT INFORMATION");
			}
		},
	},
	computed: {
		myUser() { return this.$store.state.user },
	},
	mounted: function(){

	}
}
</script>
