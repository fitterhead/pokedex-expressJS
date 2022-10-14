var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  console.log({ req, res, next });
  res.send("Welcome to Pokedex!");
});

/* Pokemon router */
const pokemonsRouter = require("./pokemons.api.js");
router.use("/pokemons", pokemonsRouter);

module.exports = router;
