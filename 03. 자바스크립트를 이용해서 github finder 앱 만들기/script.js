// ──────────────────────────────────────────
// 1) GitHub API 호출 클래스 (OOP)
// ──────────────────────────────────────────
class GitHubAPI {
  constructor() {
    this.baseUrl = 'https://api.github.com/users/';
  }

  async fetchUser(username) {
    const res = await fetch(this.baseUrl + username);
    if (!res.ok) throw new Error('User not found');
    return res.json();
  }

  async fetchRepos(username) {
    const res = await fetch(
      this.baseUrl + username + '/repos?sort=created:desc&per_page=5'
    );
    if (!res.ok) throw new Error('Repos not found');
    return res.json();
  }
}

// ──────────────────────────────────────────
// 2) UI 렌더링 & 상태 관리 클래스
// ──────────────────────────────────────────
class UI {
  constructor() {
    this.alertContainer    = document.getElementById('alert-container');
    this.spinner           = document.getElementById('spinner');
    this.profileContainer  = document.getElementById('profile-container');
    this.calendarContainer = document.getElementById('calendar-container');
    this.reposContainer    = document.getElementById('repos-container');
  }

  showSpinner() { this.spinner.classList.add('show'); }
  hideSpinner() { this.spinner.classList.remove('show'); }

  showAlert(message) {
    this.clearAlert();
    const div = document.createElement('div');
    div.className = 'alert alert-danger';
    div.textContent = message;
    this.alertContainer.appendChild(div);
    setTimeout(() => this.clearAlert(), 3000);
  }

  clearAlert() {
    this.alertContainer.innerHTML = '';
  }

  clearAll() {
    this.clearAlert();
    this.profileContainer.innerHTML  = '';
    this.calendarContainer.innerHTML = '';
    this.reposContainer.innerHTML    = '';
  }

  renderProfile(user) {
    this.profileContainer.innerHTML = `
      <div class="card card-body mb-4">
        <div class="row">
          <div class="col-md-3 text-center">
            <img
              class="img-fluid mb-2 rounded-circle"
              src="${user.avatar_url}"
              alt="Avatar"
            />
            <a
              href="${user.html_url}"
              target="_blank"
              class="btn btn-primary btn-block mb-4"
            >View Profile</a>
          </div>
          <div class="col-md-9">
            <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
            <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
            <span class="badge badge-success">Followers: ${user.followers}</span>
            <span class="badge badge-info">Following: ${user.following}</span>
            <ul class="list-group mt-3">
              <li class="list-group-item">Company: ${user.company || '-'}</li>
              <li class="list-group-item">
                Website/Blog:
                <a href="${user.blog}" target="_blank">${user.blog || '-'}</a>
              </li>
              <li class="list-group-item">Location: ${user.location || '-'}</li>
              <li class="list-group-item">
                Member Since: ${new Date(user.created_at).toLocaleDateString()}
              </li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }

  renderCalendar(username) {
    this.calendarContainer.innerHTML = `
      <div class="card card-body mb-4">
        <img
          src="https://ghchart.rshah.org/${username}"
          class="img-fluid"
          alt="Contributions Chart"
        />
      </div>
    `;
  }

  renderRepos(repos) {
    this.reposContainer.innerHTML = '<h3 class="page-heading mb-3">Latest Repos</h3>';
    repos.forEach(repo => {
      const div = document.createElement('div');
      div.className = 'card card-body mb-2';
      div.innerHTML = `
        <div class="row">
          <div class="col-md-6">
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
          </div>
          <div class="col-md-6 text-right">
            <span class="badge badge-primary">Stars: ${repo.stargazers_count}</span>
            <span class="badge badge-secondary">Watchers: ${repo.watchers_count}</span>
            <span class="badge badge-success">Forks: ${repo.forks_count}</span>
          </div>
        </div>
      `;
      this.reposContainer.appendChild(div);
    });
  }
}

// ──────────────────────────────────────────
// 3) 초기화 및 이벤트 바인딩
// ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const api   = new GitHubAPI();
  const ui    = new UI();
  const form  = document.getElementById('search-form');
  const input = document.getElementById('search-input');
  const logo  = document.getElementById('logo');

  // 스피너 기본 숨김
  ui.hideSpinner();

  // ▶️ ➊ 페이지 로드 시: 마지막 검색어가 있으면 자동 검색
  const lastUser = localStorage.getItem('lastUsername');
  if (lastUser) {
    input.value = lastUser;
    searchUser(lastUser);
  }

  // ▶️ ➋ 검색 폼 제출
  form.addEventListener('submit', e => {
    e.preventDefault();
    const username = input.value.trim();
    if (!username) {
      ui.showAlert('GitHub 사용자명을 입력하세요');
      return;
    }
    localStorage.setItem('lastUsername', username);
    searchUser(username);
  });

  // ▶️ ➌ 로고 클릭: 초기 상태 복원
  logo.addEventListener('click', e => {
    e.preventDefault();
    localStorage.removeItem('lastUsername');
    input.value = '';
    ui.clearAll();
    ui.hideSpinner();
  });

  // 검색 수행 함수
  async function searchUser(username) {
    ui.clearAll();
    ui.showSpinner();
    try {
      const [user, repos] = await Promise.all([
        api.fetchUser(username),
        api.fetchRepos(username)
      ]);
      ui.renderProfile(user);
      ui.renderCalendar(username);
      ui.renderRepos(repos);
    } catch (err) {
      ui.showAlert(err.message);
      localStorage.removeItem('lastUsername');
    } finally {
      ui.hideSpinner();
    }
  }
});
