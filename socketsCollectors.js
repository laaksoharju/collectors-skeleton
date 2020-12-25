function sockets(io, socket, data)
{
  socket.on('setupCollectors', function (d)
  {
    data.createRoom(d.roomId, d.playerCount, d.lang);
  })
  socket.on('collectorsLoaded', function (d)
  {
    socket.join(d.roomId);
    if (data.joinGame(d.roomId, d.playerId))
    {
      socket.emit('collectorsInitialize', {
        labels: data.getUILabels(d.roomId),
        players: data.getPlayers(d.roomId),
        itemsOnSale: data.getItemsOnSale(d.roomId),
        marketValues: data.getMarketValues(d.roomId),
        skillsOnSale: data.getSkillsOnSale(d.roomId),
        auctionCards: data.getAuctionCards(d.roomId),
        placements: data.getPlacements(d.roomId),
        decKAuction:data.getDeckauctionCard(d.roomId),
       

      }
    );
  }
  });
  socket.on('updatePlayerName', function (d)
  {
    io.to(d.roomId).emit('updatePlayerName',
      data.updatePlayerName(d.roomId, d.playerId, d.playerName)
    );
  });
  socket.on('updatePlayerAuction', function (d)
  {
    // console.log("insockets" + d.auction_amount)
    io.to(d.roomId).emit('updatePlayerName',
      data.updatePlayerAuction(d.roomId, d.playerId, d.auction_amount)
    );
  });
  socket.on('notifyPlayers', function (d)
  {
    io.to(d.roomId).emit('notifyPlayers',
      data.getPlayers(d.roomId)
    );
  });
  socket.on('collectorsDrawCard', function (d)
  {
    io.to(d.roomId).emit('collectorsCardDrawn',
      data.drawCard(d.roomId, d.playerId)
    );
  });
  socket.on('collectorsBuyCard', function (d)
  {
    console.log("this is socket auction"+d.start_auction)

    data.buyCard(d.roomId, d.playerId, d.card, d.cost, d.action,d.start_auction)
    io.to(d.roomId).emit('collectorsCardBought', {
      playerId: d.playerId,
      players: data.getPlayers(d.roomId),
      itemsOnSale: data.getItemsOnSale(d.roomId),
      skillsOnSale: data.getSkillsOnSale(d.roomId),
      auctionCards: data.getAuctionCards(d.roomId),
      deckAuction:data.getDeckauctionCard(d.roomId),
      
     
      
    }
 
    )
   
  });
  socket.on('collectorsPlaceBottle', function (d)
  {
    data.placeBottle(d.roomId, d.playerId, d.action, d.cost);
    io.to(d.roomId).emit('collectorsBottlePlaced', data.getPlacements(d.roomId)
    );
  });

}
module.exports = sockets;
