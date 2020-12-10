<template>
  <div class = "marketPool">
    Market Pool
    <div class = "iconBird"></div>
    <div class = "iconRobot"></div>
    <div class = "iconMusic"></div>
    <div class = "iconFilm"></div>
    <div class = "iconTech"></div>

    <div class = "bottleTwoFlags"></div>
    <div class = "bottleOneFlag"> </div>
    <div class = "bottleCoins"> </div>
  </div>

</template>

<script>

export default {
  name: 'CollectorsMarket',
  /*components: {
    CollectorsCard
  },*/
  props: {
    labels: Object,
    player: Object,
    marketValues: Object,
    placement: Array
  },
  methods: {

  }
}

</script>




<style scoped>


.marketPool{
  grid-column: 3/span 5;
  grid-row: 11/span 4;
  width: auto;
  height: auto;
  background-color: #cfdcf2;
  color: black;
  display: grid;
  grid-template-columns: repeat(5, 90px);
  grid-template-rows: repeat(5, 27.5px);
  }

  .iconBird {
    width: 30px;
    height: 40px;
    background-position:center;
    background-image: url('/images/iconBird.PNG');
    background-size: cover;
    place-self: center;
    grid-column: 1;
    grid-row: 10;
  }
  .iconRobot {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconRobot.PNG');
    background-size: cover;
    place-self: center;
    grid-column: 2;
    grid-row: 10;
  }

  .iconMusic {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconMusic.PNG');
    background-size: cover;
    place-self: center;
    grid-column: 3;
    grid-row: 10;
  }
  .iconFilm {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconFilm.PNG');
    background-size: cover;
    place-self: center;
    grid-column: 4;
    grid-row: 10;
  }
  .iconTech {
    width: 30px;
    height: 40px;
    background-image: url('/images/iconTech.PNG');
    background-size: cover;
    place-self: center;
    grid-column: 5;
    grid-row: 10;
  }
  .bottleCoins {
    width:50px;
    height:50px;
    background-image: url('/images/marketbottletwocoins.PNG');
    background-size: cover;
    grid-column: 2;
    grid-row: 2;

  }
  .bottleOneFlag {
    width:50px;
    height:50px;
    background-image: url('/images/marketbottleoneflagg.PNG') ;
    background-size: cover;
    grid-column: 3;
    grid-row: 2;
  }
.bottleTwoFlags {
  width:50px;
  height:50px;
  background-image: url('/images/marketbottletwoflaggs.PNG') ;
  background-size: cover;
  grid-column: 4;
  grid-row: 2;
}
  </style>
