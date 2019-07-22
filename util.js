export const util = {

}

export let selectedCategory = {};

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

export function setupBuildingPane() {
  $("#first-category").on("click", function() {
    if (checkCategorySelection(this)) {
      $(this).css("background", "radial-gradient(white -100%, red");
      selectedCategory = this;
      expandBuildSelection("red");
    }
  });

  $("#second-category").on("click", function() {
    if (checkCategorySelection(this)) {
      $(this).css("background", "radial-gradient(white -100%, blue");
      selectedCategory = this;
      expandBuildSelection("blue");
    }
  });

  $("#third-category").on("click", function() {
    if (checkCategorySelection(this)) {
      $(this).css("background", "radial-gradient(white -100%, green");
      selectedCategory = this;
      expandBuildSelection("green");
    }
  });

  $("#fourth-category").on("click", function() {
    if (checkCategorySelection(this)) {
      $(this).css("background", "radial-gradient(white -100%, yellow");
      selectedCategory = this;
      expandBuildSelection("yellow");
    }
  });
}

export function expandBuildSelection(color) {
  $("#building-selection").css({
    "background": function() {
      return color;
    },
  }).show(250);
}

export function checkCategorySelection(category) {
  if (selectedCategory != null) {
    $(selectedCategory).css("background", "");
  }
  if (selectedCategory == category) {
    $(selectedCategory).css("background", "");
    selectedCategory = null;
    $("#building-selection").hide(250);
    return false;
  }
  return true;
}
