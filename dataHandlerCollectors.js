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

Data.prototype.getUILabelsLang = function (lang) {
    var ui = require("./data/collectors-" + lang + ".json");
    return ui;
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
  room.auctionWinner = "";
  room.currentRound = 1;
  room.winner = "";
  room.highestBid = 0;
  room.market = [];
  room.buyPlacement = [ {cost:1, playerId: null, placementId:0 },
                        {cost:1, playerId: null, placementId:1 },
                        {cost:2, playerId: null, placementId:2 },
                        {cost:2, playerId: null, placementId:3 },
                        {cost:3, playerId: null, placementId:4 } ];
  room.skillPlacement = [ {cost:0, playerId: null, placementId:0 },
                          {cost:0, playerId: null, placementId:1 },
                          {cost:0, playerId: null, placementId:2 },
                          {cost:1, playerId: null, placementId:3 },
                          {cost:1, playerId: null, placementId:4 } ];
  room.auctionPlacement = [ {cost:0, playerId: null, placementId:0 },
                            {cost:0, playerId: null, placementId:1 },
                            {cost:-1, playerId: null, placementId:2 },
                            {cost:-2, playerId: null, placementId:3 } ];
  room.marketPlacement = [ {cost:0, playerId: null, placementId:0 },
                           {cost:0, playerId: null, placementId:1 },
                           {cost:-2, playerId: null, placementId:2 } ];
  room.workPlacement = [ {cost:1, playerId: null, workActionId:0},
                            {cost:-1, playerId: null, workActionId:1},
                            {cost:0, playerId: null, workActionId:2},
                            {cost:0, playerId: null, workActionId:3} ];
  room.quarterPlacement = [ {cost:0, playerId: null, currentRoundID:0},
                            {cost:1, playerId: null, currentRoundID:1},
                            {cost:2, playerId: null, currentRoundID:2},
                            {cost:3, playerId: null, currentRoundID:3} ];

  //FÖRSÖK ATT FÅ SPELARENS FLASKA ATT DYKA UPP EFTER KNAPPTRYCKNING


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
      room.players[playerId] = { hand: room.deck.splice(0, 2),
                                 money: 1,
                                 points: 0,
                                 skills: [],
                                 items: [],
                                 income: [],
                                 secret: room.deck.splice(0,1),
                                 bids: 0,
                                 color: '',
                                 playerBottles: 0,
                                 bottles:2,
                                 auctionSkillCounter:0,
                                 workerIncomeCounter:0,
                                 workerCardCounter:0,
                                 myFastaval: 0,
                                 myFigures:0,
                                 myMovie:0,
                                 myMusic:0,
                                 myTechnology:0,
                                 vpAll: false,
                                 order: Object.keys(room.players).length+1,

                               };
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
//CHOOSECOLOR försök till att välja färg
Data.prototype.chooseColor = function(roomId, playerId, color, playerBottles){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    console.log("inne i data handler chooose color");
    console.log(color);
    room.players[playerId].color = color;
    room.players[playerId].playerBottles = playerBottles;
    console.log("color innan foor loop"+ room.players[playerId].color);
  }
}
//startmoney sätter pengar vid spelstart
Data.prototype.startMoney = function(roomId, playerId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    console.log("inne i data handler startMoney");
    if (room.players[playerId].order === 1){
      room.players[playerId].money = 2 ;

    }
    else if (room.players[playerId].order === 2){
      room.players[playerId].money = 3;

    }

    else if (room.players[playerId].order === 3){
      room.players[playerId].money = 4;

    }

    else if (room.players[playerId].order === 4){
      room.players[playerId].money = 5;

    }

  }
}
//getSkill har jag skapat
Data.prototype.getSkill = function (roomId, playerId, card, skill, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let c = null;

    //check if card is among skills on sale
    for (let i = 0; i < room.skillsOnSale.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equalit
      if (room.skillsOnSale[i].x === card.x &&
          room.skillsOnSale[i].y === card.y) {
        c = room.skillsOnSale.splice(i,1);

        break;
      }
    }
    room.players[playerId].skills.push(...c);
    room.players[playerId].money -= cost;

  }
}

Data.prototype.getSkillValue= function (roomId, playerId, card, skill){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {

    if(card.skill === "bottle" ){
      room.players[playerId].playerBottles += 1;
      room.players[playerId].bottles += 1;
    }

    if(card.skill=== "auctionIncome") {
      room.players[playerId].auctionSkillCounter += 1;
    }

    if(card.skill === "workerIncome"){
      room.players[playerId].workerIncomeCounter += 2;
    }

    if(card.skill === "workerCard"){
      room.players[playerId].workerCardCounter += 1;
    }


      if(card.skill === "VP-fastaval"){
        room.players[playerId].myFastaval += 1;
      }
      if(card.skill === "VP-music"){
        room.players[playerId].myMusic += 1;
      }
      if(card.skill === "VP-technology"){
        room.players[playerId].myTechnology += 1;
      }
      if(card.skill === "VP-movies"){
        room.players[playerId].myMovie += 1;
      }
      if(card.skill === "VP-figures"){
        room.players[playerId].myFigures += 1;
      }

      if(card.skill === "VP-all"){
        room.players[playerId].vpAll = true;
      }





  }

}


