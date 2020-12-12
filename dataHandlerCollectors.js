'use strict';

let csv = require("csvtojson");

let collectorsDeck = "collectors-cards";
let languages = ["en", "se"];
/* https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array */
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// Store data in an object to keep the global namespace clean
function Data() {
  this.data = {};
  this.rooms = {};
}


/***********************************************
For performance reasons, methods are added to the
prototype of the Data object/class
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures
***********************************************/

/*
  Function to load initial data from CSV files into the object
*/
Data.prototype.initializeTable = function (table) {
  csv({checkType: true})
    .fromFile("./data/" + table + ".csv")
    .then((jsonObj) => {
      this.data[table] = jsonObj;
    });
};

Data.prototype.initializeData = function() {
  console.log("Starting to build data tables");
  for (let i in languages) {
    this.initializeTable(collectorsDeck);
  }
}

Data.prototype.getUILabels = function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let lang = room.lang;
    var ui = require("./data/collectors-" + lang + ".json");
    return ui;
  }
  else return {};
}

Data.prototype.createRoom = function(roomId, playerCount, lang="en") {
  let room = {};
  room.players = {};
  room.lang = lang;
  room.deck = this.createDeck(lang);
  room.playerCount = playerCount;
  if(playerCount===4){
  room.itemsOnSale = room.deck.splice(0, 5);
  room.skillsOnSale = room.deck.splice(0, 5);
  }
  if(playerCount===3){
  room.itemsOnSale = room.deck.splice(0, 4);
  room.skillsOnSale = room.deck.splice(0, 4);
  }
  if(playerCount===2){
  room.itemsOnSale = room.deck.splice(0, 3);
  room.skillsOnSale = room.deck.splice(0,3);
  }
  room.auctionCards = room.deck.splice(0, 4);
  room.currentAuction = [];
  room.market = {
    movie: 0,
    technology: 0,
    fastaval: 0,
    music: 0,
    figures:0};
  room.buyPlacement = [ {cost:1, playerId: null},
                        {cost:1, playerId: null},
                        {cost:2, playerId: null},
                        {cost:2, playerId: null},
                        {cost:3, playerId: null} ];
  room.skillPlacement = [ {cost:0, playerId: null},
                          {cost:0, playerId: null},
                          {cost:0, playerId: null},
                          {cost:1, playerId: null},
                          {cost:1, playerId: null} ];
  room.auctionPlacement = [ {cost:-2, playerId: null},
                            {cost:-1, playerId: null},
                            {cost:0, playerId: null},
                            {cost:0, playerId: null} ];
  room.marketPlacement = [ {cost:0, playerId: null, numberOfChangedMarkets: 2},
                           {cost:2, playerId: null,numberOfChangedMarkets: 2},
                           {cost:0, playerId: null,numberOfChangedMarkets: 1} ];
  this.rooms[roomId] = room;
}

Data.prototype.createDeck = function() {
  // we want a copy of the deck array, not a reference to it so we use the
  // spread operator (...) to copy the items. Note that this is a shallow copy
  // so it is not generalizable to all copy problems
  let deck = [...this.data[collectorsDeck]];
  return shuffle(deck);
}

Data.prototype.joinGame = function (roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    if (typeof room.players[playerId] !== 'undefined') {
      console.log("Player", playerId, "joined again with info", room.players[playerId]);
      return true;
    }
    else if (Object.keys(room.players).length < room.playerCount) {
      console.log("Player", playerId, "joined for the first time");
      if(Object.keys(room.players).length < 1){
      room.players[playerId] = { hand: [],
                                 money: 1,
                                 points: 0,
                                 skills: [],
                                 itemsByNumber:{
                                   movie: 0,
                                   technology: 0,
                                   fastaval: 0,
                                   music: 0,
                                   figures:0},
                                 items: [],
                                 income: [],
                                 secret: [],
                                 energyBottles: 2,
                                 myTurn: true};
      }
      else{
      room.players[playerId] = { hand: [],
                                 money: 1,
                                 points: 0,
                                 skills: [],
                                 itemsByNumber:{
                                   movie: 0,
                                   technology: 0,
                                   fastaval: 0,
                                   music: 0,
                                   figures:0},
                                 items: [],
                                 income: [],
                                 secret: [],
                                 energyBottles: 2,
                                 myTurn: false };
      }
      return true;
    }
    console.log("Player", playerId, "was declined due to player limit");
  }
  return false;
}

Data.prototype.getPlayers = function (id) {
  let room = this.rooms[id]
  if (typeof room !== 'undefined') {
    return room.players;
  }
  else return {};
}

