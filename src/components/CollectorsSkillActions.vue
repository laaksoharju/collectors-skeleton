<template>
  <div id="SkillActionDiv">
    <h1 style="text-align: center"><img class="title_img" src="images/skill.png">{{ labels.getSkill }}</h1>
    <div id="BuySkillsDiv">
      <div id="SkillCardsDiv">
        <div class="get-skills">
          <div v-for="(card, index) in skillsOnSale" :key="index">
            <CollectorsCard
            :card="card"
            :availableAction="card.available"
            @doAction="getSkill(card)"/>
          </div>
        </div>
        <div>
          <div class="buttons" v-for="(p, index) in placement" :key="index">
            <button
            v-if="p.playerId===null"
            :disabled="cannotAfford(p.cost) || player.bottles < 1"
            @click="placeBottle(p)" >
            <!-- ${{p.cost}} -->
            <img :src='p.img' style="width:55%">
          </button>
          <div v-if="p.playerId !== null" style="color:black">
            {{p.playerId}}
          </div>
        </div>
      </div>
    </div>
    <div id="SkillInfoDiv">
      <h3>Info</h3>
      <img class="skillsinfo" src="images/gain2.png"/>
          <p id = "skillInfoText">{{labels.skillInfoWorkSkill}}</p>
      <img class="skillsinfo" src="images/gaincard.png"/>
          <p id = "skillInfoText">{{labels.skillInfoCardSkill}}</p>
      <img class="skillsinfo" src="images/gain5vp.png"/>
          <p id = "skillInfoText">{{labels.skillInfo5VP}}</p>
      <img class="skillsinfo" src="images/gainbottle.png"/>
          <p id = "skillInfoText">{{labels.skillInfoBottle}}</p>
      <img class="skillsinfo" src="images/gainauction.png"/>
          <p id = "skillInfoText">{{labels.skillInfoAuction}}</p>
      <img class="skillsinfo" src="images/gainvp.png"/>
          <p id = "skillInfoText">{{labels.skillInfo1VP}}</p>
    </div>
  </div>
</div>
</template>

<script>
import CollectorsCard from '@/components/CollectorsCard.vue'

export default {
  name: 'CollectorsSkillActions',
  components: {
    CollectorsCard
  },
  props: {
    labels: Object,
    player: Object,
    skillsOnSale: Array,
    marketValues: Object,
    placement: Array
  },
  methods: {
    cannotAfford: function (cost) {
      return (this.player.money < cost);
    },
    placeBottle: function (p) {
      this.$emit('placeBottle', p.cost);
      this.highlightAvailableCards(p.cost);
    },
    highlightAvailableCards: function (cost) {
      for (let i = 0; i < this.skillsOnSale.length; i += 1) {
        if (this.player.money >= cost) {
          this.$set(this.skillsOnSale[i], "available", true);
        }
        else {
          this.$set(this.skillsOnSale[i], "available", false);
        }
      }
      for (let i = 0; i < this.player.hand.length; i += 1) {
        this.$set(this.player.hand[i], "available", true);
      }
      this.chosenPlacementCost = cost;
    },
    getSkill: function (card) {
      if (card.available) {
        this.$emit('getSkill', card)
        this.highlightAvailableCards()
      }
    }

  }
}
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.title_img {
  height: 65px;
  width: 70px;
  vertical-align: middle;
}

.get-skills {
  display: grid;
  grid-template-columns: repeat(auto-fill, 130px);
  grid-template-rows: repeat(auto-fill, 260px);
}

.get-skills div {
  transform: scale(0.8)translate(-10%,-10%);
  transition: 0.2s;
  transition-timing-function: ease-out;
  z-index: 0;
}

.get-skills div:hover {
  transform: scale(0.9)translate(-10%,-10%);
  z-index: 1;
}

.buttons {
  display: grid;
  float: left;
  grid-template-columns: repeat(auto-fill, 130px);
  transform: scale(0.8)translate(10%,-10%);
}

.buttons button {
  border-radius: 10px;
  transition: 0.15s;
  transition-timing-function: ease-in-out;
}

.buttons button:hover {
  transform: scale(1.05);
  transition:0.2s;
  transition-timing-function: ease-in-out;
}

#BuySkillsDiv {
  display: grid;
  grid-template-columns: 87% 13%;
  grid-template-areas:
  "SkillCardsDiv SkillInfoDiv"
}

#SkillCardsDiv {
  grid-area: SkillCardsDiv;
}

#SkillActionDiv h1, h2, h3, p  {
  color: black;
}

#SkillInfoDiv {
  grid-area: SkillInfoDiv;
  margin: 2px;
}

#skillInfoText{
  position: absolute;
  visibility: hidden;
  width: 200px;
  transition:0.2s;
  transition-timing-function: ease-in-out;
  z-index: 0;
}

.skillsinfo {
  align-self: center;
  width: 2em;
  margin-right: 0.2em;
  margin-left: 0.2em;
  margin-top: 0.5em;
  transition:0.2s;
  transition-timing-function: ease-out;
}

.skillsinfo:hover {
  transform: scale(1.2);
  transition: 0.15s;
  transition-timing-function: ease-in-out;
}

#SkillInfoDiv img:hover + #skillInfoText{
 position: absolute;
 visibility: visible;
 transform: scale(2);
 width: 200px;
 transition:0.2s;
 background-color: white;
 border-radius: 10px;
 transition-timing-function: ease-in-out;
 z-index: 2;
}

</style>
