<template>
  <div
    v-if="deckCardAvailable === true && card.x > 0"
    :class="['card', { 'available-to-choose': available }, index]"
    :style="{
      'background-position':
        -(card.x - 1) * 250 + 'px ' + -(card.y - 1) * 350 + 'px',
    }"
    @click="doAction"
  ></div>
  <div
    v-else-if="card.x > 0"
    :class="['card', { 'available-to-choose': availableAction }]"
    :style="{
      'background-position':
        -(card.x - 1) * 250 + 'px ' + -(card.y - 1) * 350 + 'px',
    }"
    @click="doAction"
  ></div>
</template>

<script>
export default {
  name: "CollectorsCard",
  props: {
    card: Object,
    availableAction: Boolean,
    deckCardAvailable: Boolean,
    index: Number,
  },
  data: function () {
    return {
      available: this.deckCardAvailable,
    };
  },

  methods: {
    doAction: function () {
      this.$emit("doAction");
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.card {
  color: red;
  user-select: none;
  width: 250px;
  height: 350px;
  transform: scale(1.2) translate(-50%, -50%);
  background-image: url("/images/collectors-cards.png");
  border-radius: 10px;
}

.available-to-choose {
  /*animation: jiggle 1s ease-in-out;
  animation-iteration-count: infinite;*/

  box-shadow: 0 0 30px red;
}

@keyframes jiggle {
  0% {
    transform: rotate(0.5deg);
  }
  50% {
    transform: rotate(-0.5deg);
  }
  100% {
    transform: rotate(0.5deg);
  }
}
</style>
