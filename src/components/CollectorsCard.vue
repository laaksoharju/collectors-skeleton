  <template>
    <!-- <div v-if="card.x>0" :class="['card', {'available-to-choose': availableAction}]" :style="{'background-position': (-(card.x-1)*250)+'px ' + (-(card.y-1)*350)+'px'}" @click="doAction"> -->
    <div v-if="card.x>0" :class="['card-frame', {'available-to-choose': availableAction}]" @click="doAction">
      <img src="/images/collectors-cards.png" :style="{'left': (-(card.x-1)*100)+'%', 'top': (-(card.y-1)*100)+'%'}">
        <slot></slot>
    </div>
    <div v-else>
    </div>
</template>

<script>
export default {
  name: 'CollectorsCard',
  props: {
    card: Object,
    availableAction: Boolean
  },
  methods: {
    doAction: function() {
      this.$emit('doAction');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  /*
  this is now an outdated technique
  .card {
    color:red;
    user-select: none;
    width: 250px;
    height: 350px;
    background-image: url('/images/collectors-cards.png');
    border-radius: 10px;
  }*/

  .card-frame {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .card-frame img {
    position: absolute;
    width: 3000%;
  }

  .available-to-choose {
    animation: jiggle 1s ease-in-out;
    animation-iteration-count:infinite;
    box-shadow: 0 0 10px yellow;
  }

  @keyframes jiggle {
    0% {transform:rotate(0.5deg);}
    50% {transform:rotate(-0.5deg);}
    100% {transform:rotate(0.5deg);}
  }


</style>
