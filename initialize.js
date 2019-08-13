import { player }  from "./player.js";
import { Building, buildings, importImages, images, getBuildingCoords, buildInsideTile,
  constructBuilding, buildingTypes } from "./buildings.js"
import { render }  from "./render.js";
import { Tile, TileBonus, tileSize, createFirstTile } from "./tile.js";
import { radius, quality, resourceSize } from "./resourceTile.js";
import { Day, restartDay, setCurrentDay } from "./day.js";
import { mouse, getRandomInt, getRandomNumber, createTileText, createResourceText,
  setupSelectionBoard } from "./util.js";
import { showInfo } from "./infoBoard.js";
import { discoveryStatus, discover, discoverySequence, discoveryCount } from "./discovery.js";
import { setupProgress } from "./testing.js";

export function initialize() {
  let debug = true;

  let day = new Day(1);
  setCurrentDay(day);

  $("div").on("contextmenu", function() {
    return false;
  });

  $("#canvas").attr("width", ($(window).width()));
  $("#canvas").attr("height", ($(window).height()));

  $("#console-player").on("click", function() {
    console.log(player);
  })

  $("#console-tiles").on("click", function() {
    console.log(render.tiles);
  })

  $("#console-buildings").on("click", function() {
    console.log(render.resource);
  })

  importImages();

  $("#canvas").on("click", function(event) {
    let clickedTile = render.getTile(event.pageX, event.pageY);
    let clickedResourceTile;
    if (clickedTile) {
      clickedResourceTile = render.getResourceTile(clickedTile, event.pageX, event.pageY);
    }
    if (clickedResourceTile && clickedResourceTile.hasResource && clickedTile.isOwned && clickedResourceTile.cooldown == 0 && mouse.mouseLock == 0) {
      clickedResourceTile.mineResource();
    } else {
      $("#colorDiv").text("Empty");
    }
    if (buildings.buyMenuOpen) {
      $("#buyMenu").css("display", "none");
      buildings.buyMenuOpen = false;
    }
    if (buildings.buildingSelected) {
      constructBuilding(event.pageX, event.pageY);
    }
  }).on("contextmenu", function(event) {
    if (buildings.buyMenuOpen) {
      $("#buyMenu").css("display", "none");
      buildings.buyMenuOpen = false;
    } else {
      let tile = render.getTile(event.pageX, event.pageY);
      render.selectedTile = tile;
      if (tile && !tile.isOwned) {
        $("#buyMenu").css("display", "inline").css("left", event.pageX).css("top", event.pageY);
        $("#buyMenu table").empty();
        if (!tile.isScouted) {
          $("#buyMenu table").append("<tr id='buyScout'><td>Scout</td><td>" + tile.unlockScout.manpower + "</td></tr>");
          addScoutBuy();
        } else if (!tile.isOwned) {
          $("#buyMenu table").append("<tr id='buyTile'><td>Buy</td><td>" + tile.unlockBuy.manpower + "</td></tr>");
          addTileBuy();
        }
        $("#tipScout").text(tile.unlockScout.manpower);
      }
      buildings.buyMenuOpen = true;
    }
    return false;
  }).on("mousemove", function(event) {
    mouse.mousePos.x = event.pageX;
    mouse.mousePos.y = event.pageY;

    let hoveredTile = render.getTile(event.pageX, event.pageY);
    let hoveredResourceTile;
    if (hoveredTile) {
      mouse.mouseInsideTile = true;
      hoveredResourceTile = render.getResourceTile(hoveredTile, event.pageX, event.pageY);
    } else {
      mouse.mouseInsideTile = false;
    }
    if (hoveredResourceTile && hoveredResourceTile.hasResource) {
      let text = createResourceText(hoveredResourceTile);
      $("#tooltip").html(text);
    } else if (hoveredTile) {
      let text = createTileText(hoveredTile);
      $("#tooltip").html(text);
    }

    if (buildings.buildingSelected) {
      let pos = getBuildingCoords(mouse.mousePos.x, mouse.mousePos.y);
      if (buildInsideTile(pos.x, pos.y)) {
        buildings.buildingShadow.x = pos.x;
        buildings.buildingShadow.y = pos.y;
      }
    }
  });

  $("#buyMenu").on("contextmenu", function(event) {
    $("#buyMenu").css("display", "none");
    buildings.buyMenuOpen = false;
  });

  $("#build-house-selection").on("click", function() {
    buildings.buildingSelected = !buildings.buildingSelected;
    if (buildings.buildingSelected) {
      buildings.buildingShadow = new Building(buildingTypes.house, $(window).width() / 2, $(window).height() / 2);
    } else {
      buildings.buildingShadow = null;
    }
  })

  $("#end-day-button").on("click", function() {
    restartDay();
  })

  $("#discovery-selection").on("click", function() {
    discover();
  })



  setupSelectionBoard();

  render.canvas = $("#canvas")[0].getContext("2d");;

  createFirstTile();

  setTimeout(function() {
    $("#first-category").show();
  }, 10000);

  if (debug) {
    setupProgress();
  }
}

function addScoutBuy() {
  $("#buyScout").on("click", function(event) {
    $("#buyMenu").css("display", "none");
    buyMenuOpen = false;
    if (player.manpower >= render.selectedTile.unlockScout.manpower && !render.selectedTile.isScouted) {
      expandTile(render.selectedTile);
      player.manpower -= render.selectedTile.unlockScout.manpower;
      scoutTile(render.selectedTile);
      showInfo("Scouted tile " + render.selectedTile.description);
    } else {
      showInfo("You need " + render.selectedTile.unlockScout.manpower + " manpower");
    }
  });
}

function addTileBuy() {
  $("#buyTile").on("click", function(event) {
    $("#buyMenu").css("display", "none");
    buyMenuOpen = false;
    if (player.manpower >= render.selectedTile.unlockBuy.manpower && !render.selectedTile.isOwned) {
      player.manpower -= render.selectedTile.unlockBuy.manpower;
      buyTile(render.selectedTile);
      showInfo("Bought tile " + render.selectedTile.description);
    } else {
      showInfo("You need " + render.selectedTile.unlockBuy.manpower + " manpower");
    }
  });
}