Data.prototype.startAuction = function (roomId, playerId, card, cost) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
        //check if card is among skills on sale
    for (let i = 0; i < room.auctionCards.length; i += 1) {
      // since card comes from the client, it is NOT the same object (reference)
      // so we need to compare properties for determining equalit
      if (room.auctionCards[i].x === card.x &&
          room.auctionCards[i].y === card.y) {
            let temp = room.auctionCards.splice(i,1);
            room.cardUpForAuction = temp[0];
        break;
      }
    }


    }

  for (let playerId in room.players){
    if( room.players[playerId].auctionSkillCounter > 0){

      room.players[playerId].money += room.players[playerId].auctionSkillCounter;
    }
  }

  room.players[playerId].money -= cost;
}

Data.prototype.stopAuction = function (roomId, playerId, card) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
  console.log("inne i stop auction")
  let c = room.cardUpForAuction;
  let allPlayersId = Object.keys(room.players);
  for (let i in allPlayersId){
    if (room.players[allPlayersId[i]].bids === room.highestBid){
        room.auctionWinner = allPlayersId[i];
        return c;

      }

  }
  return {};
  }
}

Data.prototype.startWinnerCard = function(roomId, playerId, cardUpForAuction, action){
  let room = this.rooms[roomId];

  if (typeof room !== 'undefined') {

    console.log("data handler start winner card")
    if(action==='skill'){
      room.players[playerId].skills.push(room.cardUpForAuction);
    }
    if(action==='market'){
      room.market.push(room.cardUpForAuction);
    }
    if(action==='item'){
      room.players[playerId].items.push(room.cardUpForAuction);
    }
    room.players[room.auctionWinner].money -= room.highestBid;
    console.log("players kostnad highest:" + room.players[room.auctionWinner].money);
    room.cardUpForAuction = {};
    room.highestBid = 0;
    room.auctionWinner = "";
    action = '';
    let allPlayersId = Object.keys(room.players);
    for (let i in allPlayersId){
      room.players[allPlayersId[i]].bids = 0;
    }

  }

}

Data.prototype.startMarket = function (roomId, playerId, card) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
        for (let i = 0; i < room.skillsOnSale.length; i += 1) {

          if (room.skillsOnSale[i].x === card.x &&
              room.skillsOnSale[i].y === card.y) {
                let temp = room.skillsOnSale.splice(i,1);
                room.market.push(temp[0]);
                break;
          //  c = room.skillsOnSale.splice(i,1, {});

          }
        }
      //  room.players[playerId].skills.push(...c);
      }
    }


