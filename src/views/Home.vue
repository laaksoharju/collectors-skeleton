<template>
  <div class="container">

      <img src="images\CollectorsStartMenuImage-removebg-preview (1).png" alt="">
      <h1>Collectors</h1>

  <div class="buttons">
      <button v-for="i in 3" :key="i">
        <a @click="setupCollectors(i+1, 'en')">Set up a game of Collectors for {{i+1}} players</a>.
      </button>
      <button>
        <a href="/rules_collectors.pdf" target="_blank">Rules</a>
      </button>
      <button v-for="i in 3" :key="i">
        <a @click="setupCollectors(i+1, 'se')">Spela Collectors med {{i+1}} spelare</a>.
      </button>
      <button>
        <a href="rules_collectors.pdf" text-decoration="none" target="_blank">Spelregler</a>
      </button>
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

.container {
  display: grid;
  align-items: center;
  justify-content: center;
  text-align: center;
}

button {
margin:auto;
display:block;
width: 400px;
height: 40px;
border-radius: 10px;
}

button:hover{
  color: green;
  transform: scale(1.3);
  transition:0.2s;
  background-color: white;
  border-radius: 10px;
  transition-timing-function: ease-in-out;
  z-index: 2;
}


</style>
