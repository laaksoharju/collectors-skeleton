function sockets(io, socket, data) {
    socket.on('setupCollectors', function(d) {
      data.createRoom(d.roomId, d.playerCount, d.lang);
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

    socket.on('collectorsGetSkill', function(d) {
      data.getSkill(d.roomId, d.playerId, d.card, d.skill)
      io.to(d.roomId).emit('collectorsSkillCaught', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          skillsOnSale: data.getSkillsOnSale(d.roomId)
        }
      );
    });

    socket.on('collectorsStartAuction', function(d){
      data.startAuction(d.roomId, d.playerId, d.card, d.auctionCard, d.cost)
      io.to(d.roomId).emit('collectorsAuctionStarted', {
        playerId: d.playerId,
        players: data.getPlayers(d.roomId),
        auctionCards: data.getAuctionCards(d.roomId),
        cardUpForAuction: data.getCardUpForAuction(d.roomId)
        }
      );
    });

    socket.on('collectorsStartMarket', function(d){
      data.startMarket(d.roomId, d.playerId, d.card)
      io.to(d.roomId).emit('collectorsMarketStarted', {
        playerId: d.playerId,
        players: data.getPlayers(d.roomId),
        skillsOnSale: data.getSkillsOnSale(d.roomId),
        market: data.getMarket(d.roomId),
        marketValues: data.getMarketValues(d.roomId)   //lagt till marketValues
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
    }
    );

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
    //  data.startBidding(d.roomId, d.playerId)
    console.log(data.getPlayers(d.roomId));
    data.startBidding(d.roomId, d.playerId, d.bids)
      io.to(d.roomId).emit('collectorsBiddingStarted', {
        players: data.getPlayers(d.roomId),
        highestBid: data.getHighestBid(d.roomId)
        }
      );
        console.log("SOCKET BIDS" +d.bids);
        console.log("SOCKET HIGHESTBID" + data.getHighestBid(d.roomId));
    });

    socket.on('collectorsChangeTurn', function(d) {
      io.to(d.roomId).emit('collectorsChangedTurn',
      data.changeTurn(d.roomId, d.currentPlayer));
    });
    // 14/12

    socket.on('collectorsChangeRound', function(d) {
      io.to(d.roomId).emit('collectorsChangedRound',
      data.changeRound(d.roomId, d.currentRound));
    });

    socket.on('collectorsCountRounds', function(d) {
      io.to(d.roomId).emit('collectorsRoundsCounted',
      data.countRounds(d.roomId, d.currentPlayer));
    });

    socket.on('collectorsEndGame', function(d) {
      data.endGame(d.roomId, d.marketValues)
      io.to(d.roomId).emit('collectorsEndedGame',{
        winner: data.getWinner(d.roomId),
        players: data.getPlayers(d.roomId)
      });
    });
}

module.exports = sockets;
