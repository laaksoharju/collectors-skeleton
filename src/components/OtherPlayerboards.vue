<template>
  <div id="AllOtherPlayerboards">
      <div v-for="(player, index) in Players" :key="index" :player="player">
        <div v-if="player!= Players[playerId]">
          <div v-on:click="playerClicked(index)" class="otherPlayerBoard"> 
            <p>Player {{index}}</p>
            <PlayerBoard v-if = dispPlayerboard :player="player" />
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
        dispPlayerboard: false
    }},
    methods: {
        playerClicked: function(playerIndex) {
          console.log("Playerboard clicked: " + playerIndex)
            if (this.dispPlayerboard){
                this.dispPlayerboard = false;
            }
            else{
                this.dispPlayerboard = true;
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
    width: auto;
    text-align: center;
    color: black;
    background-color: hotpink;
    }
    .otherPlayerBoard:hover {
    cursor: pointer;
    background-color: coral;
    }
</style>