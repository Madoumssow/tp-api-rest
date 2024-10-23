// server.js
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Importer le modèle User
const User = require('./models/User');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT || 3003;

// Middleware pour analyser les données JSON
app.use(express.json());

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes de base
app.get('/', (req, res) => {
  res.send('Bienvenue sur notre API');
});

// Route GET : Retourner tous les utilisateurs
app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la récupération des utilisateurs' });
  }
});

// Route POST : Ajouter un nouvel utilisateur
app.post('/users', async (req, res) => {
  const { name, email, age } = req.body;

  try {
    const newUser = new User({ name, email, age });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de l’ajout de l’utilisateur' });
  }
});

// Route PUT : Éditer un utilisateur par ID
app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, age } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(id, { name, email, age }, { new: true });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la mise à jour de l’utilisateur' });
  }
});

// Route DELETE : Supprimer un utilisateur par ID
app.delete('/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await User.findByIdAndDelete(id);
    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(400).json({ message: 'Erreur lors de la suppression de l’utilisateur' });
  }
});


// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur le port ${port}`);
});
