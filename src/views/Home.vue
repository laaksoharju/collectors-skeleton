<template>
  <div class="center">
    <div>
      <section>
        <div class="home_image">
          <img
            src="/images/collectors_welcome2.png"
            alt="home welcome page"
            style="
              width: 25rem;
              heigth: 25rem;
              padding-bottom: 0;
              margin-top: 10rem;
              margin-left: 2rem;
            "
          />
        </div>
        <div class="choose_langauge">
          <div style="margin-left: 10rem; aligen: center">
            <img
              src="/images/language-tr.png"
              alt="home welcome page"
              style="width: 2rem; heigth: 2rem; margin-left: 7rem"
            /><br />
            <select v-model="lang_type" style="width: 9rem; height: 2rem">
              <option>English</option>
              <option>Svenska</option>
            </select>
          </div>

          <ul class="lang_setup" v-if="lang_type === 'English'">
            <label style="margin-left: 2rem"
              >Choose number of players and start game</label
            >

            <button
              style="
                width: 20rem;
                height: 2rem;
                margin: 0.1rem;
                border-radius: 0.5rem;
              "
              @click="setupCollectors(i + 1, 'en')"
              v-for="i in 3"
              :key="i"
            >
              with {{ i + 1 }} players</button
            ><br />
          </ul>

          <ul class="lang_setup" v-if="lang_type === 'Svenska'">
            <label style="margin-left: 2rem"
              >Välj antal spelare och börja spela</label
            >
            <button
              style="
                width: 20rem;
                height: 2rem;
                margin: 0.1rem;
                border-radius: 0.5rem;
              "
              @click="setupCollectors(i + 1, 'se')"
              v-for="i in 3"
              :key="i"
            >
              med {{ i + 1 }} spelare.
            </button>
          </ul>
        </div>
        <div class="rules">
          <div>
            <button
              v-if="lang_type === 'English'"
              @click="rules_click()"
              style="
                width: 10rem;d
                padding: 1rem;
                margin-top: 5rem;
                margin-left: 10rem;
                border-radius: 2rem;
                height: 3rem;
              "
            >
              Rules
            </button>
            <button
              v-else-if="lang_type === 'Svenska'"
              @click="rules_click()"
              style="
                width: 10rem;d
                padding: 1rem;
                margin-top: 5rem;
                margin-left: 10rem;
                border-radius: 2rem;
                height: 3rem;
              "
            >
              Regler
            </button>
          </div>

          <div v-if="show_rules">
            <embed
              src="/images/collectors.pdf"
              type="application/pdf"
              height="300px"
              width="400px"
              border-radius="10px"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home",
  data: function () {
    return {
      lang_type: "English",
      show_rules: false,
      audioBottlePlaced: new Audio("/sounds/PM_Blurry.mp3"),
    };
  },
  created: function () {
    this.$store.commit("SET_ROOM_ID");
  },
  methods: {
    setupCollectors: function (playerCount, lang = "en") {
      this.audioBottlePlaced.play();
      this.$store.commit("SETUP_GAME", {
        roomId: this.$store.state.roomId,
        playerCount: playerCount,
        lang: lang,
      });
      this.$router.push("/room/" + this.$store.state.roomId);
    },
    rules_click: function () {
      this.show_rules = !this.show_rules;
    },
  },
};
</script>
<style scoped>
.center {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  padding: 1em;
  background: rgb(238, 226, 174);
  background: radial-gradient(
    circle,
    rgba(238, 226, 174, 0.8616187989556136) 0%,
    rgba(54, 31, 124, 0.9190600522193212) 100%
  );
}
.lang_setup {
  position: relative;
  left: 2rem;
  display: grid;
  grid-template-rows: repeat(4, 1fr);
}
</style>
