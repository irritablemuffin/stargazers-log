document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('repos');
  if (!container) return;
  fetch('events.json')
    .then(res => {
      if (!res.ok) throw new Error('Network response not ok');
      return res.json();
    })
    .then(data => renderRepos(data, container))
    .catch(err => {
      container.textContent = 'Failed to load repositories.';
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
  repos.forEach(r => {
    const li = document.createElement('li');
    li.className = 'repo-item';

    const a = document.createElement('a');
    a.href = r.html_url || '#';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'repo-name';
    a.textContent = r.full_name || r.name || 'Unnamed';

    const desc = document.createElement('div');
    desc.className = 'repo-desc';
    desc.textContent = r.description || '';

    const meta = document.createElement('div');
    meta.className = 'repo-meta';
    const stars = document.createElement('span');
    stars.textContent = `⭐ ${r.stargazers_count || 0}`;
    const starredAt = document.createElement('span');
    starredAt.style.marginLeft = '1rem';
    if (r.starred_at) {
      const d = new Date(r.starred_at);
      if (!isNaN(d)) starredAt.textContent = `Starred: ${d.toLocaleString()}`;
    }
    meta.appendChild(stars);
    meta.appendChild(starredAt);

    li.appendChild(a);
    if (r.description) li.appendChild(desc);
    li.appendChild(meta);
    ul.appendChild(li);
  });
  container.innerHTML = '';
  container.appendChild(ul);
}