Data.prototype.updatePoints = function (roomId, player, points) {
  let room = this.rooms[roomId]
  if (typeof room !== 'undefined') {
    room.points[player] += points;
    return room.points;
  }
  else return {};
}

/* returns players after a new card is drawn */
Data.prototype.drawCard = function (roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let card = room.deck.pop();
    room.players[playerId].hand.push(card);
    return room.players;
  }
  else return [];
}

Data.prototype.skipThisRound = function (roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
        // Turn-base- function
        var aPlayer
        for(aPlayer in room.players){

          if(room.players[aPlayer].myTurn === true){

            if(Object.keys(room.players).indexOf(aPlayer) === room.playerCount - 1){
              room.players[aPlayer].myTurn = false;
              room.players[Object.keys(room.players)[0]].myTurn = true;
              break;
            }
            else{
              room.players[aPlayer].myTurn = false;

              // Följande är en black box. Men jag kan förklara:
              // Object.keys(room.players).indexOf(aPlayer) = index av den spelare vars tur det är

              // Object.keys(room.players).indexOf(aPlayer) = index av den spelare vars tur det är nästa gång,
              // förutsatt att spelaren vars tur det är inte är den sista spelaren.

              // Object.keys(room.players)[Object.keys(room.players).indexOf(aPlayer) + 1] = playerId:t av den spelare
              // vars tur det är nästa gång

              // room.players[Object.keys(room.players)[Object.keys(room.players).indexOf(aPlayer) + 1]] =
              // room.players[playerId:t av den spelare vars tur det är nästa gång]
              room.players[Object.keys(room.players)[Object.keys(room.players).indexOf(aPlayer) + 1]].myTurn = true;
              break;
          }
          }
        }
    return room.players;
  }
  else return [];
}

/* moves card from itemsOnSale to a player's hand */
Data.prototype.buyCard = function (roomId, playerId, card, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;
    /// check first if the card is among the items on sale
    for (let i = 0; i < room.itemsOnSale.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality
      if (room.itemsOnSale[i].x === card.x &&
          room.itemsOnSale[i].y === card.y) {
        c = room.itemsOnSale.splice(i,1, {});
        break;
      }
    }
    // ...then check if it is in the hand. It cannot be in both so it's safe
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality
      if (room.players[playerId].hand[i].x === card.x &&
          room.players[playerId].hand[i].y === card.y) {
        c = room.players[playerId].hand.splice(i,1);
        break;
      }
    }
    room.players[playerId].items.push(...c);
    Data.prototype.raiseItem(c, room, playerId);
    room.players[playerId].money -= cost;




    // Turn-base- function
    var aPlayer
    for(aPlayer in room.players){

      if(room.players[aPlayer].myTurn === true){

        if(Object.keys(room.players).indexOf(aPlayer) === room.playerCount - 1){
          room.players[aPlayer].myTurn = false;
          room.players[Object.keys(room.players)[0]].myTurn = true;
          break;
        }
        else{
          room.players[aPlayer].myTurn = false;

          // Följande är en black box. Men jag kan förklara:
          // Object.keys(room.players).indexOf(aPlayer) = index av den spelare vars tur det är

          // Object.keys(room.players).indexOf(aPlayer) = index av den spelare vars tur det är nästa gång,
          // förutsatt att spelaren vars tur det är inte är den sista spelaren.

          // Object.keys(room.players)[Object.keys(room.players).indexOf(aPlayer) + 1] = playerId:t av den spelare
          // vars tur det är nästa gång

          // room.players[Object.keys(room.players)[Object.keys(room.players).indexOf(aPlayer) + 1]] =
          // room.players[playerId:t av den spelare vars tur det är nästa gång]
          room.players[Object.keys(room.players)[Object.keys(room.players).indexOf(aPlayer) + 1]].myTurn = true;
          break;
      }
      }
    }


    Data.prototype.calculatePoints(room ,playerId);
}
}

Data.prototype.calculatePoints=function(room, playerId){
  let points=0;
  let player = room.players[playerId];
  console.log(player);
  /*for(let i=0;i<room.market;i +=1){
    console.log(room.markets[i][0])
    points+=room.market[i]*player.itemsByNumber[i];
  }*/
  points=room.market.music*player.itemsByNumber.music;
  points+=room.market.fastaval*player.itemsByNumber.fastaval;
  points+=room.market.movie*player.itemsByNumber.movie;
  points+=room.market.figures*player.itemsByNumber.figures;
  points+=room.market.technology*player.itemsByNumber.technology;
  console.log(points);
  player.points=points;
}

