// Animazioni legate allo scroll della home, ispirate a olhalazarieva.com.
// Un solo loop requestAnimationFrame, attivo solo quando si scorre.
//
//  - .split-title   lettere che risalgono e si ricompongono (scrub)
//  - .identity      tabella: riempimento grigio→nero, poi crollo verso il basso
//  - [data-fill]    frase che si accende parola per parola
//  - .tile[data-speed]  parallasse del mosaico foto
//  - [data-chapter] indice di capitolo fisso "01 / 05 — Chi sono"
//  - video[data-autoplay]  partono solo quando sono visibili
//
// Con prefers-reduced-motion non parte nulla: la pagina resta statica e
// leggibile (le classi .fx-on non vengono messe).

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

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
  sec.querySelectorAll<HTMLElement>('.fx').forEach(splitLetters);

  const letters = Array.from(sec.querySelectorAll<HTMLElement>('.ch'));
  const pieces = Array.from(sec.querySelectorAll<HTMLElement>('.ch, .seg'));
  const rows = sec.querySelectorAll('.id-row').length + 1;

  type Geo = { dx: number; dy: number; rot: number; delay: number; dim: boolean };
  let geo: Geo[] = [];
  const lit = new Array(letters.length).fill(false);

  function measure() {
    pieces.forEach((p) => (p.style.transform = ''));
    const s = stage.getBoundingClientRect();
    const rand = rng(2003);
    // il pavimento lascia libera la fascia in basso dell'indice "01 / 05"
    const floor = s.height - 84;
    const pile = s.height * 0.14;
    geo = pieces.map((p, i) => {
      const r = p.getBoundingClientRect();
      const x = r.left - s.left;
      const y = r.top - s.top;
      const seg = p.classList.contains('seg');
      const row = Number(p.closest<HTMLElement>('[data-row]')?.dataset.row ?? 0);
      // la tabella cede dal basso: le righe in fondo partono per prime
      const delay = (1 - row / rows) * 0.3 + rand() * 0.2;
      const tx = clamp(x + (rand() - 0.5) * s.width * 0.3, 0, s.width - r.width);
      const ty = floor - r.height - rand() * pile;
      return {
        dx: tx - x,
        dy: ty - y,
        rot: (rand() - 0.5) * (seg ? 50 : 230),
        delay,
        dim: !seg && i % 3 === 0,
      };
    });
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

    // fase 1: riempimento dal grigio al nero, in ordine di lettura
    const fill = clamp(p / 0.36);
    const lettersOn = Math.round(fill * letters.length);
    letters.forEach((l, i) => {
      const on = i < lettersOn;
      if (on !== lit[i]) {
        lit[i] = on;
        l.classList.toggle('on', on);
      }
    });

    // fase 2 (dopo una pausa): la tabella si rompe e crolla
    const c = clamp((p - 0.5) / 0.44);
    pieces.forEach((el, i) => {
      const g = geo[i];
      if (!g) return;
      const t = clamp((c - g.delay) / 0.5);
      if (t <= 0) {
        if (el.style.transform) el.style.transform = '';
        el.classList.remove('dim');
        return;
      }
      // gravità: accelera, poi un piccolo rimbalzo sul fondo
      const fall = t < 0.86 ? Math.pow(t / 0.86, 2) : 1 - 0.05 * Math.sin(((t - 0.86) / 0.14) * Math.PI);
      el.style.transform = `translate3d(${g.dx * easeOut(t)}px, ${g.dy * fall}px, 0) rotate(${g.rot * easeOut(t)}deg)`;
      el.classList.toggle('dim', g.dim && t > 0.35);
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
