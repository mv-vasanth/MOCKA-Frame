var express = require("express")
var router = express.Router()
const Pokemon = require("../models/Pokemon")
const Pokedex = require("../db/Pokedex")
const config = require("../config")[process.env.NODE_ENV || "development"]

// init database
let pokedex = new Pokedex()
pokedex.connect(config.database.filename)

router.get("/", async function(req, res, next) {

	// get all pokemons
	let filter = {}

	// name
	if (req.query.name) {
		filter.name = req.query.name
	}

	// name
	if (req.query.types) {
		filter.types = req.query.types

		// coerce to array
		if(typeof filter.types === "string"){
			filter.types = [filter.types]
		}
	}

	// generation
	if (req.query.generation) {
		filter.generation = Number.parseInt(req.query.generation)
	}

	// legendary
	if (req.query.legendary) {
		filter.legendary = req.query.legendary === "1"
	}

	let pokemons = await pokedex.find({filter: filter})

	res.render("index", {
		title: "Pokedex",
		filter: {
			name: filter.name || "",
			types: filter.types || [],
			generation: filter.generation || "",
			legendary: req.query.legendary || ""
		},
		pokemons: pokemons
	})

})

module.exports = router
