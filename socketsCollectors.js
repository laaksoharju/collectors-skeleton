function sockets(io, socket, data) {
    socket.on('setupCollectors', function(d) {
      data.createRoom(d.roomId, d.playerCount, d.lang);
    })
    socket.on('collectorsLoaded', function(d) {
      socket.join(d.roomId);
      if (data.joinGame(d.roomId, d.playerId)) {
        io.to(d.roomId).emit('collectorsInitialize', { 
            labels: data.getUILabels(d.roomId),
            players: data.getPlayers(d.roomId),
            itemsOnSale: data.getItemsOnSale(d.roomId),
            marketValues: data.getMarketValues(d.roomId),
            skillsOnSale: data.getSkillsOnSale(d.roomId),
            auctionCards: data.getAuctionCards(d.roomId),
            placements: data.getPlacements(d.roomId),
            playOrder: data.getPlayOrder(d.roomId),
            actingPlayer: data.getActingPlayer(d.roomId),
            round: data.getRound(d.roomId)
          }
        );
      }
    });
    socket.on('collectorsDrawCard', function(d) {
      io.to(d.roomId).emit('collectorsUpdatePlayers', 
        data.drawCard(d.roomId, d.playerId)
      );
    });
    socket.on('collectorsCardForIncome', function(d) {
      io.to(d.roomId).emit('collectorsUpdatePlayers', 
        data.cardForIncome(d.roomId, d.playerId, d.card)
      );
    });
    socket.on('collectorsNextPlayer', function(d) {
      io.to(d.roomId).emit('collectorsActingPlayer', {
        players: data.getPlayers(d.roomId),
        actingPlayer: data.nextPlayer(d.roomId)
      }
      );
    });
    socket.on('collectorsGainSkill', function(d) {
      data.gainSkill(d.roomId, d.playerId, d.card)
      io.to(d.roomId).emit('collectorsSkillGained', { 
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          skillsOnSale: data.getSkillsOnSale(d.roomId),
          actingPlayer: data.getActingPlayer(d.roomId)
        }
      );
    });
    socket.on('collectorsBuyItem', function(d) {
      data.buyItem(d.roomId, d.playerId, d.card, d.cost)
      io.to(d.roomId).emit('collectorsItemBought', { 
          playerId: d.playerId,
          players: data.getPlayers(d.roomId),
          itemsOnSale: data.getItemsOnSale(d.roomId),
          actingPlayer: data.getActingPlayer(d.roomId)
        }
      );
    });
    socket.on('collectorsPlaceBottle', function(d) {
      let ok = data.placeBottle(d.roomId, d.playerId, d.action, d.id);
      io.to(d.roomId).emit('collectorsBottlePlaced', {
        players: data.getPlayers(d.roomId),
        placements: data.getPlacements(d.roomId),
        playOrder: data.getPlayOrder(d.roomId),
        actingPlayer: data.getActingPlayer(d.roomId),
        ok: ok
      }
      );
    });

    socket.on('collectorsAdjustBottle', function(d) {
      data.placeBottle(d.roomId, d.playerId, d.oldPos, d.newPos);
      io.to(d.roomId).emit('collectorsBottlePlaced', {
        players: data.getPlayers(d.roomId),
      }
      );
    });

    socket.on('collectorsAddMoney', function(d) {
      io.to(d.roomId).emit('collectorsUpdatePlayers', 
        data.addMoney(d.roomId, d.playerId)
      );
    });
}

module.exports = sockets;