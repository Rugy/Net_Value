import { render } from "./render.js";
import { ResourceTile, resourceSize,  } from "./resourceTile.js";
import { showInfo } from "./infoBoard.js";

export class Building {
  constructor(type, x, y, tile, coveredResourceTiles, usedResoures) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.tile = tile;
    this.coveredResourceTiles = coveredResourceTiles;
    this.currentCooldown = 0;
    this.usedResoures = usedResoures;
  }
}

export const buildings = {
  buildingTemplates: [],
  buildingSelected: false,
  buildingShadow: {}
}

export function importImages() {
  images.houseImage = new Image();
  images.houseImage.src = "./img/house.png";
  buildings.buildingTemplates.push(images.houseImage);
  buildingTypes.house.image = images.houseImage;
}

export const images = {
  houseImage: {}
}

export const buildingTypes = {
  house: {
    description: "Simple house",
    image: {},
    spread: [
      {top: 0, left: 0},
      {top: 0, left: 1},
      {top: 1, left: 0},
      {top: 1, left: 1},
    ],
    miningCooldown: 200
  }
}

export function buildInsideTile(x, y) {
  let tile = render.getTile(x + 1, y + 1);
  let bottomRightTile = render.getTile(x + resourceSize + 1, y + resourceSize + 1);

  if (!tile || !tile.isOwned) {
    return false;
  }

  if (!bottomRightTile || !bottomRightTile.isOwned) {
    return false;
  }

  return true;
}

export function constructBuilding(x, y) {
  let pos = getBuildingCoords(x, y);

  let tile = render.getTile(x, y);
  let coveredResourceTiles = [];
  coveredResourceTiles.push(render.getResourceTile(tile, pos.x, pos.y));
  coveredResourceTiles.push(render.getResourceTile(tile, pos.x + resourceSize + 1, pos.y));
  coveredResourceTiles.push(render.getResourceTile(tile, pos.x, pos.y + resourceSize + 1));
  coveredResourceTiles.push(render.getResourceTile(tile, pos.x + resourceSize + 1, pos.y + resourceSize + 1));

  let usedResources = [];
  coveredResourceTiles.forEach(resourceTile => {
    resourceTile.hasBuilding = true;
    if (resourceTile.hasResource) {
      usedResources.push(resourceTile);
    }
  });

  if (usedResources.length == 0) {
    coveredResourceTiles.forEach(resourceTile => {
      if (resourceTile.warningLock == 0) {
        render.resourceTileWarnings.add(resourceTile);
      }
      resourceTile.showWarning();
    });
    showInfo("The Building must cover at least one Resource");
    return;
  }

  let building = new Building(buildingTypes.house, pos.x, pos.y, tile, coveredResourceTiles, usedResources);

  if (buildInsideTile(pos.x, pos.y)) {
    render.buildings.push(building);
  }
}

export function getBuildingCoords(x, y) {
  let pos = {};
  x -= resourceSize / 2;
  y -= resourceSize / 2;
  pos.x = (x - render.offsetX) - ((x - render.offsetX) % resourceSize) + render.offsetX;
  pos.y = (y - render.offsetY) - ((y - render.offsetY) % resourceSize) + render.offsetY;
  return pos;
}
