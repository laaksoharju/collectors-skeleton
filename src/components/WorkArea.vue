<template>
    <div>       
        <div id="workArea">
            <h2 id=workAreaText>Work</h2>
                <div v-if = "round == 1" class="rectangular firstArea" >
                    <div class="workArea_circle" v-on:click = "circleClicked"></div>
                    <div class="first figures">&#9203;</div>
                    <div class="second figures">&#9203;</div>
                    <p>ROUND 1</p>  
                </div>
                <div v-if = "round == 2" class="rectangular firstArea">
                    <div class="workArea_circle" v-on:click = "circleClicked"></div>
                    <div class="workArea_component">
                    <CircleComponent v-bind:value=-1 />
                    </div>
                    <div class="first figures">&#9203;</div>
                    <div class="second figures">&#9203;</div>
                    <p>ROUND 2</p>
                </div>
                <div v-if = "round == 3" class="rectangular firstArea">
                    <div class="workArea_circle" v-on:click = "circleClicked"></div>
                    <div class="workArea_component">
                        <CircleComponent v-bind:value=2 />
                    </div>
                    <div class="first figures">&#9203;</div>
                    <div class="second figures">&#9203;</div>
                    <p>ROUND 3</p>
                </div>
                <div v-if = "round == 4" class="rectangular firstArea">
                    <div class="workArea_circle" v-on:click = "circleClicked"></div>
                    <div class="workArea_component">
                        <CircleComponent v-bind:value=3 />
                    </div>
                    <div class="first figures">&#x267B;</div>
                    <p>ROUND 4</p>
                </div>
            <div class="rectangular secondArea">
                <div class="workArea_circle" v-on:click = "circleClicked"></div>
                <div class="workArea_component">
                    <CircleComponent v-bind:value=1 />
                </div>
                <div class="first figures">&#x267B;</div>
            </div>
            <div class="rectangular thirdArea">
                <div class="workArea_circle" v-on:click = "circleClicked"></div>
                <div class="workArea_component">
                    <CircleComponent v-bind:value=-1 />
                </div>
                <!--Här ska bilden in-->
                <div class="first" id="getCard"></div>
                <!--<div class="first figures">&#127183;</div>-->
                <!--<div class="second figures">&#127183;</div>-->
                <div class="second" id="getCard"></div>
            </div>
            <div class="rectangular fourthArea">
                <div class="workArea_circle" v-on:click = "circleClicked"></div>
                <div class="first" id="getCard"></div>
                <!--<div class="first figures">&#127183;</div>-->
                <div class="workArea_token">
                    <FirstPlayerToken/>
                </div>
            </div>
            <div class="rectangular fifthArea">
                <div class="workArea_circle" v-on:click = "circleClicked"></div>
                <!--<div class="first figures">&#127183;</div>-->
                <div class="first" id="getCard"></div>
                <div class="second figures">&#9203;</div>
            </div>
        </div>
    </div>
</template>

<script>
import CircleComponent from '@/components/CircleComponent.vue'
import FirstPlayerToken from '@/components/FirstPlayerToken.vue'

export default {
    name: "WorkArea",

    components: {
        CircleComponent,
        FirstPlayerToken,
    },

    props: {
        color: String
    },

    data: function() {
        return {
            round: 4,
            clicked: false,
            /*color: "blue",*/
        }
    },
    methods: {
        circleClicked: function(e) {
            if(!this.clicked){
                let clickedEl = e.target;
                /*clickedEl.style.backgroundColor = this.color;*/
                clickedEl.setAttribute("style", "background-color:"+this.color);
                this.clicked = true;
                console.log("färg")
            }
            else{
                let clickedEl = e.target;
                clickedEl.setAttribute("style", "background-color:white");
                this.clicked = false;
            }
            
        }
    },


}
</script>
    
<style scoped>
    #workArea {
        /*background-color: rgb(235, 235, 109);*/
        background-color: #F5F2CC; /* #ffe599ff;*/
        width: 100%;
        border: 1px solid black;
        display: flex;
        align-items: center;
        flex-direction: column;
    }
   
    /*#workArea p { gjorde att alla p taggar i hela diven blev svarta och center, inte bra dvs.
        color:black;
        font-size: 20px;
        font-weight: bold;
        text-align: center;
    }*/

    #workAreaText {
        color:black;
        /*font-size: 30px;*/
        font-weight: bold;
        text-align: center;
    }

    .rectangular {
        margin: 7px;
        height: 120px;
        width: 90%;
        color: black;
        background-color: #F5F2CC; /* #ffe599ff;*/
        border: 3px solid grey;
        /*display: flex;
        justify-content: space-around;*/
        display: grid;
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;

    }

    .firstArea {
        border: 3px dotted grey;
        /*display: grid;
        grid-template-columns: 1fr 1fr;*/
    }

    .firstArea p {
        color: black;
        font-size: 14px;
        font-weight: bold;
        text-align: right;
        grid-column: 5;
        margin-top: 10px;
        margin-right: 10px;
    }

    .workArea_circle {
        text-align: center;
        font-size: 50px;
        width: 100px;
        height: 100px;
        color: black;
        background-color: white;
        border-radius: 50%;
        border: 1px solid black;
        margin-top: 8px;
        margin-left: 10px;
        grid-column: 1;
    }

    .workArea_component {
        grid-column: 2;
        margin-top: 40px;
    }

    .workArea_token {
        grid-column: 4;
        margin-top: 40px;
    }

    /*kke ta bort nedan*/
    .figures {
        font-size: 50px;
        margin-top: 40px;
    }

    .first {
        grid-column: 3;
        margin-top: 20px;
    }

    .second {
        grid-column: 4;
        margin-top: 20px;
    }

    #getCard {
        background: url("/images/getCardInWorkArea.PNG");
        background-size: 70px 75px;
        background-repeat: no-repeat;
    }
</style>