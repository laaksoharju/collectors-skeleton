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
  //FÖRSÖK TILL KORTAKJ
  let numbPlayers = room.playerCount;
  room.itemsOnSale = room.deck.splice(0, (numbPlayers+1) );
  room.skillsOnSale = room.deck.splice(0, (numbPlayers+1) );
  //SLUT

  room.auctionCards = room.deck.splice(0, 4);
  room.cardUpForAuction = {};
  room.highestBid = 0;
  room.market = [];
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
                           {cost:-2, playerId: null},
                           {cost:0, playerId: null} ];
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
                                 points: 0,
                                 skills: [],
                                 items: [],
                                 income: [],
                                 secret: [],
                                 bids: 0, };
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

//getSkill har jag skapat
Data.prototype.getSkill = function (roomId, playerId, card, skill) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;

    //check if card is among skills on sale
    for (let i = 0; i < room.skillsOnSale.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equalit
      if (room.skillsOnSale[i].x === card.x &&
          room.skillsOnSale[i].y === card.y) {
        c = room.skillsOnSale.splice(i,1, {});

        break;
      }
    }
    room.players[playerId].skills.push(...c);
  }
}

Data.prototype.startAuction = function (roomId, playerId, card, auctionCard) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
        //check if card is among skills on sale
    for (let i = 0; i < room.auctionCards.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equalit
      if (room.auctionCards[i].x === card.x &&
          room.auctionCards[i].y === card.y) {
            let temp = room.auctionCards.splice(i,1, {});
            room.cardUpForAuction = temp[0];
        break;
      }
    }
  }
}

Data.prototype.startBidding = function (roomId, playerId) {
  console.log('console.log("HEJ NU I DATA");');
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
  //var highestBidValue = {};
  let allPlayersId = Object.keys(room.players);
  console.log(allPlayersId);
  console.log(room.players[playerId].bids +"HÄÄÄÄÄR");
  for (let i in allPlayersId){
    console.log(room.players[allPlayersId[i]].bids)
    if (room.highestBid < room.players[allPlayersId[i]].bids){
        room.highestBid = room.players[allPlayersId[i]].bids;
      }
    }
  //for (let i = 0; i < room.bids.length; i += 1) {
    //   if (highestBid < room.bids[i]){
      //   highestBid = room.bids[i];
    console.log("Det högsta budet är" +room.highestBid);
    }
}

/* VI LÄGGER TILL FÖR ATT BYTA SPELARE I TURNBUTTON */
Data.prototype.changeTurn = function (roomId, playerId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let allPlayersId = Object.keys(room.players);
    let nextPlayer = allPlayersId[0];
    for (let i in allPlayersId) {

     if (playerId === allPlayersId[i]){
        let newIndex = (Number(i) + Number(1))%(room.playerCount);
        nextPlayer = allPlayersId[newIndex]; //kanske +1 tänk MATTE
        break;
      }
    }
    return nextPlayer;
  }
  else return "";

}

Data.prototype.countRounds = function (roomId, playerId) {};//FORTSÄTT HÄR FÖR QUARTER TILES


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
    room.players[playerId].money -= cost;

  }
}

Data.prototype.placeBottle = function (roomId, playerId, action, cost) {
  let room = this.rooms[roomId];
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
      activePlacement = room.marketPlacement;
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

Data.prototype.getCardUpForAuction = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.cardUpForAuction;
  }
  else return {};
}

Data.prototype.getMarketValues = function(roomId){
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
}

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
