import { discoveryCount } from "./discovery.js";

export function showInfo(text) {
  if (discoveryCount < 2) {
    return;
  }
  $("#info-board").css("display", "inline").text(text);
  infoBoardOpacity = 1;
}

export let infoBoardOpacity = 0;

export function setInfoBoardOpacity(value) {
  infoBoardOpacity = value;
}
