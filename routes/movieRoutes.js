const express = require('express');
const router = express.Router();
const Movie = require('../models/movie');

// GET all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET one movie by ID or by title
router.get('/:identifier', getMovie, (req, res) => {
  res.json(res.movie);
});

// POST a new movie
router.post('/', async (req, res) => {
  const movie = new Movie({
    title: req.body.title,
    synopsis: req.body.synopsis,
    release: req.body.release,
  });

  try {
    const newMovie = await movie.save();
    res.status(201).json(newMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT (Update) a movie by ID or by title
router.put('/:identifier', getMovie, async (req, res) => {
  const { movie } = res;

  // Mise à jour des champs du film avec les données de la requête
  if (req.body.title != null) {
    movie.title = req.body.title;
  }
  if (req.body.synopsis != null) {
    movie.synopsis = req.body.synopsis;
  }
  if (req.body.release != null) {
    movie.release = req.body.release;
  }

  try {
    const updatedMovie = await movie.save();
    res.json(updatedMovie);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE a movie by ID or by title
router.delete('/:identifier', getMovie, async (req, res) => {
  try {
    const movieToRemove = res.movie;

    // Utilisez la méthode deleteOne() pour supprimer le film de la base de données
    await Movie.deleteOne({ _id: movieToRemove._id });

    res.json({ message: 'Movie deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware to get a movie by ID or title
async function getMovie(req, res, next) {
  const { identifier } = req.params;

  try {
    let movie;

    // Tentative de recherche d'un film par titre
    movie = await Movie.findOne({ title: identifier });

    // Si aucun film n'est trouvé par titre, essayer de trouver par ID
    if (!movie) {
      movie = await Movie.findById(identifier);

      // Si aucun film n'est encore trouvé, retourner une réponse 404
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found' });
      }
    }

    res.movie = movie;
    next();
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
}

module.exports = router;
