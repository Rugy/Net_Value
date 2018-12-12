class Player {
  constructor() {
    this.typeDescriptions = ["material", "manpower"];

    this.material = 0;
    this.manpower = 0;
  }

  addResourceValue(resource) {
    if (resource.typeDesc == this.typeDescriptions[0]) {
      this.material += resource.clickValue;
    } else if (resource.typeDesc == this.typeDescriptions[1]) {
      this.manpower += resource.clickValue;
    }

    resource.miningChance = resource.baseMiningChance;
    resource.currCharges--;
  }
}