Data.prototype.startBidding = function (roomId, playerId, bids) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
  let allPlayersId = Object.keys(room.players);

    //  players.bids = bids
  //    player[playerId].bids = bids
  room.players[playerId].bids = bids;
  console.log(allPlayersId);
  console.log(bids +" Bids i data");
  for (let i in allPlayersId){
    console.log("Data room.players[allPlayersId[i]]" ,room.players[allPlayersId[i]]);
    console.log("Data room.players[allPlayersId[i]].bids" ,room.players[allPlayersId[i]].bids);
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

Data.prototype.fillBottles= function(roomId, players){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {

    for (let playerId in room.players){
      room.players[playerId].playerBottles = room.players[playerId].bottles;


    }
  }
}

Data.prototype.getIncome= function(roomId, players){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {

  for (let player in room.players){

    for (let i =0; room.players[player].income.length; i+=1){
      room.players[player].money += 1;
      room.players[player].income.splice(i, 1);
    }

  }
}
}

Data.prototype.newRound = function (roomId){
  let room = this.rooms[roomId];

  if (typeof room !== 'undefined') {
      let nextRound = room.currentRound;
    if (nextRound < 4) {
      room.currentRound += 1;
    }
    if (nextRound === 4) {
      let stopGame = 5;
      return stopGame; //Krash på sista gången som måste fixas!
    }


    let playerCounter = room.playerCount+2;

    for (let i = 0; i < room.skillsOnSale.length; i += 1) {
//sista kortet från skill till market
      if (room.skillsOnSale[i]=room.skillsOnSale[0]) {
            let temp = room.skillsOnSale.splice(i,1);
            room.market.push(temp[0]);
            break;
    }
  }
//Fyll kort från item till skill
  if (room.skillsOnSale.length < playerCounter){
      for (let i = room.skillsOnSale.length; i < room.playerCount+1; i+=1){
        let card = room.itemsOnSale.pop();
        console.log("inne  i for loop item till skill"+i);
        room.skillsOnSale.push(card);
      }
  }
//sista kortet från auction till market
  for (let i = 0; i < room.auctionCards.length; i += 1) {
    if (room.auctionCards[i]=room.auctionCards[0]) {
          let temp = room.auctionCards.splice(i,1);
          room.market.push(temp[0]);
          break;
        }
  }

//Item och auction fylls på från högen
      if (room.itemsOnSale.length < playerCounter){
          for (let i = room.itemsOnSale.length; i < room.playerCount+1; i+=1){
            let card = room.deck.pop();
            room.itemsOnSale.push(card);
          }
      }

      if (room.auctionCards.length < 4){
          for (let i = room.auctionCards.length; i < 4; i+=1){
            let card = room.deck.pop();
            room.auctionCards.push(card);
          }
      }
//Flaskorna försvinner vid new round
      for (let playerId in room.buyPlacement){
        room.buyPlacement[playerId].playerId = null;
      }

      for (let playerId in room.skillPlacement){
        room.skillPlacement[playerId].playerId = null;
      }

      for (let playerId in room.auctionPlacement){
        room.auctionPlacement[playerId].playerId = null;
      }

      for (let playerId in room.workPlacement){
        room.workPlacement[playerId].playerId = null;
      }

      for (let playerId in room.marketPlacement){
        room.marketPlacement[playerId].playerId = null;
      }
    }
  }


Data.prototype.endGame = function (roomId, marketValues){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let highestPoint = 0;

    let fastaval = marketValues.fastaval;
    let movie = marketValues.movie;
    let technology = marketValues.technology;
    let figures = marketValues.figures;
    let music = marketValues.music;

    let fastavalItem = false;
    let musicItem = false;
    let movieItem = false;
    let technologyItem = false;
    let figuresItem = false;


    for (let player in room.players){


      while (room.players[player].money > 2){


        room.players[player].money = room.players[player].money - 3;
        room.players[player].points += 1;
      }


      for (let index in room.players[player].items){
        let cardItem = room.players[player].items[index].item;

        if (cardItem === "fastaval"){
          fastavalItem = true;
          if((fastaval >0) || (room.players[player].myFastaval >0)){
          room.players[player].points += fastaval;
          room.players[player].points += room.players[player].myFastaval;

          }
        }
        if (cardItem === "movie"){
          musicItem = true;

          if((movie >0) || (room.players[player].myMovie >0)){
          room.players[player].points += movie;
          room.players[player].points += room.players[player].myMovie;
          }
        }
        if (cardItem === "technology"){
          technologyItem = true;
          if((movie >0) || (room.players[player].myTechnology >0)){
          room.players[player].points += technology;
          room.players[player].points += room.players[player].myTechnology;
          }
        }
        if (cardItem === "figures"){
          figuresItem = true;
          if((figures >0) || (room.players[player].myFigures >0)){
          room.players[player].points += figures;
          room.players[player].points += room.players[player].myFigures;
          }
        }
        if (cardItem === "music"){
          musicItem = true;
          if((music >0) || (room.players[player].myMusic >0)){
          room.players[player].points += music; //Vp one category
          room.players[player].points += room.players[player].myMusic;
          }
        }

      }
      /*if (room.players[player].vpAll===true){
        console.log("loop1"+room.players[player].vpAll)
        if ((musicItem ===true)&& (movieItem===true) && (technologyItem===true) && (figuresItem===true) && (fastavalItem===true)){

          room.players[player].points += 5;
          console.log("loop"+room.players[player].vpAll)
        }
      }*/

      if (room.players[player].points > highestPoint){
        highestPoint = room.players[player].points;
        room.winner = player;
      }
    }
    }
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
        c = room.itemsOnSale.splice(i,1);
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

Data.prototype.placeBottle = function (roomId, playerId, action, cost, placementId) {
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    console.log("placementId i data"+placementId+"cost"+cost)
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
    if (room.players[playerId].playerBottles > 0){
      room.players[playerId].playerBottles = room.players[playerId].playerBottles - 1;
    }
    console.log("dtahandlert"+ placementId)
    for(let i = 0; i < activePlacement.length; i += 1) {
        if(activePlacement[i].placementId === placementId &&
          activePlacement[i].cost === cost &&
          activePlacement[i].playerId === null) {
          activePlacement[i].playerId = playerId;
          break;
        }
    }
  }
}

