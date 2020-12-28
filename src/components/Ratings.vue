<template>
    <div @click="onRate" class="rating-wrap">
        <div class="thesize ml-2">SEE THIS USER'S RATING</div>
        <v-rating v-model="rating" readonly background-color="orange lighten-3" color="orange" small></v-rating>
        <v-dialog v-model="dialogRate" width="500">
            <v-card min-height="400">
                <v-card-title class="dialog-top lighten-2">FEEDBACK</v-card-title>
                <v-card-text class="mt-3">
                    <div v-if="ratingFeedback.length > 0">
                        <div v-for="(item, i) in ratingFeedback" v-bind:key="i">                                            
                            <v-icon small class="mr-3">{{ item.rating ? "mdi-thumb-up-outline" : "mdi-thumb-down-outline" }}</v-icon>                         
                            "{{item.feedback}}" from {{item.from}}
                        </div>
                    </div>
                    <div v-else>
                        NO FEEDBACK
                    </div>
                </v-card-text>
                <v-divider></v-divider>
            </v-card>
        </v-dialog>					
    </div>
</template>

<style lang="scss" scoped>
.rating-wrap{
    cursor:pointer;
    .thesize {
        font-size:10px;
    }
    &:hover{
        opacity:0.8;
    }
}
.dialog-top{
  background:#262222;
  color:white;
}

</style>

<script>
// import { mdiThumbDownOutline, mdiThumbUpOutline } from '@mdi/js';

import firebase from "firebase/app"
import 'firebase/storage'

  export default {
    name: 'HelloWorld',
    props: ['userUid'],
    data: () => ({
        rating: 0,
        ratingFeedback: [],
        dialogRate: false
    }),
    methods: {
        getRating: async function() {
            let result = await firebase.firestore().collection("ratings").doc("rate").get()
            let res = result.data().ratings.filter(v => v.toUid === this.userUid)

            let total = res.length
            let positive = res.filter(v => v.rating === "positive").length
            // let negative = res.filter(v => v.rating === "negative").length
            this.rating = +Math.round((positive / total) * 5).toFixed(1)
            this.ratingFeedback = res
        },
        onRate: async function() {
            this.dialogRate = true
        },        
    },
    mounted: function() {
        this.getRating()
    }
  }
</script>
