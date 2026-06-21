import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { loadCMS, resetCMS, saveCMS, type CMSContent } from "../lib/cms";

type CMSContextType = {
  cms: CMSContent;
  updateCMS: (updater: (prev: CMSContent) => CMSContent) => void;
  resetToDefaults: () => void;
};

const CMSContext = createContext<CMSContextType | null>(null);

export function CMSProvider({ children }: { children: ReactNode }) {
  const [cms, setCMS] = useState<CMSContent>(() => loadCMS());

  const updateCMS = useCallback((updater: (prev: CMSContent) => CMSContent) => {
    setCMS((prev) => {
      const next = updater(prev);
      saveCMS(next);
      return next;
    });
  }, []);

  const resetToDefaults = useCallback(() => {
    resetCMS();
    setCMS(loadCMS());
  }, []);

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
