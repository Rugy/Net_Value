export const util = {

}

export const notifications = [];

export const cooldownSet = new Set();

export const mouse = {
  mousePos: {"x": 0, "y": 0},
  clickCount: 0,
  mouseLock: 0,
  mouseInsideTile: false
}

export function getRandomInt(minimum, range) {
  return Math.floor(Math.random() * (range + 1)) + minimum;
}

export function getRandomNumber(minimum, range) {
  return Math.random() * range + minimum;
}

export function createTileText(tile) {
  let text = tile.description;

  if (tile.boni) {
    for (let key in tile.boni) {
      text += "<br /><strong>" + key + " </strong>" + tile.boni[key];
    }
  }

  if (!tile.isScouted) {
    text += "<br />Not scouted";
  } else if (!tile.isOwned) {
    text += "<br />Not owned"
  }

  return text;
}

export function createResourceText(resource) {
  let text = resource.type;
  text = text.charAt(0).toUpperCase() + text.slice(1);

  return text;
}

export function setupSelectionBoard() {
  $(categories.discovery.buttonId).on("click", function() {
    if (categories.selectedCategory == null) {
      $(categories.discovery.buttonId).css("background", "radial-gradient(white -100%, blue");
      $(categories.discovery.menuId).css("display", "flex");
      categories.selectedCategory = categories.discovery;
    } else if (categories.selectedCategory == categories.discovery) {
      $(categories.discovery.buttonId).css("background", "");
      $(categories.discovery.menuId).hide();
      categories.selectedCategory = null;
    } else {
      categories.hideAll();
      $(categories.discovery.buttonId).css("background", "radial-gradient(white -100%, blue");
      $(categories.discovery.menuId).css("display", "flex");
      categories.selectedCategory = categories.discovery;
    }
  });

  $(categories.building.buttonId).on("click", function() {
    if (categories.selectedCategory == null) {
      $(categories.building.buttonId).css("background", "radial-gradient(white -100%, green");
      $(categories.building.menuId).show();
      categories.selectedCategory = categories.building;
    } else if (categories.selectedCategory == categories.building) {
      $(categories.building.buttonId).css("background", "");
      $(categories.building.menuId).hide();
      categories.selectedCategory = null;
    } else {
      categories.hideAll();
      $(categories.building.buttonId).css("background", "radial-gradient(white -100%, green");
      $(categories.building.menuId).show();
      categories.selectedCategory = categories.building;
    }
  });
}

export let categories = {
  selectedCategory: null,
  discovery: {
    buttonId: "#first-category",
    menuId: "#discovery-selection",
    color: "blue"
  },
  building: {
    buttonId: "#second-category",
    menuId: "#building-selection",
    color: "green"
  },

  hideAll: function() {
    $(categories.discovery.menuId).hide();
    $(categories.discovery.buttonId).css("background", "");
    $(categories.building.menuId).hide();
    $(categories.building.buttonId).css("background", "");
    this.selectedCategory = null;
  }
}
