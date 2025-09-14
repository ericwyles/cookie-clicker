const MULTIPLIER_THRESHOLD_2 = 300;
const CLICKER_THRESHOLD_2 = 300;
const MAGIC_TARGET = 115;
const TOWER_TARGET = 731;
const TOWER_LOW_TARGET = 31;

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

function isClickFrenzyActive() {
    for (const buffName in Game.buffs) {
        if (Game.buffs[buffName].name === "Click frenzy") {
            return true;
        }
    }
    return false;
}

function isFrenzyActive() {
    for (const buffName in Game.buffs) {
        if (Game.buffs[buffName].name === "Frenzy") {
            return true;
        }
    }
    return false;
}

var sell_cast = setInterval(async function() {
    const tower = Game.ObjectsById[7];
    const M = tower.minigame;

    const buffActive = (Game.cookiesPs / Game.unbuffedCps > MULTIPLIER_THRESHOLD_2) || (isClickFrenzyActive() && isFrenzyActive());

    let cpsMult=Game.cookiesPs / Game.unbuffedCps

    if (buffActive) {
      console.log("Buff is active: ", cpsMult)
      if (M.magic >= MAGIC_TARGET) {
        console.log("Starting cast descent.");

        M.castSpell(M.spellsById[1]);

        console.log("Spell cast - remaining magic:", M.magic);
        await delay(1000)
        let newCpsMult = Game.cookiesPs / Game.unbuffedCps
        console.log("Cps Change was ", cpsMult, "=>", newCpsMult);

        if (newCpsMult < cpsMult + 5) {
            console.log("cps did not increase.");
        }


        while (tower.amount > TOWER_LOW_TARGET) {
            tower.sell(1);

            const towers = Math.max(tower.amount, 1);
            const lvl = Math.max(tower.level, 1);
            M.magicM = Math.floor(4 + Math.pow(towers, 0.6) + Math.log((towers + (lvl - 1) * 10) / 15 + 1) * 15);
        }

        M.castSpell(M.spellsById[1]);

        console.log("Spell cast - remaining magic:", M.magic);

        // Restore towers after descent
        while (tower.amount < TOWER_TARGET) {
            tower.buy(1);
        }
      }
    }
}, 1000);