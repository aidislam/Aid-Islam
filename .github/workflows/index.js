<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Aid Islam - Islamic Super App</title>
    <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        :root { --primary: #1a531b; --secondary: #2e7d32; --bg: #f0f4f0; --white: #ffffff; }
        body { font-family: 'Hind Siliguri', sans-serif; margin: 0; display: flex; background: var(--bg); height: 100vh; overflow: hidden; }

        /* Sidebar Navigation */
        .sidebar { width: 280px; background: var(--white); border-right: 1px solid #ddd; display: flex; flex-direction: column; transition: 0.3s; }
        .sidebar-header { padding: 25px; background: var(--primary); color: white; text-align: center; font-size: 24px; font-weight: bold; }
        .menu-list { overflow-y: auto; flex: 1; }
        .menu-item { padding: 14px 20px; border-bottom: 1px solid #f0f0f0; cursor: pointer; display: flex; align-items: center; transition: 0.2s; color: #333; text-decoration: none; }
        .menu-item:hover, .menu-item.active { background: #e8f5e9; color: var(--primary); font-weight: bold; border-left: 5px solid var(--primary); }

        /* Main Content Display Area */
        .main-content { flex: 1; padding: 25px; overflow-y: auto; display: flex; flex-direction: column; }
        .display-card { background: var(--white); padding: 30px; border-radius: 20px; box-shadow: 0 5px 20px rgba(0,0,0,0.05); min-height: 500px; }
        
        /* Elements */
        .loader { border: 4px solid #f3f3f3; border-top: 4px solid var(--primary); border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 50px auto; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .btn-back { background: #333; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer; margin-bottom: 15px; }

        @media (max-width: 768px) {
            body { flex-direction: column; }
            .sidebar { width: 100%; height: auto; max-height: 250px; }
            .main-content { padding: 15px; }
        }
    </style>
</head>
<body>

<div class="sidebar">
    <div class="sidebar-header">Aid Islam</div>
    <div class="menu-list">
        <div class="menu-item active" onclick="loadContent('Dashboard', this)">🏠 Dashboard</div>
        <div class="menu-item" onclick="loadContent('Hadith', this)">📚 Hadith</div>
        <div class="menu-item" onclick="loadContent('Prayer Times', this)">🕒 Prayer Times</div>
        <div class="menu-item" onclick="loadContent('Quran', this)">📖 Quran</div>
        <div class="menu-item" onclick="loadContent('Tasbih', this)">📿 Tasbih</div>
        <div class="menu-item" onclick="loadContent('Names of Allah', this)">🕋 Names of Allah</div>
    </div>
</div>

<div class="main-content">
    <div class="display-card" id="app-screen">
        </div>
</div>

<script>
    const HADITH_API_KEY = "$2y$10$80vqLWiZLoHQ5wmr0nJz2OXlXY9VScdrukEO5fNXpiKg8ldm6l5a";
    const HADITH_URL = "https://hadithapi.com/api";

    // ১. মেইন লোডার ফাংশন
    function loadContent(page, element) {
        document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
        element.classList.add('active');
        
        const screen = document.getElementById('app-screen');
        screen.innerHTML = `<div class="loader"></div>`;

        setTimeout(() => {
            if(page === 'Dashboard') renderDashboard();
            else if(page === 'Hadith') loadHadithBooks();
            else if(page === 'Prayer Times') renderPrayers();
            else if(page === 'Tasbih') renderTasbih();
            else screen.innerHTML = `<h2>${page}</h2><p>এই বিভাগটি নিয়ে কাজ চলছে...</p>`;
        }, 300);
    }

    // ২. ড্যাশবোর্ড (Live Clock & Date)
    function renderDashboard() {
        const now = new Date();
        const bnDate = new Intl.DateTimeFormat('bn-BD-u-ca-bengali', {day:'numeric', month:'long', year:'numeric'}).format(now);
        document.getElementById('app-screen').innerHTML = `
            <div style="text-align:center; padding: 50px 0;">
                <h1 style="font-size: 60px; color: var(--primary); margin:0;">${now.toLocaleTimeString('bn-BD')}</h1>
                <h2 style="color: #666;">আজ ${bnDate}</h2>
                <div style="margin-top:30px; background:#e8f5e9; padding:20px; border-radius:15px; border-left: 10px solid var(--primary);">
                    <p style="font-size: 18px; font-style: italic;">"তোমরা আমাকে ডাকো, আমি তোমাদের ডাকে সাড়া দেব।" (সূরা গাফির: ৬০)</p>
                </div>
            </div>`;
    }

    // ৩. হাদিস সেকশন (API Integration)
    async function loadHadithBooks() {
        const screen = document.getElementById('app-screen');
        try {
            const res = await fetch(`${HADITH_URL}/books?apiKey=${HADITH_API_KEY}`);
            const data = await res.json();
            let html = '<h2>Hadith Books</h2><div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:15px;">';
            data.books.forEach(book => {
                html += `<div onclick="loadHadithChapters('${book.bookSlug}')" style="cursor:pointer; padding:15px; background:#f1f8e9; border:1px solid #c8e6c9; border-radius:10px; text-align:center;">
                    <strong>${book.bookName}</strong><br><small>Hadiths: ${book.hadiths_count}</small>
                </div>`;
            });
            screen.innerHTML = html + '</div>';
        } catch (e) { screen.innerHTML = "হাদিস লোড করা সম্ভব হচ্ছে না।"; }
    }

    async function loadHadithChapters(slug) {
        const screen = document.getElementById('app-screen');
        screen.innerHTML = '<div class="loader"></div>';
        try {
            const res = await fetch(`${HADITH_URL}/${slug}/chapters?apiKey=${HADITH_API_KEY}`);
            const data = await res.json();
            let html = `<button class="btn-back" onclick="loadHadithBooks()">← Back</button><h2>Chapters</h2>`;
            data.chapters.forEach(ch => {
                html += `<div style="padding:10px; border-bottom:1px solid #eee;">Chapter ${ch.chapterNumber}: ${ch.chapterEnglish}</div>`;
            });
            screen.innerHTML = html;
        } catch (e) { screen.innerHTML = "অধ্যায় লোড হচ্ছে না।"; }
    }

    // ৪. নামাজের সময়সূচী (GPS Based)
    function renderPrayers() {
        const screen = document.getElementById('app-screen');
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const res = await fetch(`https://api.aladhan.com/v1/timings?latitude=${pos.coords.latitude}&longitude=${pos.coords.longitude}&method=2`);
            const data = await res.json();
            const t = data.data.timings;
            screen.innerHTML = `<h2>🕒 নামাজের সময়সূচী</h2>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap:15px;">
                <div style="background:#f9f9f9; padding:15px; border-radius:10px; text-align:center;"><b>ফজর</b><br>${t.Fajr}</div>
                <div style="background:#f9f9f9; padding:15px; border-radius:10px; text-align:center;"><b>যোহর</b><br>${t.Dhuhr}</div>
                <div style="background:#f9f9f9; padding:15px; border-radius:10px; text-align:center;"><b>মাগরিব</b><br>${t.Maghrib}</div>
                <div style="background:#f9f9f9; padding:15px; border-radius:10px; text-align:center;"><b>এশা</b><br>${t.Isha}</div>
            </div>`;
        }, () => screen.innerHTML = "লোকেশন পারমিশন দিন।");
    }

    // ৫. ডিজিটাল তসবিহ
    let tCount = 0;
    function renderTasbih() {
        document.getElementById('app-screen').innerHTML = `
            <h2>📿 ডিজিটাল তসবিহ</h2>
            <div style="text-align:center; padding:40px;">
                <div style="font-size:80px; font-weight:bold; color:var(--primary);">${tCount}</div>
                <button onclick="tCount++; renderTasbih()" style="width:150px; height:150px; border-radius:50%; border:none; background:var(--primary); color:white; font-size:24px; cursor:pointer; box-shadow:0 10px 20px rgba(0,0,0,0.1);">জিকির</button><br>
                <button onclick="tCount=0; renderTasbih()" style="margin-top:20px; border:none; background:none; color:red; cursor:pointer;">Reset</button>
            </div>`;
    }

    // Initial Load
    renderDashboard();
</script>

</body>
</html>

