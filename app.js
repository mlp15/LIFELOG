/* LIFELOG - Functional Application Logic & Storage Engine */

const STORAGE_MEMORIES = 'lifelog_memories';
const STORAGE_EXPENSES = 'lifelog_expenses';
const STORAGE_USER = 'lifelog_user';

let memories = [];
let expenses = [];
let currentUser = { name: 'Maya', language: 'id' };
let selectedPhotoBase64 = '';
let currentFilterMood = 'ALL';
let activeDetailId = null;

const i18n = {
  id: { navHome: "Home", navMemories: "Memories", navTimeline: "Timeline", navMusic: "Soundtrack", navInsights: "Insights", navSpending: "Spending", navSettings: "Settings", recentMemories: "Kenangan Terbaru", newMemory: "Memory Baru" },
  en: { navHome: "Home", navMemories: "Memories", navTimeline: "Timeline", navMusic: "Soundtrack", navInsights: "Insights", navSpending: "Spending", navSettings: "Settings", recentMemories: "Recent Memories", newMemory: "New Memory" },
  ar: { navHome: "الرئيسية", navMemories: "الذكريات", navTimeline: "الجدول", navMusic: "الموسيقى", navInsights: "الإحصائيات", navSpending: "المصاريف", navSettings: "الإعدادات", recentMemories: "الذكريات الأخيرة", newMemory: "ذكرى جديدة" },
  ja: { navHome: "ホーム", navMemories: "思い出", navTimeline: "タイムライン", navMusic: "音楽", navInsights: "分析", navSpending: "支出", navSettings: "設定", recentMemories: "最近の思い出", newMemory: "新しい思い出" }
};

document.addEventListener('DOMContentLoaded', () => {
  loadDataFromStorage();
  updateUserUI();
  renderDateStrip();
  renderAllViews();
});

function loadDataFromStorage() {
  const savedUser = localStorage.getItem(STORAGE_USER);
  if (savedUser) currentUser = JSON.parse(savedUser);

  const savedMemories = localStorage.getItem(STORAGE_MEMORIES);
  memories = savedMemories ? JSON.parse(savedMemories) : [];

  const savedExpenses = localStorage.getItem(STORAGE_EXPENSES);
  expenses = savedExpenses ? JSON.parse(savedExpenses) : [];
}

function saveMemoriesToStorage() {
  localStorage.setItem(STORAGE_MEMORIES, JSON.stringify(memories));
  renderAllViews();
}

function saveExpensesToStorage() {
  localStorage.setItem(STORAGE_EXPENSES, JSON.stringify(expenses));
  renderAllViews();
}

function saveUserToStorage() {
  localStorage.setItem(STORAGE_USER, JSON.stringify(currentUser));
  updateUserUI();
}

function switchTab(tabKey) {
  document.querySelectorAll('.page-view').forEach(page => page.classList.remove('active'));
  document.querySelectorAll('.nav-item, .nav-link').forEach(btn => btn.classList.remove('active'));

  const targetPage = document.getElementById(`page-${tabKey}`);
  if (targetPage) targetPage.classList.add('active');

  document.querySelectorAll(`.nav-item[onclick*="${tabKey}"], .nav-link[onclick*="${tabKey}"]`).forEach(btn => btn.classList.add('active'));

  window.scrollTo(0, 0);
}

function renderAllViews() {
  renderHomeFeed();
  renderMemoriesPage();
  renderTimelinePage();
  renderSoundtrackPage();
  renderInsightsPage();
  renderSpendingPage();
}

function updateUserUI() {
  document.getElementById('userGreeting').textContent = `Halo, ${currentUser.name} 👋`;
  document.getElementById('userAvatar').textContent = currentUser.name.charAt(0).toUpperCase();
  document.getElementById('settingUserNameInput').value = currentUser.name;
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('currentFullDate').textContent = new Date().toLocaleDateString('id-ID', options);

  document.documentElement.dir = currentUser.language === 'ar' ? 'rtl' : 'ltr';
  const t = i18n[currentUser.language] || i18n.id;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
}

function saveUserProfile() {
  const name = document.getElementById('settingUserNameInput').value.trim();
  if (name) {
    currentUser.name = name;
    saveUserToStorage();
    alert('Profil berhasil diperbarui!');
  }
}

function setLanguage(langKey) {
  currentUser.language = langKey;
  saveUserToStorage();
}

function renderDateStrip() {
  const container = document.getElementById('homeDateStrip');
  container.innerHTML = '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();

  for (let i = -3; i <= 3; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const isToday = i === 0;

    const card = document.createElement('div');
    card.className = `date-card ${isToday ? 'active' : ''}`;
    card.innerHTML = `
      <span class="day">${days[d.getDay()]}</span>
      <span class="num">${d.getDate()}</span>
    `;
    container.appendChild(card);
  }
}

