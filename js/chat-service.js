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

  async function sendMessageStream(message, onToken, onDone, onError) {
    try {
      const res = await fetch(`${API_BASE}/api/chat/${SLUG}/stream`, {
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

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data: ')) continue;

          try {
            const parsed = JSON.parse(trimmed.slice(6));
            if (parsed.token) {
              onToken(parsed.token);
            } else if (parsed.done) {
              onDone(parsed.fullResponse || '');
            } else if (parsed.error) {
              onError(parsed.error);
            }
          } catch {
          }
        }
      }
    } catch (err) {
      onError(err.message || 'Something went wrong.');
    }
  }

  return { getSessionId, sendMessage, sendMessageStream };
})();
