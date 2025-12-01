// hooks/useDeviceIdentity.ts
"use client";

import { useEffect, useState } from "react";

const safeUUID = () => {
  try {
    if (crypto?.randomUUID) return crypto.randomUUID();
  } catch {}
  return Math.random().toString(36).substring(2) + Date.now();
};

export default function useDeviceIdentity() {
  const [deviceIdentity, setDeviceIdentity] = useState<string>("");

  useEffect(() => {
    try {
      let id = localStorage.getItem("deviceIdentity");
      if (!id) {
        id = safeUUID();
        localStorage.setItem("deviceIdentity", id);
      }
      setDeviceIdentity(id);
    } catch {
      setDeviceIdentity(safeUUID());
    }
  }, []);

  return deviceIdentity;
}