function renderHomeFeed() {
  const container = document.getElementById('homeFeedContainer');
  const searchQuery = document.getElementById('homeSearchInput').value.toLowerCase();
  container.innerHTML = '';

  const filtered = memories.filter(m => 
    m.title.toLowerCase().includes(searchQuery) || 
    m.story.toLowerCase().includes(searchQuery) ||
    m.location.toLowerCase().includes(searchQuery)
  );

  if (memories.length > 0 && memories[0].song) {
    document.getElementById('heroSongTitle').textContent = memories[0].song;
    document.getElementById('heroSongSub').textContent = `📍 ${memories[0].location || 'Momen'} • ${memories[0].date}`;
  } else {
    document.getElementById('heroSongTitle').textContent = 'Belum ada lagu tercatat';
    document.getElementById('heroSongSub').textContent = 'Abadikan momen Anda hari ini';
  }

  if (filtered.length === 0) {
    container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:30px;">Belum ada kenangan. Klik + untuk membuat baru!</p>`;
    return;
  }

  filtered.slice(0, 4).forEach(item => {
    container.appendChild(createMemoryCardElement(item));
  });
}

function renderMemoriesPage() {
  const container = document.getElementById('memoriesListContainer');
  const searchQuery = document.getElementById('memoriesSearchInput').value.toLowerCase();
  container.innerHTML = '';

  document.getElementById('memoriesCountSub').textContent = `${memories.length} cerita tersimpan`;

  let filtered = memories.filter(m => 
    m.title.toLowerCase().includes(searchQuery) || 
    m.story.toLowerCase().includes(searchQuery) ||
    m.location.toLowerCase().includes(searchQuery)
  );

  if (currentFilterMood !== 'ALL') {
    filtered = filtered.filter(m => m.mood === currentFilterMood);
  }

  if (filtered.length === 0) {
    container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:30px;">Tidak ada kenangan yang ditemukan.</p>`;
    return;
  }

  filtered.forEach(item => {
    container.appendChild(createMemoryCardElement(item));
  });
}

function filterMemoriesByMood(mood, btnElement) {
  currentFilterMood = mood;
  document.querySelectorAll('#moodFilterChips .chip-btn').forEach(b => b.classList.remove('active'));
  btnElement.classList.add('active');
  renderMemoriesPage();
}

function createMemoryCardElement(item) {
  const card = document.createElement('article');
  card.className = 'card-hifi';
  card.onclick = () => openMemoryDetail(item.id);

  const imgHtml = item.photo ? 
    `<img src="${item.photo}" class="card-img" alt="${item.title}">` : 
    `<div class="card-img-placeholder">🖼️</div>`;

  card.innerHTML = `
    ${imgHtml}
    <div class="card-body">
      <span class="card-badge">${getMoodEmoji(item.mood)} ${item.mood}</span>
      <h3 class="card-heading">${item.title}</h3>
      <p class="card-desc">${item.story || 'Tidak ada cerita tertulis.'}</p>
      <div class="card-meta-row">
        <span>📍 ${item.location || 'Tanpa Lokasi'}</span>
        <span>🎵 ${item.song || 'Tanpa Lagu'}</span>
      </div>
    </div>
  `;
  return card;
}

function openMemoryDetail(id) {
  const item = memories.find(m => m.id === id);
  if (!item) return;
  activeDetailId = id;

  const container = document.getElementById('memoryDetailBody');
  const imgHtml = item.photo ? 
    `<img src="${item.photo}" style="width:100%; height:220px; object-fit:cover; border-radius:16px; margin-bottom:16px;">` : '';

  container.innerHTML = `
    ${imgHtml}
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
      <span class="card-badge">${getMoodEmoji(item.mood)} ${item.mood}</span>
      <span style="font-size:12px; color:var(--text-muted);">${item.date}</span>
    </div>
    <h2 style="font-family:'Plus Jakarta Sans'; font-size:22px; font-weight:700; margin-bottom:4px;">${item.title}</h2>
    <div style="font-size:13px; color:var(--accent-slate); font-weight:600; margin-bottom:16px;">📍 ${item.location || 'Lokasi tidak dicantumkan'}</div>

    ${item.song ? `
      <div style="background:var(--accent-slate); color:white; padding:14px; border-radius:16px; display:flex; align-items:center; justify-content:space-between; margin-bottom:16px;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:20px;">💿</span>
          <div>
            <div style="font-size:14px; font-weight:700;">${item.song}</div>
            <div style="font-size:11px; opacity:0.8;">Soundtrack Terhubung</div>
          </div>
        </div>
      </div>
    ` : ''}

    <p style="font-size:14px; color:var(--text-main); line-height:1.7; white-space:pre-line;">${item.story || 'Tidak ada cerita tertulis.'}</p>
  `;

  document.getElementById('btnEditMemory').onclick = () => openEditMemoryModal(id);
  document.getElementById('btnDeleteMemory').onclick = () => deleteMemory(id);

  switchTab('detail');
}