Data.prototype.placeWorkBottle = function (roomId, playerId, workActionId, cost) {

  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let activePlacement = room.workPlacement;
    if (room.players[playerId].playerBottles > 0){
      room.players[playerId].playerBottles = room.players[playerId].playerBottles - 1;
    }
    for(let i = 0; i < activePlacement.length; i += 1) {
        if( activePlacement[i].workActionId === workActionId &&
            activePlacement[i].playerId === null &&
          activePlacement[i].cost === cost ) {
          activePlacement[i].playerId = playerId;
          break;
        }
    }
    if (room.players[playerId].workerIncomeCounter > 0){
      room.players[playerId].money += room.players[playerId].workerIncomeCounter;
    }
    if (room.players[playerId].workerCardCounter > 0){
      for (let i=0; i < room.players[playerId].workerCardCounter; i+=1){
        this.drawCard(roomId, playerId);
      }
    }
    if (workActionId === 0 ){
    room.players[playerId].money += cost;
    //radera flaska, får ej va med i framtida ronder, gör om de finns tid
    }
    if (workActionId === 1 ){
      this.drawCard(roomId, playerId);
      this.drawCard(roomId, playerId);
      room.players[playerId].money += cost;
    }
    if (workActionId === 2 ){
      this.drawCard(roomId, playerId);
      let switchOrder = room.players[playerId].order;
      for (let playerId in room.players ){
      console.log('order före ändring',  room.players[playerId].order)
      room.players[playerId].order = (room.players[playerId].order - (switchOrder - 1) + room.playerCount) % room.playerCount //FEL I EKV
      if (room.players[playerId].order === 0){
          room.players[playerId].order = room.playerCount;
      }
      console.log(playerId, 's order efter ändring',  room.players[playerId].order)
      }
  }
    if (workActionId === 3 ){
      this.drawCard(roomId, playerId);
      let c = room.players[playerId].hand.splice(0,1);
      room.players[playerId].income.push(...c);
    }
  }
}
Data.prototype.placeQuarterBottle = function (roomId, playerId, currentRound, cost) {
  console.log("inne i  datahandlers ");
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let activePlacement = room.quarterPlacement;
    if (room.players[playerId].playerBottles > 0){
      room.players[playerId].playerBottles = room.players[playerId].playerBottles - 1;
    }
    for(let i = 0; i < activePlacement.length; i += 1) {
      console.log("active placement currentround id i data: "+activePlacement[i].currentRoundID, currentRound);
      console.log("activePlacement[i].cost === cost i data: "+activePlacement[i].cost, cost);
        if( activePlacement[i].currentRoundID === (currentRound-1) &&
            activePlacement[i].playerId === null
            //&& activePlacement[i].cost === cost
        ) {
          console.log("inne i if :)");
          activePlacement[i].playerId = playerId;
          console.log(activePlacement[i].playerId + "dataaaaaaaaa");
          break;
        }
}
    if (currentRound === 1 ){
      this.drawCard(roomId, playerId);
      this.drawCard(roomId, playerId);
      let c = room.players[playerId].hand.splice(0,1);
      room.players[playerId].income.push(...c);
      let d = room.players[playerId].hand.splice(0,1);
      room.players[playerId].income.push(...d);
      console.log("income" + room.players[playerId].income)
    }
    if (currentRound === 2 ){
      this.drawCard(roomId, playerId);
      this.drawCard(roomId, playerId);
      let c = room.players[playerId].hand.splice(0,2);
      room.players[playerId].income.push(...c);
      room.players[playerId].money += 1;
    }
    if (currentRound === 3 ){
      this.drawCard(roomId, playerId);
      this.drawCard(roomId, playerId);
      let c = room.players[playerId].hand.splice(0,2);
      room.players[playerId].income.push(...c);
      room.players[playerId].money += 2;
    }
    if (currentRound === 4 ){
      room.players[playerId].money += 3;
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
             marketPlacement: room.marketPlacement,
             workPlacement: room.workPlacement,
             quarterPlacement: room.quarterPlacement}
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

Data.prototype.getAuctionWinner = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    console.log( "inne i getAuctionWinner"+room.auctionWinner);
    return room.auctionWinner;
  }
  else return "";
}

Data.prototype.getWinner = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.winner;
  }
  else return "";
}

Data.prototype.getCurrentRound = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.currentRound;
  }
  else return null;
}

Data.prototype.getHighestBid = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.highestBid;
  }
  else return 0;
}

Data.prototype.getMarketValues = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    let mv = { fastaval: 0,
              movie: 0,
              technology: 0,
              figures: 0,
              music: 0 };

    for (let cardIndex in room.market) {
      mv[room.market[cardIndex].market] += 1;
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

Data.prototype.getAuctionCards = function(roomId){
  let room = this.rooms[roomId];
  if (typeof room !== 'undefined') {
    return room.auctionCards;
  }
  else return [];
}

module.exports = Data;
