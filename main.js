var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            //console.log('Clearing non-existing creep memory:', name);
        }
    }

    var tower = Game.getObjectById('7ecedee99a81c25f9083bb8d');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    var roomEnergy = Game.room.energyAvailable;
    if (Game.room.energyCapacityAvailable == roomEnergy) {

      var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
      var upgraders = _.filter(Game.creeps, (creep) => creep.memory.role == 'upgrader');
      var builders = _.filter(Game.creeps, (creep) => creep.memory.role == 'builder');
      //console.log('Harvesters: ' + harvesters.length);

      var bodyParts = [];
      var bodyRatio = Math.floor(roomEnergy/50);
      for (i = 0; i < bodyRatio; i++) {
          bodyParts.push(WORK);
          bodyParts.push(CARRY);
          bodyParts.push(MOVE);
          bodyParts.push(MOVE);
      }

      if(harvesters.length < 2) {
          var newName = 'Harvester' + Game.time;
          console.log('Spawning new harvester: ' + newName);
          Game.spawns['Spawn1'].spawnCreep(bodyParts, newName,
              {memory: {role: 'harvester'}});
      }

      else if(upgraders.length < 2) {
          var newName = 'Upgrader' + Game.time;
          console.log('Spawning new upgrader: ' + newName);
          Game.spawns['Spawn1'].spawnCreep(bodyParts, newName,
              {memory: {role: 'upgrader'}});
      }

      else if(builders.length < 4) {
          var newName = 'Builder' + Game.time;
          console.log('Spawning new builder: ' + newName);
          Game.spawns['Spawn1'].spawnCreep(bodyParts, newName,
              {memory: {role: 'builder'}});
      }

      /*
      if(Game.spawns['Spawn1'].spawning) {
          var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
          Game.spawns['Spawn1'].room.visual.text(
              '🛠️' + spawningCreep.memory.role,
              Game.spawns['Spawn1'].pos.x + 1,
              Game.spawns['Spawn1'].pos.y,
              {align: 'left', opacity: 0.8});
      }
      */

    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
