import { createFirstTile } from "./tile.js";
import { resourceBoard } from "./resourceBoard.js";
import { player } from "./player.js";
import { render } from "./render.js";

export class Day {
  constructor(number) {
    this.number = number;
    this.dayStarting = true;
    $("#blackout").show();
    days.push(this);
  }
}

export function restartDay() {
  render.canvas.fillStyle = "white";
  render.canvas.fillRect(0, 0, $("#canvas").width(), $("#canvas").height());
  createFirstTile();
  if (player.manpower < 10) {
    player.manpower = 10;
  }
  resourceBoard.updateResourceBoard();
  let day = new Day(currentDay.number + 1);
  setCurrentDay(day);
}

export let currentDay = {

}

export function setCurrentDay(newDate) {
  currentDay = newDate;
}

export const days = [];