Data.prototype.raiseItem= function(card, room, playerId){

  if(card[0].item==='movie'){
    room.players[playerId].itemsByNumber.movie+=1;
  }
  if(card[0].item==='music'){
    room.players[playerId].itemsByNumber.music+=1;
  }
  if(card[0].item==='technology'){
    room.players[playerId].itemsByNumber.technology+=1;
  }
  if(card[0].item==='fastaval'){
    room.players[playerId].itemsByNumber.fastaval+=1;
  }
  if(card[0].item==='figures'){
    room.players[playerId].itemsByNumber.figures+=1;
  }
  console.log(room.players[playerId].itemsByNumber);
}

Data.prototype.buySkill=function (roomId,playerId,card,cost){
  let room = this.rooms[roomId];
  if(typeof room !== 'undefined'){
    let c = null;
    //Check if the card is on the
    for (let i = 0; i < room.skillsOnSale.length; i += 1){
      if (room.skillsOnSale[i].x === card.x &&
          room.skillsOnSale[i].y === card.y) {
        c = room.skillsOnSale.splice(i,1, {});
        break;
    }
  }
  for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
    // since card comes from the client, it is NOT the same object (reference)
    // so we need to compare properties for determining equality
    if (room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y) {
      c = room.players[playerId].hand.splice(i,1);
      break;
    }
  }
  room.players[playerId].skills.push(...c);
  room.players[playerId].money -= cost;
  }

  // Turn-base- function
  var aPlayer
  for(aPlayer in room.players){

    if(room.players[aPlayer].myTurn === true){

      if(Object.keys(room.players).indexOf(aPlayer) === room.playerCount - 1){
          room.players[aPlayer].myTurn = false;
          room.players[Object.keys(room.players)[0]].myTurn = true;
          break;
      }
      else{
          room.players[aPlayer].myTurn = false;

          // Följande är en black box. Men jag kan förklara:
          // Object.keys(room.players).indexOf(aPlayer) = index av den spelare vars tur det är

          // Object.keys(room.players).indexOf(aPlayer) = index av den spelare vars tur det är nästa gång,
          // förutsatt att spelaren vars tur det är inte är den sista spelaren.

          // Object.keys(room.players)[Object.keys(room.players).indexOf(aPlayer) + 1] = playerId:t av den spelare
          // vars tur det är nästa gång

          // room.players[Object.keys(room.players)[Object.keys(room.players).indexOf(aPlayer) + 1]] =
          // room.players[playerId:t av den spelare vars tur det är nästa gång]
          room.players[Object.keys(room.players)[Object.keys(room.players).indexOf(aPlayer) + 1]].myTurn = true;
          break;
      }
    }
  }


}

Data.prototype.placeBottle = function (roomId, playerId, action, cost,twoMarket) {
  let room = this.rooms[roomId];
  room.players[playerId].energyBottles -= 1;
  if (typeof room !== 'undefined') {
    let activePlacement = [];
    if (action === "buy") {
      activePlacement = room.buyPlacement;
    }
    else if (action === "skill") {
      activePlacement = room.skillPlacement;
    }
    else if (action === "auction") {
      activePlacement = room.auctionPlacement;
    }
    else if (action === "market") {
      Data.prototype.placeMarketBottle(room,playerId,cost,twoMarket);
      return
    }
    for(let i = 0; i < activePlacement.length; i += 1) {
        if( activePlacement[i].cost === cost &&
            activePlacement[i].playerId === null ) {
          activePlacement[i].playerId = playerId;
          break;
        }
    }
  }
}

Data.prototype.placeMarketBottle=function(room,playerId,cost,twoMarket){
  let activePlacement = [];
  let numberOfChangedMarkets=1;
  if(twoMarket===true){
    numberOfChangedMarkets=2;
  }
  activePlacement=room.marketPlacement;
  for(let i = 0; i < activePlacement.length; i += 1){

  if( activePlacement[i].cost === cost &&
      activePlacement[i].playerId === null &&
      activePlacement[i].numberOfChangedMarkets===numberOfChangedMarkets) {
    activePlacement[i].playerId = playerId;
}
}
}
/* auction */
Data.prototype.startAuction = function (roomId, playerId, card, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;
    /// check first if the card is among the items on sale
    for (let i = 0; i < room.auctionCards.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality
      if (room.auctionCards[i].x === card.x &&
          room.auctionCards[i].y === card.y) {
        c = room.auctionCards.splice(i,1, {});
        break;
      }
    }
    // ...then check if it is in the hand. It cannot be in both so it's safe
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality
      if (room.players[playerId].hand[i].x === card.x &&
          room.players[playerId].hand[i].y === card.y) {
        c = room.players[playerId].hand.splice(i,1);
        break;
      }
    }
    room.currentAuction = c;
    room.players[playerId].money -= cost;

  }
}

