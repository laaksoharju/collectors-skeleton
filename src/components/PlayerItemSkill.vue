<template>
  <div class="player_item_skill" v-if="playeritemskill.length!==0">
    <div v-for="(card, index) in playeritemskill" :key="index" class="player_choice">
     
      <div v-if="card.item==='music'" class='item_skill_style'>
            <img src="/images/items/music.jpg" alt="Player Items 1" />
            <h1 v-if ="itemcount(card.item)  >= 1">{{itemcount(card)}}</h1>
            
      </div>
    </div>
  </div>
</template>

<script>


export default {
  name: "CollectorsBuyActions",
  components: {
    CollectorsCard,
  },
  data:function(){
      return{
          item_player:{
          music:0,
          movie:0,
          technology:0,
          figures:0,
          fastaval:0}



      }
  },
  props: {
   
    playeritemskill:Array
  },
  methods: {
    itemcount: function (card) {
      
        for (let typeofcard in item_player ){
            if (typeofcard === card){
                typeofcard+=1;

            }
            return typeofcard
        

      }
  
   
  
   
    
   
},
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.buy-cards {
  display: grid;
  grid-template-columns:repeat(5,1fr);
  grid-gap: 1rem;
}


.cardslots div {
  transform: scale(0.5) translate(-50%, -50%);
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}
</style>

