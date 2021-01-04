<template>
  <div class="center">
    <div>
      <div>
        <h1>COLLECTORS</h1>
      </div>
      <div>
      <h2>Welcome to play Collectors! / Välkommen att spela Collectors! <nav>
      </nav>Start by choosing a language! / Börja genom att välja språk!</h2>
      </div>

      <button title="Svenska" type="button" id="languageButton" class="rulesButton" v-on:click="setSprak">
        <h2>Svenska</h2>
      </button>
      <button title="English" type="button" id="languageButton" class="rulesButton" v-on:click="setSprakEn">
        <h2>English</h2>
      </button>

      <div>
        <h3>{{ labels.setup }} </h3>
        <h3> {{ labels.nextStep }} </h3>

          <a id='firstButton' href="#identifier"><img src='https://website-bamedag.netdna-ssl.com/fileadmin/media/_processed_/8/8/csm_7-9-months-introtext_7588a3bb0c.jpg' alt="Span" width="200"></a>
      </div>
      <ul>
        <div v-for="i in 3" :key="i">
          <button id=startButton @click="setupCollectors(i+1, 'en')"><h3>{{ labels.gameSetup }}{{i+1}} {{ labels.players }} </h3></button>
        </div>
        <!--Rule button and id for where the text prints out -->
        <button title="Rules!" type="button" id="rulesButton" class="rulesButton" v-on:click="ruleFunction">
          <h2>{{ labels.readRules }}</h2>
        </button>

        <div id="ruleContent">
        </div>
        <div> <img id="myImage" src="/images/backgroundblue.png" height="50" > </div>


      </ul>
        <!--- sorry riktigt dålig lösning:)<br><br><br><br><br><br><br><br> -->
      <!--    <a name="identifier">RULES</a> -->

    </div>
  </div>
</template>

<script>
// @ is an alias to /src
export default {
  name: 'Home',
  data: function () {
    return {
  labels: {},
  rules: ""
  }
},
  created: function () {
    this.$store.commit('SET_ROOM_ID');
    this.$store.state.socket.on('collectorsHomeLabels',
      function(labels) {
        this.labels = labels;
        console.log(labels);
      }.bind(this));
  },
  methods: {
    setupCollectors: function (playerCount, lang="en") {
      this.$store.commit('SETUP_GAME', {roomId: this.$store.state.roomId,
        playerCount: playerCount,
        lang: lang });
      this.$router.push("/room/" + this.$store.state.roomId);
    },
    setSprak: function(){
      this.$store.commit('SET_LANG','se')
      console.log(this.$store.state.lang)
    },
    setSprakEn: function(){
      this.$store.commit('SET_LANG','en')
      console.log(this.$store.state.lang)
    },
    ruleFunction: function() {
      //console.log("button clicked");
      var placement = document.getElementById("ruleContent");
      var rules1=
      ["Collectors is a game for 2-4 players and the winning player is " +
      "the one with the most valuable collection of rare collectables " +
      "in the end. The game board is divided into 5 different areas, " +
      "item pool, skill pool, auction pool, work pool and market pool."];
      var rules2 = ["ITEM POOL. You use Buy Item if you want to buy one card from the item pool " +
        "(the red ish area) or from your own hand. The cost will depend on " +
        "how many cards there are with the same symbol in the Market pool " +
        "(the blue ish area). The cost will also contain the cost for where " +
        "the bottle was placed. "];
      var rules3 = ["SKILL POOL. The Skill area is used if you want to grant skills for the rest " +
      "of the game. You gain skill by taking one of the cards from the skill " +
      "pool or from your hand and place it in the gain skill area " +
      "(the green ish area). There are different skills available in Collectors " +
      "and these are explained on the player board. "];
      var rules4 = ["WORK POOL. In the Work area you perform actions to increase your income, " +
      "recycle bottles, draw cards and become the first player. You use this " +
      "area by placing bottles in the action space, depending on which place "+
      "you choose you get and have to do different things. For example if you "+
      "put your bottle on the second space you get to draw two cards from the " +
      "deck to your hand. "];
      var rules5 = ["AUCTION POOL. The Auction area is used when you want to do an auction, you can" +
      "choose a card from your own hand or from the Auction area. If you take" +
      "a card from your hand then you may place it face down so the other" +
      "players do not know what kind of card it is when they bid on it. " +
      "The first player can bid any number of coins with a minimum of one then " +
      "the second player must place a higher bid or pass. The winner gets the " +
      "card and must pay the bid amount. When paying in an auction you can use " +
      "cards from your hand as coins, then there is the worth as depicted in " +
      "the upper right corner of the card. "];
      var rules6 = ["MARKET POOL. The last area is Raise Value where you must place cards in the market " +
      "area that are equal to the number of seals on your action space. "+
      "You may place cards from your hand, from the card in the lowest position " +
      "in the skill pool or from the lowest card in the auction pool. "];
      var rules7 = ["The cards used in Collectors have multiple functions, " +
      "see the picture below for an explanation:"]
      let pic = ['/images/kort.png'];
      document.getElementById("myImage").src = pic[0];
      document.getElementById("myImage").height = 350;
      var linebreak0 = document.createElement("p"); var linebreak1 = document.createElement("p");
      var linebreak2 = document.createElement("p"); var linebreak3 = document.createElement("p");
      var linebreak4 = document.createElement("p");  var linebreak5 = document.createElement("p");
      var linebreak6 = document.createElement("p");
      var text= document.createElement("div");
      var output1 = document.createTextNode(rules1);
      var output2 = document.createTextNode(rules2);
      var output3 = document.createTextNode(rules3);
      var output4 = document.createTextNode(rules4);
      var output5 = document.createTextNode(rules5);
      var output6 = document.createTextNode(rules6);
      var output7 = document.createTextNode(rules7);
      text.appendChild(output1); text.appendChild(linebreak0);
      text.appendChild(output2); text.appendChild(linebreak1);
      text.appendChild(output3); text.appendChild(linebreak2);
      text.appendChild(output4); text.appendChild(linebreak3);
      text.appendChild(output5); text.appendChild(linebreak4);
      text.appendChild(output6); text.appendChild(linebreak5);
      text.appendChild(output7); text.appendChild(linebreak6);
      placement.appendChild(text);
    }
}};
</script>

<style scoped>
  .center {
    font-family:inherit;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 1em;
}
h1 {
  font-style: italic;
  font-size: 50px;
  text-shadow: 2px 2px 4px blue;
}
  #startButton {
padding: 1px 80px 1px;
cursor:pointer;
transition-duration: 0.4s;
background-color: #3B737A ;
color:white;
height: 50px;
width: 500px;
}
#beginner{
  padding: 1px 125px 1px;
}
#firstButton{
  margin-left: 180px;
  margin-right: 200px;
}
#startButton:hover{
  background-color: #F89D94;
}
/*id rulebutton*/
#rulesButton:hover {
  background-color: #b22222;
}
/*class rulebutton*/
#rulesButton {
  padding: 1px 100px 1px;
  cursor:pointer;
  transition-duration: 0.4s;
  background-color: #f08080 ;
  color:white;
  height: 50px;
  width: 500px;
}
#ruleContent {
  margin: 50px 50px 50px 50px;
  padding: 10px 10px;
  font-size: 20px;
  font-style: oblique;
}
#languageButton:hover {
  background-color: #b22222;
}
/*class rulebutton*/
#languageButton {
  place-self: center;
  cursor:pointer;
  transition-duration: 0.4s;
  background-color: #f08080 ;
  color:white;
  height: 50px;
  width: 250px;
}
</style>
