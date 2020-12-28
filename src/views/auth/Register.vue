<template>
  <div class="home">
		<div class="recap" id="recaptcha-container"></div>
    <div class="container-top">
			<div><b>AUTHENTICATION</b></div>
		</div>
		<div class="first-step">
			<v-select v-model="phoneType" class="theselect" return-object persistent-hint :hint="`${phoneType.country}, ${phoneType.code}`" :items="phoneTypes" item-text="country" item-value="code" label="Country Code" solo dense></v-select>
			<v-text-field label="Phone number (without dash)" v-model="phone" :disabled="verifyTime"></v-text-field>
			<div>
				<v-btn class="btn text--white" color="#262222" id="sign-in-button" small @click="onSignInSubmit()" :disabled="verifyTime">AUTHENTICATE</v-btn>
			</div>
		</div>

		<div class="first-step" v-if="verifyTimeDone">
			<v-text-field label="We sent you a Verification Code. Please enter the code" v-model="verifyCode"></v-text-field>
			<v-btn class="btn" color="#262222" @click="onSubmitVerifyCode()">Verify</v-btn>
		</div>	

		<v-dialog v-model="dialog" persistent width="500">
			<v-card>
				<v-card-title class="topdeco headline lighten-2">
					ENTER INFORMATION TO SIGN UP
				</v-card-title>
				<v-card-text>
					<v-form>
						<v-container>
							<!-- <v-text-field outlined label="Username" v-model="username"></v-text-field> -->
							<v-text-field outlined label="Nick Name" v-model="nickname"></v-text-field>
							<v-text-field outlined label="Email" v-model="email"></v-text-field>
							<v-text-field outlined label="Your city" v-model="location" :disabled="true"></v-text-field>
						</v-container>
					</v-form>
				</v-card-text>

				<v-divider></v-divider>

				<v-card-actions>
					<v-spacer></v-spacer>
					<v-btn class="btn" color="#262222" text @click="onSubmitUser">SUBMIT</v-btn>
				</v-card-actions>
			</v-card>
		</v-dialog>

  </div>
</template>

<style lang="scss" scoped>
.container-top{
	margin: 20px 0;
}
.topdeco {
	background:#262222;
	color:white;
}
.theselect {
	margin-top: 10px;
}
.first-step, .first-step2{

	.btn {
		margin-top:20px;
		color:white;
		width:150px;
	}
  @media only screen and (min-width: 768px) {
		display:grid;
		grid-template-columns: 150px 1fr 150px;
		grid-gap:20px;
	}
}

.first-step2 {
	grid-template-columns: 1fr 150px;
}

.recap{
	display:none;
}
</style>

<script>
import firebase from "firebase/app"
import 'firebase/storage';  // <----
import CountryCode from "../../library/CountryCode"

export default {
  name: 'Register',
  components: {
    // HelloWorld
  },
  data: function() {
    return {  
			username: "",
			nickname:"",
			email:"",
			phone: "",
			location:"",
			verifyCode:"",
			dialog: false,
			verifyTime: false,
			verifyTimeDone: false,
			phoneType: { country:"United State", code:'+1' },
			phoneTypes: CountryCode
    }
  },
  methods: {
		signout: function() {
			firebase.auth().signOut().then(function() {
				// console.log("logged out")
				this.$root.$refs.A.triggerError("LOGGED OUT");
			})
		},
		onSubmitUser: async function() {
			function validateEmail(email) {
				const re = /\S+@\S+\.\S+/;
				return re.test(String(email).toLowerCase());
			}
			let checkEmail = validateEmail(this.email)
			if(!this.nickname || !checkEmail || !this.location) {
				this.$root.$refs.A.triggerError("PLEASE ENTER CORRECT INFORMATION");
				return false
			}			

			try {
				await firebase.firestore().collection("users").doc(this.phone).set({
					nickname: this.nickname,
					email: this.email,
					location: this.location,
					uid: firebase.auth().currentUser.uid,
					phone: this.phone
				})
				await this.$store.dispatch({type: 'afterRegister', userMore: {
					nickname: this.nickname,
					email: this.email,
					location: this.location,
					uid: firebase.auth().currentUser.uid,
					phone: this.phone
				}})					
				this.$root.$refs.A.triggerError("USER CREATED");
				this.$router.push('/trade')
			}catch(error) {
				console.log(error)
			}	
		},
		onSignInSubmit: async function() {
			// Check if this user Exist First
			var appVerifier = window.recaptchaVerifier;
			this.verifyTime = true
			// 	console.log(this.phoneType.code + this.phone)
			let thephone = this.phone.replace(/(\D+)/g, "")
			this.phone = this.phoneType.code + thephone
			// console.log(phone)

			try {
				let res = await firebase.auth().signInWithPhoneNumber(this.phone, appVerifier)
				window.confirmationResult = res
				this.verifyTimeDone = true
			} catch {
				this.$root.$refs.A.triggerError("PLEASE ENTER RIGHT PHONE NUMBER");
				this.verifyTime = false
			}
		},
		onSubmitVerifyCode: async function() {
			let code = this.verifyCode
			try{
				const result = await window.confirmationResult.confirm(code)
				if(result) {
					// If Verfieid, Then check if this phone number is registered to DB already
					const checkRegistered =	await firebase.firestore().collection("users").doc(this.phone).get()
					const emailExist = checkRegistered.data()

					try {
						if(emailExist.email) {
						this.$root.$refs.A.triggerError("YOU ARE AUTHORIZED NOW");
							await this.$store.dispatch({type: 'loggedIn' })
							this.$router.push(`/trade`)
							return false
						}
					} catch {
						this.$root.$refs.A.triggerError("INCOMPLETED USER");
					}

					// If User Not on the DB Yet = Very First time
					try {
						await firebase.firestore().collection("users").doc(this.phone).set({
							phone: this.phone,
							uid: firebase.auth().currentUser.uid,
						})
						console.log("You are firsttime or didn finish signup yet. Please Finish register")
						this.dialog = true
					} catch {
						this.$root.$refs.A.triggerError("NETWORK ERROR");
					}
				}
			}	catch(error) {
				this.$root.$refs.A.triggerError("WRONG VERIFY CODE");
			}		

		},
  },
  mounted: async function() {
		firebase.auth().useDeviceLanguage(); // = 'it';
			window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('sign-in-button', {
				size: 'invisible',
				callback: function() {
				// 'callback': function(response) {
				this.onSignInSubmit();
				},
				'expired-callback': function() {
					// Response expired. Ask user to solve reCAPTCHA again.
					console.log('expired')
				}
		});

		try {
			let location = await fetch('https://geolocation-db.com/json/')
				.then(function(response) {
					return response.json();
				})
			let city = location.city
			let state = location.state
			let country_code = location.country_code
			this.location = `${city}, ${state}, ${country_code}`
		}catch {
			console.log("something wrong")
		}

  }
}
</script>
