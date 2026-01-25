"use client";

import { useState } from "react";

export default function AuthTestPage() {
  const [mode, setMode] = useState<"login" | "signup" | "verify">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [code, setCode] = useState("");
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs((prev) => [msg, ...prev]);

  const handleSignup = async () => {
    addLog("Signing up...");
    try {
      const res = await fetch("http://localhost:8080/v1/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password, display_name: displayName }),
      });
      const data = await res.json();
      addLog(`Signup response: ${JSON.stringify(data)}`);
      if (res.ok) {
        setMode("verify");
      }
    } catch (e) {
      addLog(`Signup error: ${e}`);
    }
  };

  const handleLogin = async () => {
    addLog("Logging in...");
    try {
      const res = await fetch("http://localhost:8080/v1/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: email, password }),
      });
      const data = await res.json();
      addLog(`Login response: ${JSON.stringify(data)}`);
      if (res.ok) {
        if (data.user?.is_email_verified === false) {
          addLog("User not verified. Redirecting to verification...");
          setMode("verify");
        } else {
          addLog("Login successful!");
        }
      }
    } catch (e) {
      addLog(`Login error: ${e}`);
    }
  };

  const handleVerify = async () => {
    addLog("Verifying email...");
    try {
      const res = await fetch("http://localhost:8080/v1/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      addLog(`Verify response: ${JSON.stringify(data)}`);
      if (res.ok) {
        addLog("Verification successful! You can now login.");
        setMode("login");
      }
    } catch (e) {
      addLog(`Verify error: ${e}`);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Auth Test</h1>

      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setMode("login")}
          className={`px-3 py-1 rounded ${mode === "login" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Login
        </button>
        <button
          onClick={() => setMode("signup")}
          className={`px-3 py-1 rounded ${mode === "signup" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Signup
        </button>
        <button
          onClick={() => setMode("verify")}
          className={`px-3 py-1 rounded ${mode === "verify" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
        >
          Verify
        </button>
      </div>

      <div className="space-y-3 border p-4 rounded bg-white shadow">
        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium">Display Name</label>
            <input
              className="w-full border p-2 rounded"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
        )}

        {(mode === "login" || mode === "signup" || mode === "verify") && (
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              className="w-full border p-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        )}

        {(mode === "login" || mode === "signup") && (
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        )}

        {mode === "verify" && (
          <div>
            <label className="block text-sm font-medium">Verification Code</label>
            <input
              className="w-full border p-2 rounded"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        )}

        <div className="pt-2">
          {mode === "login" && (
            <button onClick={handleLogin} className="w-full bg-blue-600 text-white p-2 rounded">
              Login
            </button>
          )}
          {mode === "signup" && (
            <button onClick={handleSignup} className="w-full bg-green-600 text-white p-2 rounded">
              Sign Up
            </button>
          )}
          {mode === "verify" && (
            <button onClick={handleVerify} className="w-full bg-purple-600 text-white p-2 rounded">
              Verify Code
            </button>
          )}
        </div>
      </div>

      <div className="mt-8 border-t pt-4">
        <h2 className="font-bold mb-2">Logs</h2>
        <div className="bg-gray-100 p-2 rounded h-48 overflow-y-auto text-xs font-mono">
          {logs.map((log, i) => (
            <div key={i} className="border-b border-gray-200 py-1">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
