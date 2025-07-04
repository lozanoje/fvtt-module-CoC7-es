Hooks.once("ready", async function () {
  if (game.user.isGM) {
    let ficherosjs = await FilePicker.browse(
      "data",
      "/modules/fvtt-module-CoC7-es/scripts"
    ).then((picker) => picker.files);
    for (var i = 0; i < ficherosjs.length; i++) {
      if (ficherosjs[i].search(/\.js/) > -1) updateMacro(ficherosjs[i]);
    }
  }
});

  function updateMacro(macroFile) {
    fetch(macroFile)
      .then((res) => res.text())
      .then((content) => {
        let macroContents = content.split(`\n`);
        let versionLine = -1;
        for (var i = 0; i < macroContents.length; i++) {
          if (macroContents[i].search(/macroVersion/) > -1) {
            versionLine = i;
            break;
          }
        }
        let macroVersion = parseFloat(
          macroContents[versionLine]
            .split("=")[1]
            .replace(/\;/g, "")
            .replace(/\"/g, "")
        );
        let nameLine = -1;
        for (var i = 0; i < macroContents.length; i++) {
          if (macroContents[i].search(/macroName/) > -1) {
            nameLine = i;
            break;
          }
        }
        let macroName = macroContents[nameLine]
          .split("=")[1]
          .replace(/\;/g, "")
          .replace(/\"/g, "")
          .trim();
        let imageLine = -1;
        for (var i = 0; i < macroContents.length; i++) {
          if (macroContents[i].search(/macroImage/) > -1) {
            imageLine = i;
            break;
          }
        }
        let macroImage = macroContents[imageLine]
          .split("=")[1]
          .replace(/\;/g, "")
          .replace(/\"/g, "")
          .trim();

        let instMacro = game.macros.getName(macroName);
        let instVersion = instMacro ? instMacro.flags.version : 0;
        console.log("Analizando: " + macroFile);

        if (
          !instMacro ||
          instVersion === undefined ||
          parseFloat(instVersion) < macroVersion
        ) {
          if (instMacro) {
            console.log(
              "Macro: " +
                macroName +
                ", Versión: " +
                macroVersion +
                ", Instalada: ",
              instVersion,
              " --- Actualizamos macro actual"
            );

            instMacro.update({
              name: macroName,
              type: "script",
              img: macroImage,
              command: content,
              flags: {
                version: macroVersion,
              },
            });
          } else {
            console.log(
              "Macro: " +
                macroName +
                ", Versión: " +
                macroVersion +
                ", Instalada: ",
              instVersion,
              " --- Creamos macro"
            );

            Macro.create({
              name: macroName,
              type: "script",
              img: macroImage,
              command: content,
              flags: {
                version: macroVersion,
              },
            });
          }
        } else {
          console.log(
            "Macro: " +
              macroName +
              ", Versión: " +
              macroVersion +
              ", Instalada: ",
            instVersion,
            " --- No hacemos nada"
          );
        }
      });
  }