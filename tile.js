import { getRandomInt, getRandomNumber } from "./util.js";
import { render } from "./render.js"
import { quality, resourceSize } from "./resourceTile.js"

export class Tile {
  constructor(description, x, y, unlockScout, unlockBuy, quality, isScouted, isOwned, boni, resourceCount) {
    this.description = description;
    this.active = true;
    this.x = x;
    this.y = y;
    this.unlockScout = unlockScout;
    this.unlockBuy = unlockBuy;
    this.quality = quality;
    this.isScouted = isScouted;
    this.isOwned = isOwned;
    this.boni = boni;
    this.resourceCount = 2;
    this.resourceTiles = [];
    this.freeResTiles = [];
    this.usedResTiles = [];

    if (boni && boni.resourceCount) {
      this.resourceCount += boni.resourceCount;
    }
  }

  createTileResources(amount, minAppearances, probability) {
    for (let i = 0; i < amount; i++) {
      let typeIndex = 0;
      let length = minAppearances.length;

      if (length != 0) {
        if (minAppearances[length - 1] != 0) {
          typeIndex = length - 1;
          minAppearances[length - 1]--;
        } else {
          i--;
          minAppearances.pop();
          continue;
        }
      } else {
        typeIndex = weightedRandom(probability);
      }

      let resIndex = getRandomInt(0, this.freeResTiles.length - 1);
      let resource = this.freeResTiles[resIndex];
      resource.addResource(typeIndex);

      this.usedResTiles.push(resource);
      this.freeResTiles.splice(resIndex, 1);
    }
  }
}

export function createFirstTile() {
  render.tiles = [];
  render.tileGrid = [];

  let crit = getRandomNumber(0.2, 0.3).toPrecision(2);
  let tileBonus = new TileBonus(2, crit);
  let xInit = ($("#canvas").width() / 2 - tileSize / 2).toPrecision(3);
  xInit -= 0;
  let yInit = ($("#canvas").height() / 2 - tileSize / 2).toPrecision(3);
  yInit -= 0;
  startingTile = new Tile("Tile 1", xInit, yInit, {"manpower": 5}, {"manpower": 20}, quality[3], true, true, tileBonus);
  render.offsetX = xInit % resourceSize;
  render.offsetY = yInit % resourceSize;

  render.tiles.push(startingTile);
  render.tileGrid.push([startingTile]);
  render.initTileGrid(startingTile);
  startingTile.createTileResources(4, [0, 3, 1], [0.9, 0.1]);
}

export class TileBonus {
  constructor(resourceCount, crit) {
    this.resourceCount = resourceCount;
    this.crit = crit;
  }
}

export const tileSize = 128;

export let startingTile = {};
