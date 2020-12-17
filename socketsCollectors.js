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
            currentAuctionCard: data.getCurrentAuctionCard(d.roomId),
            placements: data.getPlacements(d.roomId),
            market: data.getMarket(d.roomId),
            playerCount: data.getPlayerCount(d.roomId)
          }
        );
      }
    });

    socket.on('collectorsStartGame', function(d) {
      data.changeRound(d.roomId, d.playerId, d.activeRound, d.players);
      io.to(d.roomId).emit('collectorsGameStarted', {
        playerBoardShown: data.getPlayerBoardShown(d.roomId),
        playerIdArray: data.getPlayerIdArray(d.roomId),
        players: data.getPlayers(d.roomId),
      });
      io.to(d.roomId).emit('collectorsRoundUpdated', {
        activeRound: data.getActiveRound(d.roomId)
      });
    //  console.log(d.activeRound, "aktiv runda som skickas in")
    //  console.log(data.getActiveRound(d.roomId), "aktiv runda i datahandlern efter förändring")
    });

    socket.on('collectorsDrawCard', function(d) {
      io.to(d.roomId).emit('collectorsCardDrawn',
      data.drawCard(d.roomId, d.playerId)
      );
    });

    socket.on('collectorsBuyItem', function(d) {
      data.buyItem(d.roomId, d.playerId, d.card, d.cost)
      io.to(d.roomId).emit('collectorsItemBought', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          itemsOnSale: data.getItemsOnSale(d.roomId),
          currentAuctionCard: data.getCurrentAuctionCard(d.roomId)
        }
      );
    });

    socket.on('collectorsPlayerReady', function(d) {
      data.addPlayerReady(d.roomId, d.playerId);
      io.to(d.roomId).emit('collectorsPlayerArrayFinished', {
        playerIdArray: data.getPlayerIdArray(d.roomId)
      });
    });

    socket.on('collectorsChangeRound', function(d) {
      console.log("ändrar runda i sockets")
      data.changeRound(d.roomId, d.playerId, d.activeRound, d.players);
      io.to(d.roomId).emit('collectorsRoundUpdated', {
        activeRound: data.getActiveRound(d.roomId),
        placements: data.getPlacements(d.roomId)
      });
    });

    socket.on('collectorsPlaceBottle', function(d) {
      data.placeBottle(d.roomId, d.playerId, d.action, d.cost);
      io.to(d.roomId).emit('collectorsBottlePlaced', {
        placements: data.getPlacements(d.roomId),
        players: data.getPlayers(d.roomId),
        playerIdArray: data.getPlayerIdArray(d.roomId)
      });
    });

    socket.on('collectorsPlaceBottleRaiseValue', function(d) {
      data.placeBottleRaiseValue(d.roomId, d.playerId, d.action, d.cost, d.index);
      io.to(d.roomId).emit('collectorsBottlePlaced', {
        placements: data.getPlacements(d.roomId),
        players: data.getPlayers(d.roomId),
        playerIdArray: data.getPlayerIdArray(d.roomId)
      });
    });

    socket.on('collectorsPlaceBottleWork', function(d) {
      data.placeBottleWork(d.roomId, d.playerId, d.action, d.cost, d.index);
      io.to(d.roomId).emit('collectorsBottlePlaced', {
        placements: data.getPlacements(d.roomId),
        players: data.getPlayers(d.roomId),
        playerIdArray: data.getPlayerIdArray(d.roomId)
      });
    });

    socket.on('collectorsStartAuction', function(d) {
      data.startAuction(d.roomId, d.playerId, d.card, d.cost);
      io.to(d.roomId).emit('collectorsAuctionStarted', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          auctionCards: data.getAuctionCards(d.roomId),
          currentAuctionCard: data.getCurrentAuctionCard(d.roomId)
        }
      );
    });

    socket.on('collectorsEndAuction', function(d) {
      data.endAuction(d.roomId, d.playerId,);
      io.to(d.roomId).emit('collectorsAuctionEnded', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          bidArray: data.getBidArray(d.roomId)
        }
      );
    });

    socket.on('collectorsGetSkill', function(d) {
      data.getSkill(d.roomId, d.playerId, d.card, d.cost)
      io.to(d.roomId).emit('collectorsSkillAcquired', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          skillsOnSale: data.getSkillsOnSale(d.roomId),
          currentAuctionCard: data.getCurrentAuctionCard(d.roomId)
        }
      );
    });

    socket.on('collectorsRaiseValue', function(d) {
      data.raiseValue(d.roomId, d.playerId, d.card1, d.cost)
      if (d.card2 !== null) {
        data.raiseValue(d.roomId, d.playerId, d.card2, 0)
      }
      io.to(d.roomId).emit('collectorsValueRaised', {
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          marketValues: data.getMarketValues(d.roomId),
          market: data.getMarket(d.roomId),
          skillsOnSale: data.getSkillsOnSale(d.roomId),
          auctionCards: data.getAuctionCards(d.roomId),
          currentAuctionCard: data.getCurrentAuctionCard(d.roomId)
        }
      );
    });

    socket.on('collectorsFakeMoreMoney', function(d) {
      io.to(d.roomId).emit('collectorsMoneyFaked',
      data.fakeMoreMoney(d.roomId, d.playerId)
      );
    });

    socket.on('collectorsRetrieveBottles', function(d) {
      io.to(d.roomId).emit('collectorsBottlesRetrieved',
      data.retrieveBottles(d.roomId, d.playerId)
      );
    });

    socket.on('collectorsRaiseCurrentBid', function(d) {
	     io.to(d.roomId).emit('collectorsBidRaised',
			 data.raiseCurrentBid(d.roomId, d.playerId)
      );
    });

}

module.exports = sockets;
