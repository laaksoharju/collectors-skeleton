<template>
  <div id="Scoreboard">
      <div class="score_table">
          <h2 class="score_data">Your score: 20</h2>
          <h2 class="score_data">Julias score: 10</h2>
          <h2 class="score_data">Bobbens score: 5</h2>
      </div>
  </div>
</template>

<script>


export default {
  name: "Scoreboard",

  props: {
  },

  data: function() {
    return {
    }
    
  },

  methods: {
  
  },
};
</script>

<style scoped>

#Scoreboard{
    position: fixed;
    top: 0;
    left: 0;
    background-color: #000;
    width: 100%;
    height: 100vh;
}

.score_table{
    min-width: 300px;
    width: 30%;
    background-color: white;
}
.score_data{
    color: black;
    border-bottom: 1px solid black;
}
</style>
