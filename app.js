/* LIFELOG - Premium Personal Journal (Supabase SDK v2 Core) */

// ==========================================
// 1. SUPABASE CLIENT CONFIGURATION
// ==========================================
const SUPABASE_URL = 'https://dmbhsxtlfpxxyvabidar.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_xwSAN9nPFf6PwKfV1W15Mw_siNoXroK'; 

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ==========================================
// 2. STATE APLIKASI
// ==========================================
let currentUser = null;
let userProfile = null;
let memories = [];
let expenses = [];
let selectedPhotoFile = null;
let currentFilterMood = 'ALL';
let activeDetailId = null;
let spendingChartInstance = null;

// Kamus Multi-Bahasa Complete (i18n)
const i18n = {
  id: {
    authSubtitle: "Jurnal personal, soundtrack hidup, dan pelacak keuangan Anda.",
    login: "Masuk", register: "Daftar Akun", submitLogin: "Masuk ke LIFELOG", submitRegister: "Buat Akun Baru",
    fullName: "Nama Lengkap", email: "Email", password: "Kata Sandi", confirmPassword: "Konfirmasi Kata Sandi",
    navHome: "Home", navMemories: "Memories", navTimeline: "Timeline", navMusic: "Soundtrack", navInsights: "Insights", navSpending: "Spending", navSettings: "Settings",
    recentMemories: "Kenangan Terbaru", newMemory: "Memory Baru", heroSoundtrackTag: "🎵 Soundtrack Terkini",
    memoriesTitle: "Jurnal Kenangan", add: "Tambah", moodAll: "Semua Mood", detailTitle: "Detail Kenangan",
    timelineTitle: "Garis Waktu", timelineSub: "Kronologi Berdasarkan Urutan Tanggal", insightsSub: "Statistik Kebiasaan & Catatan",
    totalMemories: "Total Kenangan", dominantMood: "Mood Dominan", topLocations: "📍 Lokasi Sering Dikunjungi",
    spendingSub: "Visualisasi & Pelacak Keuangan", addTransaction: "Transaksi", totalSpending: "Total Pengeluaran",
    averageSpending: "Rata-rata:", highestSpending: "Terbesar:", chartTitle: "Grafik Analisis Pengeluaran",
    filterMonthly: "Bulanan", filterWeekly: "Mingguan", historyTitle: "Riwayat Transaksi", settingsTitle: "Settings",
    settingsSub: "Pengaturan Akun & Bahasa", logout: "Keluar", userProfile: "👤 Profil Pengguna", saveProfile: "Simpan Profil",
    selectLanguage: "🌐 Pilih Bahasa (Language)", uploadPhoto: "Unggah Foto Momen", chooseGallery: "Pilih foto dari Galeri",
    titleLabel: "Judul Momen *", dateLabel: "Tanggal *", locationLabel: "Lokasi", moodLabel: "Suasana Hati (Mood)",
    soundtrackSearchLabel: "Cari Soundtrack Spotify (Artis / Judul Lagu)", search: "Cari", journalStory: "Cerita Jurnal",
    cancel: "Batal", saveMemory: "Simpan Kenangan", addExpenseTitle: "Tambah Pengeluaran", amountLabel: "Jumlah Pengeluaran (Rp) *",
    noteLabel: "Keterangan / Catatan *", categoryLabel: "Kategori", saveTransaction: "Simpan Transaksi"
  },
  en: {
    authSubtitle: "Your personal journal, life soundtrack, and spending tracker app.",
    login: "Log In", register: "Sign Up", submitLogin: "Log In to LIFELOG", submitRegister: "Create New Account",
    fullName: "Full Name", email: "Email", password: "Password", confirmPassword: "Confirm Password",
    navHome: "Home", navMemories: "Memories", navTimeline: "Timeline", navMusic: "Soundtrack", navInsights: "Insights", navSpending: "Spending", navSettings: "Settings",
    recentMemories: "Recent Memories", newMemory: "New Memory", heroSoundtrackTag: "🎵 Current Soundtrack",
    memoriesTitle: "Memory Journal", add: "Add", moodAll: "All Moods", detailTitle: "Memory Details",
    timelineTitle: "Timeline", timelineSub: "Chronological Stream by Date", insightsSub: "Habit & Memory Analytics",
    totalMemories: "Total Memories", dominantMood: "Dominant Mood", topLocations: "📍 Top Visited Locations",
    spendingSub: "Financial Visuals & Tracker", addTransaction: "Transaction", totalSpending: "Total Spending",
    averageSpending: "Average:", highestSpending: "Highest:", chartTitle: "Spending Analysis Chart",
    filterMonthly: "Monthly", filterWeekly: "Weekly", historyTitle: "Transaction History", settingsTitle: "Settings",
    settingsSub: "Account & Language Preferences", logout: "Log Out", userProfile: "👤 User Profile", saveProfile: "Save Profile",
    selectLanguage: "🌐 Select Language", uploadPhoto: "Upload Moment Photo", chooseGallery: "Select photo from Gallery",
    titleLabel: "Moment Title *", dateLabel: "Date *", locationLabel: "Location", moodLabel: "Mood",
    soundtrackSearchLabel: "Search Spotify Soundtrack (Artist / Song)", search: "Search", journalStory: "Journal Story",
    cancel: "Cancel", saveMemory: "Save Memory", addExpenseTitle: "Add Expense", amountLabel: "Amount (Rp) *",
    noteLabel: "Description *", categoryLabel: "Category", saveTransaction: "Save Transaction"
  },
  ar: {
    authSubtitle: "تطبيقك الشخصي لتدوين الذكريات، موسيقى الحياة، ومتابعة المصاريف.",
    login: "تسجيل الدخول", register: "إنشاء حساب", submitLogin: "الدخول إلى LIFELOG", submitRegister: "إنشاء حساب جديد",
    fullName: "الاسم الكامل", email: "البريد الإلكتروني", password: "كلمة المرور", confirmPassword: "تأكيد كلمة المرور",
    navHome: "الرئيسية", navMemories: "الذكريات", navTimeline: "الجدول", navMusic: "الموسيقى", navInsights: "الإحصائيات", navSpending: "المصاريف", navSettings: "الإعدادات",
    recentMemories: "الذكريات الأخيرة", newMemory: "ذكرى جديدة", heroSoundtrackTag: "🎵 الموسيقى الحالية",
    memoriesTitle: "دفتر الذكريات", add: "إضافة", moodAll: "جميع المزاجات", detailTitle: "تفاصيل الذكرى",
    timelineTitle: "الخط الزمني", timelineSub: "الجدول الزمني حسب التاريخ", insightsSub: "تحليلات الذكريات",
    totalMemories: "إجمالي الذكريات", dominantMood: "المزاج السائد", topLocations: "📍 الأماكن الأكثر زيارة",
    spendingSub: "المخططات المالية والمصاريف", addTransaction: "معاملة", totalSpending: "إجمالي المصروفات",
    averageSpending: "المتوسط:", highestSpending: "الأعلى:", chartTitle: "مخطط تحليلات المصاريف",
    filterMonthly: "شهري", filterWeekly: "أسبوعي", historyTitle: "سجل المعاملات", settingsTitle: "الإعدادات",
    settingsSub: "تفضيلات الحساب واللغة", logout: "تسجيل الخروج", userProfile: "👤 الملف الشخصي", saveProfile: "حفظ الملف",
    selectLanguage: "🌐 اختر اللغة", uploadPhoto: "تحميل صورة الذكرى", chooseGallery: "اختر صورة من المعرض",
    titleLabel: "عنوان الذكرى *", dateLabel: "التاريخ *", locationLabel: "الموقع", moodLabel: "المزاج",
    soundtrackSearchLabel: "البحث في Spotify (الفنان / الأغنية)", search: "بحث", journalStory: "قصة الذكرى",
    cancel: "إلغاء", saveMemory: "حفظ الذكرى", addExpenseTitle: "إضافة مصروف", amountLabel: "المبلغ (Rp) *",
    noteLabel: "الوصف *", categoryLabel: "الفئة", saveTransaction: "حفظ المعاملة"
  },
  ja: {
    authSubtitle: "あなたの個人の日記、人生のサウンドトラック、支出トラッカー。",
    login: "ログイン", register: "新規登録", submitLogin: "LIFELOGにログイン", submitRegister: "アカウントを作成",
    fullName: "氏名", email: "メールアドレス", password: "パスワード", confirmPassword: "パスワード再入力",
    navHome: "ホーム", navMemories: "思い出", navTimeline: "タイムライン", navMusic: "音楽", navInsights: "分析", navSpending: "支出", navSettings: "設定",
    recentMemories: "最近の思い出", newMemory: "新しい思い出", heroSoundtrackTag: "🎵 今日のトラック",
    memoriesTitle: "思い出の日記", add: "追加", moodAll: "すべての気分", detailTitle: "思い出の詳細",
    timelineTitle: "タイムライン", timelineSub: "日付順のストリーム", insightsSub: "習慣とメモリの分析",
    totalMemories: "合計思い出数", dominantMood: "主な気分", topLocations: "📍 よく訪れる場所",
    spendingSub: "財務ビジュアルとトラッカー", addTransaction: "取引追加", totalSpending: "今月の支出合計",
    averageSpending: "平均:", highestSpending: "最高:", chartTitle: "支出分析チャート",
    filterMonthly: "月次", filterWeekly: "週次", historyTitle: "取引履歴", settingsTitle: "設定",
    settingsSub: "アカウントと言語の設定", logout: "ログアウト", userProfile: "👤 ユーザープロファイル", saveProfile: "保存",
    selectLanguage: "🌐 言語を選択", uploadPhoto: "写真をアップロード", chooseGallery: "ギャラリーから選択",
    titleLabel: "タイトル *", dateLabel: "日付 *", locationLabel: "場所", moodLabel: "気分",
    soundtrackSearchLabel: "Spotifyで検索 (歌手/曲名)", search: "検索", journalStory: "ジャーナルの物語",
    cancel: "キャンセル", saveMemory: "思い出を保存", addExpenseTitle: "支出を追加", amountLabel: "金額 (Rp) *",
    noteLabel: "メモ *", categoryLabel: "カテゴリ", saveTransaction: "取引を保存"
  }
};

