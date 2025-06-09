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

    if (usernames.length === 0) {
      const messageLi = document.createElement('li');
      messageLi.id = 'no-usernames-message'; 
      messageLi.textContent = 'No URLs saved yet. Click "Add New URL" to get started!';
      list.appendChild(messageLi);
    } else {
      usernames.forEach((item, idx) => {
        const li = document.createElement('li');

        const detailsDiv = document.createElement('div');
        detailsDiv.className = 'username-item-details';

        const platformSpan = document.createElement('span');
        platformSpan.className = 'username-item-platform';
        platformSpan.textContent = item.platform;

        const urlSpan = document.createElement('span');
        urlSpan.className = 'username-item-url';
        urlSpan.textContent = item.username;

        detailsDiv.appendChild(platformSpan);
        detailsDiv.appendChild(urlSpan);

        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'username-item-actions';

        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        const copyIconSpan = document.createElement('span');
        copyIconSpan.className = 'icon-copy'; 
        copyBtn.appendChild(copyIconSpan);
        copyBtn.append(' Copy'); 
        copyBtn.onclick = () => {
          copyToClipboard(item.username, copyBtn);
        };

        const delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        const deleteIconSpan = document.createElement('span');
        deleteIconSpan.className = 'icon-delete'; 
        delBtn.appendChild(deleteIconSpan);
        delBtn.append(' Delete'); 
        delBtn.onclick = () => {

          const updatedUsernames = usernames.filter((_, index) => index !== idx);
          localStorage.setItem('usernames', JSON.stringify(updatedUsernames));
          loadUsernames(); 
        };

        actionsDiv.appendChild(copyBtn);
        actionsDiv.appendChild(delBtn);

        li.appendChild(detailsDiv);
        li.appendChild(actionsDiv);

        list.appendChild(li);
      });
    }
  }

  addBtn.onclick = () => {
    form.classList.remove('hidden'); 
    addBtn.style.display = 'none';  
    platformInput.value = '';
    usernameInput.value = '';
  };

  cancelBtn.onclick = () => {
    form.classList.add('hidden'); 
    addBtn.style.display = '';   
  };

  form.onsubmit = (e) => {
    e.preventDefault();
    const platform = platformInput.value.trim();
    const username = usernameInput.value.trim();
    if (!platform || !username) return;
    const usernames = JSON.parse(localStorage.getItem('usernames') || '[]');
    usernames.push({ platform, username });
    localStorage.setItem('usernames', JSON.stringify(usernames));
    form.classList.add('hidden'); 
    addBtn.style.display = '';    
    loadUsernames();
  };

  loadUsernames();

  const githubLink = document.getElementById('github-link');
  if (githubLink) {
    githubLink.addEventListener('click', (event) => {
      event.preventDefault(); 
      chrome.tabs.create({ url: githubLink.href });
    });
  }
});