import React from "react";
import { useNotes } from "../contexts/NotesContext";

// PUBLIC_INTERFACE
export default function NoteList({ onSelect, selectedNote }) {
  const { filteredNotes, isLoading } = useNotes();

  if (isLoading) return <div className="note-list"><em>Loading...</em></div>;
  if (!filteredNotes.length)
    return <div className="note-list"><em>No notes found.</em></div>;

  return (
    <div className="note-list">
      <ul>
        {filteredNotes.map(note => (
          <li
            key={note.id}
            className={selectedNote === note.id ? "active" : ""}
            onClick={() => onSelect(note.id)}
          >
            <strong>{note.title}</strong>
            <div className="note-preview">
              {note.content.slice(0, 80)}{note.content.length > 80 ? "..." : ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
