import { ResourceTile, radius, quality, resourceSize, resourceAmount } from "./resourceTile.js";

export const render = {
  canvas: {},
  tiles: [],
  tileGrdid: [],
  tileSize: 128,
  resourceSize: 8,
  buildings: [],
  resourceTileWarnings: new Set(),

  selectedTile: {},

  offsetX: 0,
  offsetY: 0,

  drawTiles: function() {
    for (let i = 0; i < this.tiles.length; i++) {
      let color = this.tiles[i].isOwned ? "lightgreen" : "grey";
      this.canvas.fillStyle = color;
      this.canvas.fillRect(this.tiles[i].x, this.tiles[i].y, this.tileSize, this.tileSize);
    }
  },

  drawResourceTileWarnings: function() {
    this.resourceTileWarnings.forEach(resource => {
      if (resource.warningLock > 0) {
        this.canvas.fillStyle = "red";
        this.canvas.globalAlpha = resource.warningLock / 100;
        this.canvas.fillRect(resource.xCenter - resourceSize / 2, resource.yCenter - resourceSize / 2, resourceSize, resourceSize);
        resource.warningLock--;
        this.canvas.globalAlpha = 1;
      } else {
        this.resourceTileWarnings.delete(resource);
      }
    });
  },

  drawResources: function(tile) {
    for (let i = 0; i < tile.usedResTiles.length; i++) {
      let resource = tile.usedResTiles[i];
      this.drawCircle(resource.xCenter, resource.yCenter, radius, resource.color);
    }
  },

  drawCircle: function(x, y, radius, color) {
    this.canvas.beginPath();
    this.canvas.ellipse(x, y, radius - 1, radius - 1, 0, 0, Math.PI * 2);
    this.canvas.fillStyle = color;
    this.canvas.fill();
  },

  drawBuildings: function() {
    for (let i = 0; i < this.buildings.length; i++) {
      this.canvas.drawImage(this.buildings[i].type.image, this.buildings[i].x, this.buildings[i].y);
    }
  },

  draw: function() {
    this.drawTiles();
    this.drawResourceTileWarnings();
    for (let i = 0; i < this.tiles.length; i++) {
      if (this.tiles[i].isScouted) {
        this.drawResources(this.tiles[i]);
      }
    }
    this.drawBuildings();
  },

  initTileGrid: function(tile) {
    tile.resourceTiles = [];

    for (let i = 0; i < resourceAmount; i++) {
      tile.resourceTiles.push([]);

      for (let j = 0; j < resourceAmount; j++) {
        let resourceTile = new ResourceTile(tile, i, j, tile.x + i * resourceSize + radius, tile.y + j * resourceSize + radius);
        tile.resourceTiles[i].push(resourceTile);
      }
    }

    tile.freeResTiles = [].concat.apply([], tile.resourceTiles);
    tile.usedResTiles = [];
  },

  getTile: function(x, y) {
    let yPos = -1;
    let xPos = -1;

    for (let i = 0; i < this.tileGrid.length; i++) {
      let tile = this.tileGrid[i][0];
      if (this.tileGrid[i][0].y < y && this.tileGrid[i][0].y + 128 > y) {
        yPos = i;
        break;
      }
    }

    if (yPos == -1) {
      return null;
    }

    for (let i = 0; i < this.tileGrid[yPos].length; i++) {
      if (this.tileGrid[yPos][i].x < x && this.tileGrid[yPos][i].x + 128 > x) {
        xPos = i;
        break;
      }
    }

    if (xPos >= 0) {
      return this.tileGrid[yPos][xPos];
    }
  },

  getResourceTile: function(tile, x, y) {
    let xOrd = Math.floor((x - tile.x) / resourceSize);
    let yOrd = Math.floor((y - tile.y) / resourceSize);

    return tile.resourceTiles[xOrd][yOrd];
  }

}
