changeRoundWork<template>
  <div id="WorkActionsDiv">
    <h1 style="text-align: center"><img class="title_img" src="images/work.png">{{ labels.doWork }}</h1>
    <div id="WorkContainer">
      <div id="PickRoundButtons" >
        <h3>Double-click to change round</h3>
        <input type="radio" id="roundOneButton" value="Round 1" v-model="picked" v-on:dblclick="changeRoundWork()" >
        <label for="roundOneButton">Round 1</label>
        <br>
        <input type="radio" id="roundTwoButton" value="Round 2" v-model="picked" v-on:dblclick="changeRoundWork()">
        <label for="roundTwoButton">Round 2</label>
        <br>
        <input type="radio" id="roundThreeButton" value="Round 3" v-model="picked" v-on:dblclick="changeRoundWork()">
        <label for="roundThreeButton">Round 3</label>
        <br>
        <input type="radio" id="roundFourButton" value="Round 4" v-model="picked" v-on:dblclick="changeRoundWork()">
        <label for="roundFourButton">Round 4</label>
        <br>
      </div>
      <div id="WorkButtons">
        <div class="buttons" v-for="(p, index) in placement" :key="index">
          <button
          v-if="p.playerId===null"
          :disabled="cannotAfford(p.cost) || player.bottles < 1"
          @click="placeBottle(p, index)">
          <img v-if="index===0" :src='changeFirstWorkCard()'  style="width:100%" >
          <img :src='p.img' style="width:100%">
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
  },

  data: function () {
    return {
      picked:  this.picked
    }
  },

  created: function () {
    this.$store.state.socket.on('collectorsRoundUpdated',function(d){
      console.log('round updated');
      this.activeRound=d.activeRound;
      this.picked = d.activeRound;
    }.bind(this));
  },

  methods: {
    cannotAfford: function (cost) {
      return (this.player.money < cost);
    },

    placeBottle: function (p, index) {
      p.index = index;
      this.$emit('placeBottleWork', p);
    },

    changeRoundWork: function (){
      console.log(this.picked);

      alert(this.picked);
      this.$store.state.socket.emit('collectorsChangeRound', {
        playerId: this.playerId,
        roomId: this.$route.params.id,
        round: this.picked
      });
    },

    changeFirstWorkCard: function (){
      let firstWorkButtonImage = ['images/Work_Round_1.png','images/Work_Round_2.png','images/Work_Round_3.png','images/Work_Round_4.png'];
      let setImage =[];

      if (this.picked === 'Round 1'){
        setImage = firstWorkButtonImage[0];
      }
      else if (this.picked === 'Round 2') {
        setImage = firstWorkButtonImage[1];
      }
      else if (this.picked === 'Round 3') {
        setImage = firstWorkButtonImage[2];
      }
      else if (this.picked === 'Round 4') {
        setImage = firstWorkButtonImage[3];
      }
      return setImage;
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
  transform: scale(0.9);
  z-index: -1;
}

.buttons img{
  border-style: dashed;
  border-width: 1px;
  border-color: black;
  transition:0.15s;
  transition-timing-function:ease-in-out ;
  z-index: 1;
}

.buttons  img:hover {
  position: relative;
  transform: scale(1.6);
  z-index: 1;
}

#PickRoundButtons{
  grid-area: pickRoundButtons;
  align-self: center;
}

#WorkButtons{
  grid-area: workButtons;
  align-self: center;
}
#WorkContainer{
  display: grid;
  grid-template-columns: 15% 85% ;
  grid-template-areas:
  "pickRoundButtons workButtons"
}

#WorkActionsDiv  h1, h2, h3, p, label, span  {
  color: black;
}

</style>