function renderTimelinePage() {
  const container = document.getElementById('timelineStreamContainer');
  container.innerHTML = '';

  const sorted = [...memories].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sorted.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted);">Belum ada timeline kenangan.</p>`;
    return;
  }

  sorted.forEach(item => {
    const el = document.createElement('div');
    el.className = 'timeline-item';
    el.onclick = () => openMemoryDetail(item.id);
    el.innerHTML = `
      <div class="timeline-dot"></div>
      <div style="font-size:11px; font-weight:700; color:var(--accent-terracotta); margin-bottom:4px;">${item.date}</div>
      <div class="timeline-card">
        <div style="font-weight:700; font-size:15px;">${item.title}</div>
        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">📍 ${item.location || '-'} • 🎵 ${item.song || '-'}</div>
      </div>
    `;
    container.appendChild(el);
  });
}

function renderSoundtrackPage() {
  const container = document.getElementById('soundtrackListContainer');
  container.innerHTML = '';

  const songItems = memories.filter(m => m.song && m.song.trim() !== '');
  document.getElementById('soundtrackCountSub').textContent = `${songItems.length} Lagu Terhubung`;

  if (songItems.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:20px;">Belum ada lagu yang dihubungkan dengan kenangan.</p>`;
    return;
  }

  songItems.forEach(item => {
    const el = document.createElement('div');
    el.className = 'soundtrack-item';
    el.onclick = () => openMemoryDetail(item.id);
    el.innerHTML = `
      <div style="display:flex; align-items:center; gap:12px;">
        <div style="width:42px; height:42px; border-radius:10px; background:var(--accent-slate); color:white; display:flex; align-items:center; justify-content:center; font-size:18px;">💿</div>
        <div>
          <div style="font-weight:700; font-size:14px;">${item.song}</div>
          <div style="font-size:12px; color:var(--text-muted);">Momen: ${item.title}</div>
        </div>
      </div>
      <div style="color:var(--accent-terracotta); font-size:16px;">▶</div>
    `;
    container.appendChild(el);
  });
}

function renderInsightsPage() {
  document.getElementById('statTotalMemories').textContent = `${memories.length} Momen`;

  const moodCounts = {};
  memories.forEach(m => { moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1; });
  let topMood = '-';
  let maxCount = 0;
  for (const m in moodCounts) {
    if (moodCounts[m] > maxCount) { maxCount = moodCounts[m]; topMood = m; }
  }
  document.getElementById('statDominantMood').textContent = topMood !== '-' ? `${getMoodEmoji(topMood)} ${topMood}` : '-';

  const locCounts = {};
  memories.forEach(m => { if (m.location) locCounts[m.location] = (locCounts[m.location] || 0) + 1; });
  const locList = document.getElementById('statTopLocationsList');
  locList.innerHTML = Object.keys(locCounts).length ? '' : '<span style="font-size:12px; color:var(--text-muted);">Belum ada data lokasi.</span>';
  for (const loc in locCounts) {
    locList.innerHTML += `<div style="font-size:13px; margin-top:6px;">📍 <strong>${loc}</strong> (${locCounts[loc]}x dicatat)</div>`;
  }
}

function renderSpendingPage() {
  const container = document.getElementById('spendingListContainer');
  container.innerHTML = '';

  const totalSpent = expenses.reduce((sum, item) => sum + Number(item.amount), 0);
  document.getElementById('totalSpendingAmount').textContent = `Rp ${totalSpent.toLocaleString('id-ID')}`;

  if (expenses.length === 0) {
    container.innerHTML = `<p style="color:var(--text-muted); text-align:center; padding:20px;">Belum ada catatan pengeluaran.</p>`;
    return;
  }

  expenses.forEach(item => {
    const el = document.createElement('div');
    el.className = 'spending-item';
    el.innerHTML = `
      <div>
        <div style="font-weight:700; font-size:14px;">${item.note}</div>
        <div style="font-size:11px; color:var(--text-muted);">${item.date} • ${item.category}</div>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <div style="font-weight:700; color:var(--accent-terracotta);">Rp ${Number(item.amount).toLocaleString('id-ID')}</div>
        <button onclick="deleteExpense('${item.id}')" style="background:none; border:none; color:#DC2626; cursor:pointer;">🗑️</button>
      </div>
    `;
    container.appendChild(el);
  });
}

