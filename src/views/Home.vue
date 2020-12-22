<template>
  <div class="container">

    <div id="startMenuImageDiv">
      <img src="images\CollectorsStartMenuImage-removebg-preview (1).png" alt="">
    </div>

      <h1>Collectors</h1>

    <div>
        <span id="languageFlags">
          <img src="images/se.png" @click="displaySe()">
          <img src="images/en.png" @click="displayEn()">
        </span>
    </div>



  <div id="buttons_En" style="display: none">
    <h2> Set up a game of Collectors for: </h2>
      <button v-for="i in 3" :key="'enbutton'+i">
        <a @click="setupCollectors(i+1, 'en')"> <span class="playerNumber"> {{i+1}} </span> players</a>
      </button>
      <button>
        <a class="rules" href="/rules_collectors.pdf" target="_blank">Rules</a>
      </button>
    </div>
    <div id="buttons_Se" style="display: none">
      <h2> Spela Collectors med: </h2>
        <button v-for="i in 3" :key="'swebutton'+i">
          <a @click="setupCollectors(i+1, 'se')"> <span class="playerNumber"> {{i+1}} </span> spelare</a>
        </button>
        <button>
          <a class="rules" href="rules_collectors.pdf" text-decoration="none" target="_blank">Spelregler</a>
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
    setupCollectors: function (playerCount, lang) {
      this.$store.commit('SETUP_GAME', {roomId: this.$store.state.roomId,
        playerCount: playerCount,
        lang: lang });
        this.$router.push("/room/" + this.$store.state.roomId);
      },

      displayEn: function () {
        document.getElementById("buttons_En").style.display = "block";
        document.getElementById("buttons_Se").style.display = "none";
      },

      displaySe: function () {
        document.getElementById("buttons_Se").style.display = "block";
        document.getElementById("buttons_En").style.display = "none";
      },

    }
  }

  </script>
  <style scoped>

#startMenuImageDiv {
  text-align: center;
}

#startMenuImageDiv img {
  width: 70%;
}

#languageFlags img {
  border: 1px solid #000000;
  border-radius: 4px;
  margin: 0 1em 0 1em;
  width: 4em;
  transition: 0.5s;
}

#languageFlags img:hover {
  transform: scale(1.15);
  transition: 0.15s;
  transition-timing-function: ease-in-out;
}

.playerNumber {
  font-size: 1.25em;
  font-weight: 600;
}

a {
  font-size: 1.5em;
  color: #000000;
  text-decoration: none;
}

.rules {
  font-weight: 600;
}

.container {
  display: grid;
  align-items: center;
  justify-content: center;
  text-align: center;
}


button {
margin: auto;
margin-bottom: 0.5em;
background-color: #d9d9d9;
display: block;
width: 20em;
height: 3em;
border-radius: 10px;
transition:0.3s;
}

button:hover{
  color: green;
  transform: scale(1.3);
  transition:0.4s;
  background-color: white;
  border-radius: 10px;
  transition-timing-function: ease-in-out;
  z-index: 2;
}


</style>
