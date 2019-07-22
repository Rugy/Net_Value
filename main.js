import { resourceTypes }  from "./resourceTypes.js";
import { util, notifications, mouse, cooldownSet }  from "./util.js";
import { render }  from "./render.js";
import { initialize }  from "./initialize.js";
import { player }  from "./player.js";
import { Tile } from "./tile.js";
import { ResourceTile } from "./resourceTile.js";
import { resourceBoard } from "./resourceBoard.js";
import { buildings } from "./buildings.js";
import { currentDay } from "./day.js";
import { showInfo, infoBoardOpacity, setInfoBoardOpacity } from "./infoBoard.js";

$(document).ready(function() {
  var frame = 0;
  var gameLoopId;

  var startingTile;
  var tilesUnlock = 30;
  var expanded = false;

  function update() {
    // $("#frameCounter").text(frame);
    frame++;

    cooldownSet.forEach(function(resource) {
      resource.cooldown--;
      if (resource.cooldown == 0) {
        resource.color = resource.config.color;
        cooldownSet.delete(resource);
      }
    });

    if (mouse.mouseLock > 0) {
      if (--mouse.mouseLock == 0) {
        $("canvas").css("cursor", "default");
      }
    }

    // Rendering
    render.draw();

    if(buildings.buildingSelected && mouse.mouseInsideTile && buildings.buildingShadow) {
      render.canvas.drawImage(buildings.buildingShadow.type, buildings.buildingShadow.x, buildings.buildingShadow.y);
    }

    if (frame % 5 == 0) {
      notifications.forEach(div => {
        $(div).css({
          top: "+=1px",
          opacity: "-=0.05"
        });
        if ($(div).css("opacity") < 0.3) {
          notifications.shift();
          $(div).remove();
        }
      })

      if (infoBoardOpacity > 0) {
        setInfoBoardOpacity(infoBoardOpacity - 0.05);
        if (infoBoardOpacity < 0.2) {
          setInfoBoardOpacity(0);
        }
        $("#info-board").css("opacity", infoBoardOpacity);
      }
    }

    if (currentDay.dayStarting) {
      $("#blackout").css("opacity", "-=0.01");
      if ($("#blackout").css("opacity") == 0) {
        currentDay.dayStarting = false;
        $("#blackout").hide();
        $("#blackout").css("opacity", "100");
      }
    }
  }

  function buyTile(tile) {
    render.canvas.fillStyle = "lightgreen";
    render.canvas.fillRect(tile.x, tile.y - 1, tileSize, tileSize + 2);
    tile.isOwned = true;
  }

  function scoutTile(tile) {
    render.canvas.fillStyle = "grey";
    render.canvas.fillRect(tile.x, tile.y - 1, tileSize, tileSize + 2);
    tile.isScouted = true;
  }

  function expandTile(tile) {
    let xFactor = 0;
    let yFactor = 0;
    let newEntry = false;

    for (let i = 0; i < 4; i++) {
      if (!tile.adjacentN) {
        xFactor = 0;
        yFactor = -1;
        newEntry = true;
      }
      if (!tile.adjacentE) {
        xFactor = 1;
        yFactor = 0;
        newEntry = true;
      }
      if (!tile.adjacentS) {
        xFactor = 0;
        yFactor = 1;
        newEntry = true;
      }
      if (!tile.adjacentW) {
        xFactor = -1;
        yFactor = 0;
        newEntry = true;
      }
      if (!newEntry) {
        break;
      }

      let newTile = new Tile("Tile " + (tiles.length + 1), tile.x + tileSize * xFactor, tile.y + tileSize * yFactor, {"manpower": tile.unlockScout.manpower + 3}, {"manpower": tile.unlockBuy.manpower + 10}, false, false);
      newTile.resourceTiles = [];

      linkDirections(newTile);
      tiles.push(newTile);

      addTileToGrid(tile, newTile);

      initTileGrid(newTile);
      createTileResources(newTile, 2, [1], [0.6, 0.3, 0.1]);

      render.canvas.fillStyle = "grey";
      render.canvas.fillRect(newTile.x, newTile.y, tileSize, tileSize);
      newEntry = false;
    }
  }

  function addTileToGrid(tile, newTile) {
    let pos = getTileGridPosition(tile);
    let xPos;

    if (newTile.y > tile.y) {
      if (tileGrid[pos.y + 1]) {
        xPos = findXGridPos(newTile, pos.y + 1);
        tileGrid[pos.y + 1].splice(xPos, 0, newTile);
      } else {
        tileGrid.push([newTile]);
      }
    } else if (newTile.y < tile.y) {
      if (tileGrid[pos.y - 1]) {
        xPos = findXGridPos(newTile, pos.y - 1);
        tileGrid[pos.y - 1].splice(xPos, 0, newTile);
      } else {
        tileGrid.unshift([newTile]);
      }
    } else if (newTile.y == newTile.y) {
      xPos = findXGridPos(newTile, pos.y);
      tileGrid[pos.y].splice(xPos, 0, newTile);
    }
  }

  function findXGridPos(tile, y) {
    let inserted = false;
    let pos = 0;

    while(!inserted && pos < tileGrid[y].length) {
      if (tileGrid[y][pos] && tile.x < tileGrid[y][pos].x) {
        inserted = true;
      } else {
        pos++;
      }
    }

    return pos;
  }

  function getTileGridPosition(tile) {
    for (let i = 0; i < tileGrid.length; i++) {
      for (let j = 0; j < tileGrid[i].length; j++) {
        if (tileGrid[i][j] == tile) {
          return {"x": j, "y": i};
        }
      }
    }
  }

  function linkDirections(tile) {
    let neighbourTile = getTile(tile.x - 10, tile.y + 10);
    if (neighbourTile) {
      tile.adjacentW = neighbourTile;
      neighbourTile.adjacentE = tile;
    }
    neighbourTile = getTile(tile.x + 210, tile.y + 10);
    if (neighbourTile) {
      tile.adjacentE = neighbourTile;
      neighbourTile.adjacentW = tile;
    }
    neighbourTile = getTile(tile.x + 10, tile.y - 10);
    if (neighbourTile) {
      tile.adjacentN = neighbourTile;
      neighbourTile.adjacentS = tile;
    }
    neighbourTile = getTile(tile.x + 10, tile.y + 210);
    if (neighbourTile) {
      tile.adjacentS = neighbourTile;
      neighbourTile.adjacentN = tile;
    }
  }

  function weightedRandom(weights) {
    if (!weights || weights.length < 1) {
      return;
    }

    var number = Math.random();
    var segmentSum = weights[0];
    var weightSegment = 0;

    for (var i = 1; i < weights.length; i++){
      if (number > segmentSum) {
        segmentSum += weights[i];
        weightSegment++;
      } else {
        break;
      }
    }

    return weightSegment;
  }

  initialize();
  gameLoopId = setInterval(update, 20);

});
