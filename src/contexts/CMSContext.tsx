import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { loadCMS, resetCMS, saveCMS, defaults, type CMSContent } from "../lib/cms";

type CMSContextType = {
  cms: CMSContent;
  updateCMS: (updater: (prev: CMSContent) => CMSContent) => void;
  resetToDefaults: () => Promise<void>;
};

const CMSContext = createContext<CMSContextType | null>(null);

export function CMSProvider({ children }: { children: ReactNode }) {
  const [cms, setCMS] = useState<CMSContent | null>(null);

  useEffect(() => {
    loadCMS().then(setCMS);
  }, []);

  const updateCMS = useCallback((updater: (prev: CMSContent) => CMSContent) => {
    setCMS((prev) => {
      const next = updater(prev ?? defaults());
      saveCMS(next);
      return next;
    });
  }, []);

  const resetToDefaults = useCallback(async () => {
    await resetCMS();
    const fresh = await loadCMS();
    setCMS(fresh);
  }, []);

  if (!cms) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-white z-[9999]">
        <div
          className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{ borderColor: "#FF9933", borderTopColor: "transparent" }}
        />
        <p className="text-sm font-semibold" style={{ color: "#FF9933" }}>Loading content…</p>
      </div>
    );
  }

  return (
    <CMSContext.Provider value={{ cms, updateCMS, resetToDefaults }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error("useCMS must be used within <CMSProvider>");
  return ctx;
}
