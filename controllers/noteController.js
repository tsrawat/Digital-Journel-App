const Note = require('../models/Note');

// 1. GET ALL NOTES (फक्त लॉग-इन असलेल्या युझरचे)
exports.getNotes = async (req, res) => {
    try {
        // req.userId हा मिडलवेअरमधून येतोय
        const notes = await Note.find({ user: req.userId }).sort({ createdAt: -1 }); // नवीन नोट्स आधी दिसतील
        res.status(200).json({ success: true, notes });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// 2. CREATE A NEW NOTE
exports.createNote = async (req, res) => {
    try {
        const { title, description, tag } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and Description are required!" });
        }

        const newNote = new Note({
            user: req.userId,
            title,
            description,
            tag
        });

        await newNote.save();
        res.status(201).json({ success: true, note: newNote, message: "Note created successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// 3. UPDATE AN EXISTING NOTE
exports.updateNote = async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        let note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found!" });
        }

        // चेक करणे की हा नोट याच युझरचा आहे का
        if (note.user.toString() !== req.userId) {
            return res.status(401).json({ success: false, message: "Not authorized!" });
        }

        // Fields update करणे
        if (title) note.title = title;
        if (description) note.description = description;
        if (tag) note.tag = tag;

        await note.save();
        res.status(200).json({ success: true, note, message: "Note updated successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};

// 4. DELETE A NOTE
exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({ success: false, message: "Note not found!" });
        }

        // चेक करणे की हा नोट याच युझरचा आहे का
        if (note.user.toString() !== req.userId) {
            return res.status(401).json({ success: false, message: "Not authorized!" });
        }

        await note.deleteOne();
        res.status(200).json({ success: true, message: "Note deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};