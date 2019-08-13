import { player } from "./player.js";
import { discover } from "./discovery.js";

export function setupProgress() {
  player.manpower = 1000;
  player.material = 1000;
  player.information = 1000;

  while(discover()) {

  }
}