// ==========================================
// 3. INITIALIZATION & SESSION RECOVERY
// ==========================================
document.addEventListener('DOMContentLoaded', async () => {
  showSpinner(true);
  
  // Pemulihan Sesi Otomatis dari Supabase Auth Storage
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    currentUser = session.user;
    await fetchUserProfile();
    await loadAppData();
    showAppShell(true);
  } else {
    showAppShell(false);
  }

  // Listener Perubahan Sesi (Login, Logout, Auto Refresh Token)
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
      currentUser = session.user;
      await fetchUserProfile();
      await loadAppData();
      showAppShell(true);
    } else if (event === 'SIGNED_OUT') {
      currentUser = null;
      userProfile = null;
      memories = [];
      expenses = [];
      showAppShell(false);
    }
  });

  renderDateStrip();
  showSpinner(false);
});

// ==========================================
// 4. AUTHENTICATION (SUPABASE AUTH)
// ==========================================
function switchAuthTab(tab) {
  document.getElementById('tabBtnLogin').classList.toggle('active', tab === 'login');
  document.getElementById('tabBtnRegister').classList.toggle('active', tab === 'register');
  document.getElementById('loginForm').classList.toggle('hidden', tab !== 'login');
  document.getElementById('registerForm').classList.toggle('hidden', tab !== 'register');
}

