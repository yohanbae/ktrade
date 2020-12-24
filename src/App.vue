<template>
  <v-app>
  <div id="app">
    <div class="header">
      <!-- <div class="header-deco"></div> -->
      <div class="header-title">
        <h2>K-POP FREE EXCHANGE SERVICE</h2>
        <h5>The K-Pop goods exchange service between KPOP Fans</h5>
        <h5>100% Free service between the phone verified secure users</h5>
        <h5>Feel free to upload your unnecessary goods here</h5>
      </div>
      <div class="header-bar">
        <span class="bar-btn header-menu" @click="toTrade">ITEMS</span>

        <div class="header-bar-right">
        <v-menu left bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="mr-5" icon v-bind="attrs" v-on="on">
              <v-icon class="thewhite" color="white">mdi-help-circle-outline</v-icon>
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item>
              <v-list-item-title class="header-menu">HOW THIS WORKS?</v-list-item-title>
            </v-list-item>                        
            <v-list-item>
              <v-icon class="mr-5">mdi-account-arrow-right</v-icon>
              <v-list-item-title class="header-menu" @click="onTutorialPost">I WANT TO POST MY ITEM</v-list-item-title>
            </v-list-item>            
            <v-list-item>
              <v-icon class="mr-5">mdi-account-arrow-left-outline</v-icon>
              <v-list-item-title class="header-menu" @click="onTutorial">I FOUND AN ITEM I WANT</v-list-item-title>
            </v-list-item>            
          </v-list>
        </v-menu>        
        <v-menu left bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-bind="attrs" v-on="on">
              <v-icon class="thewhite" color="white">mdi-account</v-icon>
            </v-btn>
          </template>

          <v-list v-if="myUser" dense>
            <v-list-item v-if="myUser.loggedIn">
                <v-icon class="mr-5">mdi-account-circle</v-icon>
                <v-list-item-title class="header-menu" @click="toAccount">MANAGE ACCOUNT</v-list-item-title>
            </v-list-item>            
            <v-list-item v-if="myUser.loggedIn">
              <v-icon class="mr-5">mdi-post</v-icon>
              <v-list-item-title class="header-menu" @click="toMyTrade">MY POSTINGS</v-list-item-title>
            </v-list-item>            
            <v-list-item v-if="myUser.loggedIn">
              <v-icon class="mr-5">mdi-account-convert-outline</v-icon>
              <v-list-item-title class="header-menu" @click="toTransactionList">MESSAGES</v-list-item-title>
            </v-list-item>            
            <v-list-item v-if="myUser.loggedIn">
              <v-icon class="mr-5">mdi-exit-run</v-icon>
              <v-list-item-title class="header-menu" @click="toLogout">LOGOUT</v-list-item-title>
            </v-list-item>            
            <v-list-item v-else>
              <v-icon class="mr-5">mdi-login-variant</v-icon>
              <v-list-item-title class="header-menu" @click="toLogin">LOGIN</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        </div>
      </div>
    </div>
    <v-snackbar outlined v-model="snackbar">
      {{errorText}}
      <template v-slot:action="{ attrs }">
        <v-btn color="gray" text v-bind="attrs" @click="snackbar = false">Close</v-btn>
      </template>
    </v-snackbar>
    <div class="main">
      <router-view/>
    </div>

    <div class="notice pa-4" v-if="notice">
      Hello. This is a testing page. You can do whatever you want here but all items will be deleted after Testing.
      <span @click="notice = false">CLOSE</span>
    </div>

    <div class="footer">
      <div class="footer-one">
        <div @click="onAbout">ABOUT US</div>
        <div></div>
        <div class="text-right" @click="onFeedback">SEND US FEEDBACK</div>
      </div>
      <div class="footer-two mt-6">COPYRIGHT @ 2020 KPOP FREE EXCHANGE ALL RIGHT RESERVED</div>
    </div>

    <v-dialog v-model="dialogAbout" width="500" v-if="myUser">
      <v-card>
        <v-card-title small class="dialog-top headline lighten-2">
          About
        </v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <div class="pa-4 small">
          Welcome!<br />
          We provide an free service for all K-POP fans to exchange goods for free.
          I developed this website for myself since I didn't want to spend extra money to collect photocards.<br /><br />

          We provide this service to the only phone verified users<br />
          This is a common way in Korea in which only phone verified users can trade the item. Hope this will work well internationally.
          <br /><br />
          Feel free to post your unnecessary items here. Hope you to have more satisfaction with less spending :)
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>

		<v-dialog v-model="dialogTutorialPost" width="500">
      <v-carousel>
        <v-carousel-item>
          <div class="tutorial-wrap">
            <img src="./assets/tutorialpost01.png" alt="hoi" />
            <div class="tutorial-desc">
              <div>
              Search for a item you are interested<br />
              If you find one, then click it to see more detail<br />
              </div>
            </div>
          </div>
        </v-carousel-item>
        <v-carousel-item>
          <div class="tutorial-wrap">
            <img src="./assets/tutorialpost02.png" alt="hoi" />
            <div class="tutorial-desc">
              <div>
              Read full description of the item,<br />
              Check if you have the uploader’s wanted item and your location is close to the uploader.<br />
              If all conditions are met, then click the “Request Trade” button.
              </div>
            </div>
          </div>
        </v-carousel-item>        
        <v-carousel-item>
          <div class="tutorial-wrap">
            <img src="./assets/tutorial04.png" alt="hoi" />
            <div class="tutorial-desc">
              <div>
              Now you are in the chatroom with the uploader!<br />
              You can discuss more about items and trade.<br />
              Once you make a decision, then click the “TRADE” button.
              </div>
            </div>
          </div>
        </v-carousel-item>        
        <v-carousel-item>
          <div class="tutorial-wrap">
            <img src="./assets/tutorial05.png" alt="hoi" />
            <div class="tutorial-desc">
              <div>
                Under condition if both of you click the “TRADE” button,<br />
                You will be able to see each other’s personal information: Phone number & email address.<br />
                From now on, you are free from us and can trade with the person.<br />
                Don’t forget to rate each other after trade so other 
              </div>
            </div>
          </div>
        </v-carousel-item>         
      </v-carousel>
		</v-dialog>

		<v-dialog v-model="dialogTutorial" width="500">
      <v-carousel>
        <v-carousel-item>
          <div class="tutorial-wrap">
            <img src="./assets/tutorial01.png" alt="hoi" />
            <div class="tutorial-desc">
              <div>
              Search for a item you are interested<br />
              If you find one, then click it to see more detail<br />
              </div>
            </div>
          </div>
        </v-carousel-item>
        <v-carousel-item>
          <div class="tutorial-wrap">
            <img src="./assets/tutorial02.png" alt="hoi" />
            <div class="tutorial-desc">
              <div>
              Read full description of the item,<br />
              Check if you have the uploader’s wanted item and your location is close to the uploader.<br />
              If all conditions are met, then click the “Request Trade” button.
              </div>
            </div>
          </div>
        </v-carousel-item>        
        <v-carousel-item>
          <div class="tutorial-wrap">
            <img src="./assets/tutorial03.png" alt="hoi" />
            <div class="tutorial-desc">
              <div>
                Now the system will ask you to attach a photo file of your item.<br />
                Once you add photo and description,<br />
                Click send request.
              </div>
            </div>
          </div>
        </v-carousel-item>
        <v-carousel-item>
          <div class="tutorial-wrap">
            <img src="./assets/tutorial04.png" alt="hoi" />
            <div class="tutorial-desc">
              <div>
              Now you are in the chatroom with the uploader!<br />
              You can discuss more about items and trade.<br />
              Once you make a decision, then click the “TRADE” button.
              </div>
            </div>
          </div>
        </v-carousel-item>        
        <v-carousel-item>
          <div class="tutorial-wrap">
            <img src="./assets/tutorial05.png" alt="hoi" />
            <div class="tutorial-desc">
              <div>
                Under condition if both of you click the “TRADE” button,<br />
                You will be able to see each other’s personal information: Phone number & email address.<br />
                From now on, you are free from us and can trade with the person.<br />
                Don’t forget to rate each other after trade so other 
              </div>
            </div>
          </div>
        </v-carousel-item>  
        <v-carousel-item>
          <div class="tutorial-wrap">
            <img src="./assets/tutorial05.png" alt="hoi" />
            <div class="tutorial-desc">
              <div>
              Notice<br />
              Anyone can request trade or upload item with an account.<br />
              We encourage you to trade in person to avoid fraud. Find person live close to your area.<br />
              If you are willing to trade through mail, find someone with good rating.<br />
              Don’t forget to give a rate after successful trade so other users can see the reputation.<br />
              This place is money free zone. No buying/selling.<br />
              One item has a value of one. Cannot be traded with multiple items.<br />
              Ktrade is not responsible any scam/fraud act between users.
              </div>
            </div>
          </div>
        </v-carousel-item>          
      </v-carousel>
		</v-dialog>

  </div>
  </v-app>
