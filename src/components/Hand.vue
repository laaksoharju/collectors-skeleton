<template>
  <div class="handPlayer" :style="{ backgroundColor: player.color }">
    <div class="test">
    <InfoButtons :modalProps="handProps" />
      
      <h2>HAND</h2>
    </div>
    <div class = "handSlot" :style="{ backgroundColor: player.color }">
        
        
        <CollectorsCard v-for="(card, index) in player.hand"
            :card="card"
            :availableAction="card.available"
            :key="index"/>
        <!--<div id="secretCard">
            <p>Secret</p>
            <CollectorsCard :card="player.secret" />
        </div>-->

    </div>
    </div>
</template>

<script>
import CollectorsCard from "@/components/CollectorsCard.vue";
import InfoButtons from "@/components/InfoButtons.vue";

export default {
  name: "Hand",
  components: {
    CollectorsCard,
    InfoButtons,
  },
  props: {
    player: Object,
  },

  data: function () {
    return {
      handProps: {
      value: "Hand",
      text: "Information about hand",
      title: "",
      classes: `${this.player.color} button`,
    }}
  },
  methods: {
    
  },
};
</script>

<style scoped>
.handSlot {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
  grid-template-rows: repeat(auto-fill, 180px);
  background-color: white;
  padding: 10px;
  /*margin: 10px;*/
  /*border-radius: 3px;*/
}
.handSlot div{
  transform: scale(0.5) translate(-50%, -50%);
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}
.handSlot div:hover {
  transform: scale(1) translate(-25%, 0);
  z-index: 1;
}

div.handPlayer {
  overflow-y: scroll;
  white-space: nowrap;
  
}

.handPlayer {
  width: 100%;
  border: 1px solid black;
  border-left-style: none;
}

/*DENNA BORDE KUNNA LIGGA SOM DEN ÖVERSTA KLASSEN, MEN DET BLIR KNAS MED HEIGTHEN DÅ*/
.handWrapper {
  padding: 10px;
  width: 100%;
  border: 1px solid black;
  border-left-style: none;
}
#secretCard{
    background: url("/images/baksida.png");
    background-size: 8vw 10vw;
  background-repeat: no-repeat;
    border-radius: 3px;
    padding: 10px;
    text-align:center;
}
</style>