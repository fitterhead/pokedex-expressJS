const fs = require("fs");
const csv = require("csvtojson");

const createPokemon = async () => {
  let convertData = await csv().fromFile("pokemons.csv");
  convertData = Array.from(convertData);
  let jsonData = JSON.parse(fs.readFileSync("pokemons.json"));
  console.log(convertData, "convertData");
  convertData = convertData.map((e, index) => {
    return {
      id: index,
      name: e.Name,
      types: [e.Type1, e.Type2].filter((value) => value !== undefined),
      url: `http://localhost:5000/images/${index}.png`,
    };
  });

  jsonData.data = convertData;
  jsonData.totalPokemons = convertData.length;

  fs.writeFileSync("pokemons.json", JSON.stringify(jsonData));
  console.log(convertData, "afterConvert");
};

createPokemon();
