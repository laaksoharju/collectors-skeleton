<template>
  <div id="AuctionDiv">
    <h1 style="text-align: center">{{ labels.auction }}</h1>
    <div class="auction">
      <div v-for="(card, index) in auctionCards" :key="index">
        <CollectorsCard
        :card="card"
        :availableAction="card.available"
        @doAction="handleAction(card)"/>
      </div>
    </div>
    <div>
      <div class="buttons" v-for="(p, index) in placement" :key="index">
        <button
        v-if="p.playerId===null"
        :disabled="cannotAfford(p.cost)"
        @click="placeBottle(p, index)" >
        ${{p.cost}}
      </button>
      <div v-if="p.playerId !== null" style="color:black">
        {{p.playerId}}
      </div>
    </div>
  </div>
  <div id="CurrentAuction">
  </div>
</div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsAuctionActions',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    auctionCards: Array,
    placement: Array,
  },
  methods: {
    cannotAfford: function (cost) {
      return (this.player.money < cost);
    },

    placeBottle: function (p) {
      this.$emit('placeBottle', p.cost);
      this.highlightAvailableCards(p.cost);
    },

    highlightAvailableCards: function () {
      for (let i = 0; i < this.auctionCards.length; i += 1) {
        this.$set(this.auctionCards[i], "available", true);
      }
      for (let i = 0; i < this.player.hand.length; i += 1) {
        this.$set(this.player.hand[i], "available", true);
      }
    },

    handleAction: function (card) {
      if (card.available) {
        this.$emit('handleAction', card)
        this.highlightAvailableCards()
      }
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.auction {
  display: grid;
  grid-template-columns: repeat(auto-fill, 250px);
}

.buttons {
  display: grid;
  float:left;
  grid-template-columns: repeat(auto-fill, 250px);
}

#Cards {
  grid-area: TitleANDcards;
  align-self: center;
}

#ValueStats {
  grid-area: ValueStats;
  align-self: center;
}

#AuctionDiv {
  display: grid;
}

#AuctionDiv h1, h2, h3, p  {
  color: black;
}

</style>
