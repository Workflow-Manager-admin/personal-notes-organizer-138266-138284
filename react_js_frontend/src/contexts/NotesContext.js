/**
 * NotesContext provides note CRUD, folder/tag structure, and search results.
 */
import React, { createContext, useContext, useEffect, useState } from "react";
import { apiRequest } from "../api";
import { useAuth } from "./AuthContext";

// PUBLIC_INTERFACE
export const NotesContext = createContext({
  notes: [],
  folders: [],
  tags: [],
  selectedFolder: null,
  selectedTag: null,
  search: "",
  filteredNotes: [],
  isLoading: false,
  createNote: async (data) => {},
  updateNote: async (id, data) => {},
  deleteNote: async (id) => {},
  reloadNotes: async () => {},
  setFolder: (folder) => {},
  setTag: (tag) => {},
  setSearch: (search) => {},
});

export const useNotes = () => useContext(NotesContext);

export function NotesProvider({ children }) {
  const { token } = useAuth();
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]); // folders are { id, name }
  const [tags, setTags] = useState([]);       // tags are { id, name }
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [selectedTag, setSelectedTag] = useState(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Derived
  const filteredNotes = notes.filter(note => {
    let match = true;
    if (selectedFolder && note.folderId !== selectedFolder) match = false;
    if (selectedTag && !(note.tags || []).includes(selectedTag)) match = false;
    if (search && !note.title.toLowerCase().includes(search.toLowerCase()) && !note.content.toLowerCase().includes(search.toLowerCase())) match = false;
    return match;
  });

  // PUBLIC_INTERFACE
  async function reloadNotes() {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await apiRequest({
        endpoint: "/notes",
        token,
      });
      setNotes(res.notes || []);
      setFolders(res.folders || []);
      setTags(res.tags || []);
    } catch (e) {
      // could show error
    } finally {
      setIsLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function createNote(note) {
    setIsLoading(true);
    try {
      const res = await apiRequest({
        endpoint: "/notes",
        method: "POST",
        data: note,
        token,
      });
      setNotes(notes => [res.note, ...notes]);
      // folders and tags may be updated externally
    } finally {
      setIsLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function updateNote(id, data) {
    setIsLoading(true);
    try {
      const res = await apiRequest({
        endpoint: `/notes/${id}`,
        method: "PUT",
        data,
        token,
      });
      setNotes(notes => notes.map(note => (note.id === id ? res.note : note)));
    } finally {
      setIsLoading(false);
    }
  }

  // PUBLIC_INTERFACE
  async function deleteNote(id) {
    setIsLoading(true);
    try {
      await apiRequest({
        endpoint: `/notes/${id}`,
        method: "DELETE",
        token,
      });
      setNotes(notes => notes.filter(note => note.id !== id));
    } finally {
      setIsLoading(false);
    }
  }

  // Effects
  useEffect(() => {
    reloadNotes();
    // eslint-disable-next-line
  }, [token]);

  function setFolder(folderId) {
    setSelectedFolder(folderId);
    setSelectedTag(null); // mutually exclusive for simplicity
  }

  function setTag(tagId) {
    setSelectedTag(tagId);
    setSelectedFolder(null);
  }

  return (
    <NotesContext.Provider
      value={{
        notes,
        folders,
        tags,
        selectedFolder,
        selectedTag,
        search,
        filteredNotes,
        isLoading,
        createNote,
        updateNote,
        deleteNote,
        reloadNotes,
        setFolder,
        setTag,
        setSearch,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
}
