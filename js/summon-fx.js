// เอฟเฟคการ์ดลงสนาม: เปลือกแสง → แตกเป็นเศษกระจกโฮโล แรงขึ้นตามระดับความแรร์
// ชิ้นเอฟเฟคอยู่ในเลเยอร์ลอย #summon-fx-layer (พิกัดจอ) จึงไม่ถูกลบตอน renderGame() สร้างช่องใหม่
(function () {
  'use strict';

  const TIER = {
    N: { shards: 8, dist: 70, shake: 0, sparks: 0 },
    R: { shards: 14, dist: 100, shake: 2, sparks: 6 },
    SR: { shards: 22, dist: 140, shake: 4, sparks: 12, rainbow: true, sweep: true },
    SSR: { shards: 34, dist: 220, shake: 7, sparks: 24, rainbow: true, sweep: true, prism: true },
    Legend: { shards: 34, dist: 220, shake: 7, sparks: 24, rainbow: true, sweep: true, prism: true },
  };
  const COLOR_VAR = { N: '--rar-n', R: '--rar-r', SR: '--rar-sr', SSR: '--rar-legend', Legend: '--rar-legend' };
  const T = { shell: 160, flash: 450, shardMin: 500, shardMax: 900, shake: 220, sweep: 650, reduced: 200, failsafe: 1600 };
  const COARSE_FACTOR = 0.6;

  const SummonFx = { TIER, MAX_PIECES: 90 };
  let layer = null;

  const reducedMotion = () => !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const coarse = () => !!(window.matchMedia && window.matchMedia('(pointer: coarse)').matches) || window.innerWidth < 768;
  const rnd = (a, b) => a + Math.random() * (b - a);

  SummonFx.layer = function () {
    if (!layer || !layer.isConnected) {
      layer = document.createElement('div');
      layer.id = 'summon-fx-layer';
      document.body.appendChild(layer);
    }
    return layer;
  };
  SummonFx.activeCount = function () { return layer ? layer.childElementCount : 0; };

  // สร้างชิ้นกึ่งกลางที่ (x, y) พิกัดจอ; เกินเพดานคืน null
  function spawn(cls, x, y, w, h, style) {
    const L = SummonFx.layer();
    if (L.childElementCount >= SummonFx.MAX_PIECES) return null;
    const el = document.createElement('i');
    el.className = cls;
    el.style.cssText = `left:${x - w / 2}px;top:${y - h / 2}px;width:${w}px;height:${h}px;`;
    if (style) Object.assign(el.style, style);
    L.appendChild(el);
    setTimeout(() => el.remove(), T.failsafe);
    return el;
  }
  // เล่นแล้วลบตัวเองเมื่อจบ
  function play(el, frames, opt) {
    if (!el) return null;
    const a = el.animate(frames, Object.assign({ fill: 'forwards' }, opt));
    a.onfinish = () => el.remove();
    return a;
  }

  function shake(px) {
    const f = [];
    for (let i = 0; i <= 8; i++) { const k = px * (1 - i / 8); f.push({ transform: `translate(${rnd(-k, k)}px, ${rnd(-k, k)}px)` }); }
    f[f.length - 1] = { transform: 'none' };
    ['ai-board', 'player-board'].forEach(id => { const b = document.getElementById(id); if (b) b.animate(f, { duration: T.shake }); });
  }

  function shatter(r, color, rect, cardEl) {
    const tier = TIER[r];
    const k = coarse() ? COARSE_FACTOR : 1;
    const x = rect.left + rect.width / 2, y = rect.top + rect.height / 2, w = rect.width, h = rect.height;
    const img = cardEl.querySelector('.card-art img');
    const art = img && img.src ? `url("${img.src}")` : 'none';

    cardEl.animate([{ filter: 'brightness(2.5)' }, { filter: 'brightness(1)' }], { duration: T.flash, easing: 'ease-out' });
    if (tier.shake) shake(tier.shake);

    const n = Math.round(tier.shards * k);
    for (let i = 0; i < n; i++) {
      const sw = rnd(w * 0.12, w * 0.26), sh = rnd(h * 0.09, h * 0.22);
      const sx = x + rnd(-w / 2 + sw / 2, w / 2 - sw / 2), sy = y + rnd(-h / 2 + sh / 2, h / 2 - sh / 2);
      const s = spawn('sfx-shard', sx, sy, sw, sh, {
        clipPath: `polygon(${rnd(0, 40)}% 0, 100% ${rnd(0, 50)}%, ${rnd(40, 100)}% 100%, 0 ${rnd(30, 90)}%)`,
        backgroundColor: color,
        backgroundImage: art,
        backgroundSize: `${w}px ${h}px`,
        backgroundPosition: `${-(sx - sw / 2 - (x - w / 2))}px ${-(sy - sh / 2 - (y - h / 2))}px`,
        filter: tier.rainbow ? `hue-rotate(${Math.round(rnd(0, 360))}deg) saturate(2) brightness(1.4)` : 'brightness(1.6)',
        '--c': color,
      });
      if (!s) break;
      const a = Math.atan2(sy - y, sx - x) + rnd(-0.4, 0.4), d = rnd(tier.dist * 0.5, tier.dist);
      play(s, [
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d + 30}px) rotate(${rnd(-300, 300)}deg) scale(.4)`, opacity: 0 },
      ], { duration: rnd(T.shardMin, T.shardMax), easing: 'cubic-bezier(.15,.7,.4,1)' });
    }

    const sparks = Math.round(tier.sparks * k);
    for (let i = 0; i < sparks; i++) {
      const sz = rnd(3, 6);
      const s = spawn('sfx-spark', x, y, sz, sz, { '--c': '#fff' });
      if (!s) break;
      const a = rnd(0, Math.PI * 2), d = rnd(tier.dist * 0.4, tier.dist);
      play(s, [
        { transform: 'translate(0, 0) scale(1)', opacity: 1 },
        { transform: `translate(${Math.cos(a) * d}px, ${Math.sin(a) * d + 10}px) scale(.2)`, opacity: 0 },
      ], { duration: rnd(420, 720), delay: rnd(0, 60), easing: 'cubic-bezier(.1,.8,.3,1)' });
    }

    if (tier.sweep) {
      // แสงกวาดผ่านการ์ด: เกาะการ์ดจริง ถ้าถูกวาดใหม่ก็หายไปพร้อมการ์ด
      const g = document.createElement('i');
      g.className = 'sfx-sweep';
      cardEl.appendChild(g);
      play(g, [{ transform: 'translateX(-120%)' }, { transform: 'translateX(120%)' }], { duration: T.sweep, delay: 120, easing: 'ease-in-out' });
    }

    if (tier.prism) {
      play(spawn('sfx-prism', x, y, 60, 60), [
        { transform: 'scale(.5) rotate(0deg)', opacity: 1 },
        { transform: 'scale(6) rotate(90deg)', opacity: 0 },
      ], { duration: 900, easing: 'cubic-bezier(.2,.7,.3,1)' });
      for (let i = 0; i < 4; i++) {
        play(spawn('sfx-ray', x, y, 6, 260, { '--c': color }), [
          { transform: `rotate(${i * 45}deg) scaleY(0)`, opacity: 1 },
          { transform: `rotate(${i * 45}deg) scaleY(1.4)`, opacity: 0 },
        ], { duration: 700, easing: 'ease-out' });
      }
      play(spawn('sfx-flash', x, y, 420, 420, { '--c': color }), [{ opacity: 0.7 }, { opacity: 0 }], { duration: 600, easing: 'ease-out' });
      const st = spawn('sfx-stamp', x, y - 70, 220, 40, { '--c': color });
      if (st) {
        st.textContent = r === 'SSR' ? 'SSR' : 'LEGEND';
        play(st, [
          { transform: 'scale(2.4)', opacity: 0 },
          { transform: 'scale(.95)', opacity: 1, offset: 0.25 },
          { transform: 'scale(1)', opacity: 1, offset: 0.75 },
          { transform: 'scale(1.05) translateY(-8px)', opacity: 0 },
        ], { duration: 1300, easing: 'cubic-bezier(.2,.8,.3,1)' });
      }
    }
  }

  SummonFx.play = function (slotEl, cardEl) {
    if (!slotEl || !cardEl || !cardEl.isConnected) return;
    const r = TIER[cardEl.dataset.rarity] ? cardEl.dataset.rarity : 'N';
    const color = getComputedStyle(document.documentElement).getPropertyValue(COLOR_VAR[r]).trim() || '#8f97b8';

    if (reducedMotion()) {
      cardEl.animate([
        { opacity: 0, boxShadow: `0 0 0 2px ${color}, 0 0 18px ${color}` },
        { opacity: 1, boxShadow: `0 0 0 2px ${color}, 0 0 18px ${color}` },
      ], { duration: T.reduced, easing: 'ease-out' });
      return;
    }

    const rect = cardEl.getBoundingClientRect();
    const shell = spawn('sfx-shell', rect.left + rect.width / 2, rect.top + rect.height / 2, rect.width, rect.height, { '--c': color });
    if (!shell) { shatter(r, color, rect, cardEl); return; }
    cardEl.style.opacity = '0';
    const a = shell.animate([{ opacity: 0, transform: 'scale(1.25)' }, { opacity: 1, transform: 'scale(1)' }], { duration: T.shell, easing: 'ease-in', fill: 'forwards' });
    a.onfinish = () => {
      shell.remove();
      cardEl.style.opacity = '';
      // การ์ดอาจถูกวาดใหม่ไปแล้ว: เศษยังเล่นตามพิกัดเดิม ส่วนแสงบนการ์ดเก่าไม่มีผล
      shatter(r, color, rect, cardEl);
    };
  };

  // วาดวังวนฟิวชั่นสไตล์ยูกิโอ (Polymerization / Master Duel): เกลียวพลังงานส้ม-น้ำเงินม้วนเข้าหลุมดำกลางจอ
  function startPolymerizationVortex(canvas, durationMs) {
    const ctx = canvas && canvas.getContext ? canvas.getContext('2d') : null;
    if (!ctx) return () => {};
    const size = 520, cx = size / 2, cy = size / 2, maxR = 238;
    canvas.width = size;
    canvas.height = size;

    const sparks = Array.from({ length: 56 }, (_, i) => ({
      angle: (i / 56) * Math.PI * 2 + rnd(-0.2, 0.2),
      r: rnd(38, maxR),
      speed: rnd(1.8, 3.6),
      size: rnd(1.6, 4.2),
      isOrange: i % 2 === 0,
    }));

    let rafId = 0;
    const t0 = performance.now();

    function drawArm(spin, offsetAngle, colors, widthScale, turns) {
      const steps = 68;
      colors.forEach(([stroke, width, alpha]) => {
        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const u = i / steps;
          const r = maxR * Math.pow(1 - u, 1.18) + 20;
          const a = offsetAngle + spin + u * Math.PI * turns;
          const x = cx + Math.cos(a) * r;
          const y = cy + Math.sin(a) * r;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = stroke;
        ctx.lineWidth = width * widthScale;
        ctx.lineCap = 'round';
        ctx.globalAlpha = alpha;
        ctx.stroke();
      });
    }

    function frame(now) {
      const elapsed = now - t0;
      const p = Math.min(1, elapsed / durationMs);
      // เร่งความเร็วหมุนขึ้นเรื่อยๆ ก่อนระเบิด
      const spin = (elapsed * 0.0048) + p * p * 6.5;

      ctx.clearRect(0, 0, size, size);

      // 1. วงเงาจักรวาลรอบหลุมดำ
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      const bg = ctx.createRadialGradient(cx, cy, 18, cx, cy, maxR);
      bg.addColorStop(0, 'rgba(0, 0, 0, 0.96)');
      bg.addColorStop(0.32, 'rgba(8, 6, 22, 0.84)');
      bg.addColorStop(0.68, 'rgba(12, 16, 40, 0.35)');
      bg.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bg;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.fill();

      // 2. เกลียวพลังงานส้มเพลิง + น้ำเงินไฟฟ้า ม้วนเป็นเกลียวจริงเข้าสู่หลุมดำ
      ctx.globalCompositeOperation = 'lighter';
      const orangeArm = [
        ['rgba(255, 88, 0, 0.55)', 28, 0.55],
        ['rgba(255, 145, 30, 0.85)', 14, 0.85],
        ['rgba(255, 240, 200, 0.95)', 4.5, 0.95],
      ];
      const blueArm = [
        ['rgba(0, 102, 255, 0.55)', 28, 0.55],
        ['rgba(56, 189, 248, 0.85)', 14, 0.85],
        ['rgba(224, 247, 255, 0.95)', 4.5, 0.95],
      ];

      // เกลียวหลัก 2 แขน (ส้ม vs น้ำเงิน) + เกลียวรองบางๆ ให้ดูหนาแน่นเหมือนโพลีเมอไรเซชั่น
      drawArm(spin, 0, orangeArm, 1.0, 4.4);
      drawArm(spin, Math.PI, blueArm, 1.0, 4.4);
      drawArm(spin * 1.18, 0.55, orangeArm, 0.45, 5.2);
      drawArm(spin * 1.18, Math.PI + 0.55, blueArm, 0.45, 5.2);

      // 3. ประกายพลังงานถูกดูดม้วนเข้าศูนย์กลาง
      sparks.forEach(s => {
        s.r -= s.speed * (1.2 + (1 - s.r / maxR) * 2.2);
        s.angle += 0.065 + (1 - s.r / maxR) * 0.14;
        if (s.r < 22) { s.r = maxR; s.angle = rnd(0, Math.PI * 2); }
        const x = cx + Math.cos(s.angle) * s.r;
        const y = cy + Math.sin(s.angle) * s.r;
        const tailA = s.angle - 0.18;
        const tx = cx + Math.cos(tailA) * (s.r + 8);
        const ty = cy + Math.sin(tailA) * (s.r + 8);
        ctx.beginPath();
        ctx.moveTo(tx, ty);
        ctx.lineTo(x, y);
        ctx.strokeStyle = s.isOrange ? '#ffb347' : '#60d5ff';
        ctx.lineWidth = s.size;
        ctx.globalAlpha = Math.min(1, (s.r / maxR) * 1.3);
        ctx.stroke();
      });

      // 4. ใจกลางหลุมดำ (Event Horizon + ขอบแสงส้ม/น้ำเงิน)
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = 1;
      const holeR = 32 * (1 - p * 0.25);
      const rim = ctx.createRadialGradient(cx, cy, holeR * 0.72, cx, cy, holeR * 1.65);
      rim.addColorStop(0, '#000000');
      rim.addColorStop(0.55, '#000000');
      rim.addColorStop(0.76, p > 0.82 ? '#ffffff' : 'rgba(255, 165, 60, 0.95)');
      rim.addColorStop(0.9, 'rgba(56, 189, 248, 0.75)');
      rim.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cx, cy, holeR * 1.65, 0, Math.PI * 2);
      ctx.fill();

      // แสงวาบก่อนระเบิดท้ายช่วง
      if (p > 0.82) {
        const k = (p - 0.82) / 0.18;
        ctx.globalCompositeOperation = 'lighter';
        const flare = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR * (0.4 + k * 0.7));
        flare.addColorStop(0, `rgba(255, 255, 255, ${k})`);
        flare.addColorStop(0.45, `rgba(216, 180, 254, ${k * 0.75})`);
        flare.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = flare;
        ctx.beginPath();
        ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
        ctx.fill();
      }

      if (elapsed < durationMs + 300) {
        rafId = requestAnimationFrame(frame);
      }
    }

    rafId = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafId);
  }

  // เอฟเฟคอัญเชิญฟิวชั่นสไตล์ Master Duel (วัตถุดิบลอยกรอบม่วง -> หลุมดำเกลียวส้ม-น้ำเงินแบบยูกิโอ -> การ์ดฟิวชั่นเด้งกลางจอ -> พุ่งตบลงช่องจริง + วงแหวนม่วง)
  SummonFx.playFusion = function (opts) {
    if (!opts || !opts.fusionCard) return;
    const fusionCard = opts.fusionCard;
    const materials = Array.isArray(opts.materials) ? opts.materials.filter(Boolean) : [];
    const onComplete = typeof opts.onComplete === 'function' ? opts.onComplete : null;
    const artUrl = fusionCard.image || '';
    const hasMats = materials.length > 0;

    const findTargetSlot = () => {
      if (opts.targetSlotEl && opts.targetSlotEl.isConnected) return opts.targetSlotEl;
      if (opts.side && typeof opts.slotIndex === 'number') {
        const boardId = opts.side === 'player' ? 'player-board' : 'ai-board';
        const slots = document.querySelectorAll(`#${boardId} .card-slot`);
        if (slots[opts.slotIndex]) return slots[opts.slotIndex];
      }
      if (fusionCard.uid) {
        const el = document.querySelector(`.card[data-uid="${fusionCard.uid}"]`);
        if (el) return el.closest('.card-slot') || el;
      }
      return null;
    };

    const existing = document.querySelector('.sfx-fusion-overlay');
    if (existing) existing.remove();

    const overlay = document.createElement('div');
    overlay.className = 'sfx-fusion-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', `อัญเชิญฟิวชั่น ${fusionCard.name || ''}`);

    const timers = [];
    const after = (ms, fn) => timers.push(setTimeout(fn, ms));
    let stopVortex = null;
    let closed = false;
    const close = () => {
      if (closed) return;
      closed = true;
      timers.forEach(clearTimeout);
      if (stopVortex) { stopVortex(); stopVortex = null; }
      overlay.classList.add('is-closing');
      setTimeout(() => {
        overlay.remove();
        if (onComplete) onComplete();
      }, 280);
    };
    overlay.addEventListener('click', close);

    // Stage 1: การ์ดวัตถุดิบลอยกรอบออร่าม่วงบนกระดานมืด
    let matsWrap = null;
    const matNodes = [];
    if (hasMats && !reducedMotion()) {
      matsWrap = document.createElement('div');
      matsWrap.className = 'sfx-fusion-mats';
      materials.forEach((mat, i) => {
        const box = document.createElement('div');
        box.className = 'sfx-fusion-mat-card';
        box.style.animationDelay = `${i * 70}ms`;
        const img = document.createElement('img');
        img.src = mat.image || '';
        img.alt = mat.name || '';
        box.appendChild(img);
        matsWrap.appendChild(box);
        matNodes.push(box);
      });
      overlay.appendChild(matsWrap);
    }

    // Stage 2: หลุมดำเกลียวพลังงานส้ม-น้ำเงินแบบยูกิโอ (Polymerization Canvas Vortex)
    const vortex = document.createElement('div');
    vortex.className = 'sfx-fusion-vortex';
    const vortexCanvas = document.createElement('canvas');
    vortexCanvas.className = 'sfx-fusion-canvas';
    vortex.appendChild(vortexCanvas);
    overlay.appendChild(vortex);

    const flash = document.createElement('div');
    flash.className = 'sfx-fusion-flash';
    overlay.appendChild(flash);

    // Stage 3 & 4: การ์ดฟิวชั่นเด้งเปิดตัวกลางจอพร้อมออร่าม่วง
    const revealWrap = document.createElement('div');
    revealWrap.className = 'sfx-fusion-reveal-wrap';
    const aura = document.createElement('div');
    aura.className = 'sfx-fusion-aura';
    const cardFinal = document.createElement('div');
    cardFinal.className = 'sfx-fusion-reveal-card';
    const finalImg = document.createElement('img');
    finalImg.src = artUrl;
    finalImg.alt = fusionCard.name || '';
    cardFinal.appendChild(finalImg);
    revealWrap.appendChild(aura);
    revealWrap.appendChild(cardFinal);
    overlay.appendChild(revealWrap);

    const caption = document.createElement('div');
    caption.className = 'sfx-fusion-caption';
    const tag = document.createElement('div');
    tag.className = 'sfx-fusion-tag';
    tag.textContent = 'FUSION SUMMON';
    const nameEl = document.createElement('div');
    nameEl.className = 'sfx-fusion-name';
    nameEl.textContent = fusionCard.name || 'ฟิวชั่นมอนสเตอร์';
    caption.appendChild(tag);
    caption.appendChild(nameEl);
    overlay.appendChild(caption);

    const skipHint = document.createElement('div');
    skipHint.className = 'sfx-fusion-skip';
    skipHint.textContent = 'แตะเพื่อข้าม';
    overlay.appendChild(skipHint);

    document.body.appendChild(overlay);

    if (reducedMotion()) {
      revealWrap.classList.add('is-shown');
      caption.classList.add('is-shown');
      if (window.BOF_AUDIO && typeof window.BOF_AUDIO.playSsr === 'function') window.BOF_AUDIO.playSsr();
      after(1300, close);
      return;
    }

    if (window.BOF_AUDIO && typeof window.BOF_AUDIO.playFusion === 'function') {
      window.BOF_AUDIO.playFusion(hasMats);
    }

    let t = 0;
    if (matsWrap) {
      after(640, () => {
        const cx = window.innerWidth / 2;
        matNodes.forEach((node, idx) => {
          const r = node.getBoundingClientRect();
          const dx = cx - (r.left + r.width / 2);
          node.style.setProperty('--merge-x', `${Math.round(dx)}px`);
          node.style.setProperty('--merge-rot', idx % 2 === 0 ? '160deg' : '-160deg');
        });
        matsWrap.classList.add('is-merging');
      });
      t = 1020;
    }

    // Stage 2: หลุมดำเกลียวพลังงานส้ม-น้ำเงินแบบยูกิโอ
    after(t, () => {
      if (matsWrap) matsWrap.style.display = 'none';
      vortex.classList.add('is-active');
      stopVortex = startPolymerizationVortex(vortexCanvas, 1280);
    });

    // Stage 3: ระเบิดแสง + การ์ดฟิวชั่นเด้งเปิดตัวใหญ่กลางจอ
    after(t + 1280, () => {
      vortex.classList.add('is-burst');
      after(280, () => { if (stopVortex) { stopVortex(); stopVortex = null; } });
      flash.classList.add('is-active');
      revealWrap.classList.add('is-shown');
      caption.classList.add('is-shown');
      shake(4);
    });

    // Stage 4: พุ่งตบลงช่องจริงบนกระดาน + วงแหวนสีม่วงกระแทก
    after(t + 2650, () => {
      caption.classList.remove('is-shown');
      overlay.classList.add('is-landing');
      const slotEl = findTargetSlot();
      const targetRect = slotEl ? slotEl.getBoundingClientRect() : null;
      const curRect = revealWrap.getBoundingClientRect();
      const destX = targetRect ? (targetRect.left + targetRect.width / 2) : window.innerWidth / 2;
      const destY = targetRect ? (targetRect.top + targetRect.height / 2) : window.innerHeight / 2;
      const scale = targetRect && curRect.width > 0 ? Math.max(0.32, targetRect.width / curRect.width) : 0.48;
      const dx = destX - window.innerWidth / 2;
      const dy = destY - window.innerHeight / 2;

      revealWrap.animate([
        { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
        { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${scale})`, opacity: 1 }
      ], { duration: 260, easing: 'cubic-bezier(.55, .05, .68, .53)', fill: 'forwards' });

      after(250, () => {
        const ring = document.createElement('div');
        ring.className = 'sfx-fusion-ring';
        const ringSize = Math.max(110, (targetRect ? targetRect.width : 110) * 1.45);
        ring.style.cssText = `left:${destX}px;top:${destY}px;width:${ringSize}px;height:${ringSize}px;`;
        document.body.appendChild(ring);
        setTimeout(() => ring.remove(), 620);
        shake(6);
      });
    });

    after(t + 3180, close);
  };

  window.SummonFx = SummonFx;
})();
