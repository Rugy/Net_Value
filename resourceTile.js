import { resourceTypes }  from "./resourceTypes.js";
import { player }  from "./player.js";
import { util, notifications, mouse, cooldownSet }  from "./util.js";
import { resourceBoard } from "./resourceBoard.js"
import { showInfo } from "./infoBoard.js";

export class ResourceTile {
  constructor(tile, x, y, xCenter, yCenter) {
    this.tile = tile;
    this.xPos = x;
    this.yPos = y;
    this.xCenter = xCenter;
    this.yCenter = yCenter;
    this.warningLock = 0;
  }

  addResource(type) {
    this.config = resourceTypes[type];
    this.color = this.config.color;
    this.type = this.config.type;
    this.cooldown = 0;
    this.hasResource = true;
    this.mouseLockChance = this.config.mouseLockChance;
    this.mouseLockTime = this.config.mouseLockTime;
    this.miningTimeout = this.config.miningTimeout;
    this.miningCost = this.config.miningCost;
    this.amount = this.config.amount;
  }

  mineResource() {
    if (player.manpower < this.miningCost) {
      showInfo("Not enough Manpower to mine");
      return;
    } else if (this.amount == 0) {
      showInfo("Resourcetile is empty");
      return;
    } else {
      player.manpower -= this.miningCost;
      let div = $("body").append("<div class='notification'></div>");
      $(".notification:last-child").css({
        top: this.yCenter,
        left: this.xCenter + 20
      }).text("-" + this.miningCost + " manpower");
      notifications.push($(".notification:last-child"));
    }

    if (Math.random() < this.mouseLockChance) {
      $("canvas").css("cursor", "not-allowed");
      mouse.mouseLock = this.mouseLockTime;
    } else {
      player[this.type]++;
      this.amount--;
    }

    resourceBoard.updateResourceBoard();

    // Lock Resource
    if (this.amount == 0) {
      this.color = "#323232";
    } else {
      this.color = "grey";
      this.cooldown = this.miningTimeout;
      cooldownSet.add(this);
    }
  }

  showWarning() {
    this.warningLock = 100;
  }
}

export const resourceSize = 16;
export const radius = resourceSize / 2;
export const resourceAmount = 8;
export const quality = ["none", "bronze", "silver", "gold", "ember"];
