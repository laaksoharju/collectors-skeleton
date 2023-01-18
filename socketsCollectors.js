function sockets(io, socket, data) {
    socket.on('setupCollectors', function(d) {
      data.createRoom(d.roomId, d.playerCount, d.lang);
    })
    socket.on('setLang', function(lang) {
      socket.emit('collectorsHomeLabels',
      data.getUILabelsLang(lang));
    })
    socket.on('collectorsLoaded', function(d) {
      socket.join(d.roomId);
      if (data.joinGame(d.roomId, d.playerId)) {
        socket.emit('collectorsInitialize', {
            labels: data.getUILabels(d.roomId),
            players: data.getPlayers(d.roomId),
            itemsOnSale: data.getItemsOnSale(d.roomId),
            marketValues: data.getMarketValues(d.roomId),
            skillsOnSale: data.getSkillsOnSale(d.roomId),
            auctionCards: data.getAuctionCards(d.roomId),
            placements: data.getPlacements(d.roomId),
            }
        );
      }
    });

    socket.on('collectorsDrawCard', function(d) {
      io.to(d.roomId).emit('collectorsCardDrawn',
        data.drawCard(d.roomId, d.playerId)
      );
    });

    socket.on('collectorsBuyCard', function(d) {
      data.buyCard(d.roomId, d.playerId, d.card, d.cost)
      io.to(d.roomId).emit('collectorsCardBought', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          itemsOnSale: data.getItemsOnSale(d.roomId)
        }
      );
    });

    socket.on('collectorsChooseColor', function(d) {
      data.chooseColor(d.roomId, d.playerId, d.color, d.playerBottles)
      io.to(d.roomId).emit('collectorsColorChosen', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
        }
      );
    });

    socket.on('collectorsStartMoney', function(d) {
      data.startMoney(d.roomId, d.playerId)
      io.to(d.roomId).emit('collectorsColorChosen', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
        }
      );
    });

    socket.on('collectorsPlaceBottle', function(d) {
      data.placeBottle(d.roomId, d.playerId, d.action, d.cost, d.placementId);
      io.to(d.roomId).emit('collectorsBottlePlaced',
         data.getPlacements(d.roomId)
      );
    });


    socket.on('collectorsPlaceWorkBottle', function(d) {
      data.placeWorkBottle(d.roomId, d.playerId, d.workActionId, d.cost);
      io.to(d.roomId).emit('collectorsWorkBottlePlaced',
        { placements: data.getPlacements(d.roomId),
         players: data.getPlayers(d.roomId)}
      );
    });


    socket.on('collectorsPlaceQuarterBottle', function(d) {

      console.log("inne i  sockets collectorsPlaceQuarterBottle 1"+d.currentRound);

      data.placeQuarterBottle(d.roomId, d.playerId, d.cost);

      console.log("data getplacement" + data.getPlacements(d.roomId).quarterPlacement[0].playerId);
      console.log("Socket efter placeQuarterBottle 2");

      io.to(d.roomId).emit('collectorsQuarterBottlePlaced',
        { placements: data.getPlacements(d.roomId),
         players: data.getPlayers(d.roomId),
         currentRound: data.getCurrentRound(d.roomId)}
       );
       console.log("socket quarterplacement. "+ data.getPlacements(d.roomId).quarterPlacement);
            console.log("I socket placeQuarterBottle 3");
     });


    socket.on('collectorsGetSkillValue', function(d){
      data.getSkillValue(d.roomId, d.playerId, d.card, d.skill)
      io.to(d.roomId).emit('collectorsSkillValueCaught', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
        }
      );
    });

    socket.on('collectorsGetSkill', function(d) {
      data.getSkill(d.roomId, d.playerId, d.card, d.skill, d.cost)
      io.to(d.roomId).emit('collectorsSkillCaught', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          skillsOnSale: data.getSkillsOnSale(d.roomId)
        }
      );
    });

    socket.on('collectorsStartAuction', function(d){
      data.startAuction(d.roomId, d.playerId, d.card, d.cost)
      io.to(d.roomId).emit('collectorsAuctionStarted', {
        playerId: d.playerId,
        players: data.getPlayers(d.roomId),
        auctionCards: data.getAuctionCards(d.roomId),
        cardUpForAuction: data.getCardUpForAuction(d.roomId)
        }
      );
    });

    socket.on('collectorsStartMarket', function(d){
      data.startMarket(d.roomId, d.playerId, d.card, d.cost)
      io.to(d.roomId).emit('collectorsMarketStarted', {
        playerId: d.playerId,
        players: data.getPlayers(d.roomId),
        skillsOnSale: data.getSkillsOnSale(d.roomId),
        market: data.getMarket(d.roomId),
        marketValues: data.getMarketValues(d.roomId)
        }
      );
    });

    socket.on('collectorsStopAuction', function(d){
      data.stopAuction(d.roomId, d.playerId, d.cardUpForAuction)
      io.to(d.roomId).emit('collectorsAuctionStopped', {
        playerId: d.playerId,
        players: data.getPlayers(d.roomId),
        cardUpForAuction: data.getCardUpForAuction(d.roomId),
        auctionWinner: data.getAuctionWinner(d.roomId)
        }
      );
    });

    socket.on('collectorsWinnerCard', function(d){
      data.startWinnerCard(d.roomId, d.playerId, d.cardUpForAuction, d.action)
      io.to(d.roomId).emit('collectorsWinnerCardStarted', {
        playerId: d.playerId,
        players: data.getPlayers(d.roomId),
        cardUpForAuction: data.getCardUpForAuction(d.roomId),
        auctionWinner: data.getAuctionWinner(d.roomId),
        marketValues: data.getMarketValues(d.roomId)
        }
      );
    }
  );
    socket.on('collectorsStartBidding', function(d){
    data.startBidding(d.roomId, d.playerId, d.bids)
      io.to(d.roomId).emit('collectorsBiddingStarted', {
        players: data.getPlayers(d.roomId),
        highestBid: data.getHighestBid(d.roomId)
        }
      );
    });

    socket.on('collectorsChangeTurn', function(d) {
      io.to(d.roomId).emit('collectorsChangedTurn',{
        currentPlayer: data.changeTurn(d.roomId, d.currentPlayer),
        currentRound: data.getCurrentRound(d.roomId)
      }
    )
    });

    socket.on('collectorsEndGame', function(d) {
      data.endGame(d.roomId, d.marketValues)
      io.to(d.roomId).emit('collectorsEndedGame',{
        winner: data.getWinner(d.roomId),
        players: data.getPlayers(d.roomId)
      });
    });

    socket.on('collectorsNewRound', function(d) {
      data.newRound(d.roomId, d.players)
      console.log("runda i getcurrent"+data.getCurrentRound(d.roomId));
      io.to(d.roomId).emit('collectorsNewlyRounded',{
        currentRound: data.getCurrentRound(d.roomId),
        skillsOnSale: data.getSkillsOnSale(d.roomId),
        itemsOnSale: data.getItemsOnSale(d.roomId),
        auctionCards: data.getAuctionCards(d.roomId),
        placements: data.getPlacements(d.roomId),
        marketValues: data.getMarketValues(d.roomId),
        players: data.getPlayers(d.roomId),
      
      });
    });
}

module.exports = sockets;
