const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/", (req, res, next) => {
  //   //input validation
  const allowedFilter = ["type", "name", "url"];
  try {
    let { page, limit, search, ...filterQuery } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    //allow title,limit and page query string only
    const filterKeys = Object.keys(filterQuery);
    filterKeys.forEach((key) => {
      if (!allowedFilter.includes(key)) {
        const exception = new Error(`Query ${key} is not allowed`);
        exception.statusCode = 401;
        throw exception;
      }
      if (!filterQuery[key]) delete filterQuery[key];
    });
    //processing logic

    //Number of items skip for selection
    let offset = limit * (page - 1);

    //Read data from db.json then parse to JSobject
    let pokemonJson = fs.readFileSync("pokemons.json", "utf-8");
    pokemonJson = JSON.parse(pokemonJson);
    const { data } = pokemonJson;
    //Filter data by title
    let result = [];

    if (search) {
      data.map((element) => {
        if (Object.values(element).toString().includes(search) === true) {
          result.push(element);
        }
      });
    } else {
      if (filterKeys.length) {
        filterKeys.forEach((condition) => {
          result = result.length
            ? result.filter(
                (pokemon) =>
                  pokemon[condition].includes(filterQuery[condition]) ||
                  pokemon[condition] === filterQuery[condition]
              )
            : data.filter(
                (pokemon) =>
                  pokemon[condition].includes(filterQuery[condition]) ||
                  pokemon[condition] === filterQuery[condition]
              );
        });
      } else {
        console.log("failed");
        result = data;
      }
    }

    result = result.slice(offset, offset + limit);

    //send response
    console.log(filterKeys);
    res.status(200).send(result);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", function (req, res, next) {
  const { id } = req.params;
  const newId = parseInt(id);

  console.log(req.query, res, id);
  let pokemonJson = fs.readFileSync("pokemons.json", "utf-8");
  pokemonJson = JSON.parse(pokemonJson);
  const { data } = pokemonJson;

  // let result = [];
  let result = {
    pokemon: null,
    nextPokemon: null,
    previousPokemon: null,
  };

  for (let index = 0; index < data.length; index++) {
    const element = data[index];
    if (element.id === newId) {
      // result.previousPokemon = data[index - 1];
      index - 1 > 0
        ? (result.previousPokemon = data[index - 1])
        : (result.previousPokemon = data[data.length - 1]);

      result.pokemon = data[index];
      // if (index + 1 < data.length) result.nextPokemon = data[index + 1];
      index + 1 < data.length
        ? (result.nextPokemon = data[index + 1])
        : (result.nextPokemon = data[0]);
    }
  }

  console.log(result, "index");

  res.send(result);
});

router.post("/", (req, res, next) => {
  //post input validation

  try {
    const { name, types, url } = req.body;
    const pokemonTypes = [
      "bug",
      "dragon",
      "fairy",
      "fire",
      "ghost",
      "ground",
      "normal",
      "psychic",
      "steel",
      "dark",
      "electric",
      "fighting",
      "flyingText",
      "grass",
      "ice",
      "poison",
      "rock",
      "water",
    ];

    if (!name || !types.length) {
      const exception = new Error(`Missing body info`);
      exception.statusCode = 401;
      throw exception;
    }
    if (types.length > 2) {
      const exception = new Error(`Pokémon can only have one or two types.`);
      exception.statusCode = 401;
      throw exception;
    }

    let newType = [];

    types.map((type) => {
      if (pokemonTypes.includes(type) && type !== null) {
        newType.push(type);
      } else {
        const exception = new Error(`Pokémon type ${type} is invalid`);
        exception.statusCode = 401;
        throw exception;
      }
    });

    let pokemons = fs.readFileSync("pokemons.json", "utf-8");
    pokemons = JSON.parse(pokemons);
    const { data, totalPokemons } = pokemons;

    data.forEach((singlePokemon) => {
      if (singlePokemon.name === name) {
        const exception = new Error(`pokemon existed`);
        exception.statusCode = 401;
        throw exception;
      }
    });

    const newPokemon = {
      name,
      url,
      types: newType,
      id: data.length + 2,
    };

    data.push(newPokemon);

    pokemons.data = data;

    pokemons = JSON.stringify(pokemons);

    fs.writeFileSync("pokemons.json", pokemons);

    res.status(200).send(newPokemon);
  } catch (error) {
    next(error);
  }
});

router.delete("/:pokemonId", (req, res, next) => {
  try {
    const { pokemonId } = req.params;

    console.log(typeof parseInt(pokemonId), "pokemon Id ");

    let pokemonJson = fs.readFileSync("pokemons.json", "utf-8");
    pokemonJson = JSON.parse(pokemonJson);
    const { data } = pokemonJson;

    const targetIndex = data.findIndex(
      (pokemon) => pokemon.id === parseInt(pokemonId)
    );

    console.log(targetIndex, "targetIndex");
    if (targetIndex < 0) {
      const exception = new Error(`pokemon not found`);
      exception.statusCode = 404;
      throw exception;
    }

    pokemonJson.data = data.filter(
      (pokemon) => pokemon.id !== parseInt(pokemonId)
    );

    pokemonJson = JSON.stringify(pokemonJson);

    fs.writeFileSync("pokemons.json", pokemonJson);

    res.status(200).send("delete successful");
    // res.status(200).send({});
  } catch (error) {
    next(error);
  }
});

module.exports = router;
