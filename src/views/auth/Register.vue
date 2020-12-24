<template>
  <div class="home">
		<div class="recap" id="recaptcha-container"></div>
    <div class="container-top">
			<div><b>AUTHENTICATION</b></div>
		</div>
		<div class="first-step">
			<v-select v-model="phoneType" class="theselect" return-object persistent-hint :hint="`${phoneType.country}, ${phoneType.code}`" :items="phoneTypes" item-text="country" item-value="code" label="Country Code" solo dense></v-select>
			<v-text-field label="Verify yourself with your Phone number" v-model="phone" :disabled="verifyTime"></v-text-field>
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
							<v-text-field outlined label="Your city" v-model="location"></v-text-field>
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
			phoneTypes: [
				{ country:"Andorra", code:'+376' },
				{ country:"United Arab Emirates", code:'+971' },
				{ country:"Afghanistan", code: '+93' },
				{ country:"Albania", code: '+355' },
				{ country:"Armenia", code: '+374' },
				{ country:"Angola", code: '+244' },
				{ country:"Argentina", code:'+54' },
				{ country:"Austria", code: '+43' },
				{ country:"Australia", code: '+61' },
				{ country:"Aruba", code: '+297' },
				{ country:"Bosnia and Herzegovina", code: '+387' },
				{ country:"Bangladesh", code: '+880' },
				{ country:"Belgium", code: '+32' },
				{ country:"Burkina Faso", code: '+226' },
				{ country:"Bulgaria", code: '+359' },
				{ country:"Benin", code:'+229' },
				{ country:"Bolivia", code: '+591' },
				{ country:"Brazil", code: '+55' },
				{ country:"Bhutan", code: '+975' },
				{ country:"Botswana", code: '+267' },
				{ country:"Belarus", code: '+375' },
				{ country:"Belize", code: '+501' },
				{ country:"Canada", code:'+1' },
				{ country:"Central African Republic", code:'+236' },
				{ country:"Cook Islands", code:'+682' },
				{ country:"Chile", code: '+56' },
				{ country:"Cameroon", code:'+237' },
				{ country:"Colombia", code:'+57' },
				{ country:"Costa Rica", code: '+506' },
				{ country:"Cape Verde", code: '+238' },
				{ country:"Cambodia", code: '+855' },
				{ country:"Comoros", code: '+269'},
				{ country:"Curaçao", code: '+599' },
				{ country:"Cyprus", code: '+357' },
				{ country:"Czech Republic", code: '+420' },
				{ country:"Djibouti", code: '+253' },
				{ country:"Denmark", code: '+45' },
				{ country:"Ecuador", code: '+593' },
				{ country:"Egypt", code: '+20' },
				{ country:"El Salvador", code: '+503' },
				{ country:"Ethiopia", code: '+251' },
				{ country:"Finland", code: '+358' },
				{ country:"Fiji", code: '+679' },
				{ country:"Falkland Islands (Malvinas)", code: '+500' },
				{ country:"Faroe Islands", code: '+298' },
				{ country:"France", code: '+33' },
				{ country:"Gabon", code: '+241' },
				{ country:"Georgia", code: '+995' },
				{ country:"Germany", code: '+49' },
				{ country:"Gibraltar", code: '+350' },
				{ country:"Greenland", code: '+299' },
				{ country:"Gambia", code: '+220' },
				{ country:"Greece", code: '+30' },
				{ country:"Guatemala", code: '+502' },
				{ country:"Guyana", code: '+592' },
				{ country:"Hong Kong", code: '+852' },
				{ country:"Honduras", code: '+504' },
				{ country:"Croatia", code: '+385' },
				{ country:"Haiti", code: '+509' },
				{ country:"Hungary", code: '+36' },
				{ country:"Indonesia", code: '+62' },
				{ country:"Ireland", code: '+353' },
				{ country:"Israel", code: '+972' },
				{ country:"India", code: '+91' },
				{ country:"Iraq", code: '+964' },
				{ country:"Italy", code: '+39' },
				{ country:"Jordan", code: '+962' },
				{ country:"Japan", code: '+81' },
				{ country:"Kenya", code: '+254' },
				{ country:"Kyrgyzstan", code: '+996' },
				{ country:"Korea (South)", code: '+82' },
				{ country:"Kuwait", code: '+965' },
				{ country:"Kazakhstan", code: '+7' },
				{ country:"Lebanon", code: '+961' },
				{ country:"Liechtenstein", code: '+423' },
				{ country:"Lesotho", code: '+266' },
				{ country:"Lithuania", code: '+370' },
				{ country:"Luxembourg", code: '+352' },
				{ country:"Latvia", code: '+371' },
				{ country:"Libya", code: '+218' },
				{ country:"Morocco", code: '+212' },
				{ country:"Moldova", code: '+373' },
				{ country:"Montenegro", code: '+382' },
				{ country:"Madagascar", code: '+261' },
				{ country:"Macedonia Republic of", code: '+389' },
				{ country:"Myanmar", code: '+95' },
				{ country:"Mongolia", code: '+976' },
				{ country:"Macao", code: '+853' },
				{ country:"Malta", code: '+356' },
				{ country:"Mauritius", code: '+230' },
				{ country:"Malawi", code: '+265' },
				{ country:"Mexico", code: '+52' },
				{ country:"Malaysia", code: '+60' },
				{ country:"Mozambique", code: '+258' },
				{ country:"Namibia", code: '+264' },
				{ country:"New Caledonia", code: '+687' },
				{ country:"Niger", code: '+227' },
				{ country:"Nigeria", code: '+234' },
				{ country:"Nicaragua", code: '+505' },
				{ country:"Netherlands", code: '+31' },
				{ country:"Norway", code: '+47' },
				{ country:"Nepal", code: '+977' },
				{ country:"New Zealand", code: '+64' },
				{ country:"Oman", code: '+968' },
				{ country:"Panama", code: '+507' },
				{ country:"Peru", code: '+51' },
				{ country:"Papua New Guinea", code: '+675' },
				{ country:"Philippines", code: '+63' },
				{ country:"Pakistan", code: '+92' },
				{ country:"Poland", code: '+48' },
				{ country:"Portugal", code: '+351' },
				{ country:"Paraguay", code: '+595' },
				{ country:"Qatar", code: '+974' },
				{ country:"Réunion", code: '+262' },
				{ country:"Romania", code: '+40' },
				{ country:"Serbia", code: '+381' },
				{ country:"Russian Federation", code: '+7' },
				{ country:"Rwanda", code: '+250' },
				{ country:"Saudi Arabia", code: '+966' },
				{ country:"Seychelles", code: '+248' },
				{ country:"Sudan", code: '+249' },
				{ country:"Sweden", code: '+46' },
				{ country:"Singapore", code: '+65' },
				{ country:"Saint Helena", code: '+290' },
				{ country:"Slovenia", code: '+386' },
				{ country:"Slovakia", code: '+421' },
				{ country:"Sierra Leone", code: '+232' },
				{ country:"Senegal", code: '+221' },
				{ country:"Sri Lanka", code: '+94' },
				{ country:"Suriname", code: '+597' },
				{ country:"Spain", code: '+34' },
				{ country:"Switzerland", code: '+41' },
				{ country:"Swaziland", code: '+268' },
				{ country:"Togo", code: '+228' },
				{ country:"Thailand", code: '+66' },
				{ country:"Turkmenistan", code: '+993' },
				{ country:"Tonga", code: '+676' },
				{ country:"Turkey", code: '+90' },
				{ country:"Taiwan", code: '+886' },
				{ country:"Tanzania", code: '+255' },
				{ country:"Ukraine", code: '+380' },
				{ country:"Uganda", code: '+256' },
				{ country:"United States of America", code: '+1' },
				{ country:"Uruguay", code: '+598' },
				{ country:"Uzbekistan", code: '+998' },
				{ country:"United Kingdom", code: '+44' },
				{ country:"Venezuela (Bolivarian Republic)", code: '+58' },
				{ country:"Viet Nam", code: '+84' },
			],
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
  }
}
</script>
