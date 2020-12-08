<div id ='AuctionDiv' class="cardslots">
  <h2>Auction</h2>
  <CollectorsCard v-for="(card, index) in auctionCards" :card="card" :availableAction="card.available" @doAction="handleAction(card)" :key="index"/>
</div>
