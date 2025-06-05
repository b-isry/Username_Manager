document.addEventListener('DOMContentLoaded', () => {
  const addBtn = document.getElementById('add-username-btn');
  const form = document.getElementById('username-form');
  const cancelBtn = document.getElementById('cancel-btn');
  const list = document.getElementById('usernames-list');
  const platformInput = document.getElementById('platform');
  const usernameInput = document.getElementById('username');

  function showCopiedTooltip(target) {
    const tooltip = document.createElement('span');
    tooltip.textContent = 'Copied!';
    tooltip.style.marginLeft = '8px';
    tooltip.style.color = 'green';
    tooltip.style.fontSize = '0.9em';
    tooltip.className = 'copied-tooltip';
    target.parentNode.insertBefore(tooltip, target.nextSibling);
    setTimeout(() => {
      if (tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
    }, 1200);
  }

  async function copyToClipboard(text, btn) {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        showCopiedTooltip(btn);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = 0;
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        try {
          document.execCommand('copy');
          showCopiedTooltip(btn);
        } catch (err) {
          alert('Failed to copy');
        }
        document.body.removeChild(textarea);
      }
    } catch (err) {
      alert('Clipboard permission denied or unavailable.');
    }
  }

  function loadUsernames() {
    list.innerHTML = '';
    const usernames = JSON.parse(localStorage.getItem('usernames') || '[]');
    usernames.forEach((item, idx) => {
      const li = document.createElement('li');
      li.textContent = `${item.platform}: ${item.username}`;

      // Copy button
      const copyBtn = document.createElement('button');
      copyBtn.textContent = 'Copy';
      copyBtn.style.marginLeft = '8px';
      copyBtn.onclick = () => {
        copyToClipboard(item.username, copyBtn);
      };
      li.appendChild(copyBtn);

      const delBtn = document.createElement('button');
      delBtn.textContent = 'Delete';
      delBtn.style.marginLeft = '8px';
      delBtn.onclick = () => {
        usernames.splice(idx, 1);
        localStorage.setItem('usernames', JSON.stringify(usernames));
        loadUsernames();
      };
      li.appendChild(delBtn);
      list.appendChild(li);
    });
  }

  addBtn.onclick = () => {
    form.style.display = 'block';
    addBtn.style.display = 'none';
    platformInput.value = '';
    usernameInput.value = '';
  };

  cancelBtn.onclick = () => {
    form.style.display = 'none';
    addBtn.style.display = 'block';
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    const platform = platformInput.value.trim();
    const username = usernameInput.value.trim();
    if (!platform || !username) return;
    const usernames = JSON.parse(localStorage.getItem('usernames') || '[]');
    usernames.push({ platform, username });
    localStorage.setItem('usernames', JSON.stringify(usernames));
    form.style.display = 'none';
    addBtn.style.display = 'block';
    loadUsernames();
  };

  loadUsernames();
});