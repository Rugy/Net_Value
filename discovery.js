import { player } from "./player.js";
import { resourceBoard } from "./resourceBoard.js";
import { showInfo } from "./infoBoard.js";

export const discoveryStatus = {
  endDay: false,
  infoBoard: false,
  resourceBoardManpower: false,
  resourceBoardMaterial: false,
  resourceBoardInformation: false,
  tooltip: false,
  notification: false,
  buildingsBoard: false,
  tileExpansion: false,
}

export function discover() {
  if (discoverySequence[discoveryCount] == null) {
    return false;
  }
  if (discoverySequence[discoveryCount].cost > player.information) {
    showInfo("Not enough Information");
    return false;
  } else {
    player.information -= discoverySequence[discoveryCount].cost;
    resourceBoard.updateResourceBoard();
    showInfo("Discovered " + discoverySequence[discoveryCount].description.substring(9));
  }

  discoveryStatus[discoverySequence[discoveryCount].statusDesc] = true;
  discoverySequence[discoveryCount].discoverThis();
  discoveryCount++;
  if (discoverySequence[discoveryCount] != null) {
    $("#discovery-option-1").text(discoverySequence[discoveryCount].description);
  } else {
    $("#discovery-option-1").hide();
  }

  return true;
}

export const discoverySequence = [
  {
    statusDesc: "endDay",
    itemId: "end-day-button",
    description: "Discover Ending Day",
    cost: 0,
    discoverThis: function() {
      $("#end-day-button").show();
    }
  },
  {
    statusDesc: "infoBoard",
    itemId: "info-board",
    description: "Discover Information Board",
    cost: 1,
    discoverThis: function() {
      $("#info-board").show();
    }
  },
  {
    statusDesc: "resourceBoardManpower",
    itemId: "end-day-button",
    description: "Discover Show Manpower Resource",
    cost: 1,
    discoverThis: function() {
      $(".resourceBoard").show();
      $("#resourceTable").append("<tr><td>Manpower</td><td id='table-manpower-value'>" + player.manpower + "</td></tr>")
    }
  },
  {
    statusDesc: "resourceBoardMaterial",
    itemId: "end-day-button",
    description: "Discover Show Material Resource",
    cost: 1,
    discoverThis: function() {
      $("#resourceTable").append("<tr><td>Material</td><td id='table-material-value'>" + player.material + "</td></tr>")
    }
  },
  {
    statusDesc: "resourceBoardInformation",
    itemId: "end-day-button",
    description: "Discover Show Information Resource",
    cost: 1,
    discoverThis: function() {
      $("#resourceTable").append("<tr><td>Information</td><td id='table-information-value'>" + player.information + "</td></tr>")
    }
  },
  {
    statusDesc: "tooltip",
    itemId: "tooltip",
    description: "Discover Tooltip",
    cost: 2,
    discoverThis: function() {
      $("#tooltip").show();
    }
  },
  {
    statusDesc: "notification",
    itemId: "notification",
    description: "Discover Notifications",
    cost: 2,
    discoverThis: function() {
      $('<style>.notification { display: inline; }</style>').appendTo('head');
    }
  },
  {
    statusDesc: "buildingsBoard",
    itemId: "second-category",
    description: "Discover Building Selection",
    cost: 2,
    discoverThis: function() {
      $("#second-category").show();
    }
  }
]

export let discoveryCount = 0;
