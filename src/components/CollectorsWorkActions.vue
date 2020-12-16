changeRoundWork<template>
  <div id="WorkActionsDiv">
    <h1 style="text-align: center"><img class="title_img" src="images/work.png">{{ labels.doWork }}</h1>
    <div id="WorkContainer">
      <div id="WorkButtons">
        <div class="buttons" v-for="(p, index) in placement" :key="index">
          <button
          v-if="p.playerId===null"
          :disabled="cannotAfford(p.cost) || player.bottles < 1"
          @click="placeBottle(p, index)">
          <img v-if="index===0" :src='changeFirstWorkCard()'  style="width:100%" >
          <p id='firstButtonInfoText' v-if="index===0"> {{changeFirstWorkCardInfoText()}} </p>
          <img :src='p.img' style="width:100%">
          <p id='info_text'> {{p.info_text}} </p>
        </button>
        <div v-if="p.playerId !== null" style="color:black">
          {{p.playerId}}
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'CollectorsWorkActions',
  props: {
    labels: Object,
    player: Object,
    placement: Array,
    activeRound: Number,
  },

  methods: {
    cannotAfford: function (cost) {
      return (this.player.money < cost);
    },

    placeBottle: function (p, index) {
      p.index = index;
      this.$emit('placeBottleWork', p);
    },

    changeFirstWorkCard: function (){
      let firstWorkButtonImage = ['images/Work_Round_1.png','images/Work_Round_2.png','images/Work_Round_3.png','images/Work_Round_4.png'];
      let setImage = [];

      if (this.activeRound === 1) {
        setImage = firstWorkButtonImage[0];
      }
      else if (this.activeRound === 2) {
        setImage = firstWorkButtonImage[1];
      }
      else if (this.activeRound === 3) {
        setImage = firstWorkButtonImage[2];
      }
      else if (this.activeRound === 4) {
        setImage = firstWorkButtonImage[3];
      }
      return setImage;
    },

    changeFirstWorkCardInfoText: function (){
      let firstWorkButtonInfoText = ['Draw 2 cards to Income', 'Draw 2 cards to Income, +1$', 'Draw 2 cards to Income, +2$', 'Discard 1 bottle, +1$']
      let setInfoText = [];

      if (this.activeRound === 1){
        setInfoText = firstWorkButtonInfoText[0];
      }
      else if (this.activeRound === 2) {
        setInfoText = firstWorkButtonInfoText[1];
      }
      else if (this.activeRound === 3) {
        setInfoText = firstWorkButtonInfoText[2];
      }
      else if (this.activeRound === 4) {
        setInfoText = firstWorkButtonInfoText[3];
      }
      return setInfoText
    },
  }
}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.title_img {
  height: 65px;
  width: 75px;
  vertical-align: middle;
  padding-right: 10px;
}

.buttons {
  display: grid;
  float:left;
  grid-template-columns: repeat(auto-fill, 130px);
  grid-template-rows: repeat(auto-fill, 55px);
  transform: scale(1);
  z-index: -1;
}

.buttons {
  display: grid;
  float:center;
  grid-template-columns: repeat(auto-fill, 140px);
  grid-template-rows: repeat(auto-fill, 60px);
  margin: 5px;
  transform: scale(1);
}

.buttons button {
  border-radius: 10px;
  transition: 0.15s;
  transition-timing-function: ease-in-out;
}

.buttons button:hover {
  transform: scale(1.1);
  transition:0.2s;
  transition-timing-function: ease-in-out;
}



.buttons #info_text, #firstButtonInfoText{
  transform: scale(1);
  transition:0.2s;
  transition-timing-function: ease-in-out;
}

.buttons button:hover  #info_text{
  transform: scale(2)translate(0,55%);
  transition:0.2s;
  background-color: white;
  border-radius: 10px;
  transition-timing-function: ease-in-out;
  z-index: 2;
}

.buttons button:hover  #firstButtonInfoText{
  transform: scale(2)translate(0,55%);
  transition:0.2s;
  background-color: white;
  border-radius: 10px;
  transition-timing-function: ease-in-out;
  z-index: 2;
}

#WorkButtons{
  grid-area: workButtons;
  align-self: center;
}
#WorkContainer{
  display: grid;
}

#WorkActionsDiv  h1, h2, h3, p, label, span  {
  color: black;
}

@media screen and (max-width: 1700px) {
#WorkButtons {
    zoom: 0.8;
    -moz-transform: scale(0.8);
  }
}

</style>
