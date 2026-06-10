import React, { useState, useEffect } from 'react';
import API from '../api';

function Dashboard() {
    const [searchQuery, setSearchQuery] = useState('');
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [tag, setTag] = useState('');
    const [message, setMessage] = useState('');

    // EDITING STATES
    const [isEditing, setIsEditing] = useState(false);
    const [currentNoteId, setCurrentNoteId] = useState(null);

    // 1. BACKEND KADUN NOTES FETCH KARNE
    const fetchNotes = async () => {
        try {
            const res = await API.get('/notes');
            if (res.data.success) {
                setNotes(res.data.notes);
            }
        } catch (error) {
            console.error("Error fetching notes:", error);
        }
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    // 2. NAVIN NOTE ADD KARNE KIWA UPDATE KARNE
    const handleSaveNote = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            if (isEditing) {
                // UPDATE NOTE LOGIC
                const res = await API.put(`/notes/update/${currentNoteId}`, { title, description, tag: tag || 'General' });
                if (res.data.success) {
                    setMessage('Note updated successfully!');
                    setIsEditing(false);
                    setCurrentNoteId(null);
                }
            } else {
                // CREATE NEW NOTE LOGIC
                const res = await API.post('/notes/create', { title, description, tag: tag || 'General' });
                if (res.data.success) {
                    setMessage('Note added successfully!');
                }
            }
            
            // Form clear karne ani list refresh karne
            setTitle('');
            setDescription('');
            setTag('');
            fetchNotes();
        } catch (error) {
            setMessage(error.response?.data?.message || "Something went wrong");
        }
    };

    // 3. EDIT MODE TRIGGER KARNE (Note form madhe load karne)
    const handleEditClick = (note) => {
        setIsEditing(true);
        setCurrentNoteId(note._id);
        setTitle(note.title);
        setDescription(note.description);
        setTag(note.tag);
    };

    // 4. EDIT MODE CANCEL KARNE
    const handleCancelEdit = () => {
        setIsEditing(false);
        setCurrentNoteId(null);
        setTitle('');
        setDescription('');
        setTag('');
        setMessage('');
    };

    // 5. NOTE DELETE KARNE
    const handleDeleteNote = async (id) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            try {
                const res = await API.delete(`/notes/delete/${id}`);
                if (res.data.success) {
                    fetchNotes();
                    if (isEditing && currentNoteId === id) {
                        handleCancelEdit(); // Jar toच note edit hot asel tar cancel karne
                    }
                }
            } catch (error) {
                console.error("Error deleting note:", error);
            }
        }
    };

    // Search Query नुसार नोट्स फिल्टर करणे
    const filteredNotes = notes.filter(note =>
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tag.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', display: 'flex', gap: '40px' }}>

            {/* LEFT SIDE: ADD / EDIT NOTE FORM */}
            <div style={{ flex: '1', border: '1px solid #e0e0e0', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
                <h3 style={{ marginBottom: '15px' }}>{isEditing ? "✏️ Edit Note" : "📝 Create New Note"}</h3>
                {message && <p style={{ color: 'green', marginBottom: '10px' }}>{message}</p>}
                
                <form onSubmit={handleSaveNote} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <input
                        type="text"
                        placeholder="Note Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    <textarea
                        placeholder="Write description here..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minHeight: '100px' }}
                    />
                    <input
                        type="text"
                        placeholder="Tag (e.g. Work, Personal)"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                    />
                    
                    <button type="submit" style={{ padding: '10px', backgroundColor: isEditing ? '#0066cc' : '#333', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {isEditing ? "Update Note" : "Save Note"}
                    </button>
                    
                    {isEditing && (
                        <button type="button" onClick={handleCancelEdit} style={{ padding: '10px', backgroundColor: '#e0e0e0', color: '#333', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                            Cancel
                        </button>
                    )}
                </form>
            </div>

            {/* RIGHT SIDE: DISPLAY NOTES */}
            <div style={{ flex: '2' }}>
                <h3 style={{ marginBottom: '15px' }}>Your Notes ({notes.length})</h3>
                
                {/* SEARCH BAR */}
                <input
                    type="text"
                    placeholder="🔍 Search notes by title, description or tag..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%',
                        padding: '10px 15px',
                        marginBottom: '20px',
                        borderRadius: '6px',
                        border: '1px solid #ccc',
                        fontSize: '14px'
                    }}
                />

                {notes.length === 0 ? (
                    <p style={{ color: '#777' }}>No notes available. Start adding some!</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {filteredNotes.length === 0 ? (
                            <p style={{ color: '#777' }}>No matching notes found.</p>
                        ) : (
                            filteredNotes.map((note) => (
                                <div key={note._id} style={{ border: '1px solid #e0e0e0', padding: '15px', borderRadius: '8px', position: 'relative', backgroundColor: '#fafafa' }}>
                                    <span style={{ position: 'absolute', top: '15px', right: '15px', backgroundColor: '#e0e0e0', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                                        {note.tag}
                                    </span>
                                    <h4 style={{ margin: '0 0 8px 0', fontSize: '18px', maxWidth: '80%' }}>{note.title}</h4>
                                    <p style={{ margin: '0 0 15px 0', color: '#555', whiteSpace: 'pre-wrap' }}>{note.description}</p>
                                    
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button
                                            onClick={() => handleEditClick(note)}
                                            style={{ padding: '5px 12px', backgroundColor: '#0066cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteNote(note._id)}
                                            style={{ padding: '5px 10px', backgroundColor: '#ff4d4d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}

export default Dashboard;