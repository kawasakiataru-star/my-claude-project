(() => {
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  const progress = document.getElementById('progress');

  // Mobile menu
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menu.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  }));

  // Scroll progress + nav border
  const onScroll = () => {
    const h = document.documentElement;
    const ratio = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
    progress.style.width = (ratio * 100).toFixed(2) + '%';
    nav.classList.toggle('is-scrolled', h.scrollTop > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Radar chart: decision priority (rank 1 = 6pt … rank 6 = 1pt)
  const radar = document.getElementById('radar');
  if (radar) {
    const data = [
      ['健康', 6], ['自由な時間', 5], ['人間関係', 4], ['資産', 3], ['収入', 2], ['世間の評価', 1]
    ];
    const cx = 200, cy = 200, R = 140, max = 6, n = data.length;
    const ns = 'http://www.w3.org/2000/svg';
    const pt = (i, r) => {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / n;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    };
    const el = (tag, attrs, text) => {
      const e = document.createElementNS(ns, tag);
      Object.entries(attrs).forEach(([k, v]) => e.setAttribute(k, v));
      if (text != null) e.textContent = text;
      radar.appendChild(e);
      return e;
    };
    for (let lv = 1; lv <= max; lv++) {
      el('polygon', { class: 'radar-grid', points: data.map((_, i) => pt(i, (R * lv) / max).join(',')).join(' ') });
    }
    data.forEach((_, i) => {
      const [x, y] = pt(i, R);
      el('line', { class: 'radar-axis', x1: cx, y1: cy, x2: x, y2: y });
    });
    el('polygon', { class: 'radar-area', points: data.map(([, v], i) => pt(i, (R * v) / max).join(',')).join(' ') });
    data.forEach(([label, v], i) => {
      const [x, y] = pt(i, (R * v) / max);
      el('circle', { class: 'radar-dot', cx: x, cy: y, r: 3.5 });
      const [lx, ly] = pt(i, R + 30);
      el('text', { class: 'radar-label', x: lx, y: ly, 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, label);
      el('text', { class: 'radar-val', x: lx, y: ly + 16, 'text-anchor': 'middle', 'dominant-baseline': 'middle' }, v + 'pt');
    });
  }

  // Reveal on scroll
  const targets = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    targets.forEach(t => t.classList.add('is-in'));
    return;
  }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  targets.forEach(t => io.observe(t));
})();
