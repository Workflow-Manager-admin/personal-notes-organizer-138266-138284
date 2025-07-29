import React from "react";
import { useNotes } from "../contexts/NotesContext";
import { useAuth } from "../contexts/AuthContext";

// PUBLIC_INTERFACE
export default function TopBar() {
  const { search, setSearch, createNote } = useNotes();
  const { user } = useAuth();
  const [creating, setCreating] = React.useState(false);

  async function handleNewNote() {
    setCreating(true);
    await createNote({
      title: "Untitled note",
      content: "",
      folderId: null,
      tags: [],
    });
    setCreating(false);
  }

  return (
    <div className="topbar">
      <input
        className="search"
        type="text"
        placeholder="Search notes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        className="btn-accent"
        onClick={handleNewNote}
        disabled={creating}
        title="New Note"
      >
        + New Note
      </button>
    </div>
  );
}
