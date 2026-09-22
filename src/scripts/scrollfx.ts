// Animazioni legate allo scroll della home, ispirate a olhalazarieva.com.
// Un solo loop requestAnimationFrame, attivo solo quando si scorre.
//
//  - .split-title   lettere che risalgono e si ricompongono (scrub)
//  - .identity      tabella: riempimento grigio→nero, poi si rompe e crolla
//                   senza che i pezzi si tocchino mai
//  - [data-fill]    frase che si accende parola per parola
//  - .tile[data-speed]  parallasse del mosaico foto
//  - [data-chapter] indice di capitolo fisso "01 / 05 — Chi sono"
//  - video[data-autoplay]  partono solo quando sono visibili
//
// Con prefers-reduced-motion non parte nulla: la pagina resta statica e
// leggibile (le classi .fx-on non vengono messe).

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** PRNG deterministico: il crollo è uguale a ogni visita e a ogni resize. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

/** Spezza il testo di un elemento in parole (.w) e lettere (.ch). */
function splitLetters(el: HTMLElement) {
  const words = (el.textContent ?? '').trim().split(/\s+/);
  el.textContent = '';
  words.forEach((word, wi) => {
    const w = document.createElement('span');
    w.className = 'w';
    for (const c of word) {
      const ch = document.createElement('span');
      ch.className = 'ch';
      ch.textContent = c;
      w.appendChild(ch);
    }
    el.appendChild(w);
    if (wi < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
}

/** Spezza in parole (.fw) per il riempimento di una frase. */
function splitWords(el: HTMLElement) {
  const words = (el.textContent ?? '').trim().split(/\s+/);
  el.textContent = '';
  words.forEach((word, i) => {
    const w = document.createElement('span');
    w.className = 'fw';
    w.textContent = word;
    el.appendChild(w);
    if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
  });
}

type Updater = () => void;

// Con le view transitions di Astro la home può essere montata più volte:
// ogni avvio annulla i listener del precedente tramite questo segnale.
let controller: AbortController | null = null;
const signal = () => controller!.signal;

// ---------------------------------------------------------------- titoli

function titles(): Updater[] {
  return Array.from(document.querySelectorAll<HTMLElement>('.split-title')).map((el) => {
    const chars = Array.from(el.querySelectorAll<HTMLElement>('.st-ch'));
    const n = chars.length;
    return () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      if (r.bottom < -vh || r.top > vh * 2) return;
      // 0 quando il titolo affiora dal fondo, 1 a metà schermo
      const p = clamp((vh - r.top) / (vh * 0.55), 0, 1);
      chars.forEach((c, i) => {
        const local = clamp(p * 1.5 - (i / Math.max(1, n - 1)) * 0.5);
        const e = easeOut(local);
        const rot = (1 - e) * (i % 2 ? 14 : -10);
        c.style.transform = `translate3d(0, ${(1 - e) * 110}%, 0) rotate(${rot}deg)`;
      });
    };
  });
}

// ---------------------------------------------------------------- tabella

function identity(): Updater[] {
  const sec = document.querySelector<HTMLElement>('.identity');
  if (!sec) return [];
  const stage = sec.querySelector<HTMLElement>('.stage')!;
  const portrait = sec.querySelector<HTMLElement>('.portrait');
  sec.querySelectorAll<HTMLElement>('.fx').forEach(splitLetters);

  const letters = Array.from(sec.querySelectorAll<HTMLElement>('.ch'));
  const pieces = Array.from(sec.querySelectorAll<HTMLElement>('.ch, .seg'));
  const lit = new Array(letters.length).fill(false);

  // Fasi, in frazioni dello scroll della sezione:
  //  0 → FILL_END      il testo si riempie dal grigio al nero
  //  → BREAK           pausa: la tabella si legge intera
  //  BREAK → +SPREAD   si rompe: i pezzi si separano in orizzontale
  //  → 1               cadono per gravità e si posano senza toccarsi
  const FILL_END = 0.18;
  const BREAK = 0.26;
  const SPREAD = 0.14; // quota della fase di crollo dedicata alla separazione
  const GAP = 6; // distanza minima fra pezzi posati, in px
  const MAX_ROT = 18; // gradi
  // cadendo i pezzi si rimpiccioliscono, vanno "in profondità". Su schermi
  // stretti di più: le righe hanno poco spazio per allargarsi e il mucchio
  // verrebbe alto quanto la tabella
  let SHRINK = 0.8;

  type Geo = { dx: number; dy: number; rot: number; start: number; dim: boolean };
  let geo: Geo[] = [];
  let g = 1;

  /** Ingombro di un rettangolo scalato e ruotato. */
  const box = (w: number, h: number, deg: number, k = 1) => {
    const a = (Math.abs(deg) * Math.PI) / 180;
    return { w: k * (w * Math.cos(a) + h * Math.sin(a)), h: k * (h * Math.cos(a) + w * Math.sin(a)) };
  };
  /** Scala e rotazione a un certo punto u (0→1) della caduta. */
  const scaleAt = (u: number) => 1 - (1 - SHRINK) * easeInOut(u);

  function measure() {
    pieces.forEach((p) => (p.style.transform = ''));
    if (portrait) portrait.style.transform = '';
    const s = stage.getBoundingClientRect();
    const W = s.width;
    SHRINK = W < 700 ? 0.6 : 0.8;
    const floor = s.height - 84; // resta libera la fascia dell'indice "01 / 04"
    const rand = rng(2003);

    const raw = pieces.map((p) => {
      const r = p.getBoundingClientRect();
      return { x: r.left - s.left, y: r.top - s.top, w: r.width, h: r.height, seg: p.classList.contains('seg') };
    });
    const minX = Math.min(...raw.map((r) => r.x));
    const maxX = Math.max(...raw.map((r) => r.x + r.w));
    const minY = Math.min(...raw.map((r) => r.y));
    const maxY = Math.max(...raw.map((r) => r.y + r.h));

    // 1. separazione, riga per riga. I pezzi si raggruppano in fasce
    //    orizzontali che non si sovrappongono in altezza (una riga di testo,
    //    un filetto). Ogni fascia si allarga per conto suo su tutta la
    //    larghezza, con una dilatazione uniforme: dentro la fascia l'ordine
    //    resta e gli spazi crescono, e fasce diverse stanno ad altezze
    //    diverse, quindi niente si incrocia. Righe diverse finiscono su
    //    colonne diverse: il mucchio si distribuisce invece di impilarsi.
    const ids = raw.map((_, i) => i).sort((a, b) => raw[a].y - raw[b].y);
    const bands: number[][] = [];
    let bottom = -Infinity;
    for (const i of ids) {
      const r = raw[i];
      if (r.y >= bottom - 0.25) {
        bands.push([i]); // inizia sotto la fascia precedente: fascia nuova
        bottom = r.y + r.h;
      } else {
        bands[bands.length - 1].push(i);
        bottom = Math.max(bottom, r.y + r.h);
      }
    }
    const tx = new Array(raw.length).fill(0);
    const M = 16;
    bands.forEach((band) => {
      const bx0 = Math.min(...band.map((i) => raw[i].x));
      const bx1 = Math.max(...band.map((i) => raw[i].x + raw[i].w));
      const span = Math.max(1, bx1 - bx0);
      const k = Math.max(1, Math.min(2.6, (W - 2 * M) / span));
      const free = W - 2 * M - span * k;
      const offset = M + free * rand();
      band.forEach((i) => (tx[i] = offset + (raw[i].x - bx0) * k));
    });

    // 2. rotazione concessa a ciascun pezzo: quanta ne permette lo spazio
    //    libero ai suoi lati sulla stessa riga (metà a testa col vicino)
    const room = raw.map((r, i) => {
      let free = Infinity;
      raw.forEach((o, j) => {
        if (j === i) return;
        const sameBand = o.y < r.y + r.h && o.y + o.h > r.y;
        if (!sameBand) return;
        const gap = tx[j] >= tx[i] ? tx[j] - (tx[i] + r.w) : tx[i] - (tx[j] + o.w);
        free = Math.min(free, gap);
      });
      return free;
    });
    const rot = raw.map((r, i) => {
      const budget = (room[i] - 2) / 2; // allargamento massimo per lato
      const limit = r.seg ? 3 : MAX_ROT;
      // si controlla tutta la caduta, non solo la posa: rotazione e
      // rimpicciolimento crescono insieme
      const fits = (d: number) =>
        [0.25, 0.5, 0.75, 1].every((u) => (box(r.w, r.h, d * easeInOut(u), scaleAt(u)).w - r.w) / 2 <= budget);
      let deg = 0;
      for (let d = 0.5; d <= limit; d += 0.5) {
        if (!fits(d)) break;
        deg = d;
      }
      return (rand() < 0.5 ? -1 : 1) * deg * (0.55 + rand() * 0.45);
    });

    // 3. partenza: cede prima il basso. Chi sta sopra parte dopo e con la
    //    stessa gravità non raggiunge mai chi sta sotto nella sua colonna.
    const start = raw.map((r) => 0.45 * ((maxY - (r.y + r.h)) / Math.max(1, maxY - minY)) + rand() * 0.012);

    // 4. mucchio: ogni pezzo si posa sul più alto già posato nelle sue
    //    colonne, a GAP di distanza. Si posano nell'ordine in cui arrivano.
    const sky = new Float32Array(Math.ceil(W) + 2).fill(floor);
    const order = raw.map((_, i) => i).sort((a, b) => start[a] - start[b]);
    const dy = new Array(raw.length).fill(0);
    let stuck = 0;
    for (const i of order) {
      const r = raw[i];
      const b = box(r.w, r.h, rot[i], SHRINK);
      const left = Math.max(0, Math.floor(tx[i] + r.w / 2 - b.w / 2 - GAP / 2));
      const right = Math.min(sky.length - 1, Math.ceil(tx[i] + r.w / 2 + b.w / 2 + GAP / 2));
      let top = floor;
      for (let c = left; c <= right; c++) top = Math.min(top, sky[c]);
      const restTop = top - GAP - b.h; // bordo alto dell'ingombro ruotato
      for (let c = left; c <= right; c++) sky[c] = restTop;
      const restY = restTop + b.h / 2 - r.h / 2; // posizione dell'elemento
      dy[i] = Math.max(0, restY - r.y);
      if (restY < r.y) stuck++;
    }
    // pezzi che il mucchio non riesce a ospitare più in basso di dove sono:
    // deve restare 0 (lo verifica il banco di prova)
    stage.dataset.stuck = String(stuck);

    // gravità unica, scelta perché l'ultimo pezzo tocchi terra a fine scroll
    g = Math.max(1, ...raw.map((_, i) => (2 * dy[i]) / Math.pow(1 - start[i], 2)));

    geo = raw.map((r, i) => ({
      dx: tx[i] - r.x,
      dy: dy[i],
      rot: rot[i],
      start: start[i],
      dim: !r.seg && i % 3 === 0,
    }));
  }

  measure();
  // Helvetica arriva dopo il primo layout: si rimisura a font caricati,
  // altrimenti le lettere crollerebbero da posizioni sbagliate
  document.fonts?.ready.then(() => {
    measure();
    update();
  });
  window.addEventListener(
    'resize',
    () => {
      measure();
      update();
    },
    { signal: signal() }
  );

  function update() {
    const r = sec!.getBoundingClientRect();
    const vh = window.innerHeight;
    if (r.bottom < 0 || r.top > vh) return;
    const p = clamp(-r.top / (r.height - vh));

    // riempimento dal grigio al nero, in ordine di lettura
    const lettersOn = Math.round(clamp(p / FILL_END) * letters.length);
    letters.forEach((l, i) => {
      const on = i < lettersOn;
      if (on !== lit[i]) {
        lit[i] = on;
        l.classList.toggle('on', on);
      }
    });

    const c = clamp((p - BREAK) / (1 - BREAK));
    const spread = easeInOut(clamp(c / SPREAD));
    const T = clamp((c - SPREAD) / (1 - SPREAD));

    // il ritratto si alza e lascia il posto alla rottura
    if (portrait) {
      const lift = easeInOut(clamp(c / SPREAD));
      portrait.style.transform = lift ? `translate3d(0, ${-lift * 30}%, 0)` : '';
      portrait.style.opacity = String(1 - lift);
    }

    pieces.forEach((el, i) => {
      const gi = geo[i];
      if (!gi) return;
      const t = T - gi.start;
      const fall = t > 0 ? Math.min(gi.dy, 0.5 * g * t * t) : 0;
      const u = gi.dy > 0 ? fall / gi.dy : t > 0 ? 1 : 0;
      if (!spread && !fall) {
        if (el.style.transform) el.style.transform = '';
        el.classList.remove('dim');
        return;
      }
      const rot = gi.rot * easeInOut(u);
      const sc = scaleAt(u);
      el.style.transform = `translate3d(${gi.dx * spread}px, ${fall}px, 0) rotate(${rot}deg)${sc < 1 ? ` scale(${sc})` : ''}`;
      el.classList.toggle('dim', gi.dim && u > 0.3);
    });
  }

  return [update];
}

// ---------------------------------------------------------------- frasi

function fills(): Updater[] {
  return Array.from(document.querySelectorAll<HTMLElement>('[data-fill]')).map((el) => {
    splitWords(el);
    const words = Array.from(el.querySelectorAll<HTMLElement>('.fw'));
    return () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // si accende mentre la frase sale dal 90% al 45% dello schermo
      const p = clamp((vh * 0.9 - r.top) / (vh * 0.45));
      const on = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < on));
    };
  });
}

