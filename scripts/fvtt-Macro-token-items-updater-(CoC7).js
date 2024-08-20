//
// Token items updater (CoC7) v0.5
// By Viriato139ac, based on the code created for RQG by wake
//

const macroName = "Token items updater";
const macroVersion = "0.5";
const macroImage = "icons/sundries/books/book-worn-blue.webp";

updateTokenItems();

async function updateTokenItems() {

  if (canvas.tokens.controlled.length === 0) {
    ui.notifications.error(`No token selected`);
    return;
  }

  let select = canvas.tokens.controlled;
  let selected = select[0].actor;

  const worldLanguage = game.settings.get("core", "language");
  const updatesDocuments = [];
  let updatedDocument;
  let betterDocument;

  // Skills
  const skills = selected.items.filter(i => i.type === "skill");
  for (const skill of skills) {
    betterDocument = await game.system.api.cocid.fromCoCID(skill.flags?.CoC7?.cocidFlag?.id, worldLanguage);
    if (betterDocument[0]) {
      updatedDocument = {
        _id: skill.id,
        name: betterDocument[0].name,
        system: {
          skillName: betterDocument[0].system.skillName,
          specialization: betterDocument[0].system.specialization,
          description: {
            value: betterDocument[0].system.description.value,
            opposingDifficulty: betterDocument[0].system.description.opposingDifficulty,
            pushedFaillureConsequences: betterDocument[0].system.description.pushedFaillureConsequences,
            chat: betterDocument[0].system.description.chat,
            keeper: betterDocument[0].system.description.keeper
          }
        }
      }
      //console.log(updatedDocument);
      updatesDocuments.push(updatedDocument);
    }
  }

  // Occupation
  const occupations = selected.items.filter(i => i.type === "occupation");
  for (const occupation of occupations) {
    betterDocument = await game.system.api.cocid.fromCoCID(occupation.flags?.CoC7?.cocidFlag?.id, worldLanguage);
    if (betterDocument[0]) {
      updatedDocument = {
        _id: occupation.id,
        name: betterDocument[0].name
      }
      //console.log(updatedDocument);
      updatesDocuments.push(updatedDocument);
    }
  }

  // Weapons
  const weapons = selected.items.filter(i => i.type === "weapon");
  for (const weapon of weapons) {
    betterDocument = await game.system.api.cocid.fromCoCID(weapon.flags?.CoC7?.cocidFlag?.id, worldLanguage);
    if (betterDocument[0]) {
      updatedDocument = {
        _id: weapon.id,
        name: betterDocument[0].name
      }
      //console.log(updatedDocument);
      updatesDocuments.push(updatedDocument);
    }
  }

  await selected.updateEmbeddedDocuments("Item", updatesDocuments);
  ui.notifications.info(`Updated ${updatesDocuments.length} item names from ` + selected.name + ' (id: ' + selected.id + ')');

  //console.log("updates", updatesDocuments);
}
