<template>
    <div>
      <h1>gain skill</h1>
      <div class="wrapper-grid">
        <div class="cardslots">
          <CollectorsCard 
            v-for="(card, index) in skillsOnSale" :key="'scard' + index"
            :card="card" 
            :availableAction="card.available" 
            @doAction="gainSkill(card)"/>
        </div>
        <div class="buttons">
          <div v-for="(p, index) in placement" :key="index">
            <button
              v-if="p.playerId===null"
              @click="placeBottle(p)" >
              ${{p.cost}}
            </button>
            <div v-if="p.playerId !== null">
              {{p.playerId}}
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsGainSkillActions',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    skillsOnSale: Array,
    placement: Array
  },
  methods: {
    placeBottle: function (p) {
      this.$emit('placeBottle', p.id);
      this.highlightAvailableCards();
    },
    highlightAvailableCards: function () {
      for (let i = 0; i < this.skillsOnSale.length; i += 1) {
        console.log("highlighted", JSON.stringify(this.skillsOnSale[i]));
        this.$set(this.skillsOnSale[i], "available", true);
      }
      for (let i = 0; i < this.player.hand.length; i += 1) {
        this.$set(this.player.hand[i], "available", true);
      }
    },
    gainSkill: function (card) {
      if (card.available) {
        this.$emit('gainSkill', card)
      }
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .buttons {
    display: grid;
    grid-template-columns: repeat(auto-fill, 50px);
  }
  .slot-wrapper {
    width: 100%;
  }

</style>
