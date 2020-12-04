<template>
    <div id="SkillActionDiv">
      <h1 style="text-align: center">{{ labels.getSkill }}</h1>
      <div class="get-skills">
        <div v-for="(card, index) in skillsOnSale" :key="index">
          <CollectorsCard
            :card="card"
            :availableAction="card.available"
            @doAction="getSkill(card)"/>
        </div>
      </div>
      <div>
        <div class="buttons" v-for="(p, index) in placement" :key="index">
          <button
            v-if="p.playerId===null"
            :disabled="cannotAfford(p.cost)"
            @click="placeBottle(p)" >
            ${{p.cost}}
          </button>
          <div v-if="p.playerId !== null" style="color:black">
            {{p.playerId}}
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsSkillActions',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    skillsOnSale: Array,
    marketValues: Object,
    placement: Array
  },
  methods: {
    cannotAfford: function (cost) {
      return (this.player.money < cost);
    },
    placeBottle: function (p) {
      this.$emit('placeBottle', p.cost);
      this.highlightAvailableCards(p.cost);
    },
    highlightAvailableCards: function (cost) {

      for (let i = 0; i < this.skillsOnSale.length; i += 1) {
        if (this.player.money >= cost) {
          this.$set(this.skillsOnSale[i], "available", true);
        }
        else {
          this.$set(this.skillsOnSale[i], "available", false);
        }
        this.chosenPlacementCost = cost;
      }
      for (let i = 0; i < this.player.hand.length; i += 1) {
        this.$set(this.player.hand[i], "available", true);
      }
    },
    getSkill: function (card) {
      if (card.available) {
        this.$emit('getSkill', card)
        this.highlightAvailableCards()
      }
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .get-skills {
    display: grid;
    grid-template-columns: repeat(auto-fill, 130px);
  }

  .buttons {
    display: grid;
    float:left;
    grid-template-columns: repeat(auto-fill, 130px);
  }

  #SkillActionDiv  h1, h2, h3, p  {
    color: black;
  }

</style>