async function handleLogin(e) {
  e.preventDefault();
  showSpinner(true);
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  showSpinner(false);
  
  if (error) {
    alert('Gagal Masuk: ' + error.message);
  }
}

async function handleRegister(e) {
  e.preventDefault();
  const fullName = document.getElementById('regFullName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const confirm = document.getElementById('regConfirmPassword').value;

  if (password !== confirm) {
    alert('Konfirmasi kata sandi tidak cocok!');
    return;
  }

  showSpinner(true);
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  });
  showSpinner(false);

  if (error) {
    alert('Gagal Registrasi: ' + error.message);
  } else {
    alert('Pendaftaran Berhasil! Anda akan otomatis masuk ke Dashboard.');
  }
}

async function handleLogout() {
  if (confirm('Apakah Anda yakin ingin keluar dari LIFELOG?')) {
    showSpinner(true);
    await supabase.auth.signOut();
    showSpinner(false);
  }
}

// ==========================================
// 5. PROFILE & DATA FETCHING ENGINE
// ==========================================
async function fetchUserProfile() {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', currentUser.id).single();
  if (data) {
    userProfile = data;
    updateUserUI();
  } else if (error && error.code === 'PGRST116') {
    // Fallback jika database trigger memerlukan waktu millisecond
    const fullName = currentUser.user_metadata?.full_name || 'User';
    const { data: newProf } = await supabase.from('profiles').insert([{ id: currentUser.id, full_name: fullName, email: currentUser.email, language: 'id' }]).select().single();
    userProfile = newProf;
    updateUserUI();
  }
}

