import React from "react";
import "./App.css";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { NotesProvider } from "./contexts/NotesContext";
import { injectTheme } from "./theme";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import NoteList from "./components/NoteList";
import NoteEditor from "./components/NoteEditor";
import AuthPage from "./components/AuthPage";

// PUBLIC_INTERFACE
function App() {
  React.useEffect(() => {
    injectTheme();
  }, []);

  return (
    <AuthProvider>
      <NotesProvider>
        <MainLayout />
      </NotesProvider>
    </AuthProvider>
  );
}

// MainLayout switches between Auth and main UI
function MainLayout() {
  const { user } = useAuth();
  const [selectedNote, setSelectedNote] = React.useState(null);

  if (!user) return <AuthPage />;

  return (
    <div className="app-root">
      <Sidebar onSelectNote={setSelectedNote} />
      <div className="content-area">
        <TopBar />
        <div className="main-panel">
          <NoteList onSelect={setSelectedNote} selectedNote={selectedNote} />
          <NoteEditor noteId={selectedNote} />
        </div>
      </div>
    </div>
  );
}

export default App;
