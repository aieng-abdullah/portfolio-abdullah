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

  function sendMessageStream(message, onToken, onDone, onError) {
    const xhr = new XMLHttpRequest();
    let prevLen = 0;
    let leftover = '';

    xhr.open('POST', `${API_BASE}/api/chat/${SLUG}/stream`);
    xhr.setRequestHeader('Content-Type', 'application/json');

    xhr.onprogress = function () {
      const data = xhr.responseText.slice(prevLen);
      prevLen = xhr.responseText.length;
      if (!data && !leftover) return;

      const combined = leftover + data;
      const lines = combined.split('\n');
      leftover = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data: ')) continue;
        try {
          const parsed = JSON.parse(trimmed.slice(6));
          if (parsed.token) onToken(parsed.token);
        } catch {
        }
      }
    };

    xhr.onload = function () {
      if (xhr.status < 200 || xhr.status >= 300) {
        onError('Server error (' + xhr.status + ')');
        return;
      }
      onDone('');
    };

    xhr.onerror = function () {
      onError('Network error');
    };

    xhr.send(JSON.stringify({
      sessionId: getSessionId(),
      message,
    }));
  }

  return { getSessionId, sendMessage, sendMessageStream };
})();
