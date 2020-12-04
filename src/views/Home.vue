<template>
  <div class="center">
    <div>
      <h1>COLLECTORS</h1>
      <div>
        <h3> Welcome to play Collectors, please choose a setup for the game.<nav>
        </nav>In the next step you will get a link to send to the other players. </h3>

          <a id='firstButton' href="#identifier"><img src='https://website-bamedag.netdna-ssl.com/fileadmin/media/_processed_/8/8/csm_7-9-months-introtext_7588a3bb0c.jpg' alt="Span" title="Click for rules!" width="200"></a>
        </div>
      <ul>
        <div v-for="i in 3" :key="i">
          <button id=startButton @click="setupCollectors(i+1, 'en')"><h3>Set up a game of Collectors for {{i+1}} players </h3></button>
        </div>
        <!--Rule button and id for where the text prints out -->
        <button title="Rules!" type="button" id="rulesButton" class="rulesButton" v-on:click="ruleFunction"><h2>Click here to read the rules!</H2></button>
        <div id="ruleContent"></div>

      </ul>
        <!--- sorry riktigt dålig lösning:)--><br><br><br><br><br><br><br><br>
          <a name="identifier">RULES</a>



    </div>
  </div>
</template>
<script>
// @ is an alias to /src

export default {
  name: 'Home',
  rules: "",
  created: function () {
    this.$store.commit('SET_ROOM_ID');
  },
  methods: {
    setupCollectors: function (playerCount, lang="en") {
      this.$store.commit('SETUP_GAME', {roomId: this.$store.state.roomId,
        playerCount: playerCount,
        lang: lang });
      this.$router.push("/room/" + this.$store.state.roomId);
    },

    ruleFunction: function() {
      console.log("button clicked");
      var placement = document.getElementById("ruleContent");
      var rules=
      ["Collectors is a game for 2-4 players and the winning player is" ,
      "the one with the most valuable collection of rare collectables " ,
      "in the end. The game board is divided into 5 different areas, " ,
      "buy item, gain skill, start auction, work and raise value." ,
      "You use Buy Item if you want to buy one card from the item pool" ,
      "(the red ish area) or from your own hand. The cost will depend on" ,
      "how many cards there are with the same symbol in the Market pool" ,
      "(the blue ish area). The cost will also contain the cost for where " ,
      "the bottle was placed." ,
      "The Gain Skill area is used if you want to grant skills for the rest" ,
      "of the game. You gain skill by taking one of the cards from the skill" ,
      "pool or from your hand and place it in the gain skill area ",
      "(the green ish area). There are different skills available in Collectors" ,
      "and these are explained on the player board. ",
      "The Start Auction area is used when you want to do an auction, you can" ,
      "choose a card from your own hand or from the Auction area. If you take" ,
      "a card from your hand then you may place it face down so the other" ,
      "players do not know what kind of card it is when they bid on it. " ,
      "The first player can bid any number of coins with a minimum of one then" ,
      "the second player must place a higher bid or pass. The winner gets the",
      "card and must pay the bid amount. When paying in an auction you can use" ,
      "cards from your hand as coins, then there is the worth as depicted in" ,
      "the upper right corner of the card. ",
      "In the Work area you perform actions to increase your income,",
      "recycle bottles, draw cards and become the first player. You use this" ,
      "area by placing bottles in the action space, depending on which place",
      "you choose you get and have to do different things. For example if you ",
      "put your bottle on the second space you get to draw two cards from the" ,
      "deck to your hand. " ,
      "The last area is Raise Value where you must place cards in the market" ,
      "area that are equal to the number of seals on your action space. ",
      "You may place cards from your hand, from the card in the lowest position" ,
      "in the skill pool or from the lowest card in the auction pool. "];

      var text= document.createElement("div");
      var output = document.createTextNode(rules);
      text.appendChild(output);
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
  font-style:italic;
  font-size: 50px;
  text-shadow: 2px 2px 4px blue;
}

  #startButton {
padding: 1px 80px 1px;
cursor:pointer;
transition-duration: 0.4s;
background-color: #3B737A ;
color:white;
}

#beginner{
  padding: 1px 125px 1px;
}

#firstButton{
  cursor:pointer;
  opacity: 0.5;
}

#firstButton:hover{
  opacity: 1;
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
}

#ruleContent {
  marging: 50px 50px 50px 50px;
  padding: 10px 10px;
  font-size: 20px;
  font-style: oblique;

}

</style>
