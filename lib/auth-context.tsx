"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { api } from "./api";

interface User {
  userId: string;
  wallet: string;
  role: string;
}

interface AuthCtx {
  user: User | null;
  token: string | null;
  loading: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Ctx = createContext<AuthCtx>({
  user: null,
  token: null,
  loading: true,
  connect: async () => {},
  disconnect: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("bhdao_token");
    if (saved) {
      setToken(saved);
      api.auth
        .me(saved)
        .then((d) => setUser(d.user))
        .catch(() => {
          localStorage.removeItem("bhdao_token");
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const connect = useCallback(async () => {
    const eth = (window as any).ethereum;
    if (!eth) throw new Error("No wallet found. Install MetaMask.");

    const accounts: string[] = await eth.request({ method: "eth_requestAccounts" });
    const wallet = accounts[0];
    if (!wallet) throw new Error("No account returned.");

    // 1. Get nonce
    const { message } = await api.auth.nonce(wallet);

    // 2. Sign
    const hex =
      "0x" +
      Array.from(new TextEncoder().encode(message))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
    const signature: string = await eth.request({
      method: "personal_sign",
      params: [hex, wallet],
    });

    // 3. Verify
    const res = await api.auth.verify(wallet, signature);
    setToken(res.token);
    localStorage.setItem("bhdao_token", res.token);

    // 4. Get profile
    const me = await api.auth.me(res.token);
    setUser(me.user);
  }, []);

  const disconnect = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("bhdao_token");
  }, []);

  return (
    <Ctx.Provider value={{ user, token, loading, connect, disconnect }}>
      {children}
    </Ctx.Provider>
  );
}

export const useAuth = () => useContext(Ctx);