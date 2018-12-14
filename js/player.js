class Player {
  constructor(resources) {
    this.typeDescriptions = ["Material", "Manpower", "Machinepower"];

    if (resources) {
      this.material = resources[0];
      this.manpower = resources[1];
      this.machinepower = resources[2];
    } else {
      this.material = 0;
      this.manpower = 0;
      this.machinepower = 0;
    }
  }

  addResourceValue(resource) {
    if (resource.typeDesc == this.typeDescriptions[0]) {
      this.material += resource.clickValue;
    } else if (resource.typeDesc == this.typeDescriptions[1]) {
      this.manpower += resource.clickValue;
    } else if (resource.typeDesc == this.typeDescriptions[2]) {
      this.machinepower += resource.clickValue;
    }

    resource.miningChance = resource.baseMiningChance;
    resource.currCharges--;
    resource.currTimeout += resource.miningTimeout;
  }
}
