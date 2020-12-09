<template>
  <div id="WorkActionsDiv">
    <h1 style="text-align: center">{{ labels.doWork }}</h1>
    <div>
      <div class="buttons" v-for="(p, index) in placement" :key="index">
        <button
        v-if="p.playerId===null"
        :disabled="cannotAfford(p.cost)"
        @click="placeBottle(p, index)">
        ${{p.cost}}
      </button>
      <div v-if="p.playerId !== null" style="color:black">
        {{p.playerId}}
      </div>
    </div>
  </div>
</div>
</template>

<script>

export default {
  name: 'CollectorsWorkActions',
  props: {
    labels: Object,
    player: Object,
    placement: Array
  },
  methods: {
    cannotAfford: function (cost) {
      return (this.player.money < cost);
    },

    placeBottle: function (p, index) {
      p.index = index;
      this.$emit('placeBottleWork', p);
    },
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.get-skills {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
  grid-template-rows: repeat(auto-fill, 260px);
}
.get-skills div {
  transform: scale(0.8)translate(-10%,-10%);
  transition:0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}
.get-skills div:hover {
  transform: scale(0.9)translate(-10%,-10%);
  z-index: 1;
}

.buttons {
  display: grid;
  float:left;
  grid-template-columns: repeat(auto-fill, 130px);
  transform: scale(0.8)translate(10%,-10%);
}


#WorkActionsDiv  h1, h2, h3, p  {
  color: black;
}

</style>
