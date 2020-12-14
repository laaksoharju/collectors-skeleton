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
  room.itemsOnSale = room.deck.splice(0, 5);
  room.skillsOnSale = room.deck.splice(0, 5);
  room.auctionCards = room.deck.splice(0, 4);
  room.currentAuctionCard = [];
  room.bidArray = [];
  room.market = [];
  room.playerIdArray = [];
  room.playerBoardShown = true;
  room.activeRound = String;
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
  room.marketPlacement = [ {cost:0, playerId: null},
                           {cost:2, playerId: null},
                           {cost:0, playerId: null} ];
  room.workPlacement = [ {cost:0, playerId: null},
                         {cost:-1, playerId: null, img: 'images/Static_Work_Image_001.png'},
                         {cost:1, playerId: null, img: 'images/Static_Work_Image_002.png'},
                         {cost:0, playerId: null, img: 'images/Static_Work_Image_003.png'},
                         {cost:0, playerId: null, img: 'images/Static_Work_Image_004.png'} ];
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
      room.players[playerId] = { hand: [],
                                 money: 1,
                                 bottles: 2,
                                 points: 0,
                                 skills: [],
                                 items: [],
                                 income: [],
                                 secret: [] };
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

/* moves card from itemsOnSale to a player's hand */
Data.prototype.buyItem = function (roomId, playerId, card, cost) {
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
    if (room.currentAuctionCard.length === 1) {
      if (room.currentAuctionCard[0].x === card.x &&
          room.currentAuctionCard[0].y === card.y) {
        c = room.currentAuctionCard.splice(0,1);
      }
    }
    room.players[playerId].items.push(...c);
    room.players[playerId].money -= cost;

  }
}
Data.prototype.getSkill = function (roomId, playerId, card, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;
    /// check first if the card is among the items on sale
    for (let i = 0; i < room.skillsOnSale.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equality
      if (room.skillsOnSale[i].x === card.x &&
          room.skillsOnSale[i].y === card.y) {
        c = room.skillsOnSale.splice(i,1, {});
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
    if (room.currentAuctionCard.length === 1) {
      if (room.currentAuctionCard[0].x === card.x &&
          room.currentAuctionCard[0].y === card.y) {
        c = room.currentAuctionCard.splice(0,1);
      }
    }
    room.players[playerId].skills.push(...c);
    room.players[playerId].money -= cost;

    if (card.skill === "bottle") {
      room.players[playerId].bottles += 1;
    }
  }
}

Data.prototype.raiseValue = function (roomId, playerId, card, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;
    for (let i = 0; i < room.skillsOnSale.length; i += 1) {
      if (room.skillsOnSale[i].x === card.x &&
          room.skillsOnSale[i].y === card.y) {
        c = room.skillsOnSale.splice(i,1, {});
        break;
      }
    }
    for (let i = 0; i < room.auctionCards.length; i += 1) {
      if (room.auctionCards[i].x === card.x &&
          room.auctionCards[i].y === card.y) {
        c = room.auctionCards.splice(i,1, {});
        break;
      }
    }
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      if (room.players[playerId].hand[i].x === card.x &&
          room.players[playerId].hand[i].y === card.y) {
        c = room.players[playerId].hand.splice(i,1);
        break;
      }
    }
    if (room.currentAuctionCard.length === 1) {
      if (room.currentAuctionCard[0].x === card.x &&
          room.currentAuctionCard[0].y === card.y) {
        c = room.currentAuctionCard.splice(0,1);
      }
    }
    room.market.push(...c);
    room.players[playerId].money -= cost;
  }
}

Data.prototype.addPlayerReady = function(roomId, playerId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {

    console.log(room.playerIdArray);
    room.playerIdArray.push(playerId);
    console.log(room.playerIdArray);
    shuffle(room.playerIdArray);
    console.log(room.playerIdArray);
  }
}

Data.prototype.changeRound = function(roomId, playerId, round){
  console.log('!!!!changeRound fuktion');
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
     room.activeRound = round;
  }
}

Data.prototype.startAuction = function (roomId, playerId, card, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;
    for (let i = 0; i < room.auctionCards.length; i += 1) {
      if (room.auctionCards[i].x === card.x &&
          room.auctionCards[i].y === card.y) {
        c = room.auctionCards.splice(i,1, {});
        break;
      }
    }
    for (let i = 0; i < room.players[playerId].hand.length; i += 1) {
      if (room.players[playerId].hand[i].x === card.x &&
          room.players[playerId].hand[i].y === card.y) {
        c = room.players[playerId].hand.splice(i,1);
        break;
      }
    }
    room.currentAuctionCard.push(...c);
    room.players[playerId].money -= cost;
    for (var player in room.players) {
      if (room.players[player].skills.length !== 0) {
        for (var card in room.players[player].skills) {
          if (room.players[player].skills[card].skill === "auctionIncome") {
            room.players[player].money += 1;
          }
        }
      }
    }
  }
}

