<template>
  <div id="AuctionDiv">
    <h1 style="text-align: center"><img class="title_img" src="images/auction.png">{{ labels.auction }}</h1>
    <div id="AuctionCardsDiv">
      <div id="Cards">
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
            :disabled="cannotAfford(p.cost) || player.bottles < 1 || currentAuctionCard.length === 1"
            @click="placeBottle(p, index)">
            <img :src='p.img' style="width:70%">
            <!-- ${{p.cost}} -->
          </button>
            <div v-if="p.playerId !== null" style="color:black">
              {{p.playerId}}
            </div>
          </div>
        </div>
      </div>
      <div id="CurrentAuction">
        <div id="CurrentAuctionCard">
          <div v-for="(card, index) in currentAuctionCard" :key="index">
            <CollectorsCard
            :card="card"/>
          </div>
        </div>
      </div>
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
    currentAuctionCard: Array,
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
      }
    }
  },
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.title_img {
  height: 65px;
  width: 70px;
  vertical-align: middle;
}

.auction {
  display: grid;
  grid-template-columns: repeat(auto-fill, 100px);
  grid-template-rows: repeat(auto-fill, 260px);
}

.auction div {
  transform: scale(0.8)translate(-10%,-10%);
  transition:0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}

.auction div:hover {
  transform: scale(0.9)translate(-10%,-10%);
  z-index: 1;
}

.buttons {
  display: grid;
  float:left;
  grid-template-columns: repeat(auto-fill, 110px);
  transform: scale(0.8)translate(10%,-10%);
}

.buttons button {
  border-radius: 10px;
}

.buttons button:hover {
  transform: scale(1.05);
  transition:0.2s;
  transition-timing-function: ease-in-out;
}

#Cards {
  grid-area: Cards;
  align-self: center;
}

#CurrentAuction {
  grid-area: CurrentAuction;
  align-self:flex-start;
  height: 240px;
  width: 180px;
  border: 3px dashed black;
  border-radius: 10px;
}

 #CurrentAuctionCard {
  display: grid;
  grid-template-columns: repeat(auto-fill, 160px);
  grid-template-rows: repeat(auto-fill, 260px);
}
#CurrentAuctionCard div{
  transform: scale(0.8)translate(-10%,-10%);
}

#AuctionCardsDiv {
  display: grid;
  grid-template-columns: 70% 30% ;
  grid-template-areas:
  "Cards CurrentAuction"
}

#AuctionDiv h1, h2, h3, p  {
  color: black;
}

</style>
