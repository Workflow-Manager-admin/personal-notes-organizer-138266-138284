import React from "react";
import { useNotes } from "../contexts/NotesContext";
import { useAuth } from "../contexts/AuthContext";

// PUBLIC_INTERFACE
export default function Sidebar({ onSelectNote }) {
  const { folders, tags, selectedFolder, selectedTag, setFolder, setTag } = useNotes();
  const { logout, user } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="app-title">NotesApp</span>
        <span className="sidebar-user">{user?.email}</span>
      </div>
      <nav>
        <div className="sidebar-section">
          <h4>Folders</h4>
          <ul>
            {folders.map(f => (
              <li
                key={f.id}
                className={f.id === selectedFolder ? "selected" : ""}
                onClick={() => {
                  setFolder(f.id);
                  if (onSelectNote) onSelectNote(null);
                }}
              >
                <span className="icon">&#128193;</span> {f.name}
              </li>
            ))}
            <li
              className={!selectedFolder && !selectedTag ? "selected" : ""}
              onClick={() => {
                setFolder(null);
                if (onSelectNote) onSelectNote(null);
              }}
            >
              <span className="icon">&#128464;</span> All Notes
            </li>
          </ul>
        </div>
        <div className="sidebar-section">
          <h4>Tags</h4>
          <ul>
            {tags.map(t => (
              <li
                key={t.id}
                className={t.id === selectedTag ? "selected" : ""}
                onClick={() => {
                  setTag(t.id);
                  if (onSelectNote) onSelectNote(null);
                }}
              >
                <span className="icon">&#35;</span> {t.name}
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div style={{ flex: 1 }}></div>
      <div className="sidebar-logout">
        <button className="btn-logout" onClick={logout}>
          Logout
        </button>
      </div>
    </aside>
  );
}