Data.prototype.endAuction = function (roomId, playerId, card, cost) {
    let room = this.rooms[roomId];
    room.bidArray = [];
}


Data.prototype.placeBottle = function (roomId, playerId, action, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let activePlacement = [];
    if (action === "buyItem") {
      activePlacement = room.buyPlacement;
    }
    else if (action === "buySkill") {
      activePlacement = room.skillPlacement;
    }
    else if (action === "market") {
      activePlacement = room.marketPlacement;
    }
    else if (action === "startAuction") {
      activePlacement = room.auctionPlacement;
    }
    for(let i = 0; i < activePlacement.length; i += 1) {
        if (activePlacement[i].cost === cost &&
            activePlacement[i].playerId === null) {
          activePlacement[i].playerId = playerId;
          break;
        }
    }
    room.players[playerId].bottles -= 1;
  }
}

Data.prototype.placeBottleRaiseValue = function (roomId, playerId, action, cost, index) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    room.marketPlacement[index].playerId = playerId;
  }
  room.players[playerId].bottles -= 1;
}

Data.prototype.placeBottleWork = function (roomId, playerId, action, cost, index) {
  let room = this.rooms[roomId];
  if (typeof room !=='undefined') {
    room.players[playerId].money -= cost;
    room.players[playerId].bottles -= 1;
    if (room.players[playerId].skills.length !== 0) {
      for (let i = 0; i < room.players[playerId].skills.length; i += 1) {
        if (room.players[playerId].skills[i].skill === "workerIncome") {
          room.players[playerId].money += 2;
          console.log("You have the workerIncome skill, you gained 2 coins")
        }
        if (room.players[playerId].skills[i].skill === "workerCard") {
          let card1 = room.deck.pop();
          room.players[playerId].hand.push(card1);
          console.log("You have the workerCard skill, you gained a card")
        }
      }
    }

    if (index === 0) {
      console.log('Work ruta index 0, variera med rundan.');
      room.workPlacement[index].playerId = playerId;
    }
    if (index === 1) {
      console.log('Work ruta index 1, släng en flaska');
    }
    if (index === 2) {
      console.log('Work ruta index 2, dra två kort');
      room.workPlacement[index].playerId = playerId;
      let card1 = room.deck.pop();
      let card2 = room.deck.pop();
      room.players[playerId].hand.push(card1);
      room.players[playerId].hand.push(card2);
    }
    if (index === 3) {
      console.log('Work ruta index 3, dra ett kort, och bli spelare 1');
      room.workPlacement[index].playerId = playerId;
      let card1 = room.deck.pop();
      room.players[playerId].hand.push(card1);
    }
    if (index === 4) {
      console.log('Work ruta index 4, dra ett kort och placera ett från handen på income');
      room.workPlacement[index].playerId = playerId;
      let card1 = room.deck.pop();
      room.players[playerId].hand.push(card1);
    }
    return room.players;
  }
  else return [];
}

Data.prototype.getPlayerCount = function (roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.playerCount;
  }
  else return 0;
}

Data.prototype.fakeMoreMoney = function (roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    room.players[playerId].money += 1;
    return room.players;
  }
  else return [];
}

Data.prototype.raiseCurrentBid = function (roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
      room.bidArray.push(playerId);
      return room.bidArray;
  }
  else return [];
}

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
             marketPlacement: room.marketPlacement,
             workPlacement: room.workPlacement }
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

Data.prototype.getMarketValues = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let mv = {fastaval: 0,
              movie: 0,
              technology: 0,
              figures: 0,
              music: 0 };
    for (let cardindex in room.market) {
      mv[room.market[cardindex].market] += 1;
    }
    return mv;
  }
  else return [];
}

Data.prototype.getSkillsOnSale = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.skillsOnSale;
  }
  else return [];
}

Data.prototype.getMarket = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.market;
  }
  else return [];
}
Data.prototype.getPlayerIdArray = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.playerIdArray;
  }
  else return [];
}

Data.prototype.getActiveRound = function(roomId){
  console.log('getActiveRound funktion');
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.activeRound;
  }
  else return String;
}

Data.prototype.getAuctionCards = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.auctionCards;
  }
  else return [];
}

Data.prototype.getCurrentAuctionCard = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.currentAuctionCard;
  }
  else return [];
}

Data.prototype.getBidArray = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.bidArray;
  }
  else return [];
}

Data.prototype.getPlayerBoardShown = function(roomId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.playerBoardShown;
  }
  else return false;
}

module.exports = Data;
