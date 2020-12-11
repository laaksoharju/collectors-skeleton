
<template>

<div class = "auctionPool">
 <div class= "titleAuctionPool" > Auction Pool
 </div>

<div class = "auctionSquare">
  Auction Square
</div>
<div class = "cardUpForAuction">
  <CollectorsCard :card="cardUpForAuction"/>
</div>

<div class = "bidSquare" >
  <form>
  <label for="bidSquare">Place bid:</label>
  <input type="text" id="bidSquare" name="bidSquare">
  </form>
  <button id = "bidPlacement" @click="startBidding()">Place bid!</button>
</div>

  <div class = "EnergyBottleCoinWhiteTwo"></div> <!-- Olika flaskor med vita coins, 1 2 eller 0 -->
  <div class = "EnergyBottleCoinWhiteOne"></div>
  <div class = "EnergyBottleCoinWhiteNoll"></div>
  <div class = "EnergyBottleCoinWhiteNoll second"></div>

<div class = "start-auction" >
  <div v-for="(card, index) in auctionCards" :key="index">
    <CollectorsCard
      :card="card"
      :availableAction="card.available"
      @doAction="startAuction(card)"/>
        </div>
</div>
</div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsStartAuction',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    auctionCards: Array,
    cardUpForAuction: Object,
    //bids: Object,
    //placement: Array
  },
  methods: {
    startAuction: function (card) {
      this.highlightAvailableCards()
      if (card.available){
        this.$emit('startAuction', card)
        }
      },

  startBidding: function (){
     var bid = Number(document.getElementById("bidSquare").value);
     console.log(bid);
     console.log(this.player);
     this.player.bids = bid;
     console.log(this.player);
     this.$emit('startBidding', this.player.bids);

  },

   highlightAvailableCards: function (){
      for (let i = 0; i < this.auctionCards.length; i += 1) {
          this.$set(this.auctionCards[i], "available", true);
          }
        }
    }
  }
</script>

<style scoped>

.auctionPool{
  grid-column: 8/span 2;
  grid-row: 2/span 13;
  width: auto;
  height: auto;
  background-color: beige;
  color: black;
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(10,48.5px);
  grid-row-gap: 20px;
}

.titleAuctionPool{
grid-column: 3;
grid-row: 1;
}


.EnergyBottleCoinWhiteNoll{
  width:45px;
  height:45px;
  background-image:  url('/images/Coin-white.png');
  background-size: cover;
  grid-column: 1;
  grid-row: 3;
}
.second{
  grid-column: 1;
  grid-row: 4;
}

.EnergyBottleCoinWhiteTwo{
  width:45px;
  height:45px;
  background-image:  url('/images/Coin-white-2.png');
  background-size: cover;
  grid-column: 1;
  grid-row: 1;
}

.EnergyBottleCoinWhiteOne{
  width:45px;
  height:45px;
  background-image:  url('/images/Coin-white-1.png');
  background-size: cover;
  grid-column: 1;
  grid-row: 2;
}

  .auctionCard {
    transform: scale(0.25);
    grid-column: 2;
  }

  .auctionCard div:hover{
    transform: scale(2)translate(-25%,0);
    z-index: 1;
  }

  .auctionSquare{
  grid-column: 1;
  grid-row: 6;
  height: 180px;
  width: 130px;
  border: 5px dotted pink;
  }

  .cardUpForAuction {
  transform: scale(0.45);
  grid-column: 1;
  grid-row: 6;
  height: 70px;
  width: 50px;
  }

  .start-auction{
    transform: scale(0.25);
  }
  .start-auction div:hover{
    transform: scale(2)translate(-25%,0);
    z-index: 1;
  }

</style>