// ---------------------------------------------------------------- mosaico

function parallax(): Updater[] {
  const tiles = Array.from(document.querySelectorAll<HTMLElement>('.tile[data-speed]'));
  if (!tiles.length) return [];
  return [
    () => {
      const vh = window.innerHeight;
      tiles.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        const centre = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${-centre * Number(el.dataset.speed)}px, 0)`;
      });
    },
  ];
}

// ---------------------------------------------------------------- capitoli

function chapters(): Updater[] {
  const secs = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'));
  const box = document.querySelector<HTMLElement>('.chapter-index');
  if (!secs.length || !box) return [];
  const num = box.querySelector<HTMLElement>('.ci-num')!;
  const name = box.querySelector<HTMLElement>('.ci-name')!;
  box.querySelector<HTMLElement>('.ci-tot')!.textContent = String(secs.length).padStart(2, '0');
  let current = -1;
  return [
    () => {
      const mid = window.innerHeight * 0.5;
      let idx = -1;
      secs.forEach((s, i) => {
        const r = s.getBoundingClientRect();
        if (r.top <= mid && r.bottom > mid) idx = i;
      });
      if (idx === current) return;
      current = idx;
      box.classList.toggle('show', idx >= 0);
      if (idx < 0) return;
      // il numero cambia con un piccolo scatto verticale
      box.classList.remove('swap');
      void box.offsetWidth;
      box.classList.add('swap');
      num.textContent = String(idx + 1).padStart(2, '0');
      name.textContent = secs[idx].dataset.chapter ?? '';
      box.classList.toggle('on-dark', secs[idx].classList.contains('thesis'));
    },
  ];
}

// ---------------------------------------------------------------- video

function videos() {
  const vids = document.querySelectorAll<HTMLVideoElement>('video[data-autoplay]');
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        const v = e.target as HTMLVideoElement;
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      });
    },
    { rootMargin: '100px' }
  );
  vids.forEach((v) => io.observe(v));
  signal().addEventListener('abort', () => io.disconnect());
}

// ---------------------------------------------------------------- avvio

export function initScrollFx() {
  controller?.abort();
  controller = new AbortController();
  const root = document.documentElement;
  // fuori dalla home non c'è nulla da animare
  if (!document.querySelector('[data-chapter], .split-title')) return;

  videos();
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // prima di misurare: con .fx-on la tabella diventa sticky e il testo grigio
  root.classList.add('fx-on');

  const updaters = [...titles(), ...identity(), ...fills(), ...parallax(), ...chapters()];
  let queued = false;
  const tick = () => {
    queued = false;
    updaters.forEach((u) => u());
  };
  const request = () => {
    if (!queued) {
      queued = true;
      requestAnimationFrame(tick);
    }
  };
  window.addEventListener('scroll', request, { passive: true, signal: signal() });
  window.addEventListener('resize', request, { signal: signal() });
  tick();
}
