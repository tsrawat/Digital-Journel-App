const express = require('express');
const router = express.Router();
const { getNotes, createNote, updateNote, deleteNote } = require('../controllers/noteController');
const authMiddleware = require('../middleware/authMiddleware');

// सर्व रूट्सच्या आधी authMiddleware रन होईल
router.get('/', authMiddleware, getNotes);
router.post('/create', authMiddleware, createNote);
router.put('/update/:id', authMiddleware, updateNote);
router.delete('/delete/:id', authMiddleware, deleteNote);

module.exports = router;