</template>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.notice {
  border:1px solid gray;
  width: 300px;
  height: 200px;
  position: absolute;
  top: 10px;
  right: 10px;
  background:white;
}

.header {
  height:200px;
  // background:#262222;
  background:url('./assets/back.jpg');
  position:relative;
  color:white;

  .header-deco {
    position: absolute;
    border:1px solid black;
    opacity: 0.6;
    width: calc(100% - 10px);
    height: 290px;
    top: 5px;
    left: 5px;
    border-radius:5px;
  }

  .thewhite { color:white; }

  .header-title {
    position:absolute;
    font-size: 20px;
    color:#e6e3e3;    
    top:30px;
    left:calc((100% - 420px) / 2);
    h6,h5 {
      font-weight:100;
      font-size:14px;
    }
    h2 { font-size: 14px; margin-bottom:20px;}    
  }

  .header-bar {
    height:50px;
    width:420px;    
    left:calc((100% - 420px) / 2);
    position:absolute;
    bottom:0;
    display:grid;
    grid-template-columns: 80px 1fr;
    align-items: center;
    font-size:12px;
    letter-spacing: 2px;
    font-weight:300;
    .header-bar-right{
      text-align:right;
    }
  }
  @media only screen and (min-width: 768px) {
    height:300px;
    .header-bar {
      width:768px;    
      left:calc((100% - 768px) / 2);
    }
    .header-title {
      top: 50px;
      left:calc((100% - 768px) / 2);
      h2 { font-size: 20px;}
      h5,h6 { font-size: 15px; }
    }
  }
  @media only screen and (min-width: 1366px) {
    height:300px;
    .header-bar {
      width:1366px;    
      left:calc((100% - 1366px) / 2);
    }    
    .header-title {
      top: 80px;
      left:calc((100% - 1366px) / 2);
      h2 { font-size: 25px;}
      h5,h6 { font-size: 15px; }
    }
  }  
}

