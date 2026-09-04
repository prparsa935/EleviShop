import Axios from "axios";
import { serverAddress } from "../App";

const SESSION_KEY = "analytics_session_id";

const getSessionId = () => {
  try {
    let sessionId = localStorage.getItem(SESSION_KEY);
    if (!sessionId) {
      sessionId =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : "s-" + Date.now() + "-" + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return "anonymous";
  }
};

/**
 * fire-and-forget: منتظر جواب نمی‌ماند و هیچ خطایی به UI برنمی‌گرداند
 */
const trackEvent = (eventType, data = {}) => {
  try {
    Axios.post(
      serverAddress + "analytics/track",
      {
        eventType,
        sessionId: getSessionId(),
        productId: data.productId ?? null,
        categoryId: data.categoryId ?? null,
        searchQuery: data.searchQuery ?? null,
        metadata: data.metadata ?? null,
      },
      { timeout: 4000 }
    ).catch(() => {});
  } catch {
    // آنالیتیکس هرگز نباید UI را خراب کند
  }
};

export { getSessionId, trackEvent };
