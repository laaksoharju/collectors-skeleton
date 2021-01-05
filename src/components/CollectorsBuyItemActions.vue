<template>
    <div>
      <h1>{{ labels.buyCard }}</h1>
      <div class="wrapper-grid">
        <div class="cardslots">
            <CollectorsCard 
              v-for="(card, index) in itemsOnSale" :key="'bcard' + index"
              :card="card" 
              :availableAction="card.available" 
              @doAction="buyItem(card)">
                <span class="text-bubble">
                  ${{ cardCost(card) }}
                </span>
              </CollectorsCard>
        </div>
        <div class="buttons">
          <div v-for="(p, index) in placement" :key="index">
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
    </div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsBuyActions',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    itemsOnSale: Array,
    marketValues: Object,
    placement: Array
  },
  methods: {
    cannotAfford: function (cost) {
      let minCost = 100;
      for(let key in this.marketValues) {
        if (cost + this.marketValues[key] < minCost)
          minCost = cost + this.marketValues[key]
      }
      return (this.player.money < minCost);
    },
    cardCost: function (card) {
      return this.marketValues[card.market];
    },
    placeBottle: function (p) {
      this.$emit('placeBottle', p.id);
      this.highlightAvailableCards(p.cost);
    },
    highlightAvailableCards: function (cost=100) {
      for (let i = 0; i < this.itemsOnSale.length; i += 1) {
        if (this.marketValues[this.itemsOnSale[i].item] <= this.player.money - cost) {
          this.$set(this.itemsOnSale[i], "available", true);
        }
        else {
          this.$set(this.itemsOnSale[i], "available", false);
        }
      }
      for (let i = 0; i < this.player.hand.length; i += 1) {
        if (this.marketValues[this.player.hand[i].item] <= this.player.money - cost) {
          this.$set(this.player.hand[i], "available", true);
        }
        else {
          this.$set(this.player.hand[i], "available", false);
        }
      }
    },
    buyItem: function (card) {
      if (card.available) {
        this.$emit('buyItem', card)
      }
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .buttons {
    display: grid;
    grid-template-columns: repeat(auto-fill, 50px);
  }
  .slot-wrapper {
    width: 100%;
  }

  .text-bubble {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width:2em;
    height:2em;
    right: 0.1em;
    bottom: 0.1em;
    border-radius: 2em;
    color: white;
    background-color: rgba(200, 0, 100, 0.7);
    border: 2px dotted yellow;
    box-shadow: -0.5em -0.1em 0.5em rgba(0,0,0,0.5);
  }

</style>
