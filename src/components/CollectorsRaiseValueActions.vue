<template>
    <div>
      <h1>{{ labels.raiseValue }}</h1>
      <div class="raise-value">
        <div v-for="(type, index) in marketValues" :key="index">
          {{ type }}
        </div>
        <div v-for="(card, index) in market" :key="index">
          {{ index }}
          <CollectorsCard
            :card="card"/>
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
// import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsRaiseValueActions',
  components: {
    // CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    skillsOnSale: Array,
    auctionCards: Array,
    marketValues: Object,
    placement: Array,
    market: Array
  },
  methods: {
    cannotAfford: function (cost) {
      return (this.player.money < cost);
    },

    placeBottle: function (p) {
      this.$emit('placeBottle', p.cost);
      this.highlightAvailableCards();
    },

    highlightAvailableCards: function () {
      if (this.skillsOnSale[4].item !== undefined) {
          this.$set(this.skillsOnSale[4], "available", true);
      }
      if (this.auctionCards[3].item !== undefined) {
        this.$set(this.auctionCards[3], "available", true);
      }
      for (let i = 0; i < this.player.hand.length; i += 1) {
          this.$set(this.player.hand[i], "available", true);
      }
    },
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .raise-values {
    display: grid;
    grid-template-columns: repeat(auto-fill, 130px);
  }

  .buttons {
    display: grid;
    float:left;
    grid-template-columns: repeat(auto-fill, 130px);
  }
</style>
