/* ============================================================================
   AUTH & CLOUD PROFILE SYSTEM (BOF)
   ล็อกอินด้วย "ชื่อผู้ใช้ (Username) + รหัสผ่าน (Password)" ไม่ต้องใช้อีเมล!
   ----------------------------------------------------------------------------
   วิธีเปิดใช้งาน Cloud Sync ข้ามเครื่องผ่าน Firebase (ฟรี 100%):
   1. ไปที่ https://console.firebase.google.com/ สร้างโปรเจกต์ใหม่
   2. ไปที่ Authentication > Sign-in method > เปิดใช้งาน "Email/Password"
   3. ไปที่ Firestore Database > กด Create Database (เลือก Start in test mode)
   4. ไปที่ Project Settings > สร้าง Web App (</>) แล้วนำค่า firebaseConfig มาวางใน BOF_FIREBASE_CONFIG ด้านล่าง
   * หมายเหตุ: หากยังไม่ได้ใส่ค่า BOF_FIREBASE_CONFIG ระบบจะทำงานในโหมดบัญชีประจำเครื่อง + รหัสย้ายเครื่องให้อัตโนมัติทันที!
   ============================================================================ */
(function () {
  const BOF_FIREBASE_CONFIG = {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
  };

  const STORAGE_ACCOUNTS_KEY = 'bof_accounts_db_v1';
  const STORAGE_SESSION_KEY = 'bof_active_user_v1';
  const DECK_STORAGE_KEY = 'my_card_game_deck';
  const GUEST_NICK_KEY = 'bof_guest_nickname';
  const LAST_USER_KEY = 'bof_last_username';

  const AVATAR_LEADERS = [
    { id: 'L01', label: 'เด็คจิต (เดจิต)', image: 'images/thumbs/เด็คจิต/1.webp' },
    { id: 'L02', label: 'เด็คขุนเหนือ', image: 'images/thumbs/เด็คเหนือ/1.webp' },
    { id: 'L03', label: 'เด็ควันสิ้นโลก', image: 'images/thumbs/วันสิ้นโลก/1.webp' },
    { id: 'L04', label: 'เด็คศูนย์วิจัยไดโน', image: 'images/thumbs/ไดโน/1.webp' },
    { id: 'L05', label: 'เด็คปีศาจ', image: 'images/thumbs/เด็คปีศาจ/1.webp' },
    { id: 'L06', label: 'เด็คโอ็ต', image: 'images/thumbs/เด็คโอ๊ต/1.webp' },
    { id: 'L07', label: 'เด็คมาโดกะ', image: 'images/thumbs/มาโดกะ/1.webp' },
    { id: 'L08', label: 'เด็คคาเงโร่', image: 'images/thumbs/เด็คคาเงโร่/1.webp' },
    { id: 'L09', label: 'เด็ครอยัล พาลาดิน', image: 'images/รอยัล พาลาดิน/1.png' },
    { id: 'L10', label: 'เด็ครางดาว', image: 'images/รางดาว/1.png' }
  ];

  let currentUser = null;
  let authMode = 'login'; // 'login' | 'register'
  let selectedAvatarId = 'L01';
  let firebaseReady = false;
  let fbAuth = null;
  let fbDb = null;

  /* ---------------- ฟังก์ชันช่วยเหลือจัดการข้อมูล ---------------- */
  function isFirebaseConfigured() {
    return Boolean(
      BOF_FIREBASE_CONFIG.apiKey &&
      BOF_FIREBASE_CONFIG.projectId &&
      !BOF_FIREBASE_CONFIG.apiKey.includes('YOUR_')
    );
  }

  function normalizeUsername(raw) {
    return String(raw || '').trim();
  }

  function usernameKey(raw) {
    return normalizeUsername(raw).toLowerCase();
  }

  // แปลงชื่อผู้ใช้ (ทั้งภาษาไทย/อังกฤษ) ให้เป็นอีเมลจำลองสำหรับ Firebase Auth เบื้องหลัง
  function usernameToSyntheticEmail(username) {
    const key = usernameKey(username);
    const bytes = new TextEncoder().encode(key);
    let hex = '';
    for (const b of bytes) hex += b.toString(16).padStart(2, '0');
    return `u_${hex}@bof-tcg.local`;
  }

  async function hashPassword(password) {
    const raw = `bof_salt_v1:${password}`;
    if (window.crypto && window.crypto.subtle) {
      const buf = await window.crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
      return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    let h = 2166136261;
    for (let i = 0; i < raw.length; i++) {
      h ^= raw.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return `fnv_${(h >>> 0).toString(16)}`;
  }

  function getAvatarImage(avatarId) {
    if (currentUser && currentUser.customAvatar) return currentUser.customAvatar;
    const found = AVATAR_LEADERS.find(a => a.id === avatarId) || AVATAR_LEADERS[0];
    return found.image;
  }

  function getEffectivePlayerName() {
    if (currentUser && currentUser.username) return currentUser.username;
    try {
      const nick = localStorage.getItem(GUEST_NICK_KEY);
      if (nick && nick.trim()) return nick.trim();
    } catch (e) {}
    return 'ผู้เยี่ยมชม';
  }

  function getEffectivePlayerAvatar() {
    if (currentUser && currentUser.customAvatar) return currentUser.customAvatar;
    if (currentUser && currentUser.avatarId) return getAvatarImage(currentUser.avatarId);
    return getAvatarImage('L01');
  }

  function generateAccountSyncKey(profile) {
    if (!profile) return '';
    const payload = {
      v: 1,
      username: profile.username,
      passwordHash: profile.passwordHash,
      avatarId: profile.avatarId || 'L01',
      starterDeckId: profile.starterDeckId || profile.avatarId || 'L01',
      customAvatar: profile.customAvatar || null,
      coins: typeof profile.coins === 'number' ? profile.coins : 2000,
      shards: typeof profile.shards === 'number' ? profile.shards : 150,
      ownedCards: profile.ownedCards || {},
      packsOpened: Number(profile.packsOpened || 0),
      wins: Number(profile.wins || 0),
      losses: Number(profile.losses || 0),
      matches: Number(profile.matches || 0),
      savedDeck: profile.savedDeck || null,
      deckSlots: profile.deckSlots || null,
      pity: profile.pity || {},
      lastDailyClaimDate: profile.lastDailyClaimDate || '',
      dailyProgress: profile.dailyProgress || null,
      claimedQuests: profile.claimedQuests || {},
      weeklyProgress: profile.weeklyProgress || null,
      claimedWeekly: profile.claimedWeekly || {},
      ownedCosmetics: profile.ownedCosmetics || null,
      equippedCosmetics: profile.equippedCosmetics || null,
      exportedAt: Date.now()
    };
    return btoa(encodeURIComponent(JSON.stringify(payload)));
  }

  function parseAccountSyncKey(encoded) {
    try {
      const json = decodeURIComponent(atob(encoded.trim()));
      const data = JSON.parse(json);
      if (!data.username) throw new Error('ไม่พบข้อมูลชื่อผู้ใช้ในรหัสย้ายเครื่อง');
      return data;
    } catch (e) {
      throw new Error('รหัสย้ายเครื่องไม่ถูกต้องหรือชำรุด กรุณาตรวจสอบอีกครั้ง');
    }
  }

  async function importAccountSyncKey(rawKey) {
    const profile = parseAccountSyncKey(rawKey);
    const key = usernameKey(profile.username);
    const db = loadLocalAccounts();
    db[key] = { ...profile, updatedAt: Date.now() };
    saveLocalAccounts(db);
    currentUser = db[key];
    applyProfileDeckToGame(currentUser);
    await persistCurrentUserProfile();
    return currentUser;
  }

  function loadLocalAccounts() {
    try {
      const parsed = JSON.parse(localStorage.getItem(STORAGE_ACCOUNTS_KEY));
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch (e) {
      return {};
    }
  }

  function saveLocalAccounts(db) {
    try {
      localStorage.setItem(STORAGE_ACCOUNTS_KEY, JSON.stringify(db));
    } catch (e) {}
  }

  function readCurrentDeckFromStorage() {
    try {
      const saved = JSON.parse(localStorage.getItem(DECK_STORAGE_KEY));
      if (saved && saved.leaderId && Array.isArray(saved.mainDeck) && saved.mainDeck.length === 20) {
        return saved;
      }
    } catch (e) {}
    return null;
  }

  function applyProfileDeckToGame(profile) {
    if (!profile) return;
    if (profile.deckSlots && window.BOFDeckSlots && typeof window.BOFDeckSlots.importState === 'function') {
      window.BOFDeckSlots.importState(profile.deckSlots);
    }
    if (!profile.savedDeck) return;
    const d = profile.savedDeck;
    if (d && d.leaderId && Array.isArray(d.mainDeck) && d.mainDeck.length === 20) {
      try {
        localStorage.setItem(DECK_STORAGE_KEY, JSON.stringify(d));
      } catch (e) {}
      if (typeof currentDeckConfig !== 'undefined') {
        currentDeckConfig = { leaderId: d.leaderId, mainDeck: [...d.mainDeck], name: d.name || '' };
      }
      if (window.LobbyView && typeof window.LobbyView.refreshMine === 'function') {
        window.LobbyView.refreshMine();
        window.LobbyView.selectDeck('mine');
      }
    }
  }

  /* ---------------- โหลด Firebase อัตโนมัติหากใส่ Config แล้ว ---------------- */
  async function initFirebaseIfConfigured() {
    if (!isFirebaseConfigured()) return false;
    try {
      const loadScript = src => new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
      if (!window.firebase) {
        await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
        await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js');
        await loadScript('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js');
      }
      if (!window.firebase.apps.length) {
        window.firebase.initializeApp(BOF_FIREBASE_CONFIG);
      }
      fbAuth = window.firebase.auth();
      fbDb = window.firebase.firestore();
      firebaseReady = true;
      return true;
    } catch (err) {
      console.warn('[BOF Auth] โหลด Firebase ไม่สำเร็จ สลับไปใช้ Local Account อัตโนมัติ:', err);
      firebaseReady = false;
      return false;
    }
  }

  /* ---------------- บันทึกและซิงค์โปรไฟล์ ---------------- */
  async function persistCurrentUserProfile() {
    if (!currentUser) return;
    const key = usernameKey(currentUser.username);
    const db = loadLocalAccounts();
    if (db[key]) {
      db[key] = { ...db[key], ...currentUser, updatedAt: Date.now() };
      saveLocalAccounts(db);
    } else {
      db[key] = { ...currentUser, updatedAt: Date.now() };
      saveLocalAccounts(db);
    }
    try {
      localStorage.setItem(STORAGE_SESSION_KEY, key);
    } catch (e) {}

    if (firebaseReady && fbDb && currentUser.uid) {
      try {
        await fbDb.collection('bof_users').doc(currentUser.uid).set({
          username: currentUser.username,
          avatarId: currentUser.avatarId || 'L01',
          wins: currentUser.wins || 0,
          losses: currentUser.losses || 0,
          matches: currentUser.matches || 0,
          coins: typeof currentUser.coins === 'number' ? currentUser.coins : 2000,
          shards: typeof currentUser.shards === 'number' ? currentUser.shards : 300,
          pityCount: typeof currentUser.pityCount === 'number' ? currentUser.pityCount : 0,
          ownedCards: currentUser.ownedCards || null,
          packsOpened: currentUser.packsOpened || 0,
          savedDeck: currentUser.savedDeck || null,
          updatedAt: Date.now()
        }, { merge: true });
      } catch (e) {
        console.warn('[BOF Auth] ซิงค์ขึ้น Cloud ไม่สำเร็จ:', e);
      }
    }
    renderAuthBar();
    updateInGamePlayerIdentity();
    if (window.BOFShop && typeof window.BOFShop.reloadFromProfile === 'function') {
      window.BOFShop.reloadFromProfile();
    }
  }

  /* ---------------- สมัครสมาชิก & เข้าสู่ระบบ ---------------- */
  function buildStarterDeckAndCollection(leaderId) {
    const validId = ['L01', 'L02', 'L03', 'L04', 'L05', 'L06', 'L07', 'L08', 'L09', 'L10'].includes(leaderId) ? leaderId : 'L01';
    const mainList = (typeof getDefaultDeckForLeader === 'function')
      ? [...getDefaultDeckForLeader(validId)]
      : (typeof DECK_LISTS !== 'undefined' && DECK_LISTS[validId] ? [...DECK_LISTS[validId]] : []);
    const owned = { [validId]: 1 };
    mainList.forEach(cid => {
      owned[cid] = (owned[cid] || 0) + 1;
    });
    return {
      starterDeck: { leaderId: validId, mainDeck: mainList },
      starterOwned: owned
    };
  }

  async function registerAccount(usernameRaw, passwordRaw, avatarId) {
    const username = normalizeUsername(usernameRaw);
    const password = String(passwordRaw || '');
    if (username.length < 2 || username.length > 20) {
      throw new Error('ชื่อผู้ใช้ต้องมีความยาว 2 - 20 ตัวอักษร');
    }
    if (password.length < 6) {
      throw new Error('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร');
    }

    const key = usernameKey(username);
    const chosenLeaderId = avatarId || 'L01';
    const { starterDeck, starterOwned } = buildStarterDeckAndCollection(chosenLeaderId);

    if (firebaseReady && fbAuth && fbDb) {
      const email = usernameToSyntheticEmail(username);
      try {
        const cred = await fbAuth.createUserWithEmailAndPassword(email, password);
        const uid = cred.user.uid;
        const profile = {
          uid,
          username,
          avatarId: chosenLeaderId,
          starterDeckId: chosenLeaderId,
          coins: 2000,
          ownedCards: starterOwned,
          packsOpened: 0,
          wins: 0,
          losses: 0,
          matches: 0,
          savedDeck: starterDeck,
          createdAt: Date.now(),
          updatedAt: Date.now()
        };
        await fbDb.collection('bof_users').doc(uid).set(profile);
        currentUser = profile;
        applyProfileDeckToGame(profile);
        await persistCurrentUserProfile();
        return profile;
      } catch (err) {
        if (err && err.code === 'auth/email-already-in-use') {
          throw new Error('ชื่อผู้ใช้นี้มีคนใช้แล้ว กรุณาตั้งชื่ออื่นหรือกดเข้าสู่ระบบ');
        }
        throw new Error(err.message || 'สมัครสมาชิกไม่สำเร็จ');
      }
    }

    // โหมดบัญชีในเครื่อง
    const db = loadLocalAccounts();
    if (db[key]) {
      throw new Error('ชื่อผู้ใช้นี้ถูกใช้งานแล้ว กรุณาเลือกแท็บ "เข้าสู่ระบบ"');
    }
    const passHash = await hashPassword(password);
    const profile = {
      uid: `local_${Date.now()}`,
      username,
      passwordHash: passHash,
      avatarId: chosenLeaderId,
      starterDeckId: chosenLeaderId,
      coins: 2000,
      ownedCards: starterOwned,
      packsOpened: 0,
      wins: 0,
      losses: 0,
      matches: 0,
      savedDeck: starterDeck,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    db[key] = profile;
    saveLocalAccounts(db);
    currentUser = profile;
    applyProfileDeckToGame(profile);
    await persistCurrentUserProfile();
    return profile;
  }

  async function loginAccount(usernameRaw, passwordRaw) {
    const username = normalizeUsername(usernameRaw);
    const password = String(passwordRaw || '');
    if (!username || !password) {
      throw new Error('กรุณากรอกชื่อผู้ใช้และรหัสผ่านให้ครบ');
    }

    const key = usernameKey(username);

    if (firebaseReady && fbAuth && fbDb) {
      const email = usernameToSyntheticEmail(username);
      try {
        const cred = await fbAuth.signInWithEmailAndPassword(email, password);
        const uid = cred.user.uid;
        const doc = await fbDb.collection('bof_users').doc(uid).get();
        const data = doc.exists ? doc.data() : {};
        const fallbackLeader = data.avatarId || 'L01';
        const fallbackStarter = buildStarterDeckAndCollection(fallbackLeader);
        currentUser = {
          uid,
          username: data.username || username,
          avatarId: fallbackLeader,
          starterDeckId: data.starterDeckId || fallbackLeader,
          coins: typeof data.coins === 'number' ? data.coins : 2000,
          ownedCards: data.ownedCards || fallbackStarter.starterOwned,
          packsOpened: Number(data.packsOpened || 0),
          wins: Number(data.wins || 0),
          losses: Number(data.losses || 0),
          matches: Number(data.matches || 0),
          savedDeck: data.savedDeck || fallbackStarter.starterDeck
        };
        applyProfileDeckToGame(currentUser);
        await persistCurrentUserProfile();
        return currentUser;
      } catch (err) {
        throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
      }
    }

    const db = loadLocalAccounts();
    const record = db[key];
    if (!record) {
      throw new Error(`⚠️ ไม่พบบัญชี "${username}" ในเครื่องนี้\n• หากคุณเคยสมัครในเครื่องอื่นไว้ ให้เลือกแท็บ "🔑 กู้คืน/ย้ายเครื่อง" เพื่อนำเข้าบัญชี\n• หรือเลือกแท็บ "สมัครสมาชิกใหม่" เพื่อสร้างบัญชีใหม่`);
    }
    const passHash = await hashPassword(password);
    if (record.passwordHash && record.passwordHash !== passHash) {
      throw new Error('รหัสผ่านไม่ถูกต้อง');
    }
    if (!record.ownedCards) {
      const fallbackStarter = buildStarterDeckAndCollection(record.avatarId || 'L01');
      record.ownedCards = fallbackStarter.starterOwned;
      record.savedDeck = record.savedDeck || fallbackStarter.starterDeck;
    }
    if (typeof record.coins !== 'number') record.coins = 2000;
    currentUser = record;
    applyProfileDeckToGame(currentUser);
    await persistCurrentUserProfile();
    return currentUser;
  }

  async function logoutAccount() {
    if (firebaseReady && fbAuth) {
      try { await fbAuth.signOut(); } catch (e) {}
    }
    currentUser = null;
    try {
      localStorage.removeItem(STORAGE_SESSION_KEY);
    } catch (e) {}
    renderAuthBar();
    updateInGamePlayerIdentity();
    if (window.BOFShop && typeof window.BOFShop.reloadFromProfile === 'function') {
      window.BOFShop.reloadFromProfile();
    }
  }

  /* ---------------- อัปเดต UI ปุ่มโปรไฟล์บนหน้าล็อบบี้และในเกม ---------------- */
  function renderAuthBar() {
    const bar = document.getElementById('lb-auth-bar');
    if (!bar) return;
    const avatarImg = bar.querySelector('.lb-auth-avatar');
    const nameEl = bar.querySelector('.lb-auth-name');
    const subEl = bar.querySelector('.lb-auth-sub');
    const badgeEl = bar.querySelector('.lb-auth-badge');

    if (currentUser) {
      if (avatarImg) avatarImg.src = getAvatarImage(currentUser.avatarId);
      if (nameEl) nameEl.textContent = currentUser.username;
      if (subEl) subEl.textContent = `ชนะ ${currentUser.wins || 0} · แพ้ ${currentUser.losses || 0}`;
      if (badgeEl) {
        badgeEl.textContent = firebaseReady ? '☁️ ซิงค์แล้ว' : '✓ ล็อกอินแล้ว';
        badgeEl.style.display = 'inline-block';
      }
    } else {
      if (avatarImg) avatarImg.src = getAvatarImage('L01');
      const eff = getEffectivePlayerName();
      if (nameEl) nameEl.textContent = eff === 'ผู้เยี่ยมชม' ? 'ผู้เยี่ยมชม (Guest)' : `${eff} (Guest)`;
      if (subEl) subEl.textContent = 'คลิกเพื่อเข้าสู่ระบบ / สมัคร';
      if (badgeEl) badgeEl.style.display = 'none';
    }
    updateMultiplayerPlayerBanner();
  }

  function updateInGamePlayerIdentity() {
    const effName = getEffectivePlayerName();
    const roleTag = document.querySelector('#player-leader-box .leader-role-tag');
    if (roleTag) {
      roleTag.textContent = `👑 ${effName}`;
    }
    if (typeof gameState !== 'undefined' && gameState.player) {
      gameState.player.name = effName;
    }
  }

  function renderSavedAccountsList() {
    const section = document.getElementById('bof-saved-accounts-section');
    const list = document.getElementById('bof-saved-accounts-list');
    if (!section || !list) return;
    const db = loadLocalAccounts();
    const accounts = Object.values(db || {});
    if (!accounts.length) {
      section.style.display = 'none';
      return;
    }
    list.innerHTML = '';
    accounts.forEach(acc => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'bof-account-chip';
      const img = document.createElement('img');
      img.src = getAvatarImage(acc.avatarId || 'L01');
      const name = document.createElement('span');
      name.textContent = acc.username;
      chip.appendChild(img);
      chip.appendChild(name);
      chip.addEventListener('click', () => {
        const userInp = document.getElementById('bof-input-username');
        const passInp = document.getElementById('bof-input-password');
        if (userInp) userInp.value = acc.username;
        if (passInp) {
          passInp.value = '';
          passInp.focus();
        }
        setStatusMessage(`เลือกบัญชี "${acc.username}" แล้ว กรุณากรอกรหัสผ่าน`, false);
      });
      list.appendChild(chip);
    });
    section.style.display = 'block';
  }

  /* ---------------- หน้าต่าง Modal เข้าสู่ระบบ / โปรไฟล์ ---------------- */
  function renderAuthDialogContent() {
    const dialog = document.getElementById('bof-auth-dialog');
    if (!dialog) return;
    const formView = document.getElementById('bof-auth-form-view');
    const profileView = document.getElementById('bof-auth-profile-view');
    const titleEl = document.getElementById('bof-auth-title');
    const msgEl = document.getElementById('bof-auth-msg');
    if (msgEl) {
      msgEl.textContent = '';
      msgEl.className = 'bof-auth-msg';
    }

    if (currentUser) {
      if (titleEl) titleEl.textContent = '👤 โปรไฟล์ผู้เล่น';
      if (formView) formView.style.display = 'none';
      if (profileView) profileView.style.display = 'block';

      const pAvatar = document.getElementById('bof-profile-avatar');
      const pName = document.getElementById('bof-profile-username');
      const pDeck = document.getElementById('bof-profile-deck-info');
      const sWins = document.getElementById('bof-stat-wins');
      const sLosses = document.getElementById('bof-stat-losses');
      const sWinrate = document.getElementById('bof-stat-winrate');

      if (pAvatar) pAvatar.src = getAvatarImage(currentUser.avatarId);
      const resetBtn = document.getElementById('bof-btn-reset-avatar');
      if (resetBtn) resetBtn.style.display = currentUser.customAvatar ? 'inline-block' : 'none';
      if (pName) pName.textContent = currentUser.username;

      const deckCfg = currentUser.savedDeck || readCurrentDeckFromStorage();
      const leaderCard = (typeof CARD_DATABASE !== 'undefined' && deckCfg)
        ? CARD_DATABASE.find(c => c.id === deckCfg.leaderId)
        : null;
      if (pDeck) {
        pDeck.textContent = leaderCard
          ? `🃏 เด็คที่ซิงค์: ${leaderCard.name} (21 ใบ)`
          : '🃏 เด็คที่ซิงค์: เด็คมาตรฐานเริ่มต้น';
      }

      const wins = currentUser.wins || 0;
      const losses = currentUser.losses || 0;
      const total = wins + losses;
      const rate = total > 0 ? Math.round((wins / total) * 100) : 0;

      if (sWins) sWins.textContent = String(wins);
      if (sLosses) sLosses.textContent = String(losses);
      if (sWinrate) sWinrate.textContent = `${rate}%`;

      renderAvatarPicker('bof-profile-avatar-picker', currentUser.avatarId, async newAvatarId => {
        currentUser.avatarId = newAvatarId;
        await persistCurrentUserProfile();
        renderAuthDialogContent();
      });
    } else {
      if (titleEl) {
        titleEl.textContent = authMode === 'login' ? '🔐 เข้าสู่ระบบ' : (authMode === 'register' ? '✨ สมัครสมาชิกใหม่' : '🔑 กู้คืน/ย้ายเครื่อง');
      }
      if (formView) formView.style.display = 'block';
      if (profileView) profileView.style.display = 'none';

      const tabLogin = document.getElementById('bof-tab-login');
      const tabReg = document.getElementById('bof-tab-register');
      const tabSync = document.getElementById('bof-tab-sync');
      const formEl = document.getElementById('bof-auth-form');
      const syncView = document.getElementById('bof-auth-sync-view');
      const avatarField = document.getElementById('bof-avatar-field');
      const submitBtn = document.getElementById('bof-auth-submit-btn');

      tabLogin?.classList.toggle('is-active', authMode === 'login');
      tabReg?.classList.toggle('is-active', authMode === 'register');
      tabSync?.classList.toggle('is-active', authMode === 'sync');

      if (authMode === 'sync') {
        if (formEl) formEl.style.display = 'none';
        if (syncView) syncView.style.display = 'block';
        const guestSec = document.getElementById('bof-guest-quick-section');
        if (guestSec) guestSec.style.display = 'none';
      } else {
        if (formEl) formEl.style.display = 'block';
        if (syncView) syncView.style.display = 'none';
        if (avatarField) avatarField.style.display = authMode === 'register' ? 'block' : 'none';
        if (submitBtn) submitBtn.textContent = authMode === 'login' ? 'เข้าสู่ระบบ ▶' : 'สร้างบัญชีและเริ่มซิงค์ ▶';

        const confirmField = document.getElementById('bof-confirm-pass-field');
        if (confirmField) confirmField.style.display = authMode === 'register' ? 'block' : 'none';

        if (authMode === 'login') {
          renderSavedAccountsList();
          const userInp = document.getElementById('bof-input-username');
          if (userInp && !userInp.value) {
            try {
              const lastUser = localStorage.getItem(LAST_USER_KEY);
              if (lastUser) userInp.value = lastUser;
            } catch (e) {}
          }
        } else {
          const savedSec = document.getElementById('bof-saved-accounts-section');
          if (savedSec) savedSec.style.display = 'none';
        }

        const guestSec = document.getElementById('bof-guest-quick-section');
        if (guestSec) {
          guestSec.style.display = 'block';
          const guestInp = document.getElementById('bof-input-guest-nickname');
          if (guestInp) {
            try {
              guestInp.value = localStorage.getItem(GUEST_NICK_KEY) || '';
            } catch (e) {}
          }
        }
      }

      const handlePickStarterDeck = newId => {
        selectedAvatarId = newId;
        renderAvatarPicker('bof-register-avatar-picker', selectedAvatarId, handlePickStarterDeck);
      };
      renderAvatarPicker('bof-register-avatar-picker', selectedAvatarId, handlePickStarterDeck);
    }
  }

  function renderAvatarPicker(containerId, activeId, onPick) {
    const box = document.getElementById(containerId);
    if (!box) return;
    box.innerHTML = '';
    AVATAR_LEADERS.forEach(item => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'bof-avatar-option' + (item.id === activeId ? ' is-selected' : '');
      const img = document.createElement('img');
      img.src = item.image;
      img.alt = item.label;
      const span = document.createElement('span');
      span.textContent = item.label;
      btn.appendChild(img);
      btn.appendChild(span);
      btn.addEventListener('click', () => {
        if (onPick) onPick(item.id);
      });
      box.appendChild(btn);
    });
  }

  function setStatusMessage(text, isError = false) {
    const msgEl = document.getElementById('bof-auth-msg');
    if (!msgEl) return;
    msgEl.textContent = text;
    msgEl.className = 'bof-auth-msg ' + (isError ? 'is-error' : 'is-ok');
  }

  /* ---------------- เชื่อมระบบเข้ากับการจัดเด็ค, จบเกม, และ PvP ---------------- */
  function hookGameEvents() {
    // 1. เมื่อกดบันทึกเด็คในหน้า Deck Builder -> ซิงค์เข้าบัญชีทันที
    document.getElementById('btn-save-start')?.addEventListener('click', () => {
      setTimeout(() => {
        if (!currentUser) return;
        const savedDeck = readCurrentDeckFromStorage();
        if (savedDeck) {
          currentUser.savedDeck = savedDeck;
        }
        if (window.BOFDeckSlots && typeof window.BOFDeckSlots.exportState === 'function') {
          currentUser.deckSlots = window.BOFDeckSlots.exportState();
        }
        persistCurrentUserProfile();
      }, 50);
    });

    // 2. ดักจับผลแพ้/ชนะอัตโนมัติโดยไม่ต้องแก้ไฟล์ js/game.js
    if (typeof window.showEndMatchModal === 'function') {
      const origShowEndMatch = window.showEndMatchModal;
      window.showEndMatchModal = function (title, desc) {
        if (currentUser) {
          const isWin = String(title).includes('ชนะ');
          currentUser.wins = (currentUser.wins || 0) + (isWin ? 1 : 0);
          currentUser.losses = (currentUser.losses || 0) + (isWin ? 0 : 1);
          currentUser.matches = (currentUser.matches || 0) + 1;
          persistCurrentUserProfile();
        }
        return origShowEndMatch.apply(this, arguments);
      };
    }

    // 3. เมื่อเริ่มเกมใหม่ (VS AI หรือ PvP) -> แสดงชื่อผู้เล่นของบัญชีบนการ์ด Leader
    if (typeof window.initGame === 'function') {
      const origInitGame = window.initGame;
      window.initGame = function () {
        const res = origInitGame.apply(this, arguments);
        updateInGamePlayerIdentity();
        return res;
      };
    }

    // 4. ส่งชื่อผู้เล่นให้เพื่อนในโหมด PvP เมื่อเชื่อมต่อสำเร็จ
    if (typeof window.handleIncomingPvpData === 'function') {
      const origHandlePvp = window.handleIncomingPvpData;
      window.handleIncomingPvpData = function (data) {
        if (data && data.type === 'PLAYER_PROFILE' && data.username) {
          const aiHeader = document.querySelector('.ai-mat-half .side-header-bar span b, .ai-side-zone .side-header-bar span b');
          if (aiHeader) aiHeader.textContent = data.username;
          const aiRole = document.querySelector('#ai-leader-box .leader-role-tag');
          if (aiRole) aiRole.textContent = `👑 ${data.username}`;
          if (typeof _originalSetLog === 'function') {
            _originalSetLog(`⚔️ ฝ่ายตรงข้ามคือ "${data.username}" พร้อมสำหรับการดวล!`);
          }
          return;
        }
        return origHandlePvp.apply(this, arguments);
      };
    }

    if (typeof window.startPvpMatchBoard === 'function') {
      const origStartPvp = window.startPvpMatchBoard;
      window.startPvpMatchBoard = function (role) {
        const res = origStartPvp.apply(this, arguments);
        updateInGamePlayerIdentity();
        if (typeof pvpState !== 'undefined' && pvpState.conn && pvpState.conn.open) {
          try {
            pvpState.conn.send({
              type: 'PLAYER_PROFILE',
              username: getEffectivePlayerName(),
              avatar: getEffectivePlayerAvatar()
            });
          } catch (e) {}
        }
        return res;
      };
    }
  }

  function bindAuthUI() {
    const dialog = document.getElementById('bof-auth-dialog');
    if (!dialog) return;

    document.getElementById('lb-auth-bar')?.addEventListener('click', () => {
      renderAuthDialogContent();
      try {
        if (!dialog.open) dialog.showModal();
      } catch (e) {
        dialog.setAttribute('open', '');
      }
    });

    dialog.addEventListener('click', e => {
      const rect = dialog.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height
        && rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) dialog.close();
    });

    document.getElementById('bof-auth-close')?.addEventListener('click', () => dialog.close());

    document.getElementById('bof-tab-login')?.addEventListener('click', () => {
      authMode = 'login';
      renderAuthDialogContent();
    });

    document.getElementById('bof-tab-register')?.addEventListener('click', () => {
      authMode = 'register';
      renderAuthDialogContent();
    });

    document.getElementById('bof-tab-sync')?.addEventListener('click', () => {
      authMode = 'sync';
      renderAuthDialogContent();
    });

    // ปุ่มคัดลอกรหัสย้ายเครื่อง
    document.getElementById('bof-btn-copy-sync-key')?.addEventListener('click', () => {
      if (!currentUser) return;
      const keyStr = generateAccountSyncKey(currentUser);
      navigator.clipboard.writeText(keyStr).then(() => {
        setStatusMessage('📋 คัดลอกรหัสย้ายเครื่องสำเร็จ! นำไปวางในเครื่องอื่นเพื่อเล่นต่อได้ทันที', false);
      }).catch(() => {
        prompt('รหัสย้ายเครื่องของคุณ (กด Ctrl+C เพื่อคัดลอก):', keyStr);
      });
    });

    // ปุ่มดาวน์โหลดไฟล์สำรอง .bof
    document.getElementById('bof-btn-download-backup')?.addEventListener('click', () => {
      if (!currentUser) return;
      const keyStr = generateAccountSyncKey(currentUser);
      const blob = new Blob([keyStr], { type: 'text/plain' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `bof_account_${currentUser.username}.bof`;
      a.click();
      setStatusMessage('💾 บันทึกไฟล์สำรองบัญชี .bof สำเร็จ!', false);
    });

    // ปุ่มนำเข้ารหัสย้ายเครื่อง
    document.getElementById('bof-btn-import-sync')?.addEventListener('click', async () => {
      const keyInp = document.getElementById('bof-input-sync-key');
      if (!keyInp || !keyInp.value.trim()) {
        setStatusMessage('⚠️ กรุณาวางรหัสย้ายเครื่องก่อนกดยืนยัน', true);
        return;
      }
      try {
        await importAccountSyncKey(keyInp.value.trim());
        keyInp.value = '';
        renderAuthDialogContent();
        setStatusMessage('🎉 กู้คืนบัญชีและเข้าสู่ระบบสำเร็จ!', false);
      } catch (err) {
        setStatusMessage(err.message || 'รหัสย้ายเครื่องไม่ถูกต้อง', true);
      }
    });

    // เลือกไฟล์ .bof จากเครื่อง
    document.getElementById('bof-file-import-account')?.addEventListener('change', e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async evt => {
        try {
          await importAccountSyncKey(evt.target.result.trim());
          renderAuthDialogContent();
          setStatusMessage('🎉 นำเข้าไฟล์บัญชีสำเร็จ!', false);
        } catch (err) {
          setStatusMessage(err.message || 'ไฟล์บัญชีไม่ถูกต้อง', true);
        }
      };
      reader.readAsText(file);
    });

    // อัปโหลดรูปโปรไฟล์ของฉันเอง
    document.getElementById('bof-upload-custom-avatar')?.addEventListener('change', e => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = evt => {
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const maxDim = 160;
          let w = img.width, h = img.height;
          if (w > h) { if (w > maxDim) { h = (h * maxDim) / w; w = maxDim; } }
          else { if (h > maxDim) { w = (w * maxDim) / h; h = maxDim; } }
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          if (currentUser) {
            currentUser.customAvatar = dataUrl;
            await persistCurrentUserProfile();
            renderAuthDialogContent();
            setStatusMessage('✨ อัปโหลดรูปโปรไฟล์ใหม่สำเร็จ!', false);
          }
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    });

    // ปุ่มรีเซ็ตรูปโปรไฟล์กลับเป็นค่าเริ่มต้น
    document.getElementById('bof-btn-reset-avatar')?.addEventListener('click', async () => {
      if (currentUser && currentUser.customAvatar) {
        delete currentUser.customAvatar;
        await persistCurrentUserProfile();
        renderAuthDialogContent();
        setStatusMessage('🔄 รีเซ็ตรูปโปรไฟล์กลับเป็นรูปเริ่มต้นแล้ว', false);
      }
    });

    // ปุ่มสลับดูรหัสผ่าน (Password Show/Hide Toggle)
    document.querySelectorAll('.bof-pw-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        const inp = document.getElementById(targetId);
        if (!inp) return;
        const isPass = inp.type === 'password';
        inp.type = isPass ? 'text' : 'password';
        btn.textContent = isPass ? '🙈' : '👁️';
      });
    });

    // ปุ่มบันทึกชื่อเล่น Guest ด่วนในหน้าล็อกอิน
    document.getElementById('bof-btn-save-guest-nick')?.addEventListener('click', () => {
      const inp = document.getElementById('bof-input-guest-nickname');
      if (!inp) return;
      const val = inp.value.trim();
      if (!val) {
        setStatusMessage('⚠️ กรุณาระบุชื่อเล่นสำหรับ Guest', true);
        return;
      }
      try {
        localStorage.setItem(GUEST_NICK_KEY, val);
      } catch (e) {}
      renderAuthBar();
      updateInGamePlayerIdentity();
      updateMultiplayerPlayerBanner();
      setStatusMessage(`✨ บันทึกชื่อเล่น "${val}" เรียบร้อยแล้ว!`, false);
    });

    document.getElementById('bof-auth-form')?.addEventListener('submit', async e => {
      e.preventDefault();
      const userInp = document.getElementById('bof-input-username');
      const passInp = document.getElementById('bof-input-password');
      const submitBtn = document.getElementById('bof-auth-submit-btn');
      if (!userInp || !passInp) return;

      try {
        if (submitBtn) submitBtn.disabled = true;
        if (authMode === 'register') {
          const passConfirmInp = document.getElementById('bof-input-password-confirm');
          if (passConfirmInp && passConfirmInp.value !== passInp.value) {
            throw new Error('รหัสผ่านทั้งสองช่องไม่ตรงกัน');
          }
          await registerAccount(userInp.value, passInp.value, selectedAvatarId);
          try {
            localStorage.setItem(LAST_USER_KEY, normalizeUsername(userInp.value));
          } catch (e) {}
          setStatusMessage('🎉 สมัครสมาชิกและเข้าสู่ระบบสำเร็จ!', false);
          if (passConfirmInp) passConfirmInp.value = '';
        } else {
          await loginAccount(userInp.value, passInp.value);
          try {
            localStorage.setItem(LAST_USER_KEY, normalizeUsername(userInp.value));
          } catch (e) {}
          setStatusMessage('✅ เข้าสู่ระบบสำเร็จ!', false);
        }
        userInp.value = '';
        passInp.value = '';
        renderAuthDialogContent();
      } catch (err) {
        setStatusMessage(err.message || 'เกิดข้อผิดพลาด', true);
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });

    document.getElementById('bof-btn-logout')?.addEventListener('click', async () => {
      await logoutAccount();
      renderAuthDialogContent();
    });
  }

  /* ---------------- ระบบควบคุมห้องดวลกับเพื่อนออนไลน์ (Multiplayer Controller) ---------------- */
  const BOF_PEER_CONFIG = {
    debug: 1,
    config: {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
        { urls: 'stun:stun.cloudflare.com:3478' }
      ],
      iceCandidatePoolSize: 10
    }
  };

  let hostKeepAliveTimer = null;
  let hostCreateTimeoutTimer = null;
  let guestTimeoutTimer = null;

  function updateMultiplayerPlayerBanner() {
    const nameEl = document.getElementById('mp-current-name');
    if (nameEl) nameEl.textContent = getEffectivePlayerName();
    const avatarEl = document.getElementById('mp-banner-avatar');
    if (avatarEl) avatarEl.src = getEffectivePlayerAvatar();
  }

  function setJoinStatus(text, type = 'info') {
    const statusEl = document.getElementById('mp-join-status');
    if (!statusEl) return;
    if (!text) {
      statusEl.style.display = 'none';
      statusEl.textContent = '';
      return;
    }
    statusEl.textContent = text;
    statusEl.className = 'mp-status-msg is-' + type;
    statusEl.style.display = 'block';
  }

  function cancelHostRoom() {
    if (hostKeepAliveTimer) { clearInterval(hostKeepAliveTimer); hostKeepAliveTimer = null; }
    if (hostCreateTimeoutTimer) { clearTimeout(hostCreateTimeoutTimer); hostCreateTimeoutTimer = null; }
    if (typeof pvpState !== 'undefined') {
      if (pvpState.conn) try { pvpState.conn.close(); } catch (e) {}
      if (pvpState.peer) try { pvpState.peer.destroy(); } catch (e) {}
      pvpState.conn = null;
      pvpState.peer = null;
      pvpState.roomCode = null;
      pvpState.role = null;
    }
    const hostBtn = document.getElementById('btn-create-room');
    const codeBox = document.getElementById('room-code-display');
    if (hostBtn) { hostBtn.disabled = false; hostBtn.textContent = '➕ สร้างห้องใหม่ (รับรหัส 4 หลัก)'; }
    if (codeBox) codeBox.style.display = 'none';
    setJoinStatus('', 'info');
  }

  window.createPvpRoomAsHost = function () {
    if (typeof Peer === 'undefined') {
      alert('ไม่พบระบบเชื่อมต่อเครือข่ายออนไลน์ (PeerJS) กรุณารีเฟรชหน้าเว็บอีกครั้ง');
      return;
    }
    if (window.BOF_AUDIO && typeof window.BOF_AUDIO.playClick === 'function') window.BOF_AUDIO.playClick();
    if (hostKeepAliveTimer) { clearInterval(hostKeepAliveTimer); hostKeepAliveTimer = null; }
    if (hostCreateTimeoutTimer) { clearTimeout(hostCreateTimeoutTimer); hostCreateTimeoutTimer = null; }

    const hostBtn = document.getElementById('btn-create-room');
    const codeBox = document.getElementById('room-code-display');
    const codeEl = document.getElementById('my-room-code');

    if (hostBtn) { hostBtn.disabled = true; hostBtn.textContent = '⏳ กำลังสร้างห้อง...'; }
    if (codeBox) codeBox.style.display = 'block';
    if (codeEl) codeEl.textContent = 'กำลังสร้าง...';
    setJoinStatus('🔄 กำลังเชื่อมต่อเครือข่ายกลางเพื่อรับรหัสห้อง...', 'info');

    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    if (typeof pvpState !== 'undefined') {
      if (pvpState.peer) try { pvpState.peer.destroy(); } catch (e) {}
      pvpState.role = 'host';
      pvpState.roomCode = randomCode;
      pvpState.conn = null;

      // Timeout หากเซิร์ฟเวอร์ตอบสนองช้าเกิน 7 วินาที -> auto-retry สุ่มรหัสใหม่ทันที
      hostCreateTimeoutTimer = setTimeout(() => {
        if (pvpState.peer && !pvpState.peer.open && !pvpState.peer.destroyed) {
          if (codeEl) codeEl.textContent = '🔄 กำลังสลับเซิร์ฟเวอร์...';
          try { pvpState.peer.destroy(); } catch (e) {}
          setTimeout(() => window.createPvpRoomAsHost(), 200);
        }
      }, 7000);

      pvpState.peer = new Peer(`my-tcg-room-${randomCode}`, BOF_PEER_CONFIG);

      pvpState.peer.on('open', () => {
        if (hostCreateTimeoutTimer) { clearTimeout(hostCreateTimeoutTimer); hostCreateTimeoutTimer = null; }
        if (codeEl) codeEl.textContent = randomCode;
        if (hostBtn) { hostBtn.disabled = true; hostBtn.textContent = '🏠 ห้องของคุณเปิดอยู่'; }
        setJoinStatus(`✅ ห้อง ${randomCode} พร้อมแล้ว! ส่งรหัสหรือลิงก์ให้เพื่อนได้เลย (เปิดหน้านี้รอไว้)`, 'ok');

        // Keepalive ping ป้องกันการหลุดเมื่อเปิดห้องรอเพื่อนนาน
        if (hostKeepAliveTimer) clearInterval(hostKeepAliveTimer);
        hostKeepAliveTimer = setInterval(() => {
          if (pvpState.peer && !pvpState.peer.destroyed && pvpState.peer.socket && typeof pvpState.peer.socket.send === 'function') {
            try { pvpState.peer.socket.send({ type: 'ping' }); } catch (e) {}
          }
        }, 15000);
      });

      // ดักจับกรณีสัญญาณหลุดเมื่อสลับหน้าจอไปแอปอื่นเพื่อส่งลิงก์
      pvpState.peer.on('disconnected', () => {
        if (pvpState.role === 'host' && !pvpState.isMultiplayer && pvpState.peer && !pvpState.peer.destroyed) {
          if (codeEl) codeEl.textContent = '🔄 กำลังเชื่อมต่อสัญญาณใหม่...';
          try { pvpState.peer.reconnect(); } catch (e) {}
        }
      });

      pvpState.peer.on('error', err => {
        if (hostCreateTimeoutTimer) { clearTimeout(hostCreateTimeoutTimer); hostCreateTimeoutTimer = null; }
        if (hostKeepAliveTimer) { clearInterval(hostKeepAliveTimer); hostKeepAliveTimer = null; }
        if (err && (err.type === 'unavailable-id' || err.type === 'network')) {
          setTimeout(() => window.createPvpRoomAsHost(), 300);
          return;
        }
        if (codeEl) codeEl.textContent = 'เกิดข้อผิดพลาด';
        if (hostBtn) { hostBtn.disabled = false; hostBtn.textContent = '➕ สร้างห้องใหม่ (ลองอีกครั้ง)'; }
        setJoinStatus(`⚠️ เครือข่ายขัดข้อง (${err.message || err.type})`, 'error');
      });

      pvpState.peer.on('connection', conn => {
        if (hostKeepAliveTimer) { clearInterval(hostKeepAliveTimer); hostKeepAliveTimer = null; }
        pvpState.conn = conn;
        if (codeEl) codeEl.textContent = '✨ เพื่อนเชื่อมต่อแล้ว!';
        setJoinStatus('✨ เพื่อนกำลังเข้าสู่ห้อง กำลังเตรียมกระดานดวล...', 'ok');

        let matchStarted = false;
        const triggerMatchStart = () => {
          if (matchStarted) return;
          matchStarted = true;
          try {
            conn.send({ type: 'START_PVP_MATCH' });
            conn.send({
              type: 'PLAYER_PROFILE',
              username: getEffectivePlayerName(),
              avatar: getEffectivePlayerAvatar()
            });
          } catch (e) {}
          if (typeof startPvpMatchBoard === 'function') {
            startPvpMatchBoard('host');
          }
        };

        if (conn.open) {
          triggerMatchStart();
        } else {
          conn.on('open', triggerMatchStart);
        }

        conn.on('data', data => {
          if (!matchStarted && data && (data.type === 'START_PVP_MATCH' || data.type === 'PLAYER_PROFILE' || data.type === 'GUEST_READY')) {
            triggerMatchStart();
          }
          if (typeof handleIncomingPvpData === 'function') {
            handleIncomingPvpData(data);
          }
        });

        conn.on('close', () => {
          if (pvpState.isMultiplayer && !gameState.gameOver) {
            gameState.gameOver = true;
            disableControls();
            if (typeof _originalSetLog === 'function') _originalSetLog('🔌 ฝ่ายตรงข้ามออกจากการเชื่อมต่อ!');
            showEndMatchModal('🏆 คุณชนะ!', 'ฝ่ายตรงข้ามตัดการเชื่อมต่อไป');
          }
        });
      });
    }
  };

  window.joinPvpRoomAsGuest = function (codeInput) {
    const code = String(codeInput || '').replace(/\D+/g, '').slice(0, 4);
    if (!code || code.length !== 4) {
      setJoinStatus('⚠️ กรุณากรอกรหัสห้องเป็นตัวเลข 4 หลัก เช่น 4829', 'error');
      const inp = document.getElementById('input-join-code');
      if (inp) inp.focus();
      return;
    }

    if (window.BOF_AUDIO && typeof window.BOF_AUDIO.playClick === 'function') window.BOF_AUDIO.playClick();
    if (guestTimeoutTimer) clearTimeout(guestTimeoutTimer);

    const joinBtn = document.getElementById('btn-join-room');
    const joinInp = document.getElementById('input-join-code');
    const quickJoinBtn = document.getElementById('btn-quick-join-invite');
    if (joinBtn) { joinBtn.disabled = true; joinBtn.textContent = '⏳ กำลังค้นหา...'; }
    if (quickJoinBtn) { quickJoinBtn.disabled = true; quickJoinBtn.textContent = '⏳ กำลังเข้าห้อง...'; }
    if (joinInp) joinInp.disabled = true;
    setJoinStatus(`🔄 กำลังค้นหาและเชื่อมต่อไปยังห้อง ${code}...`, 'info');

    if (typeof pvpState !== 'undefined') {
      pvpState.role = 'guest';
      pvpState.roomCode = code;
      if (pvpState.peer) try { pvpState.peer.destroy(); } catch (e) {}
      pvpState.peer = new Peer(BOF_PEER_CONFIG);

      let hasConnected = false;
      guestTimeoutTimer = setTimeout(() => {
        if (!hasConnected) {
          if (pvpState.conn) try { pvpState.conn.close(); } catch (e) {}
          if (pvpState.peer) try { pvpState.peer.destroy(); } catch (e) {}
          pvpState.conn = null;
          pvpState.peer = null;
          setJoinStatus(`⚠️ ไม่พบห้อง ${code} หรือเจ้าของห้องสลับไปแอปอื่น (ให้เพื่อนเปิดหน้าเกมรอไว้)`, 'error');
          if (joinBtn) { joinBtn.disabled = false; joinBtn.textContent = 'เข้าร่วมห้อง ▶'; }
          if (quickJoinBtn) { quickJoinBtn.disabled = false; quickJoinBtn.textContent = '⚔️ เข้าร่วมทันที'; }
          if (joinInp) { joinInp.disabled = false; joinInp.focus(); }
        }
      }, 14000);

      pvpState.peer.on('open', () => {
        const conn = pvpState.peer.connect(`my-tcg-room-${code}`, Object.assign({ reliable: true }, BOF_PEER_CONFIG));
        pvpState.conn = conn;

        let guestStarted = false;
        const triggerGuestReady = () => {
          if (guestStarted) return;
          hasConnected = true;
          clearTimeout(guestTimeoutTimer);
          setJoinStatus('✅ เชื่อมต่อห้องสำเร็จ! กำลังเข้าสู่การดวล...', 'ok');
          try {
            conn.send({
              type: 'PLAYER_PROFILE',
              username: getEffectivePlayerName(),
              avatar: getEffectivePlayerAvatar()
            });
            conn.send({ type: 'GUEST_READY' });
          } catch (e) {}
        };

        if (conn.open) {
          triggerGuestReady();
        } else {
          conn.on('open', triggerGuestReady);
        }

        conn.on('data', data => {
          hasConnected = true;
          clearTimeout(guestTimeoutTimer);
          if (data && data.type === 'START_PVP_MATCH') {
            guestStarted = true;
          }
          if (typeof handleIncomingPvpData === 'function') {
            handleIncomingPvpData(data);
          }
        });

        conn.on('close', () => {
          if (pvpState.isMultiplayer && !gameState.gameOver) {
            gameState.gameOver = true;
            disableControls();
            if (typeof _originalSetLog === 'function') _originalSetLog('🔌 ฝ่ายตรงข้ามออกจากการเชื่อมต่อ!');
            showEndMatchModal('🏆 คุณชนะ!', 'ฝ่ายตรงข้ามตัดการเชื่อมต่อไป');
          }
        });

        conn.on('error', () => {
          clearTimeout(guestTimeoutTimer);
          setJoinStatus(`⚠️ เกิดข้อผิดพลาดในการเชื่อมต่อไปยังห้อง ${code}`, 'error');
          if (joinBtn) { joinBtn.disabled = false; joinBtn.textContent = 'เข้าร่วมห้อง ▶'; }
          if (quickJoinBtn) { quickJoinBtn.disabled = false; quickJoinBtn.textContent = '⚔️ เข้าร่วมทันที'; }
          if (joinInp) { joinInp.disabled = false; }
        });
      });

      pvpState.peer.on('error', () => {
        clearTimeout(guestTimeoutTimer);
        setJoinStatus(`⚠️ ไม่พบห้อง ${code} หรือระบบเครือข่ายขัดข้อง`, 'error');
        if (joinBtn) { joinBtn.disabled = false; joinBtn.textContent = 'เข้าร่วมห้อง ▶'; }
        if (quickJoinBtn) { quickJoinBtn.disabled = false; quickJoinBtn.textContent = '⚔️ เข้าร่วมทันที'; }
        if (joinInp) { joinInp.disabled = false; }
      });
    }
  };

  function bindMultiplayerUI() {
    updateMultiplayerPlayerBanner();

    // ปุ่มยกเลิก/ปิดห้องฝั่ง Host
    document.getElementById('btn-cancel-host-room')?.addEventListener('click', cancelHostRoom);

    // ปุ่มคัดลอกรหัสห้อง
    document.getElementById('btn-copy-room-code')?.addEventListener('click', () => {
      const code = typeof pvpState !== 'undefined' ? pvpState.roomCode : null;
      if (!code) return;
      navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('btn-copy-room-code');
        if (btn) {
          const old = btn.textContent;
          btn.textContent = '✓ คัดลอกแล้ว!';
          setTimeout(() => { btn.textContent = old; }, 2000);
        }
      }).catch(() => {
        prompt('รหัสห้องของคุณ:', code);
      });
    });

    // ปุ่มคัดลอกลิงก์ชวนเพื่อน
    document.getElementById('btn-copy-room-link')?.addEventListener('click', () => {
      const code = typeof pvpState !== 'undefined' ? pvpState.roomCode : null;
      if (!code) return;
      const url = window.location.origin + window.location.pathname + '?room=' + code;
      navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('btn-copy-room-link');
        if (btn) {
          const old = btn.textContent;
          btn.textContent = '✓ คัดลอกลิงก์แล้ว!';
          setTimeout(() => { btn.textContent = old; }, 2000);
        }
      }).catch(() => {
        prompt('ลิงก์สำหรับส่งให้เพื่อน:', url);
      });
    });

    // ปุ่มวางรหัสห้องจากคลิปบอร์ด
    document.getElementById('btn-paste-join-code')?.addEventListener('click', async () => {
      try {
        const text = await navigator.clipboard.readText();
        const code = String(text || '').replace(/\D+/g, '').slice(0, 4);
        if (code) {
          const inp = document.getElementById('input-join-code');
          if (inp) {
            inp.value = code;
            inp.focus();
            setJoinStatus(`📋 วางรหัส ${code} แล้ว กด "เข้าร่วมห้อง" ได้เลย`, 'info');
          }
        }
      } catch (e) {}
    });

    // กด Enter ในช่องกรอกรหัสห้องเพื่อเข้าร่วมทันที
    document.getElementById('input-join-code')?.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const code = document.getElementById('input-join-code').value;
        window.joinPvpRoomAsGuest(code);
      }
    });

    // แก้ไขชื่อเล่น Guest ด่วนในหน้าสร้างห้อง
    const editGuestBtn = document.getElementById('mp-btn-edit-guest');
    const guestEditRow = document.getElementById('mp-guest-edit-row');
    const guestNameInput = document.getElementById('mp-guest-name-input');
    const saveGuestBtn = document.getElementById('mp-btn-save-guest');
    const cancelGuestBtn = document.getElementById('mp-btn-cancel-guest');

    editGuestBtn?.addEventListener('click', () => {
      if (!guestEditRow) return;
      const isOpen = guestEditRow.style.display !== 'none';
      guestEditRow.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen && guestNameInput) {
        guestNameInput.value = localStorage.getItem(GUEST_NICK_KEY) || (currentUser ? currentUser.username : '');
        guestNameInput.focus();
      }
    });

    cancelGuestBtn?.addEventListener('click', () => {
      if (guestEditRow) guestEditRow.style.display = 'none';
    });

    saveGuestBtn?.addEventListener('click', () => {
      if (!guestNameInput) return;
      const val = guestNameInput.value.trim();
      if (!val) return;
      try {
        localStorage.setItem(GUEST_NICK_KEY, val);
      } catch (e) {}
      if (guestEditRow) guestEditRow.style.display = 'none';
      renderAuthBar();
      updateInGamePlayerIdentity();
      updateMultiplayerPlayerBanner();
    });

    // ตรวจจับกรณีสลับหน้าจอ (เช่น กลับมาจากแอปแชทหลังส่งลิงก์ให้เพื่อน) ให้ต่อสัญญาณห้องทันที
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        if (typeof pvpState !== 'undefined' && pvpState.role === 'host' && !pvpState.isMultiplayer && pvpState.peer) {
          if (pvpState.peer.disconnected && !pvpState.peer.destroyed) {
            const codeEl = document.getElementById('my-room-code');
            if (codeEl) codeEl.textContent = '🔄 กำลังฟื้นฟูห้อง...';
            try { pvpState.peer.reconnect(); } catch (e) {}
          }
        }
      }
    });

    // ตรวจจับ URL Parameter ชวนเข้าห้อง (?room=XXXX หรือ #room=XXXX)
    checkUrlInviteRoom();
  }

  function checkUrlInviteRoom() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let roomCode = urlParams.get('room') || '';
      if (!roomCode && window.location.hash) {
        const match = window.location.hash.match(/room=(\d{4})/i);
        if (match) roomCode = match[1];
      }
      roomCode = String(roomCode || '').replace(/\D+/g, '').slice(0, 4);
      if (roomCode.length === 4) {
        const modal = document.getElementById('pvp-room-modal');
        const inp = document.getElementById('input-join-code');
        const banner = document.getElementById('mp-invite-banner');
        const codeTxt = document.getElementById('mp-invite-code-text');
        const quickJoinBtn = document.getElementById('btn-quick-join-invite');

        if (inp) inp.value = roomCode;
        if (codeTxt) codeTxt.textContent = roomCode;
        if (banner) banner.style.display = 'flex';
        if (modal) modal.style.display = 'flex';

        setJoinStatus(`🎉 ได้รับคำเชิญเข้าห้อง ${roomCode} กดปุ่ม "เข้าร่วมทันที" เพื่อเริ่มเล่นได้เลย`, 'info');

        quickJoinBtn?.addEventListener('click', () => {
          window.joinPvpRoomAsGuest(roomCode);
        });
      }
    } catch (e) {}
  }

  async function restoreSession() {
    await initFirebaseIfConfigured();
    try {
      const savedKey = localStorage.getItem(STORAGE_SESSION_KEY);
      if (savedKey) {
        const db = loadLocalAccounts();
        if (db[savedKey]) {
          currentUser = db[savedKey];
          applyProfileDeckToGame(currentUser);
        }
      }
    } catch (e) {}
    renderAuthBar();
    updateInGamePlayerIdentity();
  }

  window.BOFAuth = {
    currentUser: () => currentUser,
    getEffectivePlayerName,
    getEffectivePlayerAvatar,
    onOpenMultiplayerModal: () => {
      updateMultiplayerPlayerBanner();
      setJoinStatus('', 'info');
    },
    onCloseMultiplayerModal: () => {
      if (typeof pvpState !== 'undefined' && pvpState.role === 'host' && !pvpState.isMultiplayer) {
        cancelHostRoom();
      }
      setJoinStatus('', 'info');
    },
    loginAccount,
    registerAccount,
    logoutAccount,
    syncEconomy: eco => {
      if (!currentUser || !eco) return;
      currentUser.coins = eco.coins;
      currentUser.shards = typeof eco.shards === 'number' ? eco.shards : (currentUser.shards || 150);
      currentUser.pity = eco.pity;
      currentUser.ownedCards = eco.ownedCards;
      if (eco.ownedDecks) currentUser.ownedDecks = eco.ownedDecks;
      currentUser.packsOpened = eco.packsOpened;
      currentUser.lastDailyClaimDate = eco.lastDailyClaimDate;
      currentUser.dailyProgress = eco.dailyProgress;
      currentUser.claimedQuests = eco.claimedQuests;
      currentUser.weeklyProgress = eco.weeklyProgress;
      currentUser.claimedWeekly = eco.claimedWeekly;
      currentUser.ownedCosmetics = eco.ownedCosmetics;
      currentUser.equippedCosmetics = eco.equippedCosmetics;
      persistCurrentUserProfile();
    }
  };

  bindAuthUI();
  bindMultiplayerUI();
  hookGameEvents();
  restoreSession();
})();