function openAddMemoryModal() {
  document.getElementById('memoryForm').reset();
  document.getElementById('memoryIdInput').value = '';
  document.getElementById('modalMemoryFormTitle').textContent = 'Kenangan Baru';
  document.getElementById('memoryDateInput').valueAsDate = new Date();
  selectedPhotoBase64 = '';
  document.getElementById('memoryImagePreview').classList.add('hidden');
  document.getElementById('photoPlaceholderText').classList.remove('hidden');
  openModal('modalMemoryForm');
}

function openEditMemoryModal(id) {
  const item = memories.find(m => m.id === id);
  if (!item) return;

  document.getElementById('memoryIdInput').value = item.id;
  document.getElementById('memoryTitleInput').value = item.title;
  document.getElementById('memoryDateInput').value = item.date;
  document.getElementById('memoryLocationInput').value = item.location || '';
  document.getElementById('memoryMoodSelect').value = item.mood;
  document.getElementById('memorySongInput').value = item.song || '';
  document.getElementById('memoryStoryInput').value = item.story || '';
  
  selectedPhotoBase64 = item.photo || '';
  if (selectedPhotoBase64) {
    document.getElementById('memoryImagePreview').src = selectedPhotoBase64;
    document.getElementById('memoryImagePreview').classList.remove('hidden');
    document.getElementById('photoPlaceholderText').classList.add('hidden');
  }

  document.getElementById('modalMemoryFormTitle').textContent = 'Edit Kenangan';
  openModal('modalMemoryForm');
}

function handlePhotoSelect(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    selectedPhotoBase64 = e.target.result;
    document.getElementById('memoryImagePreview').src = selectedPhotoBase64;
    document.getElementById('memoryImagePreview').classList.remove('hidden');
    document.getElementById('photoPlaceholderText').classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

function handleSaveMemory(event) {
  event.preventDefault();
  const id = document.getElementById('memoryIdInput').value || 'mem_' + Date.now();
  const title = document.getElementById('memoryTitleInput').value.trim();
  const date = document.getElementById('memoryDateInput').value;
  const location = document.getElementById('memoryLocationInput').value.trim();
  const mood = document.getElementById('memoryMoodSelect').value;
  const song = document.getElementById('memorySongInput').value.trim();
  const story = document.getElementById('memoryStoryInput').value.trim();

  const newMemory = { id, title, date, location, mood, song, story, photo: selectedPhotoBase64 };

  const existingIndex = memories.findIndex(m => m.id === id);
  if (existingIndex >= 0) {
    memories[existingIndex] = newMemory;
  } else {
    memories.unshift(newMemory);
  }

  saveMemoriesToStorage();
  closeModal('modalMemoryForm');

  if (activeDetailId === id) openMemoryDetail(id);
}

function deleteMemory(id) {
  if (confirm('Apakah Anda yakin ingin menghapus kenangan ini?')) {
    memories = memories.filter(m => m.id !== id);
    saveMemoriesToStorage();
    switchTab('memories');
  }
}

function openAddExpenseModal() {
  document.getElementById('expenseForm').reset();
  document.getElementById('expenseDateInput').valueAsDate = new Date();
  openModal('modalExpenseForm');
}

function handleSaveExpense(event) {
  event.preventDefault();
  const id = 'exp_' + Date.now();
  const amount = document.getElementById('expenseAmountInput').value;
  const note = document.getElementById('expenseNoteInput').value.trim();
  const category = document.getElementById('expenseCategorySelect').value;
  const date = document.getElementById('expenseDateInput').value;

  expenses.unshift({ id, amount, note, category, date });
  saveExpensesToStorage();
  closeModal('modalExpenseForm');
}

function deleteExpense(id) {
  if (confirm('Hapus pencatatan pengeluaran ini?')) {
    expenses = expenses.filter(e => e.id !== id);
    saveExpensesToStorage();
  }
}

function openModal(modalId) { document.getElementById(modalId).classList.add('active'); }
function closeModal(modalId) { document.getElementById(modalId).classList.remove('active'); }

function clearAllData() {
  if (confirm('⚠️ PERINGATAN: Seluruh data lokal kenangan & pengeluaran akan dihapus secara permanen!')) {
    localStorage.clear();
    memories = [];
    expenses = [];
    currentUser = { name: 'Maya', language: 'id' };
    saveUserToStorage();
    renderAllViews();
    alert('Seluruh data berhasil direset.');
  }
}

function getMoodEmoji(mood) {
  switch (mood) {
    case 'Senang': return '😊';
    case 'Tenang': return '☕';
    case 'Nostalgia': return '🌧️';
    case 'Bersemangat': return '🔥';
    default: return '✨';
  }
}