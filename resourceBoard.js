import { resourceTypes }  from "./resourceTypes.js";
import { player }  from "./player.js";

export const resourceBoard = {
  updateResourceBoard: function() {
    for (let i = 0; i < resourceTypes.length; i++) {
      $("#table-" + resourceTypes[i].type + "-value").text(player[resourceTypes[i].type]);
    }
  }
}
