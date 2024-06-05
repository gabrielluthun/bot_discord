const { log } = require("console");
const fs = require("fs");

module.exports = {
  name: "proba-roulette",
  category: "economie",
  permissions: ["SEND_MESSAGES"],
  ownerOnly: false,
  usage: "proba-roulette",
  examples: ["proba-roulette"],
  description: "Affiche les probabilités de la roulette.",
  async runInteraction(client, interaction) {
    function Counter(arr) {
      const count = {};
      arr.forEach((element) => {
        if (count[element]) {
          count[element]++;
        } else {
          count[element] = 1;
        }
      });
      return {
        get: (element) => count[element] || 0,
      };
    }

    function egalisationDesChances(tirages) {
      const totalTirages = tirages.length;
      const frequences = new Counter(tirages);
      const manqueFrequence = {};

      for (let numero = 0; numero < 10; numero++) {
        if (frequences.get(numero) > 0) {
          manqueFrequence[numero] = totalTirages / frequences.get(numero);
        } else {
          manqueFrequence[numero] = totalTirages;
        }
      }

      const totalManque = Object.values(manqueFrequence).reduce(
        (a, b) => a + b,
        0
      );
      const probabilites = {};
      for (let numero = 0; numero < 10; numero++) {
        probabilites[numero] = (manqueFrequence[numero] / totalManque) * 100;
      }

      return probabilites;
    }

    const emojis = ["0️⃣", "1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣"]; //emotes

    function afficherProbabilites(probabilites) {
      let message = "";
      for (let numero in probabilites) {
        message += `${emojis[numero]} = ${probabilites[numero].toFixed(2)}%\n`;
      }
      return message;
    }

    function lireTiragesJson() {
      const data = fs.readFileSync("proba-roulette.json", "utf8");
      const jsonData = JSON.parse(data);

      let tirages = [];
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < jsonData[i.toString()]; j++) {
          tirages.push(i);
        }
      }

      return tirages;
    }

    let tirages = lireTiragesJson();
    let probabilites = egalisationDesChances(tirages);
    let message = afficherProbabilites(probabilites);
    await interaction.reply(message);
  },
};
/* function countNumber(number) {
  return tirages.filter(x => x === number).length;
}

console.log(`Le nombre 0 est sorti ${countNumber(0)} fois.
Le nombre 1 est sorti ${countNumber(1)} fois.
Le nombre 2 est sorti ${countNumber(2)} fois.
Le nombre 3 est sorti ${countNumber(3)} fois.
Le nombre 4 est sorti ${countNumber(4)} fois.
Le nombre 5 est sorti ${countNumber(5)} fois.
Le nombre 6 est sorti ${countNumber(6)} fois.
Le nombre 7 est sorti ${countNumber(7)} fois.
Le nombre 8 est sorti ${countNumber(8)} fois.
Le nombre 9 est sorti ${countNumber(9)} fois.`); */
