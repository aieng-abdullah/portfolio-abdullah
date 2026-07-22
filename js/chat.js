document.addEventListener('DOMContentLoaded', () => {
  const fab = document.getElementById('chatFab');
  const overlay = document.getElementById('chatOverlay');
  const panel = document.getElementById('chatPanel');
  const closeBtn = document.getElementById('chatClose');
  const messages = document.getElementById('chatMessages');
  const input = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');

  let isOpen = false;
  let isLoading = false;

  // ─── Toggle ───
  function openChat() {
    isOpen = true;
    fab.classList.add('is-open');
    overlay.classList.add('is-visible');
    panel.classList.add('is-open');
    input.focus();
    scrollToBottom();
  }

  function closeChat() {
    isOpen = false;
    fab.classList.remove('is-open');
    overlay.classList.remove('is-visible');
    panel.classList.remove('is-open');
  }

  fab.addEventListener('click', () => (isOpen ? closeChat() : openChat()));
  closeBtn.addEventListener('click', closeChat);
  overlay.addEventListener('click', closeChat);

  // ─── Render ───
  function scrollToBottom() {
    requestAnimationFrame(() => {
      messages.scrollTop = messages.scrollHeight;
    });
  }

  function renderMessage(role, text) {
    const msg = document.createElement('div');
    msg.className = 'chat-msg chat-msg-' + role;

    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble';
    bubble.textContent = text;

    const label = document.createElement('div');
    label.className = 'chat-msg-label';
    label.textContent = role === 'user' ? 'You' : 'Assistant';

    msg.appendChild(bubble);
    msg.appendChild(label);
    messages.appendChild(msg);
    scrollToBottom();
  }

  function renderError(text) {
    const el = document.createElement('div');
    el.className = 'chat-error';
    el.textContent = text;
    messages.appendChild(el);
    scrollToBottom();
  }

  function showTyping() {
    const el = document.createElement('div');
    el.className = 'chat-typing';
    el.id = 'chatTyping';
    el.innerHTML =
      '<div class="chat-typing-dots"><span></span><span></span><span></span></div>';
    messages.appendChild(el);
    scrollToBottom();
  }

  function hideTyping() {
    const el = document.getElementById('chatTyping');
    if (el) el.remove();
  }

  // ─── Send ───
  async function sendMessage() {
    const text = input.value.trim();
    if (!text || isLoading) return;

    isLoading = true;
    input.value = '';
    input.style.height = 'auto';
    sendBtn.disabled = true;

    renderMessage('user', text);
    showTyping();

    let assistantMsgEl = null;
    let streamed = false;

    ChatService.sendMessageStream(
      text,
      (token) => {
        if (!assistantMsgEl) {
          hideTyping();
          assistantMsgEl = document.createElement('div');
          assistantMsgEl.className = 'chat-msg chat-msg-assistant';
          const bubble = document.createElement('div');
          bubble.className = 'chat-bubble';
          assistantMsgEl.appendChild(bubble);
          const label = document.createElement('div');
          label.className = 'chat-msg-label';
          label.textContent = 'Assistant';
          assistantMsgEl.appendChild(label);
          messages.appendChild(assistantMsgEl);
        }
        assistantMsgEl.querySelector('.chat-bubble').textContent += token;
        scrollToBottom();
        streamed = true;
      },
      () => {
        hideTyping();
        isLoading = false;
        sendBtn.disabled = false;
        input.focus();
      },
      () => {
        hideTyping();
        if (!streamed) {
          renderError('Something went wrong. Please try again.');
        }
        isLoading = false;
        sendBtn.disabled = false;
        input.focus();
      }
    );
  }

  sendBtn.addEventListener('click', sendMessage);

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Auto-resize textarea
  input.addEventListener('input', () => {
    input.style.height = 'auto';
    input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  });

  // ─── Welcome message ───
  renderMessage(
    'assistant',
    "Hi! I'm Abdullah's AI assistant. Ask me about his skills, projects, or experience."
  );
});
