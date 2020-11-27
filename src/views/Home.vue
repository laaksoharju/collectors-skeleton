<template>
  <div class="center">
    <div>
      <h1>COLLECTORS</h1>
      <div>
          <div> First time player? </div>
          <div class="popup" onclick="myFunction()">Click me!
            <span class="popuptext" id="myPopup">Popup text...</span>
          </div>

        <button id='firstButton'><img src='https://website-bamedag.netdna-ssl.com/fileadmin/media/_processed_/8/8/csm_7-9-months-introtext_7588a3bb0c.jpg' alt="Span" title="Click for rules!" width="200"> </button>
      </div>
      <ul>
        <div v-for="i in 3" :key="i">
          <button id=startButton @click="setupCollectors(i+1, 'en')">Set up a game of Collectors for {{i+1}} players</button>
        </div>
      </ul>
    <!--  <ul>
        <li v-for="i in 3" :key="i">
          <a @click="setupCollectors(i+1, 'se')">Spela Collectors med {{i+1}} spelare</a>.
        </li>
      </ul> -->
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
  }
}
</script>
<style scoped>
  .center {
    background-color: #11707D;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 1em;
}
  #startButton {
cursor:pointer;
transition-duration: 0.4s;
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
