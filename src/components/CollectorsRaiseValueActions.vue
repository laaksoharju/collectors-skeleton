<template>
    <div>
      <h1>{{ labels.getSkill }}</h1>
      <div class="raise-value">
        <div v-for="(card, index) in market" :key="index">
          <CollectorsCard
            :card="card"
            :availableAction="card.available"
            @doAction="raiseValue(card)"/>
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
          <div v-if="p.playerId !== null">
            {{p.playerId}}
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsRaiseValueActions',
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



    raiseValue: function (card) {
      if (card.available) {
        this.$emit('raiseValue', card)
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
</style>
