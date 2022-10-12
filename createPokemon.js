const fs = require("fs");
const csv = require("csvtojson");

const createPokemon = async () => {
  let convertData = await csv().fromFile("pokemons.csv");
  convertData = Array.from(convertData);
  let jsonData = JSON.parse(fs.readFileSync("pokemons.json"));
  console.log(convertData, "convertData");
  convertData = convertData.map((e, index) => {
    let newTypes = [e.Type1, e.Type2].map((value) => {
      if (value !== undefined) {
        return value.toLowerCase();
      }
    });
    newTypes = newTypes.filter((value) => value !== undefined);
    return {
      id: index,
      name: e.Name,
      types: newTypes,
      url: `http://localhost:5001/images/${index}.png`,
    };
  });

  jsonData.data = convertData;
  jsonData.totalPokemons = convertData.length;

  fs.writeFileSync("pokemons.json", JSON.stringify(jsonData));
  console.log(convertData, "afterConvert");
};

createPokemon();