Data.prototype.raiseMarket=function(roomId, playerId, card, cost,action){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined'){
    if(card.market==='movie'){
      room.market.movie+=1;
    }
    if(card.market==='music'){
      room.market.music+=1;
    }
    if(card.market==='technology'){
      room.market.technology+=1;
    }
    if(card.market==='fastaval'){
      room.market.fastaval+=1;
    }
    if(card.market==='figures'){
      room.market.figures+=1;
    }
    console.log(room.market);
    room.players[playerId].money -= cost;
  }
  if(action==='skill'){
    Data.prototype.getRidOfSkill(room);
  }
  else if (action==='auction') {
    Data.prototype.getRidOfAuction(room);
  }
  else if(action==='hand'){
    Data.prototype.getRidOfHand(card,room,playerId);
  }
}

Data.prototype.getRidOfSkill= function(room){
  for(let i=0; i<room.skillsOnSale.length;i +=1){
    if(room.skillsOnSale[i].item!== undefined){
      room.skillsOnSale.splice(i,1, {});
      break;
    }
  }

  // Turn-base- function
  var aPlayer
  for(aPlayer in room.players){

    if(room.players[aPlayer].myTurn === true){

      if(Object.keys(room.players).indexOf(aPlayer) === room.playerCount - 1){
          room.players[aPlayer].myTurn = false;
          room.players[Object.keys(room.players)[0]].myTurn = true;
          break;
      }
      else{
          room.players[aPlayer].myTurn = false;

          // Följande är en black box. Men jag kan förklara:
          // Object.keys(room.players).indexOf(aPlayer) = index av den spelare vars tur det är

          // Object.keys(room.players).indexOf(aPlayer) = index av den spelare vars tur det är nästa gång,
          // förutsatt att spelaren vars tur det är inte är den sista spelaren.

          // Object.keys(room.players)[Object.keys(room.players).indexOf(aPlayer) + 1] = playerId:t av den
          // spelare vars tur det är nästa gång

          // room.players[Object.keys(room.players)[Object.keys(room.players).indexOf(aPlayer) + 1]] =
          // room.players[playerId:t av den spelare vars tur det är nästa gång]
          room.players[Object.keys(room.players)[Object.keys(room.players).indexOf(aPlayer) + 1]].myTurn = true;
          break;
      }
    }
  }

}

Data.prototype.getRidOfAuction= function(room){
  for(let i=0; i<room.auctionCards.length;i +=1){
    if(room.auctionCards[i].item!== undefined){
      room.auctionCards.splice(i,1, {});
      break;
    }
  }
}

Data.prototype.getRidOfHand= function(card,room,playerId){
  for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
    // since card comes from the client, it is NOT the same object (reference)
    // so we need to compare properties for determining equality
    if (room.players[playerId].hand[i].x === card.x &&
        room.players[playerId].hand[i].y === card.y) {
        room.players[playerId].hand.splice(i,1);
      break;
    }
  }
}


/* returns the hand of the player */
Data.prototype.getCards = function (roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let i = room.players.map(d => d.playerId).indexOf(playerId)
    return room.players[i].hand;
  }
  else return [];
}

Data.prototype.getPlacements = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return { buyPlacement: room.buyPlacement,
             skillPlacement: room.skillPlacement,
             auctionPlacement: room.auctionPlacement,
             marketPlacement: room.marketPlacement }
  }
  else return {};
}

Data.prototype.getItemsOnSale = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.itemsOnSale;
  }
  else return [];
}

Data.prototype.getCurrentAuctionCard = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.currentAuction;
  }
  else return [];
}

/*Data.prototype.getMarketValues = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.market.reduce(function(acc, curr) {
      acc[curr.market] += 1;
    },
    { fastaval: 0,
      movie: 0,
      technology: 0,
      figures: 0,
      music: 0 });
  }
  else return [];
}*/

Data.prototype.getSkillsOnSale = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.skillsOnSale;
  }
  else return [];
}

Data.prototype.getAuctionCards = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.auctionCards;
  }
  else return [];
}

module.exports = Data;
