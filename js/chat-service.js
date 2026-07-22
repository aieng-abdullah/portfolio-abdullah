const ChatService = (() => {
  const STORAGE_KEY = 'portfolio_chat_session';
  const API_BASE = 'http://localhost:3000';
  const SLUG = 'portfolio';

  function getSessionId() {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = 'sess_' + crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  }

  async function sendMessage(message) {
    const res = await fetch(`${API_BASE}/api/chat/${SLUG}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sessionId: getSessionId(),
        message,
      }),
    });

    if (!res.ok) {
      throw new Error('Network response was not ok (' + res.status + ')');
    }

    const data = await res.json();
    return data.response || 'No response from assistant.';
  }

  return { getSessionId, sendMessage };
})();
