const express = require('express');
const router = express.Router();
const Challenge = require('../modeles/challenges');
const authenticateToken = require('../middleware/auth');

// Supprimer -------------------------------------------
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const deletedChallenge = await Challenge.findByIdAndDelete(req.params.id);
    if (!deletedChallenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    res.json({ message: 'Challenge deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Modifier -------------------------------------------
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, difficulty } = req.body;
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    challenge.title = title;
    challenge.description = description;
    challenge.difficulty = difficulty;
    const updatedChallenge = await challenge.save();
    res.json(updatedChallenge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Aléatoire -------------------------------------------
router.get('/random', async (req, res) => {
  try {
    const count = await Challenge.countDocuments();
    const randomIndex = Math.floor(Math.random() * count);
    const challenge = await Challenge.findOne().skip(randomIndex);
    res.json(challenge);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

// Plusieurs Aléatoire -------------------------------------------
router.get('/random/:count', async (req, res) => {
  try {
    const count = parseInt(req.params.count);
    const challenges = await Challenge.aggregate([
      { $sample: { size: count } },
    ]);
    res.json(challenges);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, difficulty } = req.body;
    const challenge = new Challenge({
      title,
      description,
      difficulty
    });
    const newChallenge = await challenge.save();
    res.status(201).json(newChallenge);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});




module.exports = router;
