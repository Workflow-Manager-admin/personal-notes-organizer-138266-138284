import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

// PUBLIC_INTERFACE
export default function AuthPage() {
  const [tab, setTab] = useState("login");
  return (
    <div className="auth-page">
      <div className="auth-tabs">
        <button className={tab === "login" ? "active" : ""} onClick={() => setTab("login")}>
          Login
        </button>
        <button className={tab === "register" ? "active" : ""} onClick={() => setTab("register")}>
          Register
        </button>
      </div>
      {tab === "login" ? <LoginForm /> : <RegisterForm />}
    </div>
  );
}

function LoginForm() {
  const { login, isLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const result = await login(form.email, form.password);
    if (!result.success) setError(result.message || "Login failed");
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        autoFocus
      />
      <input
        type="password"
        required
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <button className="btn-primary" type="submit" disabled={isLoading}>
        Log In
      </button>
      {error && <div className="auth-error">{error}</div>}
    </form>
  );
}

function RegisterForm() {
  const { register, isLoading } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const result = await register(form.email, form.password);
    if (!result.success) setError(result.message || "Register failed");
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        autoFocus
      />
      <input
        type="password"
        required
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
      />
      <button className="btn-secondary" type="submit" disabled={isLoading}>
        Register
      </button>
      {error && <div className="auth-error">{error}</div>}
    </form>
  );
}
