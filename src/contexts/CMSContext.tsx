import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { loadCMS, resetCMS, saveCMS, defaults, type CMSContent } from "../lib/cms";

type CMSContextType = {
  cms: CMSContent;
  updateCMS: (updater: (prev: CMSContent) => CMSContent) => void;
  resetToDefaults: () => Promise<void>;
  saving: boolean;
  saveError: string | null;
  clearSaveError: () => void;
};

const CMSContext = createContext<CMSContextType | null>(null);

export function CMSProvider({ children }: { children: ReactNode }) {
  const [cms, setCMS] = useState<CMSContent | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const initialLoad = useRef(true);
  const prevCmsRef = useRef<CMSContent | null>(null); // snapshot before last save
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load from Supabase on mount
  useEffect(() => {
    loadCMS().then((data) => {
      prevCmsRef.current = data; // anchor for first diff
      setCMS(data);
    });
  }, []);

  // Debounced diff-aware save: only writes tables whose domain changed since last save
  useEffect(() => {
    if (!cms) return;
    if (initialLoad.current) {
      initialLoad.current = false;
      return;
    }
    const prevSnapshot = prevCmsRef.current;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSaving(true);
    saveTimer.current = setTimeout(async () => {
      try {
        await saveCMS(cms, prevSnapshot ?? undefined);
        prevCmsRef.current = cms;
        setSaveError(null);
      } catch (e) {
        setSaveError("Save failed — check your connection and try again.");
        console.error("[cms] save error:", e);
      } finally {
        setSaving(false);
      }
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cms]);

  // Pure state update — no side effects inside setState
  const updateCMS = useCallback((updater: (prev: CMSContent) => CMSContent) => {
    setCMS((prev) => updater(prev ?? defaults()));
  }, []);

  const clearSaveError = useCallback(() => setSaveError(null), []);

  const resetToDefaults = useCallback(async () => {
    await resetCMS();
    const fresh = await loadCMS();
    initialLoad.current = true;   // skip save-on-change for the reset load
    prevCmsRef.current = fresh;   // anchor to fresh state
    setCMS(fresh);
  }, []);

  if (!cms) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center gap-4 bg-white z-[9999]">
        <div
          className="w-10 h-10 rounded-full border-4 animate-spin"
          style={{ borderColor: "#FF9933 #FF9933 #FF9933 transparent" }}
        />
        <p className="text-sm font-semibold" style={{ color: "#FF9933" }}>Loading content…</p>
      </div>
    );
  }

  return (
    <CMSContext.Provider value={{ cms, updateCMS, resetToDefaults, saving, saveError, clearSaveError }}>
      {children}
    </CMSContext.Provider>
  );
}

export function useCMS() {
  const ctx = useContext(CMSContext);
  if (!ctx) throw new Error("useCMS must be used within <CMSProvider>");
  return ctx;
}