async function loadAppData() {
  // 1. Fetch Memories milik user ini
  const { data: memData } = await supabase.from('memories').select('*').order('date', { ascending: false });
  
  // Transformasi photo_url/path menjadi Signed URL privat
  if (memData) {
    memories = await Promise.all(memData.map(async (m) => {
      let signedPhotoUrl = null;
      if (m.photo_url) {
        signedPhotoUrl = await getSignedPhotoUrl(m.photo_url);
      }
      return { ...m, displayPhotoUrl: signedPhotoUrl };
    }));
  } else {
    memories = [];
  }

  // 2. Fetch Expenses milik user ini
  const { data: expData } = await supabase.from('expenses').select('*').order('date', { ascending: false });
  expenses = expData || [];

  renderAllViews();
}

// Menghasilkan Signed URL dari Private Bucket `memory-photos`
async function getSignedPhotoUrl(filePath) {
  if (!filePath) return null;
  const cleanPath = filePath.includes('memory-photos/') ? filePath.split('memory-photos/')[1] : filePath;
  
  // Berlaku 60 menit (3600 detik)
  const { data } = await supabase.storage.from('memory-photos').createSignedUrl(cleanPath, 3600);
  return data ? data.signedUrl : null;
}

function showAppShell(isLoggedIn) {
  document.getElementById('authScreen').classList.toggle('hidden', isLoggedIn);
  document.getElementById('appShell').classList.toggle('hidden', !isLoggedIn);
}

function showSpinner(show) {
  document.getElementById('appSpinner').classList.toggle('hidden', !show);
}

// ==========================================
// 6. MULTI-LANGUAGE ENGINE (I18N & RTL)
// ==========================================
function updateUserUI() {
  if (!userProfile) return;

  // Nama pengguna diambil dinamis dari tabel profiles Supabase
  document.getElementById('userGreeting').textContent = `Halo, ${userProfile.full_name} 👋`;
  document.getElementById('userAvatar').textContent = userProfile.full_name.charAt(0).toUpperCase();
  document.getElementById('settingUserNameInput').value = userProfile.full_name;
  document.getElementById('settingUserEmailInput').value = userProfile.email;

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  document.getElementById('currentFullDate').textContent = new Date().toLocaleDateString('id-ID', options);

  // Penyesuaian layout RTL untuk Bahasa Arab
  const lang = userProfile.language || 'id';
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

  const t = i18n[lang] || i18n.id;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (t[key]) el.textContent = t[key];
  });
}

