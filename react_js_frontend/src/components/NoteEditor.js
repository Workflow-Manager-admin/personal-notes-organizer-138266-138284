import React from "react";
import { useNotes } from "../contexts/NotesContext";

// PUBLIC_INTERFACE
export default function NoteEditor({ noteId }) {
  const {
    notes,
    updateNote,
    deleteNote,
    folders,
    tags,
    reloadNotes,
  } = useNotes();
  const [note, setNote] = React.useState(null);
  const [edit, setEdit] = React.useState(false);

  React.useEffect(() => {
    setEdit(false);
    const n = notes.find(n => n.id === noteId);
    setNote(n ? { ...n } : null);
  }, [noteId, notes]);

  if (!note) return (
    <div className="note-editor">
      <em style={{ opacity: 0.5 }}>Select a note to view/edit.</em>
    </div>
  );

  function handleChange(e) {
    setNote((note) => ({
      ...note,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    await updateNote(note.id, {
      title: note.title,
      content: note.content,
      folderId: note.folderId,
      tags: note.tags,
    });
    setEdit(false);
  }

  function handleEdit() {
    setEdit(true);
  }

  async function handleDelete() {
    if (!window.confirm("Delete this note?")) return;
    await deleteNote(note.id);
    // Optionally clear selection
  }

  return (
    <div className="note-editor">
      {edit ? (
        <form onSubmit={handleSave} className="note-form">
          <input
            type="text"
            name="title"
            value={note.title}
            required
            autoFocus
            onChange={handleChange}
            className="title-input"
            placeholder="Note title"
          />
          <select
            name="folderId"
            value={note.folderId || ""}
            onChange={handleChange}
            className="folder-select"
          >
            <option value="">No folder</option>
            {folders.map(f => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
          <input
            type="text"
            name="tags"
            value={note.tags ? note.tags.join(",") : ""}
            onChange={e =>
              setNote(note => ({ ...note, tags: e.target.value.split(",").map(s => s.trim()).filter(Boolean) }))
            }
            placeholder="Tags (comma separated)"
            className="tags-input"
          />
          <textarea
            name="content"
            value={note.content}
            onChange={handleChange}
            rows={12}
            className="content-area"
            placeholder="Write your note here..."
          />
          <div className="editor-actions">
            <button type="submit" className="btn-primary">
              Save
            </button>
            <button type="button" onClick={() => setEdit(false)}>
              Cancel
            </button>
            <button type="button" className="btn-danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </form>
      ) : (
        <div>
          <h2>{note.title}</h2>
          <div style={{ color: "#888", marginBottom: 8 }}>
            Folder: {folders.find(f => f.id === note.folderId)?.name || <em>None</em>}, Tags: {(note.tags||[]).join(", ")}
          </div>
          <pre className="note-content">{note.content}</pre>
          <button className="btn-primary" onClick={handleEdit}>
            Edit
          </button>
        </div>
      )}
    </div>
  );
}
