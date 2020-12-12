<template>
  <div>
    <h1>{{labels.raiseMarket}}</h1>
    <div class="buttons" v-for="(p, index) in placement" :key="index">
      <button
        v-if="p.playerId===null"
        :disabled="cannotAfford(p.cost)"
        @click="placeBottle(p)" >
        ${{p.cost}}
        {{p.numberOfChangedMarkets}}
      </button>
      <div v-if="p.playerId !== null">
        {{p.playerId}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CollectorsMarket',
  props: {
    labels: Object,
    player: Object,
    placement:  Array
  },
  methods: {
    cannotAfford: function (cost) {
      return (this.player.money < cost);
  },
    placeBottle: function(p){
      if(p.numberOfChangedMarkets===2){
        this.$emit('changeTwoMarket');
        this.$emit('placeBottle', p.cost);
      }
      else {
        this.$emit('placeBottle', p.cost);
      }
    }

}
}
</script>

<style lang="css" scoped>
.buttons {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
}
</style>
