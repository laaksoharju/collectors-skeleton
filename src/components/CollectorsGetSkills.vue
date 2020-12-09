<template>
  <div class = "skillPool">
    Skill Pool
    <div class = "EnergyBottles">
    </div>
    <div class = "EnergyBottles">
    </div>
    <div class = "EnergyBottles">
    </div>

    <div class = "EnergyBottleCoin">
    </div>
    <div class = "EnergyBottleCoin">
    </div>

      <div class = "get-skill" >
        <div v-for="(card, index) in skillsOnSale" :key="index">
          <CollectorsCard
            :card="card"
            :availableAction="card.available"
            @doAction="getSkill(card)"/>
        </div>
      </div>
  </div>

</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsGetSkills',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    skillsOnSale: Array,
    //placement: Array
  },
  methods: {
    getSkill: function (card) {
      this.highlightAvailableCards()
      if (card.available){
        this.$emit('getSkill', card)
      }
    },
   highlightAvailableCards: function (){
      for (let i = 0; i < this.skillsOnSale.length; i += 1) {
          this.$set(this.skillsOnSale[i], "available", true);
          }
        }
    }
  }
</script>

<style scoped>

.skillPool{
  grid-column: 1 / span 2;
  grid-row: 2/span 13 ;
  width: auto;
  height: auto;
  background-color: #dce5cc;
  color: black;
  display: grid;
  grid-template-columns: repeat(3, 50px);
  grid-template-rows: repeat(6,50px);
  grid-row-gap: 25px;
  grid-auto-flow: column;
  }

.EnergyBottles{

  width:50px;
  height:50px;
  background-image:  url('/images/Gain-skill-bottle.png');
  background-size: cover;
}

.EnergyBottleCoin{

  width:50px;
  height:50px;
  background-image:  url('/images/Gain-skill-bottle-coin.png');
  background-size: cover;
}
.get-skill{
  transform: scale(0.25);
}
.get-skill div:hover{
  transform: scale(2)translate(-25%,0);
  z-index: 1;
}
</style>
