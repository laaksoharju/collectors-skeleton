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
            placements: data.getPlacements(d.roomId)
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
    socket.on('collectorsPlaceBottle', function(d) {
      data.placeBottle(d.roomId, d.playerId, d.action, d.cost);
      io.to(d.roomId).emit('collectorsBottlePlaced', data.getPlacements(d.roomId)
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
      data.startAuction(d.roomId, d.playerId, d.card, d.auctionCard)
      io.to(d.roomId).emit('collectorsAuctionStarted', {
        playerId: d.playerId,
        players: data.getPlayers(d.roomId),
        auctionCards: data.getAuctionCards(d.roomId),
        cardUpForAuction: data.getCardUpForAuction(d.roomId)
        }
      );
    });

    socket.on('collectorsChangeTurn', function(d) {
      io.to(d.roomId).emit('collectorsChangedTurn',
      data.changeTurn(d.roomId, d.currentPlayer));
    });

    socket.on('collectorsCountRounds', function(d) {
      io.to(d.roomId).emit('collectorsRoundsCounted',
      data.countRounds(d.roomId, d.currentPlayer));
    });

}

module.exports = sockets;
