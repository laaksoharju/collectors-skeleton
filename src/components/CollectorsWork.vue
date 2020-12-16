<template>
  <div class = "workPool">
    <div class= "titleWorkPool" >Work Pool</div>

    <div class = "quarterImage">
      <div class= "quarter1" v-if="currentRound === 1" >
     </div>
      <div class= "quarter2" v-if="currentRound === 2" >
      </div>
      <div class= "quarter3" v-if="currentRound === 3" >
      </div>
      <div class= "quarter4" v-if="currentRound === 4" >
      </div>
    </div>

    <div class = "Alt1"></div>
    <div class = "Alt2"></div>
    <div class = "Alt3"></div>
    <div class = "Alt4"></div>
  </div>

</template>

<script>
// import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsWork',
  components: {
  //  CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    currentRound: Number
  },
  methods: {
  /*  changeRound: function () {                               VERKAR EJ BEHÖVAS
      this.$store.state.socket.emit('collectorsChangeRound', {
          roomId: this.$route.params.id,
          currentRound: this.currentRound
          }
        );
    },*/

    }
  }
</script>

<style scoped>

.workPool{
  grid-column: 3/span 5;
  grid-row: 6/span 5;
  width: auto;
  height: auto;
  display:grid;
  grid-template-columns: repeat(2, 224px);
  grid-template-rows: repeat(3,50px);
  background-color: #f5f2cc;
  color: black;
  /*border: 3px solid #4C7B80;*/
  border-top: 2px solid #4C7B80;
}

.titleWorkPool {
  font-style: italic;
  font-size: 50px;
  text-shadow: 2px 2px 4px yellow;
  font-size: 20px;
}

.quarterImage {
  grid-column: 2;
  grid-row: 3;
}
.quarter1 {
  grid-column: 2 ;
  grid-row: 1;
  width: 140px;
  height: 62px;
  background-image: url('/images/quarterTile1.png');
  background-size: cover;
}
.quarter2 {
  grid-column: 2 ;
  grid-row: 1;
  width: 140px;
  height: 62px;
  background-image: url('/images/quarterTile2.png');
  background-size: cover;
}
.quarter3 {
  grid-column: 2 ;
  grid-row: 1;
  width: 140px;
  height: 62px;
  background-image: url('/images/quarterTile3.png');
  background-size: cover;
}
.quarter4 {
  grid-column: 2 ;
  grid-row: 1;
  width: 140px;
  height: 62px;
  background-image: url('/images/quarterTile4.png');
  background-size: cover;
}

.Alt1 {
  grid-column: 1 ;
  grid-row: 1;
  width: 130px;
  height: 60px;
  background-image: url('/images/WorkPoolAlt1.jpg');
  background-size: cover;
}
.Alt2 {
  grid-column: 1 ;
  grid-row: 2;
  width: 130px;
  height: 60px;
  background-image: url('/images/WorkPoolAlt2.jpg');
  background-size: cover;
}
.Alt3 {
  grid-column: 1 / span 2 ;
  grid-row: 3;
  width: 130px;
  height: 60px;
  background-image: url('/images/WorkPoolAlt3.jpg');
  background-size: cover;
}
.Alt4 {
  grid-column: 1 ;
  grid-row: 4;
  width: 152px;
  height: 60px;
  background-image: url('/images/WorkPoolAlt4.jpg');
  background-size: cover;
}



</style>
