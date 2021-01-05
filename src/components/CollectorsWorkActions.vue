<template>
    <div>
      <button :disabled="player.hand.length <2" v-if="round==1 && placement[0].playerId===null" @click="placeBottle(0)">
        Put two cards from hand as future income
      </button>
      <button :disabled="player.hand.length <2" v-if="round==2 && placement[1].playerId===null" @click="placeBottle(1)">
        Put two cards from hand as future income and gain 1$
      </button>
      <button :disabled="player.hand.length <2" v-if="round==3 && placement[2].playerId===null" @click="placeBottle(2)">
        Put two cards from hand as future income and gain 2$
      </button>
      <button :disabled="player.hand.length <2" v-if="round==4 && placement[3].playerId===null" @click="placeBottle(3)">
        Put two cards from hand as future income and gain 3$
      </button>
      <button @click="placeBottle(4)">
        Trash one bottle
      </button>
      <button v-if="placement[5] && placement[5].playerId===null" @click="placeBottle(5)" :disabled="cannotAfford(1)">
        Draw two cards
      </button>
      <button v-if="placement[6] && placement[6].playerId===null" @click="placeBottle(6)">
        Draw one card and become first player for next round
      </button>
      <button v-if="placement[7] && placement[7].playerId===null" @click="placeBottle(7)">
        Draw one card and put one card from hand as future income
      </button>
    </div>
</template>

<script>

export default {
  name: 'CollectorsWorkActions',
  components: {
  },
  props: {
    round: Number,
    placement: Array,
    player: Object
  },
  methods: {
    placeBottle: function (id) {
      this.$emit('placeBottle', id)
    },
    cannotAfford: function (cost) {
      return (this.player.money < cost);
    }
  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  button {
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
  }
</style>
