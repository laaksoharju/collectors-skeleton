<template>
  <div class="center">
    <div>
      <h1>COLLECTORS</h1>
      <div>
        <h2 >Welcome to play Collectors, please choose a setup for the game.<nav>
        </nav>In the next step you will get a link to send to the other players. </h2>

          <a id='firstButton' href="#identifier"><img src='https://website-bamedag.netdna-ssl.com/fileadmin/media/_processed_/8/8/csm_7-9-months-introtext_7588a3bb0c.jpg' alt="Span" title="Click for rules!" width="200"></a>
        </div>


        <button title="Rules!" type="button" class="rulesButton" v-on:click="ruleFunction">Get the rules here!</button>
        <div id="ruleContent" ></div>


      <ul>
        <div v-for="i in 3" :key="i">
          <button id=startButton @click="setupCollectors(i+1, 'en')"> <h3>Set up a game of Collectors for {{i+1}} players </h3> </button>
        </div>

      </ul>



      <p>
        <!--- sorry riktigt dålig lösning:)--><br><br><br><br><br><br><br><br>
          <a name="identifier">RULES</a>
      </p>


    </div>

  </div>

</template>

<script>
// @ is an alias to /src

export default {
  name: 'Home',
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
      var rules= "Collectors is a game for 2-4 players and the winning player is the one with the most valuable collection of rare collectables in the end. The game board is divided into 5 different areas, buy item, gain skill, start auction, work and raise value. ";
      var text= document.createElement("div");
      var output = document.createTextNode(rules);
      text.appendChild(output);
      placement.appendChild(text);

    }
}}

</script>
<style scoped>
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 1em;
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

</style>
