<template>
  <div>
    <button class="quarter-tiles" @click="nextRound(p)"></button>
  </div>
</template>

<script>
export default {
  name: "QuarterTiles",
  props: {
    labels: Object,
    player: Object,
  },
  methods: {
    nextRound: function (p) {
        console.log('Next round clicked');
      this.$emit("nextRound", p.round);
    },
  },
};
</script>

<style>
.quarter-tiles {
  position: relative;
  top: -9.3em;
  left: 0.4em;
  width: 10em;
  height: 4em;
  background-size: 100% 100%;
  border-radius: 5px;
  background-image: url("/images/quarter_tiles/1.png");
}
</style>