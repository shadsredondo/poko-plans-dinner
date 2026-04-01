export const CHAT_STATE_KEY = "poko_chat_state";

const safeStorage = {
  getItem(key: string) {
    try {
      return localStorage.getItem(key) ?? sessionStorage.getItem(key);
    } catch {
      try {
        return sessionStorage.getItem(key);
      } catch {
        return null;
      }
    }
  },
  setItem(key: string, value: string) {
    try {
      localStorage.setItem(key, value);
    } catch {}

    try {
      sessionStorage.setItem(key, value);
    } catch {}
  },
  removeItem(key: string) {
    try {
      localStorage.removeItem(key);
    } catch {}

    try {
      sessionStorage.removeItem(key);
    } catch {}
  },
};

export const loadChatState = () => {
  try {
    const saved = safeStorage.getItem(CHAT_STATE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

export const saveChatState = (state: unknown) => {
  try {
    safeStorage.setItem(CHAT_STATE_KEY, JSON.stringify(state));
  } catch {}
};

export const clearChatState = () => {
  safeStorage.removeItem(CHAT_STATE_KEY);
};

export const hasStoredChatState = () => {
  const state = loadChatState();
  return Boolean(state?.step && state.step !== "welcome");
};