var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  // res.status(200).send("Welcome to Pokedex!");
  console.log({ req, res, next });
  res.send("Welcome to Pokedex!");
});

/* Pokemon router */
const pokemonsRouter = require("./pokemons.api.js");
router.use("/pokemon", pokemonsRouter);

module.exports = router;
