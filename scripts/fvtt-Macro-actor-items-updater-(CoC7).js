//
// Actor items updater (CoC7) v0.8
// By Viriato139ac, based on the code created for RQG by wake
//

const macroName = "Actor items updater";
const macroVersion = "0.9";
const macroImage = "icons/sundries/books/book-face-blue.webp";

for (let a of Array.from(game.actors)) {
  updateActorItems(a)
}
ui.notifications.info('Finished updating');

async function updateActorItems(myactor) {

  const worldLanguage = game.settings.get("core", "language");
  const updatesDocuments = [];
  let updatedDocument;
  let updatedData;
  let betterDocument;

  // Skills
  const skills = myactor.items.filter(i => i.type === "skill");
  for (const skill of skills) {
    betterDocument = await game.system.api.cocid.fromCoCID(skill.flags?.CoC7?.cocidFlag?.id, worldLanguage);
    if (betterDocument[0]) {
      updatedDocument = {
        _id: skill.id,
        name: betterDocument[0].name,
        system: {
          skillName: betterDocument[0].system.skillName,
          specialization: betterDocument[0].system.specialization,
          description: betterDocument[0].system.description,
					base: betterDocument[0].system.base,
					bonusDice: betterDocument[0].system.bonusDice,
					value: betterDocument[0].system.value,
					attributes: betterDocument[0].system.attributes,
					properties: betterDocument[0].system.properties,
					flags: betterDocument[0].system.flags
        },
        type: betterDocument[0].type,
        img: betterDocument[0].img,
        effects: betterDocument[0].effects,
        flags: betterDocument[0].flags
      }
      //console.log(updatedDocument);
      updatesDocuments.push(updatedDocument);
    }
  }

  // Occupation
  const occupations = myactor.items.filter(i => i.type === "occupation");
  for (const occupation of occupations) {
    betterDocument = await game.system.api.cocid.fromCoCID(occupation.flags?.CoC7?.cocidFlag?.id, worldLanguage);
    if (betterDocument[0]) {
      updatedDocument = {
        _id: occupation.id,
        name: betterDocument[0].name,
      type: betterDocument[0].type,
      img: betterDocument[0].img,
      effects: betterDocument[0].effects,
      flags: betterDocument[0].flags,
      system: betterDocument[0].system
      }
      //console.log(updatedDocument);
      updatesDocuments.push(updatedDocument);
    }
  }

  // Weapons
  const weapons = myactor.items.filter(i => i.type === "weapon");
  for (const weapon of weapons) {
    betterDocument = await game.system.api.cocid.fromCoCID(weapon.flags?.CoC7?.cocidFlag?.id, worldLanguage);
    if (betterDocument[0]) {
      updatedDocument = {
        _id: weapon.id,
        name: betterDocument[0].name,
      type: betterDocument[0].type,
      img: betterDocument[0].img,
      effects: betterDocument[0].effects,
      flags: betterDocument[0].flags,
      system: betterDocument[0].system
      }
      //console.log(updatedDocument);
      updatesDocuments.push(updatedDocument);
    }
  }
  //console.log(myactor.name);

  updatedData = [{
      _id: myactor.id,
      items: updatesDocuments
    }
  ]
  //console.log(updatedData);
  Actor.updateDocuments(updatedData);
  ui.notifications.info(`Updated ${updatesDocuments.length} item names from ` + myactor.name + ' (id: ' + myactor.id + ')');
}
