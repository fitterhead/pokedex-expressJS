const express = require("express");
const router = express.Router();
const fs = require("fs");

/**
 * params: /
 * description: get all books
 * query:
 * method: get
 */

router.get("/", (req, res, next) => {
  //   //input validation
  const allowedFilter = ["types", "name"];
  try {
    let { page, limit, ...filterQuery } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    //allow title,limit and page query string only
    const filterKeys = Object.keys(filterQuery);
    //filterKeys = {name,type}
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

    if (filterKeys.length) {
      filterKeys.forEach((condition) => {
        result = result.length
          ? result.filter(
              (pokemon) =>
                pokemon[condition].includes(filterQuery[condition]) ||
                pokemon[condition] === filterQuery[condition]
            )
          : data.filter(
              (pokemon) => (pokemon) =>
                pokemon[condition].includes(filterQuery[condition]) ||
                pokemon[condition] === filterQuery[condition]
            );
      });
    } else {
      result = data;
    }
    //then select number of result by offset
    result = result.slice(offset, offset + limit);

    //send response
    console.log(filterQuery);
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

  let result = [];

  // result = data.filter((e) => e.id === newId);
  result = data.filter((e) => e.id === 1);

  console.log(result, "index");

  res.send(result);
});

module.exports = router;