async function setLanguage(langKey) {
  if (!userProfile) return;
  userProfile.language = langKey;
  updateUserUI();
  await supabase.from('profiles').update({ language: langKey }).eq('id', currentUser.id);
}

async function saveUserProfile() {
  const newName = document.getElementById('settingUserNameInput').value.trim();
  if (newName) {
    showSpinner(true);
    userProfile.full_name = newName;
    await supabase.from('profiles').update({ full_name: newName }).eq('id', currentUser.id);
    updateUserUI();
    showSpinner(false);
    alert('Profil berhasil diperbarui!');
  }
}

// ==========================================
// 7. SPOTIFY SOUNDTRACK ENGINE
// ==========================================
async function searchSpotifyTracks() {
  const query = document.getElementById('spotifySearchInput').value.trim();
  if (!query) return;

  const dropdown = document.getElementById('spotifySearchResults');
  dropdown.innerHTML = '<div style="padding:10px; font-size:12px;">Mencari lagu...</div>';
  dropdown.classList.remove('hidden');

  try {
    const res = await fetch(`https://itunes.apple.com/search?term=${encodeURIComponent(query)}&entity=song&limit=5`);
    const data = await res.json();
    
    dropdown.innerHTML = '';
    if (data.results.length === 0) {
      dropdown.innerHTML = '<div style="padding:10px; font-size:12px;">Lagu tidak ditemukan.</div>';
      return;
    }

    data.results.forEach(track => {
      const div = document.createElement('div');
      div.className = 'spotify-item';
      div.innerHTML = `
        <img src="${track.artworkUrl60}" alt="Album">
        <div>
          <div style="font-weight:700; font-size:13px;">${track.trackName}</div>
          <div style="font-size:11px; color:var(--text-muted);">${track.artistName}</div>
        </div>
      `;
      div.onclick = () => selectSpotifyTrack(track.trackName, track.artistName, track.trackId);
      dropdown.appendChild(div);
    });
  } catch (err) {
    dropdown.innerHTML = '<div style="padding:10px; font-size:12px; color:red;">Gagal mencari lagu.</div>';
  }
}

function selectSpotifyTrack(trackName, artistName, trackId) {
  const fullTitle = `${trackName} - ${artistName}`;
  document.getElementById('selectedSpotifySongTitle').value = fullTitle;
  document.getElementById('selectedSpotifyTrackId').value = trackId;
  document.getElementById('spotifySearchInput').value = fullTitle;
  document.getElementById('spotifySearchResults').classList.add('hidden');
}

function playSpotifyTrack(trackId, title) {
  document.getElementById('heroSongTitle').textContent = title;
  document.getElementById('heroSongSub').textContent = '🎵 Spotify Audio Player';
  
  const container = document.getElementById('heroSpotifyPlayer');
  container.innerHTML = `
    <iframe src="https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0" 
      allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
  `;
}

// ==========================================
// 8. NAVIGATION & VIEWS RENDERER
// ==========================================
function switchTab(tabKey) {
  document.querySelectorAll('.page-view').forEach(page => page.classList.remove('active'));
  document.querySelectorAll('.nav-item, .nav-link').forEach(btn => btn.classList.remove('active'));

  const target = document.getElementById(`page-${tabKey}`);
  if (target) target.classList.add('active');

  document.querySelectorAll(`.nav-item[onclick*="${tabKey}"], .nav-link[onclick*="${tabKey}"]`).forEach(btn => btn.classList.add('active'));
  window.scrollTo(0, 0);

  if (tabKey === 'spending') renderSpendingChart();
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
    card.innerHTML = `<span class="day">${days[d.getDay()]}</span><span class="num">${d.getDate()}</span>`;
    container.appendChild(card);
  }
}

function renderAllViews() {
  renderHomeFeed();
  renderMemoriesPage();
  renderTimelinePage();
  renderSoundtrackPage();
  renderInsightsPage();
  renderSpendingPage();
}

