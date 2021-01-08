<template>
    <div class="playerboard">
      <h1>money {{ player.money }}, income {{ player.income }}, bottles {{player.bottleSlots}}</h1>
      <h1>items</h1>
      <div class="cardslots">
        <CollectorsCard 
          v-for="(card, index) in player.items" :key="'icard' + index"
          :card="card" 
          :availableAction="card.available">
        </CollectorsCard>
      </div>
      <h1>skills</h1>
      <div class="cardslots">
        <CollectorsCard 
          v-for="(card, index) in player.skills" :key="'skill' + index"
          :card="card" 
          :availableAction="card.available">
        </CollectorsCard>
      </div>
      <h1>secret</h1>
      <div class="cardslots">
        <CollectorsCard 
          v-for="(card, index) in player.secret" :key="'sec' + index"
          :card="card" 
          :availableAction="card.available">
        </CollectorsCard>
      </div>
      <h1>hand</h1>
      <div class="cardslots">
        <CollectorsCard v-for="(card, index) in player.hand" :card="card" :availableAction="card.available" @doAction="handleAction(card)" :key="'hand' + index"/>
      </div>
    </div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsPlayerboard',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
  },
  methods: {
    adjustBottle: function (oldPos, newPos) {
      this.$emit('placeBottle', {oldPos: oldPos, newPos: newPos});
    },
    handleAction: function (card) {
      this.$emit('handleAction', card);
    }
  }
}
</script>
<style scoped>
.playerboard {
  background-color: maroon;
}

</style>
