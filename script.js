document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('repos');
  if (!container) return;

  // indicate we're loading
  container.setAttribute('aria-busy', 'true');

  fetch('events.json')
    .then(res => {
      if (!res.ok) throw new Error('Network response not ok');
      return res.json();
    })
    .then(data => {
      renderRepos(data, container);
      // loading finished
      container.setAttribute('aria-busy', 'false');
    })
    .catch(err => {
      container.textContent = 'Failed to load repositories.';
      container.setAttribute('aria-busy', 'false');
      console.error(err);
    });
});

function renderRepos(repos, container) {
  if (!Array.isArray(repos)) {
    container.textContent = 'No repositories found.';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'repo-list';

  // Use a fragment to minimize reflow for large lists
  const frag = document.createDocumentFragment();

  repos.forEach(r => {
    const li = document.createElement('li');
    li.className = 'repo-item';

    // Title: make it a heading for screen reader navigation
    const h2 = document.createElement('h2');

    const a = document.createElement('a');
    a.href = r.html_url || '#';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'repo-name';
    a.textContent = r.full_name || r.name || 'Unnamed';
    h2.appendChild(a);

    const desc = document.createElement('div');
    desc.className = 'repo-desc';
    // Use textContent to avoid XSS
    desc.textContent = r.description || '';

    const meta = document.createElement('div');
    meta.className = 'repo-meta';

    const stars = document.createElement('span');
    // Emoji should be hidden from AT, provide an accessible label instead
    const starEmoji = document.createElement('span');
    starEmoji.setAttribute('aria-hidden', 'true');
    starEmoji.textContent = '⭐';
    stars.appendChild(starEmoji);

    const count = r.stargazers_count || 0;
    stars.setAttribute('aria-label', `${count} stars`);
    stars.className = 'star-count';

    const starredAt = document.createElement('span');
    starredAt.style.marginLeft = '1rem';
    if (r.starred_at) {
      const d = new Date(r.starred_at);
      if (!isNaN(d.getTime())) {
        starredAt.textContent = `Starred: ${d.toLocaleString()}`;
      }
    }

    meta.appendChild(stars);
    meta.appendChild(starredAt);

    li.appendChild(h2);
    if (r.description) li.appendChild(desc);
    li.appendChild(meta);
    frag.appendChild(li);
  });

  ul.appendChild(frag);
  container.innerHTML = '';
  container.appendChild(ul);
}