.header-menu {
  cursor: pointer;
}

.main {
  padding:20px 0;  
  min-height:50vh;
  width:420px;    
  margin-left:calc((100% - 420px) / 2);
  @media only screen and (min-width: 768px) {
    width:768px;    
    margin-left:calc((100% - 768px) / 2);
  }
  @media only screen and (min-width: 1366px) {
    width:1366px;    
    margin-left:calc((100% - 1366px) / 2);
  }
}

.footer {
  padding:30px 0;
  background:#262222;
  color:white;
  padding-left:calc((100% - 1366px) / 2);  
  padding-right:calc((100% - 1366px) / 2);  
  .footer-one{
    display:grid;
    grid-template-columns: 1fr 1fr 1fr;
    font-size:12px;
    cursor:pointer;
  }
  .footer-two{
    text-align: center;
    font-size:12px;
    cursor:pointer;
  }

  @media only screen and (min-width: 768px) {
    padding-left:calc((100% - 768px) / 2);  
    padding-right:calc((100% - 768px) / 2); 
  }
  @media only screen and (min-width: 1366px) {
    padding-left:calc((100% - 1366px) / 2);  
    padding-right:calc((100% - 1366px) / 2); 
  }

}

.tutorial-wrap {
  background:white;
  height:100%;
  color:#262222;
  font-size:10px;
  text-align: center;
  img {
    width:100%;
    height:50%;
    object-fit: contain;
    margin-top:20px;
    margin-left:-30px;
  }
  .tutorial-desc {
    display:grid;
    align-items: center;
    padding: 0 20px;
    padding-right:40px;
  }
  @media only screen and (min-width: 768px) {
    display:grid;
    grid-template-columns: 1fr 1fr;
    font-size:14px;
    text-align: left;    
    img {
      width:100%;
      height:100%;
      object-fit: contain;
      margin:0;
    }
  }
}


</style>

<script>
import firebase from "firebase/app"
import 'firebase/storage';

export default {
  name: 'App',
  components: {
  },
  data: function() {
    return {  
      loaded: false,
      snackbar: false,
      errorText: "Network Error",
      dialogTutorial: false,
      dialogTutorialPost: false,
      dialogAbout: false,
      notice: true
    }
  },
  created() {
      this.$root.$refs.A = this;
  },  
  methods: {
    onAbout: function() {
      this.dialogAbout = true
    },
    onTutorialPost: function() {
      this.dialogTutorialPost = true
    },
    onTutorial: function() {
      this.dialogTutorial = true
    },
    onFeedback:function() {
      this.$router.push('/feedback').catch(() => {})
    },
    toAccount: function() {
      this.$router.push('/account').catch(() => {})
    },
    toLogin: function() {
      this.$router.push('/register').catch(() => {})
    },
    toMyTrade: function() {
      this.$router.push('/mytrade').catch(() => {})
    },
    toTrade: function() {
      this.$router.push('/trade').catch(() => {})
    },
    toTransactionList: function() {
      this.$router.push('/transactionList').catch(() => {})
    },
    toLogout: function() {
      let locate = this
      firebase.auth().signOut().then(function() {
				locate.$root.$refs.A.triggerError("LOGGED OUT");
        locate.$router.push('/trade').catch(() => {})
			})
    },
    triggerError: function(msg) {
      this.errorText = msg
      this.snackbar = true
    }
  },
  computed: {
    myUser() { return this.$store.state.user }
  },
  watch: {
    myUser: function() {
      this.loaded = true
    }
  },
  mounted: async function() {
    await this.$store.dispatch({type: 'loggedIn' })
  },
}
</script>
