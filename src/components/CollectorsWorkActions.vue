<template>
  <div id="WorkActionsDiv">
    <h1 style="text-align: center">{{ labels.doWork }}</h1>
      <div id="WorkContainer">
        <div id="PickRoundButtons" >
          <input type="radio" id="roundOneButton" value="Round 1" v-model="picked" >
          <label for="roundOneButton">Round 1</label>
          <br>
          <input type="radio" id="roundTwoButton" value="Round 2" v-model="picked" >
          <label for="roundTwoButton">Round 2</label>
          <br>
          <input type="radio" id="roundThreeButton" value="Round 3" v-model="picked" >
          <label for="roundThreeButton">Round 3</label>
          <br>
          <input type="radio" id="roundFourButton" value="Round 4" v-model="picked" >
          <label for="roundFourButton">Round 4</label>
          <br>
          <span>Round: {{ picked }}</span>
        </div>
        <div id="WorkButtons">
          <div class="buttons" v-for="(p, index) in placement" :key="index">
            <button
            v-if="p.playerId===null"
            :disabled="cannotAfford(p.cost)"
            @click="placeBottle(p, index)">
            ${{p.cost}}
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
    placement: Array
  },

  data: function () {
    return {
        picked:'Round 1'
      }
  },

  methods: {
    cannotAfford: function (cost) {
      return (this.player.money < cost);
    },

    placeBottle: function (p, index) {
      p.index = index;
      this.$emit('placeBottleWork', p);
    },

  }

}

</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.get-skills {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
  grid-template-rows: repeat(auto-fill, 260px);
}
.get-skills div {
  transform: scale(0.8)translate(-10%,-10%);
  transition:0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}
.get-skills div:hover {
  transform: scale(0.9)translate(-10%,-10%);
  z-index: 1;
}

.buttons {
  display: grid;
  float:left;
  grid-template-columns: repeat(auto-fill, 130px);
  transform: scale(0.8)translate(10%,-10%);
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