function renderHomeFeed() {
  const container = document.getElementById('homeFeedContainer');
  const query = document.getElementById('homeSearchInput').value.toLowerCase();
  container.innerHTML = '';

  const filtered = memories.filter(m => m.title.toLowerCase().includes(query) || (m.story && m.story.toLowerCase().includes(query)));
  if (filtered.length === 0) {
    container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:20px;">Belum ada kenangan tersimpan.</p>';
    return;
  }

  filtered.slice(0, 4).forEach(item => container.appendChild(createMemoryCardElement(item)));
}

function renderMemoriesPage() {
  const container = document.getElementById('memoriesListContainer');
  const query = document.getElementById('memoriesSearchInput').value.toLowerCase();
  container.innerHTML = '';

  document.getElementById('memoriesCountSub').textContent = `${memories.length} cerita tersimpan`;
  let filtered = memories.filter(m => m.title.toLowerCase().includes(query) || (m.story && m.story.toLowerCase().includes(query)));

  if (currentFilterMood !== 'ALL') filtered = filtered.filter(m => m.mood === currentFilterMood);

  if (filtered.length === 0) {
    container.innerHTML = '<p style="grid-column:1/-1; text-align:center; color:var(--text-muted); padding:20px;">Tidak ada kenangan yang cocok.</p>';
    return;
  }

  filtered.forEach(item => container.appendChild(createMemoryCardElement(item)));
}

