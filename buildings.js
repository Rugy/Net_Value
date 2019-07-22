import { resourceSize } from "./resourceTile.js";
import { render } from "./render.js";

export class Building {
  constructor(type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
  }
}

export const buildings = {
  buildingTemplates: [],
  buildingSelected: false,
  selectedCategory: {},
  buildingShadow: {}
}

export const images = {
  houseImage: {}
}

export function importImages() {
  images.houseImage = new Image();
  images.houseImage.src = "./img/house.png";
  buildings.buildingTemplates.push(images.houseImage);
}

export function buildInsideTile(x, y) {
  let tile = render.getTile(x + 1, y + 1);
  let bottomRightTile = render.getTile(x + 17, y + 17);

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
  if (buildInsideTile(pos.x, pos.y)) {
    render.buildings.push(new Building(images.houseImage, pos.x, pos.y));
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
