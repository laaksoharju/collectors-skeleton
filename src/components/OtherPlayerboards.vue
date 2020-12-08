<template>
  <div id="AllOtherPlayerboards">
      <div v-for="(player, index) in Players" :key="index" :player="player">
        <div v-if="player!= Players[playerId]">
          <div v-on:click="playerboardClicked(index)" :style="{backgroundColor: player.color}" class="otherPlayerBoard"> 
            <h2> Player {{index}} </h2>
            <PlayerBoard v-if="dispPlayerboard === index" :player="player" />
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import PlayerBoard from './PlayerBoard.vue';

export default {
    name: "OtherPlayerboards",
    components: {
        PlayerBoard
    },
    props:{
      Players: Object,
      playerId: String
    },
    data: function () {
    return {
        dispPlayerboard: ""
    }},
    methods: {
        playerboardClicked: function(index) {
            if(this.dispPlayerboard != index){
              this.dispPlayerboard = index;
            }
            else{
              this.dispPlayerboard = "";
            }
        },
    },
};
</script>
<style scoped>
    .otherPlayerBoard {
    margin: 5px;
    padding: 5px;
    border-radius: 3px;
    text-align: center;
    color: black;
    }
    .otherPlayerBoard:hover{
    cursor: pointer;
    }
</style>