function filterMemoriesByMood(mood, btn) {
  currentFilterMood = mood;
  document.querySelectorAll('#moodFilterChips .chip-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderMemoriesPage();
}

function createMemoryCardElement(item) {
  const card = document.createElement('article');
  card.className = 'card-hifi';
  card.onclick = () => openMemoryDetail(item.id);

  const imgHtml = item.displayPhotoUrl ? 
    `<img src="${item.displayPhotoUrl}" class="card-img" alt="${item.title}">` : 
    `<div class="card-img-placeholder">🖼️</div>`;

  card.innerHTML = `
    ${imgHtml}
    <div class="card-body">
      <span class="card-badge">${item.mood}</span>
      <h3 class="card-heading">${item.title}</h3>
      <p class="card-desc">${item.story || 'Tanpa catatan cerita.'}</p>
      <div class="card-meta-row">
        <span>📍 ${item.location || '-'}</span>
        <span>🎵 ${item.song_title || '-'}</span>
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
  const imgHtml = item.displayPhotoUrl ? `<img src="${item.displayPhotoUrl}" style="width:100%; height:220px; object-fit:cover; border-radius:16px; margin-bottom:16px;">` : '';

  container.innerHTML = `
    ${imgHtml}
    <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
      <span class="card-badge">${item.mood}</span>
      <span style="font-size:12px; color:var(--text-muted);">${item.date}</span>
    </div>
    <h2 style="font-family:'Plus Jakarta Sans'; font-size:22px; font-weight:700; margin-bottom:4px;">${item.title}</h2>
    <div style="font-size:13px; color:var(--accent-slate); font-weight:600; margin-bottom:16px;">📍 ${item.location || '-'}</div>
    ${item.song_title ? `
      <div style="background:var(--accent-slate); color:white; padding:14px; border-radius:16px; margin-bottom:16px;">
        <div style="font-size:13px; font-weight:700;">🎵 ${item.song_title}</div>
      </div>
    ` : ''}
    <p style="font-size:14px; line-height:1.7; white-space:pre-line;">${item.story || ''}</p>
  `;

  document.getElementById('btnEditMemory').onclick = () => openEditMemoryModal(id);
  document.getElementById('btnDeleteMemory').onclick = () => deleteMemory(id);
  switchTab('detail');
}

function renderTimelinePage() {
  const container = document.getElementById('timelineStreamContainer');
  container.innerHTML = '';
  memories.forEach(item => {
    const el = document.createElement('div');
    el.className = 'timeline-item';
    el.onclick = () => openMemoryDetail(item.id);
    el.innerHTML = `
      <div class="timeline-dot"></div>
      <div style="font-size:11px; font-weight:700; color:var(--accent-terracotta); margin-bottom:4px;">${item.date}</div>
      <div class="timeline-card">
        <div style="font-weight:700; font-size:15px;">${item.title}</div>
        <div style="font-size:12px; color:var(--text-muted); margin-top:4px;">📍 ${item.location || '-'}</div>
      </div>
    `;
    container.appendChild(el);
  });
}

function renderSoundtrackPage() {
  const container = document.getElementById('soundtrackListContainer');
  container.innerHTML = '';
  const songs = memories.filter(m => m.song_title);
  document.getElementById('soundtrackCountSub').textContent = `${songs.length} Lagu Terhubung`;

  songs.forEach(item => {
    const el = document.createElement('div');
    el.className = 'soundtrack-item';
    el.innerHTML = `
      <div>
        <div style="font-weight:700; font-size:14px;">${item.song_title}</div>
        <div style="font-size:12px; color:var(--text-muted);">Momen: ${item.title}</div>
      </div>
      <button class="btn-primary-sm" onclick="playSpotifyTrack('${item.spotify_track_id || ''}', '${item.song_title}')">▶ Play</button>
    `;
    container.appendChild(el);
  });
}

function renderInsightsPage() {
  document.getElementById('statTotalMemories').textContent = memories.length;

  const moodCounts = {};
  memories.forEach(m => { moodCounts[m.mood] = (moodCounts[m.mood] || 0) + 1; });
  let topMood = '-';
  let maxCount = 0;
  for (const m in moodCounts) {
    if (moodCounts[m] > maxCount) { maxCount = moodCounts[m]; topMood = m; }
  }
  document.getElementById('statDominantMood').textContent = topMood;

  const locCounts = {};
  memories.forEach(m => { if (m.location) locCounts[m.location] = (locCounts[m.location] || 0) + 1; });
  const locList = document.getElementById('statTopLocationsList');
  locList.innerHTML = Object.keys(locCounts).length ? '' : '<span style="font-size:12px; color:var(--text-muted);">Belum ada data lokasi.</span>';
  for (const loc in locCounts) {
    locList.innerHTML += `<div style="font-size:13px; margin-top:6px;">📍 <strong>${loc}</strong> (${locCounts[loc]}x dicatat)</div>`;
  }
}

// ==========================================
// 9. SPENDING TRACKER & CHART ENGINE
// ==========================================
function renderSpendingPage() {
  const container = document.getElementById('spendingListContainer');
  container.innerHTML = '';

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const avg = expenses.length > 0 ? Math.round(total / expenses.length) : 0;
  const max = expenses.length > 0 ? Math.max(...expenses.map(e => Number(e.amount))) : 0;

  document.getElementById('totalSpendingAmount').textContent = `Rp ${total.toLocaleString('id-ID')}`;
  document.getElementById('avgSpendingText').textContent = `Rp ${avg.toLocaleString('id-ID')}`;
  document.getElementById('maxSpendingText').textContent = `Rp ${max.toLocaleString('id-ID')}`;

  if (expenses.length === 0) {
    container.innerHTML = '<p style="text-align:center; color:var(--text-muted); padding:20px;">Belum ada catatan transaksi.</p>';
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

function renderSpendingChart() {
  const ctx = document.getElementById('spendingChartCanvas');
  if (!ctx) return;

  if (spendingChartInstance) spendingChartInstance.destroy();

  const categoryTotals = {};
  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
  });

  const labels = Object.keys(categoryTotals);
  const dataValues = Object.values(categoryTotals);

  spendingChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.length > 0 ? labels : ['Belum Ada Data'],
      datasets: [{
        label: 'Pengeluaran (Rp)',
        data: dataValues.length > 0 ? dataValues : [0],
        backgroundColor: '#C86D51',
        borderRadius: 8
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { beginAtZero: true, grid: { color: '#E7E5E4' } },
        x: { grid: { display: false } }
      }
    }
  });
}

// ==========================================
// 10. CRUD & PRIVATE STORAGE UPLOAD ENGINE
// ==========================================
function handlePhotoSelect(e) {
  const file = e.target.files[0];
  if (!file) return;
  selectedPhotoFile = file;

  const reader = new FileReader();
  reader.onload = (evt) => {
    document.getElementById('memoryImagePreview').src = evt.target.result;
    document.getElementById('memoryImagePreview').classList.remove('hidden');
    document.getElementById('photoPlaceholderText').classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

async function handleSaveMemory(e) {
  e.preventDefault();
  showSpinner(true);

  const id = document.getElementById('memoryIdInput').value;
  const title = document.getElementById('memoryTitleInput').value.trim();
  const date = document.getElementById('memoryDateInput').value;
  const location = document.getElementById('memoryLocationInput').value.trim();
  const mood = document.getElementById('memoryMoodSelect').value;
  const songTitle = document.getElementById('selectedSpotifySongTitle').value;
  const spotifyTrackId = document.getElementById('selectedSpotifyTrackId').value;
  const story = document.getElementById('memoryStoryInput').value.trim();

  let photoPath = null;

  // Upload Foto ke Private Bucket `memory-photos`
  if (selectedPhotoFile) {
    const fileExt = selectedPhotoFile.name.split('.').pop();
    const filePath = `${currentUser.id}/${Date.now()}.${fileExt}`;
    
    const { data: uploadData, error: uploadErr } = await supabase.storage.from('memory-photos').upload(filePath, selectedPhotoFile, {
      cacheControl: '3600',
      upsert: true
    });

    if (uploadErr) {
      alert('Gagal upload foto: ' + uploadErr.message);
    } else {
      photoPath = uploadData.path;
    }
  }

  const memoryPayload = {
    user_id: currentUser.id,
    title, date, location, mood,
    song_title: songTitle,
    spotify_track_id: spotifyTrackId,
    story,
    ...(photoPath && { photo_url: photoPath })
  };

  if (id) {
    await supabase.from('memories').update(memoryPayload).eq('id', id);
  } else {
    await supabase.from('memories').insert([memoryPayload]);
  }

  await loadAppData();
  closeModal('modalMemoryForm');
  showSpinner(false);
}

async function deleteMemory(id) {
  if (confirm('Hapus kenangan ini?')) {
    showSpinner(true);
    await supabase.from('memories').delete().eq('id', id);
    await loadAppData();
    switchTab('memories');
    showSpinner(false);
  }
}

async function handleSaveExpense(e) {
  e.preventDefault();
  showSpinner(true);

  const amount = document.getElementById('expenseAmountInput').value;
  const note = document.getElementById('expenseNoteInput').value.trim();
  const category = document.getElementById('expenseCategorySelect').value;
  const date = document.getElementById('expenseDateInput').value;

  await supabase.from('expenses').insert([{
    user_id: currentUser.id,
    amount, note, category, date
  }]);

  await loadAppData();
  closeModal('modalExpenseForm');
  showSpinner(false);
}

async function deleteExpense(id) {
  if (confirm('Hapus transaksi pengeluaran ini?')) {
    showSpinner(true);
    await supabase.from('expenses').delete().eq('id', id);
    await loadAppData();
    showSpinner(false);
  }
}

function openAddMemoryModal() {
  document.getElementById('memoryForm').reset();
  document.getElementById('memoryIdInput').value = '';
  document.getElementById('selectedSpotifySongTitle').value = '';
  document.getElementById('selectedSpotifyTrackId').value = '';
  document.getElementById('memoryDateInput').valueAsDate = new Date();
  selectedPhotoFile = null;
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
  document.getElementById('memoryStoryInput').value = item.story || '';

  openModal('modalMemoryForm');
}

function openAddExpenseModal() {
  document.getElementById('expenseForm').reset();
  document.getElementById('expenseDateInput').valueAsDate = new Date();
  openModal('modalExpenseForm');
}

function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }
