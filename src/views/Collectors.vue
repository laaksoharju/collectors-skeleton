<template>
  <div>
    <main>
    <div class="table">
      <div class="board">
        <div class = "skillPool">
          Gain Skill
        </div>
        <div class = "itemPool">
          Gain Item
        </div>
        <div class = "marketPool">
          Raise Value
        </div>
        <div class = "workPool">
          Work
        </div>
        <div class = "auctionPool">
          Auction
        </div>

        <div class="my-cards">
          <CollectorsCard v-for="(card, index) in myCards" :card="card" :key="index"/>
        </div>

        <div class="buttons">
          <button @click="drawCard">
            {{ labels.draw }}
          </button>
        </div>

      </div>
    </div>

    </main>

    <footer>
        <p>
          {{ labels.invite }}
          <input type="text" :value="publicPath + $route.path" @click="selectAll" readonly="readonly">
        </p>
    </footer>
  </div>
</template>

<script>
/*eslint no-unused-vars: ["error", { "varsIgnorePattern": "[iI]gnored" }]*/

import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'Collectors',
  components: {
    CollectorsCard
  },
  data: function () {
    return {
      publicPath: "localhost:8080/#", //"collectors-groupxx.herokuapp.com/#",
      touchScreen: false,
      myCards: [],
      maxSizes: { x: 0,
                  y: 0 },
      labels: {},
      points: {}
    }
  },
  created: function () {
    this.$store.commit('SET_PLAYER_ID', this.$route.query.id)
    //TODO! Fix this ugly hack
    //background: https://github.com/quasarframework/quasar/issues/5672
    const newRoute = this.$route.params.id + "?id=" + this.$store.state.playerId;
    if (this.$route.params.id + "?id=" + this.$route.query.id !== newRoute)
      this.$router.push(newRoute);
    this.$store.state.socket.emit('collectorsLoaded',
      { roomId: this.$route.params.id,
        playerId: this.$store.state.playerId } );
    this.$store.state.socket.on('collectorsInitialize',
      function(d) {
        this.labels = d.labels;
        this.myCards = d.hand;
      }.bind(this));
    this.$store.state.socket.on('collectorsPointsUpdated', (d) => this.points = d );

    this.$store.state.socket.on('collectorsCardDrawn',
      function(d) {
        console.log(d);
        if(d.playerId === this.$route.query.id) {
          this.myCards = d.cards;
        }
        else {
          console.log("another player drew a card");
        }
      }.bind(this)
    );
  },
  methods: {
    selectAll: function (n) {
      n.target.select();
    },
    drawCard: function () {
      this.$store.state.socket.emit('collectorsDrawCard', { roomId: this.$route.params.id,
           playerId: this.$store.state.playerId });
    }
  },
}
</script>
<style scoped>
  header {
    user-select: none;
    position: fixed;
    width:100%;
    pointer-events: none;
  }
  main {
    user-select: none;
    background-color: #5A99A1;
  }
  .table {
    padding-left: 50px;
    padding-right: 50px;
  }
  .board {
	display: grid;
	grid-template-columns: 90px 90px 90px 90px 90px 90px 90px;
	grid-template-rows: 45px 45px 45px 45px 45px 45px  45px  45px  45px  45px  45px  45px  45px  ;
	grid-gap: 0px;
	margin: 20px ;
	width: 994px;
	height: 994px;
	background: $black;
	border: 2px solid $black;
}
  .skillPool{
    grid-column: 1 / span 2;
    grid-row: 2/span 8 ;
    width: auto;
		height: auto;
    grid-template-columns: repeat(100, 12px);
    grid-template-rows: repeat(100,150px);
    background-color: #dce5cc;
    color: black;

  }
  .itemPool{
    grid-column: 3/span 3 ;
    grid-row: 2/span 4;
    width: auto;
    height: auto;
    grid-template-columns: repeat(100, 12px);
    grid-template-rows: repeat(100,150px);
    background-color: #f0d9cc ;
    color: black;
  }
  .marketPool{
    grid-column: 3/span 3;
    grid-row: 10/span 4;
    width: auto;
    height: auto;
    grid-template-columns: repeat(100, 12px);
    grid-template-rows: repeat(100,150px);
    background-color: #c9d5e1;
    color: black;
  }
  .workPool{
    grid-column: 3/span 3;
    grid-row: 6/span 4;
    width: auto;
    height: auto;
    grid-template-columns: repeat(100, 12px);
    grid-template-rows: repeat(100,150px);
    background-color: #f5f2cc;
    color: black;
  }
  .auctionPool{
    grid-column: 6/span 2;
    grid-row: 2/span 12;
    width: auto;
    height: auto;
    grid-template-columns: repeat(100, 12px);
    grid-template-rows: repeat(100,150px);
    background-color: beige;
    color: black;
  }

  .buttons{
    grid-column: 1;
    grid-row: 10;
  }
  footer {
    margin-top: 5em auto;
  }
  footer a {
    text-decoration: none;
    border-bottom: 2px dotted ivory;
  }
  footer a:visited {
    color:ivory;
  }

  .my-cards {
    /*display: grid;
    grid-template-columns: repeat(auto-fill, 130px);
    grid-template-rows: repeat(auto-fill, 18px); */
    grid-column: 1;
    grid-row: 11 ;
    display: grid;
    grid-template-columns: repeat(100, 2px);
    grid-template-rows: repeat(1,150px);
  /*  justify-content: center;
    align-items: center; */
  }
  .my-cards div {
    transform: scale(0.5)translate(-50%,-50%);
    transition:0.2s;
    transition-timing-function: ease-out;
    z-index: 0;
  }
  .my-cards div:hover {
    transform: scale(1)translate(-25%,0);
    z-index: 1;
  }
  @media screen and (max-width: 800px) {
    main {
      width:90vw;
    }
  }
</style>
