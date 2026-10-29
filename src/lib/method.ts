// Copy e dati della pagina /{lang}/metodo/ — "Misuro".
// Stringhe qui e non in i18n/ui.ts: è copy lungo della pagina, non interfaccia.
// Fonti: tesi "Six Sigma e design dei servizi nella ristorazione collettiva"
// (Hum.us Space Bononia, 2025): user flow e regole in Improve (cap. 5),
// KPI e soglie in Measure e Control (cap. 3 e 6). Il resto (configuratore,
// formati diversi dalla tavola calda) sono ipotesi di progetto da validare.
import type { Lang } from '../i18n/ui';
import type { ZoneId } from './method-scene';
import type { FormatId, LocationId, RuleId, TargetId } from './method-scenario';

export interface Dish {
  n: string;
  d: string;
  p: number;
}

export interface MenuGroup {
  id: string;
  l: string;
  t: string;
  d: string;
  k: string;
  order: string[];
  hl: string[];
}

export interface MethodCopy {
  locale: string;
  seo: { title: string };
  hero: {
    brand: string;
    kicker: string;
    h1: string;
    h1Muted: string;
    lead: string;
    tagsLabel: string;
    tags: Record<FormatId, string>;
    cta: string;
    ctaSecondary: string;
  };
  journey: {
    kicker: string;
    h2: string;
    h2Muted: string;
    lead: string;
    legend: [string, string];
    plan: {
      entrance: string;
      guided: string;
      quick: string;
      pass: string;
      cashier: string;
      dining: string;
    };
    today: { t: string; d: string }[];
    redesign: { t: string; d: string }[];
    note: string;
  };
  scene: {
    kicker: string;
    h2: string;
    h2Muted: string;
    lead: string;
    hint: string;
    sign: string;
    board: string;
    zones: Record<ZoneId, { name: string; q: string; a: string }>;
  };
  priority: {
    kicker: string;
    h2: string;
    h2Muted: string;
    lead: string;
    items: { t: string; d: string }[];
    measure: string;
    gate: string;
    note: string;
  };
  menu: {
    kicker: string;
    h2: string;
    h2Muted: string;
    lead: string;
    cardTitle: string;
    changed: string;
    note: string;
    targets: { id: string; label: string; key: string; icon: 'couple' | 'group' | 'pin' | 'clock' }[];
    dishes: Record<string, Dish>;
    groups: MenuGroup[];
  };
  scenario: {
    kicker: string;
    h2: string;
    h2Muted: string;
    lead: string;
    labels: { format: string; price: string; location: string; target: string };
    formats: Record<FormatId, string>;
    prices: Record<'1' | '2' | '3', string>;
    locations: Record<LocationId, string>;
    targets: Record<TargetId, string>;
    outputs: { score: string; covers: string; turns: string; ticket: string; monthly: string };
    rules: Record<RuleId, string>;
    neutral: string;
    note: string;
  };
  method: {
    kicker: string;
    h2: string;
    h2Muted: string;
    lead: string;
    toolsLabel: string;
    phases: { k: string; t: string; what: string; gets: string; tools: string }[];
    note: string;
  };
  case: {
    kicker: string;
    h2: string;
    h2Muted: string;
    labels: { problem: string; did: string; status: string };
    problem: string;
    did: string;
    status: string;
    kpis: { label: string; base: string; target: string }[];
    method: string;
    cta: string;
  };
  about: {
    kicker: string;
    h2: string;
    h2Muted: string;
    lead: string;
    rows: { k: string; v: string }[];
    portfolio: string;
  };
  faq: {
    kicker: string;
    h2: string;
    items: { q: string; a: string }[];
  };
  contact: {
    kicker: string;
    h2: string;
    h2Muted: string;
    lead: string;
    cta: string;
    subject: string;
    linkedin: string;
    instagram: string;
  };
  footer: string;
}

// Posizioni dei punti sulla pianta (stesso ordine dei testi in journey.today / journey.redesign)
export const HOTSPOTS_TODAY = [
  { x: 80, y: 150 },
  { x: 330, y: 100 },
  { x: 575, y: 60 },
  { x: 650, y: 120 },
];
export const HOTSPOTS_REDESIGN = [
  { x: 330, y: 140 },
  { x: 330, y: 280 },
  { x: 575, y: 60 },
  { x: 600, y: 300 },
];

export const DISH_PRICE: Record<string, number> = {
  burrata: 12,
  fritto: 14,
  pasta: 13,
  pizza: 11,
  carne: 22,
  tiramisu: 7,
  menu: 14,
};

const ORDER: Record<string, string[]> = {
  pareja: ['burrata', 'pasta', 'carne', 'tiramisu', 'pizza', 'fritto', 'menu'],
  grupo: ['fritto', 'pizza', 'burrata', 'pasta', 'tiramisu', 'carne', 'menu'],
  turista: ['pasta', 'pizza', 'burrata', 'tiramisu', 'fritto', 'carne', 'menu'],
  mediodia: ['menu', 'pizza', 'pasta', 'burrata', 'tiramisu', 'fritto', 'carne'],
};

const TARGET_ICONS = ['couple', 'group', 'pin', 'clock'] as const;

export const methodCopy: Record<Lang, MethodCopy> = {
  es: {
    locale: 'es-ES',
    seo: { title: 'Misuro · Six Sigma for Hospitality' },
    hero: {
      brand: 'Misuro',
      kicker: 'Six Sigma for Hospitality',
      h1: 'Cada servicio decide cuánto facturas.',
      h1Muted: 'Casi nadie lo mide.',
      lead: 'Misuro cómo funciona tu servicio, lo rediseño según el tipo de local y te digo qué cambiar primero.',
      tagsLabel: '¿Qué tipo de local tienes?',
      tags: {
        osteria: 'Osteria',
        fine_dining: 'Fine dining',
        tavola_calda: 'Tavola calda',
        pizzeria_taglio: 'Pizzeria al taglio',
        pizzeria_servizio: 'Pizzeria servicio completo',
        mensa: 'Restauración colectiva',
      },
      cta: 'Ver cómo funciona',
      ctaSecondary: 'Hablamos 20 minutos',
    },
    journey: {
      kicker: '01 — Recorrido del cliente',
      h2: 'Así se ve tu servicio',
      h2Muted: 'hoy y rediseñado',
      lead: 'Cada punto es una persona. Cambia la vista para ver dónde se pierde el tiempo y cómo se separa el flujo.',
      legend: ['Hoy', 'Rediseñado'],
      plan: {
        entrance: 'ENTRADA',
        guided: 'LÍNEA GUIADA',
        quick: 'RETIRO RÁPIDO',
        pass: 'PASE',
        cashier: 'CAJA',
        dining: 'SALA',
      },
      today: [
        { t: 'Espera en la entrada', d: 'Nadie sabe si hay mesa ni cuánto tarda.' },
        { t: 'Cruce en la línea', d: 'Clientes y personal se cruzan en el mismo pasillo.' },
        { t: 'Plato parado en el pase', d: 'Listo, pero nadie lo ve a tiempo.' },
        { t: 'Cuenta tardía', d: 'La mesa no rota y la sala se llena de espera.' },
      ],
      redesign: [
        { t: 'Dos flujos separados', d: 'La línea guiada y el retiro rápido no se cruzan.' },
        { t: 'Base + Topping + Efecto WOW', d: 'Una elección clara, en tres gestos.' },
        { t: 'Control en cinco puntos', d: 'Peso, temperatura, alérgenos, emplatado y etiqueta antes de salir.' },
        { t: 'QR único y retiro en box', d: 'Menú, alérgenos y pedidos en un solo punto.' },
      ],
      note: 'Esquema ilustrativo, basado en el caso Hum.us Space Bononia.',
    },
    scene: {
      kicker: '02 — Lo que se subestima',
      h2: 'Siete zonas donde el local',
      h2Muted: 'trabaja a ojo',
      lead: 'Pasa el cursor o toca una zona del local para ver qué se mide allí.',
      hint: 'Toca una zona',
      sign: 'RESTAURANTE',
      board: 'MENÚ',
      zones: {
        management: {
          name: 'Gestión',
          q: '¿Quién mira los números cada semana?',
          a: 'Un despacho lateral: food cost, personal sobre ingresos y ticket medio. Las decisiones salen de datos, no de intuición.',
        },
        journey: {
          name: 'Recorrido',
          q: '¿Dónde espera, duda o se pierde el cliente?',
          a: 'La entrada: el cliente debe saber si hay mesa y cuánto tarda. Medimos la espera desde la puerta.',
        },
        work: {
          name: 'Trabajo y gastos',
          q: '¿Dónde se van horas y dinero cada día?',
          a: 'El bancone: porciones, merma y tiempo por turno. Se mide el lead time y la merma antes de tocar nada.',
        },
        roles: {
          name: 'Roles',
          q: '¿Quién hace qué en la hora punta?',
          a: 'Una persona, una tarea: acogida, banco y reposición. Roles claros reducen los errores y el ruido de voz.',
        },
        strengths: {
          name: 'Qué funciona y qué cuesta',
          q: '¿Qué funciona y qué cuesta más de lo que rinde?',
          a: 'La insegna es lo que se ve de lejos. Separamos lo que aporta valor de lo que consume presupuesto sin rendir.',
        },
        brand: {
          name: 'Marca y campañas',
          q: '¿Qué entiende quien pasa por delante?',
          a: 'La vetrina: el mensaje de fuera. Comprobamos que lo que se promete en la calle coincide con lo que se come dentro.',
        },
        menu: {
          name: 'Carta por cliente',
          q: '¿Qué carta ve cada cliente?',
          a: 'La sala: cada cliente busca algo distinto. Ordenamos los platos según lo que busca, no según el orden de cocina.',
        },
      },
    },
    priority: {
      kicker: '03 — Plan de prueba',
      h2: 'Cuatro semanas,',
      h2Muted: 'antes de cambiar todo',
      lead: 'Así se prueba el rediseño en pequeño, como en Hum.us: se introduce poco a poco y se decide con datos.',
      items: [
        { t: 'Semana 1', d: 'Base + Topping + WOW, porcionado 80/20 y retiro rápido con una dotación prudente de box a mediodía.' },
        { t: 'Semana 2', d: 'Mismo formato. Se miden espera, porción, temperatura, emplatado, valoración y avisos.' },
        { t: 'Semana 3', d: 'Solo si la cola se acorta: más box disponibles, de forma gradual.' },
        { t: 'Semana 4', d: 'Leve rotación de toppings y efectos WOW, sin cambiar el formato. Comparación con la situación de partida.' },
      ],
      measure: 'Qué se mide cada semana: tiempo de espera, porción y temperatura al final de la bandeja, orden y presentación, valoración y avisos.',
      gate: 'Regla: la semana 3 solo se activa si la cola se acorta. Al final se compara con la situación de partida.',
      note: 'Fuente: sección 5.9 de la tesi (prueba en pequeño de cuatro semanas).',
    },
    menu: {
      kicker: '04 — Un menú por cliente',
      h2: 'La misma cocina,',
      h2Muted: 'una carta para cada cliente',
      lead: 'Elige el tipo de cliente. Cambia el orden de la carta y lo que destaca.',
      cardTitle: 'Carta',
      changed: 'Lo que cambia',
      note: 'Carta de ejemplo.',
      targets: [
        { id: 'pareja', label: 'Pareja · cena', key: 'Quieren un momento. El segundo y el postre suben.', icon: TARGET_ICONS[0] },
        { id: 'grupo', label: 'Grupo de amigos', key: 'Quieren compartir. Lo compartible va arriba.', icon: TARGET_ICONS[1] },
        { id: 'turista', label: 'Turista de paso', key: 'Buscan algo reconocible. Los clásicos van primero.', icon: TARGET_ICONS[2] },
        { id: 'mediodia', label: 'Comida de trabajo', key: 'Tienen 45 minutos. El menú cerrado va primero.', icon: TARGET_ICONS[3] },
      ],
      dishes: {
        burrata: { n: 'Burrata y tomate', d: 'Entrante fresco', p: 12 },
        fritto: { n: 'Fritto misto', d: 'Para compartir', p: 14 },
        pasta: { n: 'Pasta fresca del día', d: 'Receta de temporada', p: 13 },
        pizza: { n: 'Pizza napoletana', d: 'Masa de 48 h', p: 11 },
        carne: { n: 'Segundo del chef', d: 'Producto de mercado', p: 22 },
        tiramisu: { n: 'Tiramisù', d: 'Postre de la casa', p: 7 },
        menu: { n: 'Menú del día', d: 'Primero + segundo + café', p: 14 },
      },
      groups: [
        { id: 'pareja', l: 'Pareja · cena', t: 'Cena de pareja', d: 'Ritmo pausado. El segundo y el postre suben.', k: 'Indicador: ticket por mesa', order: ORDER.pareja, hl: ['carne', 'tiramisu'] },
        { id: 'grupo', l: 'Grupo de amigos', t: 'Grupo de amigos', d: 'Quieren compartir. Lo compartible va arriba.', k: 'Indicador: tiempo hasta el primer pedido', order: ORDER.grupo, hl: ['fritto', 'pizza'] },
        { id: 'turista', l: 'Turista de paso', t: 'Turista de paso', d: 'Buscan algo reconocible. Los clásicos van primero.', k: 'Indicador: conversión de visita a mesa', order: ORDER.turista, hl: ['pasta', 'pizza'] },
        { id: 'mediodia', l: 'Comida de trabajo', t: 'Comida de trabajo', d: 'Tienen 45 minutos. El menú cerrado va primero.', k: 'Indicador: rotación de mesas', order: ORDER.mediodia, hl: ['menu'] },
      ],
    },
    scenario: {
      kicker: '05 — Configurador',
      h2: '¿Qué pasa si cambias',
      h2Muted: 'formato, precio o zona?',
      lead: 'Elige cómo es tu local. Verás si la oferta encaja con el público y el lugar, y qué cifras orientativas se derivan.',
      labels: { format: 'Formato', price: 'Precio', location: 'Ubicación', target: 'Público' },
      formats: {
        osteria: 'Osteria',
        fine_dining: 'Fine dining',
        tavola_calda: 'Tavola calda',
        pizzeria_taglio: 'Pizzeria al taglio',
        pizzeria_servizio: 'Pizzeria servicio completo',
        mensa: 'Restauración colectiva',
      },
      prices: { '1': '€ económico', '2': '€€ medio', '3': '€€€ alto' },
      locations: {
        centro: 'Centro histórico',
        campus: 'Campus universitario',
        uffici: 'Zona de oficinas',
        periferia: 'Periferia residencial',
        turistica: 'Zona turística',
      },
      targets: {
        studenti: 'Estudiantes',
        turisti: 'Turistas',
        lavoro: 'Comida de trabajo',
        famiglie: 'Familias',
      },
      outputs: {
        score: 'Coherencia de la oferta',
        covers: 'Cubiertos al día',
        turns: 'Rotaciones al día',
        ticket: 'Ticket medio',
        monthly: 'Facturación estimada al mes',
      },
      rules: {
        tc_premium: 'Tavola calda a precio alto: el cliente no ve el valor del precio.',
        fine_low: 'Fine dining a precio bajo: no paga el personal que necesita cada mesa.',
        taglio_premium: 'Pizza al taglio a precio alto: rompe la promesa de rapidez y precio.',
        campus_premium: 'Precio alto en campus: el presupuesto del público no llega.',
        periferia_premium: 'Precio alto en periferia: sin un motivo fuerte, nadie llega.',
        uffici_students: 'Estudiantes en zona de oficinas: no pasan por allí a mediodía.',
        periferia_tourists: 'Turistas en periferia: no llegan sin una razón fuerte.',
        fine_students: 'Fine dining para estudiantes: el presupuesto no acompaña al formato.',
        tc_tourists: 'Tavola calda para turistas: hace falta una señal clara desde la calle.',
        price1_turistica: 'Precio bajo en zona turística: el cliente desconfía de la calidad.',
        campus_students: 'Estudiantes en campus: el público ya está allí.',
        uffici_lunch: 'Comida de trabajo en zona de oficinas: demanda concentrada y rotación alta.',
        centro_tourists: 'Turistas en centro histórico: el formato se lee desde la calle.',
        taglio_lunch: 'Pizza al taglio para comida de trabajo: servicio en pocos minutos.',
      },
      neutral: 'Combinación neutra: faltan datos para decidir.',
      note: 'Cifras orientativas para comparar combinaciones, no promesas de resultados. Con datos reales se calibran.',
    },
    method: {
      kicker: '06 — Método DMADV',
      toolsLabel: 'Herramientas',
      h2: 'Cinco fases para',
      h2Muted: 'diseñar un servicio',
      lead: 'Cada fase tiene un entregable. Al final, el cliente no recibe solo ideas, sino un sistema para gestionar el local.',
      phases: [
        { k: 'D', t: 'Definir', what: 'Foto de la situación actual: qué se vende, a quién, en qué local y con qué medios.', gets: 'Punto de partida, con las debilidades visibles.', tools: 'Project charter, SIPOC, mapa de ecosistema, personas.' },
        { k: 'M', t: 'Medir', what: 'Se mide el servicio tal cual es: tiempos, costes, merma y opiniones. Sin suponer nada.', gets: 'Línea base de los KPI con datos reales.', tools: 'VOC, modelo de Kano, árbol de CTQ, benchmarking, mapa del recorrido.' },
        { k: 'A', t: 'Analizar', what: 'Briefing con la empresa: objetivos, presupuesto y lo que el cliente quiere ser hoy.', gets: 'Un briefing claro: qué cambiar, con qué dinero y en qué plazo.', tools: 'QFD, matriz de Pugh, TRIZ, análisis de puntos de contacto.' },
        { k: 'D', t: 'Diseñar', what: 'Se diseñan recorrido, carta, roles y formato, y se prueban a pequeña escala.', gets: 'Propuestas prototipadas, no solo ideas.', tools: 'Service blueprint, FMEA de servicio, simulación, prototipos y role-play.' },
        { k: 'V', t: 'Verificar', what: 'Se comprueba que funciona y se deja el sistema de gestión en marcha.', gets: 'Un cuadro de mando para el día a día y un método para seguir mejorando.', tools: 'Piloto, capability de proceso, cartas de control, test con clientes reales, SERVQUAL.' },
      ],
      note: 'Definir, medir, analizar, diseñar y verificar: el ciclo DMADV del protocolo de la propuesta.',
    },
    case: {
      kicker: '07 — Ya aplicado',
      h2: 'El caso',
      h2Muted: 'Hum.us Space Bononia',
      labels: { problem: 'Problema', did: 'Qué hicimos', status: 'Estado' },
      problem: 'Cola de hasta 8 minutos en el banco, cocina bajo presión y cena peor valorada que el almuerzo.',
      did: 'Flujos separados (línea guiada y retiro rápido), menú modular, control de calidad en cinco puntos y un QR único.',
      status: 'Los resultados son esperados: la medición tras la implantación es el siguiente paso.',
      kpis: [
        { label: 'Lead time en el banco', base: '8 min', target: '≤ 5 min' },
        { label: 'CSAT', base: '2,9', target: '≥ 4,2' },
        { label: 'Food cost', base: '70 %', target: '≤ 66 %' },
        { label: 'Digitalización', base: '2,5', target: '≥ 4,2' },
      ],
      method: 'Método del caso: DMAIC, para mejorar un servicio existente.',
      cta: 'Ver el caso completo →',
    },
    about: {
      kicker: '08 — Quién soy',
      h2: 'De la barra',
      h2Muted: 'al diagrama',
      lead: 'Antes de ser diseñador fui camarero y barista. Conozco la sala desde dentro.',
      rows: [
        { k: 'Nombre', v: 'Adriano Parmentola' },
        { k: 'Vive en', v: 'Bolonia' },
        { k: 'Estudios', v: 'Máster en Advanced Design (Service Design), Universidad de Bolonia' },
        { k: 'Antes', v: 'Barista y camarero' },
        { k: 'Idiomas', v: 'Italiano (nativo), inglés C1, francés A2, español A2' },
      ],
      portfolio: 'Ver proyectos →',
    },
    faq: {
      kicker: '09 — Preguntas',
      h2: 'Antes de que lo preguntes',
      items: [
        { q: '¿Es un trabajo o unas prácticas?', a: 'Ni una cosa ni la otra. Soy investigador externo para mi tesis: sin puesto, sin tutor y en unos 3 meses.' },
        { q: '¿Qué tengo que aportar?', a: 'Acceso para observar, un contacto para los datos y la firma de un responsable en los documentos.' },
        { q: '¿Cuánto cuesta?', a: 'Nada. Es investigación de tesis, con el respaldo de la Universidad de Bolonia.' },
        { q: '¿Qué pasa con mis datos?', a: 'Son confidenciales. Tú decides qué cifras se pueden usar.' },
        { q: '¿Y si no sale nada útil?', a: 'Cada propuesta se basa en un dato medido. Si el dato no la respalda, no la propongo.' },
      ],
    },
    contact: {
      kicker: '10 — Hablamos',
      h2: 'Veinte minutos para ver',
      h2Muted: 'si encaja',
      lead: 'Videollamada sin compromiso. Me cuentas cómo funciona tu servicio y te digo qué mediría primero.',
      cta: 'Escríbeme un email',
      subject: 'Misuro: hablamos',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
    },
    footer: 'Datos y mockups ilustrativos. No son una promesa de resultados.',
  },

  it: {
    locale: 'it-IT',
    seo: { title: 'Misuro · Six Sigma for Hospitality' },
    hero: {
      brand: 'Misuro',
      kicker: 'Six Sigma for Hospitality',
      h1: 'Ogni servizio decide quanto fatturi.',
      h1Muted: 'Quasi nessuno lo misura.',
      lead: 'Misuro come funziona il tuo servizio, lo riprogetto in base al tipo di locale e ti dico cosa cambiare per primo.',
      tagsLabel: 'Che tipo di locale hai?',
      tags: {
        osteria: 'Osteria',
        fine_dining: 'Fine dining',
        tavola_calda: 'Tavola calda',
        pizzeria_taglio: 'Pizzeria al taglio',
        pizzeria_servizio: 'Pizzeria servizio completo',
        mensa: 'Ristorazione collettiva',
      },
      cta: 'Scopri come funziona',
      ctaSecondary: 'Parliamone 20 minuti',
    },
    journey: {
      kicker: '01 — Percorso del cliente',
      h2: 'Così appare il tuo servizio',
      h2Muted: 'oggi e riprogettato',
      lead: 'Ogni punto è una persona. Cambia vista per vedere dove si perde tempo e come si separa il flusso.',
      legend: ['Oggi', 'Riprogettato'],
      plan: {
        entrance: 'INGRESSO',
        guided: 'LINEA GUIDATA',
        quick: 'RITIRO RAPIDO',
        pass: 'PASS',
        cashier: 'CASSA',
        dining: 'SALA',
      },
      today: [
        { t: "Attesa all'ingresso", d: 'Nessuno sa se c\'è posto né quanto aspettare.' },
        { t: 'Incrocio in linea', d: 'Clienti e personale si incrociano nello stesso passaggio.' },
        { t: 'Piatto fermo al pass', d: 'Pronto, ma nessuno lo vede in tempo.' },
        { t: 'Conto in ritardo', d: 'Il tavolo non gira e la sala si riempie di attesa.' },
      ],
      redesign: [
        { t: 'Due flussi separati', d: 'La linea guidata e il ritiro rapido non si incrociano.' },
        { t: 'Base + Topping + Effetto WOW', d: 'Una scelta chiara, in tre gesti.' },
        { t: 'Controllo in cinque punti', d: 'Peso, temperatura, allergeni, impiattamento ed etichetta prima di uscire.' },
        { t: 'QR unico e ritiro in box', d: 'Menù, allergeni e ordini in un solo punto.' },
      ],
      note: 'Schema illustrativo, basato sul caso Hum.us Space Bononia.',
    },
    scene: {
      kicker: '02 — Ciò che si sottovaluta',
      h2: 'Sette zone dove il locale',
      h2Muted: 'lavora a occhio',
      lead: 'Passa il cursore o tocca una zona del locale per vedere cosa si misura lì.',
      hint: 'Tocca una zona',
      sign: 'RISTORANTE',
      board: 'MENÙ',
      zones: {
        management: {
          name: 'Gestione',
          q: 'Chi guarda i numeri ogni settimana?',
          a: 'Un ufficio laterale: food cost, personale su ricavi e scontrino medio. Le decisioni partono dai dati, non dall\'intuito.',
        },
        journey: {
          name: 'Percorso',
          q: 'Dove aspetta, dubita o si perde il cliente?',
          a: 'L\'ingresso: il cliente deve sapere se c\'è posto e quanto aspetta. Misuriamo l\'attesa dalla porta.',
        },
        work: {
          name: 'Lavoro e spese',
          q: 'Dove se ne vanno ore e denaro ogni giorno?',
          a: 'Il bancone: porzioni, sprechi e tempo per turno. Si misurano lead time e sprechi prima di toccare qualsiasi cosa.',
        },
        roles: {
          name: 'Ruoli',
          q: 'Chi fa cosa nell\'ora di punta?',
          a: 'Una persona, un compito: accoglienza, banco e rifornimento. Ruoli chiari riducono errori e comunicazione a voce.',
        },
        strengths: {
          name: 'Cosa funziona e cosa costa',
          q: 'Cosa funziona e cosa costa più di quanto rende?',
          a: 'L\'insegna è ciò che si vede da lontano. Separiamo ciò che porta valore da ciò che consuma budget senza rendere.',
        },
        brand: {
          name: 'Marca e campagne',
          q: 'Cosa capisce chi passa davanti?',
          a: 'La vetrina: il messaggio da fuori. Verifichiamo che ciò che si promette in strada coincida con ciò che si mangia dentro.',
        },
        menu: {
          name: 'Menù per cliente',
          q: 'Quale menù vede ogni cliente?',
          a: 'La sala: ogni cliente cerca cose diverse. Ordiniamo i piatti in base a ciò che cerca, non all\'ordine della cucina.',
        },
      },
    },
    priority: {
      kicker: '03 — Piano di prova',
      h2: 'Quattro settimane,',
      h2Muted: 'prima di cambiare tutto',
      lead: 'Così si prova il ridisegno in piccolo, come a Hum.us: si introduce a poco a poco e si decide con i dati.',
      items: [
        { t: 'Settimana 1', d: 'Base + Topping + WOW, porzionatura 80/20 e ritiro rapido con una dotazione prudente di box a pranzo.' },
        { t: 'Settimana 2', d: 'Stesso formato. Si misurano attesa, porzione, temperatura, impiattamento, valutazione e segnalazioni.' },
        { t: 'Settimana 3', d: 'Solo se la coda si accorcia: più box disponibili, in modo graduale.' },
        { t: 'Settimana 4', d: 'Leggera rotazione di topping ed effetti WOW, senza cambiare il formato. Confronto con la situazione di partenza.' },
      ],
      measure: 'Cosa si misura ogni settimana: tempo di attesa, porzione e temperatura a fine vassoio, ordine e presentazione, gradimento e segnalazioni.',
      gate: 'Regola: la settimana 3 si attiva solo se la coda si accorcia. A fine percorso si confronta con la situazione di partenza.',
      note: 'Fonte: sezione 5.9 della tesi (prova in piccolo di quattro settimane).',
    },
    menu: {
      kicker: '04 — Un menù per cliente',
      h2: 'La stessa cucina,',
      h2Muted: 'un menù per ogni cliente',
      lead: 'Scegli il tipo di cliente. Cambia l\'ordine del menù e ciò che risalta.',
      cardTitle: 'Menù',
      changed: 'Cosa cambia',
      note: 'Menù di esempio.',
      targets: [
        { id: 'pareja', label: 'Coppia · cena', key: 'Cercano un momento. Il secondo e il dolce salgono.', icon: TARGET_ICONS[0] },
        { id: 'grupo', label: 'Gruppo di amici', key: 'Vogliono condividere. Ciò che si condivide va in alto.', icon: TARGET_ICONS[1] },
        { id: 'turista', label: 'Turista di passaggio', key: 'Cercano qualcosa di riconoscibile. I classici vanno primi.', icon: TARGET_ICONS[2] },
        { id: 'mediodia', label: 'Pranzo di lavoro', key: 'Hanno 45 minuti. Il menù fisso va per primo.', icon: TARGET_ICONS[3] },
      ],
      dishes: {
        burrata: { n: 'Burrata e pomodoro', d: 'Antipasto fresco', p: 12 },
        fritto: { n: 'Fritto misto', d: 'Da condividere', p: 14 },
        pasta: { n: 'Pasta fresca del giorno', d: 'Ricetta di stagione', p: 13 },
        pizza: { n: 'Pizza napoletana', d: 'Impasto di 48 ore', p: 11 },
        carne: { n: 'Secondo dello chef', d: 'Prodotto di mercato', p: 22 },
        tiramisu: { n: 'Tiramisù', d: 'Dolce della casa', p: 7 },
        menu: { n: 'Menù del giorno', d: 'Primo + secondo + caffè', p: 14 },
      },
      groups: [
        { id: 'pareja', l: 'Coppia · cena', t: 'Cena di coppia', d: 'Ritmo lento. Il secondo e il dolce salgono.', k: 'Indicatore: scontrino per tavolo', order: ORDER.pareja, hl: ['carne', 'tiramisu'] },
        { id: 'grupo', l: 'Gruppo di amici', t: 'Gruppo di amici', d: 'Vogliono condividere. Ciò che si condivide va in alto.', k: 'Indicatore: tempo al primo ordine', order: ORDER.grupo, hl: ['fritto', 'pizza'] },
        { id: 'turista', l: 'Turista di passaggio', t: 'Turista di passaggio', d: 'Cercano qualcosa di riconoscibile. I classici vanno primi.', k: 'Indicatore: conversione da visita a tavolo', order: ORDER.turista, hl: ['pasta', 'pizza'] },
        { id: 'mediodia', l: 'Pranzo di lavoro', t: 'Pranzo di lavoro', d: 'Hanno 45 minuti. Il menù fisso va per primo.', k: 'Indicatore: rotazione dei tavoli', order: ORDER.mediodia, hl: ['menu'] },
      ],
    },
    scenario: {
      kicker: '05 — Configuratore',
      h2: 'Cosa succede se cambi',
      h2Muted: 'formato, prezzo o zona?',
      lead: 'Scegli com\'è il tuo locale. Vedi se l\'offerta regge con il pubblico e il luogo, e le cifre orientative che ne derivano.',
      labels: { format: 'Formato', price: 'Prezzo', location: 'Posizione', target: 'Pubblico' },
      formats: {
        osteria: 'Osteria',
        fine_dining: 'Fine dining',
        tavola_calda: 'Tavola calda',
        pizzeria_taglio: 'Pizzeria al taglio',
        pizzeria_servizio: 'Pizzeria servizio completo',
        mensa: 'Ristorazione collettiva',
      },
      prices: { '1': '€ economico', '2': '€€ medio', '3': '€€€ alto' },
      locations: {
        centro: 'Centro storico',
        campus: 'Campus universitario',
        uffici: 'Zona uffici',
        periferia: 'Periferia residenziale',
        turistica: 'Zona turistica',
      },
      targets: {
        studenti: 'Studenti',
        turisti: 'Turisti',
        lavoro: 'Pranzo di lavoro',
        famiglie: 'Famiglie',
      },
      outputs: {
        score: 'Coerenza dell\'offerta',
        covers: 'Coperti al giorno',
        turns: 'Rotazioni al giorno',
        ticket: 'Scontrino medio',
        monthly: 'Fatturato stimato al mese',
      },
      rules: {
        tc_premium: 'Tavola calda a prezzo alto: il cliente non vede il valore del prezzo.',
        fine_low: 'Fine dining a prezzo basso: non copre il personale che serve ogni tavolo.',
        taglio_premium: 'Pizza al taglio a prezzo alto: rompe la promessa di rapidità e prezzo.',
        campus_premium: 'Prezzo alto in campus: il budget del pubblico non regge.',
        periferia_premium: 'Prezzo alto in periferia: senza un motivo forte, nessuno arriva.',
        uffici_students: 'Studenti in zona uffici: a mezzogiorno non passano da lì.',
        periferia_tourists: 'Turisti in periferia: non arrivano senza una ragione forte.',
        fine_students: 'Fine dining per studenti: il budget non accompagna il formato.',
        tc_tourists: 'Tavola calda per turisti: serve un segnale chiaro dalla strada.',
        price1_turistica: 'Prezzo basso in zona turistica: il cliente diffida della qualità.',
        campus_students: 'Studenti in campus: il pubblico è già lì.',
        uffici_lunch: 'Pranzo di lavoro in zona uffici: domanda concentrata e rotazione alta.',
        centro_tourists: 'Turisti in centro storico: il formato si legge dalla strada.',
        taglio_lunch: 'Pizza al taglio per il pranzo di lavoro: servizio in pochi minuti.',
      },
      neutral: 'Combinazione neutra: servono dati per decidere.',
      note: 'Cifre orientative per confrontare combinazioni, non promesse di risultati. Con dati reali si calibrano.',
    },
    method: {
      kicker: '06 — Metodo DMADV',
      toolsLabel: 'Strumenti',
      h2: 'Cinque fasi per',
      h2Muted: 'progettare un servizio',
      lead: 'Ogni fase ha un risultato. Alla fine il cliente non riceve solo idee, ma un sistema per gestire il locale.',
      phases: [
        { k: 'D', t: 'Definire', what: 'Foto della situazione attuale: cosa si vende, a chi, in quale locale e con quali mezzi.', gets: 'Un punto di partenza, con le debolezze visibili.', tools: 'Project charter, SIPOC, mappa dell\'ecosistema, personas.' },
        { k: 'M', t: 'Misurare', what: 'Si misura il servizio com\'è: tempi, costi, sprechi e opinioni. Senza supporre nulla.', gets: 'La linea base dei KPI con dati reali.', tools: 'VOC, modello di Kano, albero dei CTQ, benchmarking, mappa del percorso.' },
        { k: 'A', t: 'Analizzare', what: 'Briefing con l\'azienda: obiettivi, budget e ciò che il cliente vuole essere oggi.', gets: 'Un briefing chiaro: cosa cambiare, con quali soldi e in quali tempi.', tools: 'QFD, matrice di Pugh, TRIZ, analisi dei punti di contatto.' },
        { k: 'D', t: 'Progettare', what: 'Si progettano percorso, menù, ruoli e formato, e si provano in piccolo.', gets: 'Proposte prototipate, non solo idee.', tools: 'Service blueprint, FMEA di servizio, simulazione, prototipi e role-play.' },
        { k: 'V', t: 'Verificare', what: 'Si controlla che funzioni e si lascia in marcia il sistema di gestione.', gets: 'Un cruscotto per il lavoro quotidiano e un metodo per continuare a migliorare.', tools: 'Pilota, capability di processo, carte di controllo, test con clienti reali, SERVQUAL.' },
      ],
      note: 'Definire, misurare, analizzare, progettare e verificare: il ciclo DMADV del protocollo della proposta.',
    },
    case: {
      kicker: '07 — Già applicato',
      h2: 'Il caso',
      h2Muted: 'Hum.us Space Bononia',
      labels: { problem: 'Problema', did: 'Cosa abbiamo fatto', status: 'Stato' },
      problem: 'Coda fino a 8 minuti al banco, cucina sotto pressione e cena valutata peggio del pranzo.',
      did: 'Flussi separati (linea guidata e ritiro rapido), menù modulare, controllo qualità in cinque punti e un QR unico.',
      status: 'I risultati sono attesi: la misurazione dopo l\'implementazione è il passo successivo.',
      kpis: [
        { label: 'Lead time al banco', base: '8 min', target: '≤ 5 min' },
        { label: 'CSAT', base: '2,9', target: '≥ 4,2' },
        { label: 'Food cost', base: '70 %', target: '≤ 66 %' },
        { label: 'Digitalizzazione', base: '2,5', target: '≥ 4,2' },
      ],
      method: 'Metodo del caso: DMAIC, per migliorare un servizio esistente.',
      cta: 'Vedi il caso completo →',
    },
    about: {
      kicker: '08 — Chi sono',
      h2: 'Dalla barra',
      h2Muted: 'al diagramma',
      lead: 'Prima di diventare designer ero cameriere e barista. Conosco la sala dall\'interno.',
      rows: [
        { k: 'Nome', v: 'Adriano Parmentola' },
        { k: 'Vive a', v: 'Bologna' },
        { k: 'Studi', v: 'Laurea magistrale in Advanced Design (Service Design), Università di Bologna' },
        { k: 'Prima', v: 'Barista e cameriere' },
        { k: 'Lingue', v: 'Italiano (madrelingua), inglese C1, francese A2, spagnolo A2' },
      ],
      portfolio: 'Vedi i progetti →',
    },
    faq: {
      kicker: '09 — Domande',
      h2: 'Prima che tu lo chieda',
      items: [
        { q: 'È un lavoro o un tirocinio?', a: 'Né l\'uno né l\'altro. Sono ricercatore esterno per la mia tesi: nessun posto, nessun tutor, circa 3 mesi.' },
        { q: 'Cosa devo mettere io?', a: 'Accesso per osservare, un contatto per i dati e la firma di un responsabile sui documenti.' },
        { q: 'Quanto costa?', a: 'Nulla. È ricerca di tesi, sostenuta dall\'Università di Bologna.' },
        { q: 'Che fine fanno i miei dati?', a: 'Sono riservati. Decidi tu quali cifre si possono usare.' },
        { q: 'E se non ne esce nulla di utile?', a: 'Ogni proposta si basa su un dato misurato. Se il dato non la sostiene, non la propongo.' },
      ],
    },
    contact: {
      kicker: '10 — Parliamone',
      h2: 'Venti minuti per capire',
      h2Muted: 'se ha senso',
      lead: 'Videochiamata senza impegno. Mi racconti come funziona il tuo servizio e ti dico cosa misurerei per primo.',
      cta: 'Scrivimi un\'email',
      subject: 'Misuro: parliamone',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
    },
    footer: 'Dati e mockup illustrativi. Non sono una promessa di risultati.',
  },

  en: {
    locale: 'en-GB',
    seo: { title: 'Misuro · Six Sigma for Hospitality' },
    hero: {
      brand: 'Misuro',
      kicker: 'Six Sigma for Hospitality',
      h1: 'Every service decides how much you earn.',
      h1Muted: 'Almost nobody measures it.',
      lead: 'Misuro measures how your service works, redesigns it for your type of venue and tells you what to change first.',
      tagsLabel: 'What kind of venue is it?',
      tags: {
        osteria: 'Osteria',
        fine_dining: 'Fine dining',
        tavola_calda: 'Tavola calda',
        pizzeria_taglio: 'Pizzeria by the slice',
        pizzeria_servizio: 'Full-service pizzeria',
        mensa: 'Contract catering',
      },
      cta: 'See how it works',
      ctaSecondary: 'Talk for 20 minutes',
    },
    journey: {
      kicker: '01 — Customer journey',
      h2: 'Your service, today',
      h2Muted: 'and redesigned',
      lead: 'Each dot is a person. Switch the view to see where time is lost and how the flow is split.',
      legend: ['Today', 'Redesigned'],
      plan: {
        entrance: 'ENTRANCE',
        guided: 'GUIDED LINE',
        quick: 'QUICK PICKUP',
        pass: 'PASS',
        cashier: 'TILL',
        dining: 'DINING',
      },
      today: [
        { t: 'Waiting at the entrance', d: 'Nobody knows if there is a table or how long it takes.' },
        { t: 'Crossing in the line', d: 'Guests and staff cross in the same aisle.' },
        { t: 'Plate waiting at the pass', d: 'Ready, but nobody sees it in time.' },
        { t: 'Late bill', d: 'The table does not turn and the room fills with waiting.' },
      ],
      redesign: [
        { t: 'Two separate flows', d: 'The guided line and the quick pickup never cross.' },
        { t: 'Base + Topping + WOW effect', d: 'One clear choice, in three moves.' },
        { t: 'Five-point check', d: 'Weight, temperature, allergens, plating and label before leaving.' },
        { t: 'One QR and boxed pickup', d: 'Menu, allergens and orders in a single place.' },
      ],
      note: 'Illustrative diagram, based on the Hum.us Space Bononia case.',
    },
    scene: {
      kicker: '02 — What gets underrated',
      h2: 'Seven areas where the venue',
      h2Muted: 'runs on gut feeling',
      lead: 'Hover over or tap an area of the venue to see what gets measured there.',
      hint: 'Tap an area',
      sign: 'RESTAURANT',
      board: 'MENU',
      zones: {
        management: {
          name: 'Management',
          q: 'Who checks the numbers every week?',
          a: 'A side office: food cost, staff over revenue and average ticket. Decisions come from data, not gut feeling.',
        },
        journey: {
          name: 'Journey',
          q: 'Where do guests wait, hesitate or get lost?',
          a: 'The entrance: guests should know if there is a table and how long it takes. We measure the wait from the door.',
        },
        work: {
          name: 'Work & daily costs',
          q: 'Where do hours and money go each day?',
          a: 'The counter: portions, waste and time per shift. Lead time and waste are measured before anything changes.',
        },
        roles: {
          name: 'Roles',
          q: 'Who does what at peak time?',
          a: 'One person, one task: welcome, counter and restocking. Clear roles cut errors and shouting across the room.',
        },
        strengths: {
          name: 'What works and what costs',
          q: 'What works, and what costs more than it earns?',
          a: 'The sign is what people see from afar. We separate what adds value from what eats budget without paying back.',
        },
        brand: {
          name: 'Brand & campaigns',
          q: 'What does someone walking past understand?',
          a: 'The window: the message from outside. We check that what the street promises matches what is served inside.',
        },
        menu: {
          name: 'Menu for each guest',
          q: 'Which menu does each guest see?',
          a: 'The dining room: each guest looks for something different. We order dishes by what they look for, not by kitchen logic.',
        },
      },
    },
    priority: {
      kicker: '03 — Trial plan',
      h2: 'Four weeks,',
      h2Muted: 'before changing everything',
      lead: 'This is how the redesign is tested on a small scale, as at Hum.us: introduced step by step and decided with data.',
      items: [
        { t: 'Week 1', d: 'Base + Topping + WOW, 80/20 portioning and quick pickup with a cautious supply of lunch boxes.' },
        { t: 'Week 2', d: 'Same format. Wait time, portion, temperature, plating, rating and complaints are measured.' },
        { t: 'Week 3', d: 'Only if the queue gets shorter: more boxes available, gradually.' },
        { t: 'Week 4', d: 'Light rotation of toppings and WOW effects, without changing the format. Comparison with the starting point.' },
      ],
      measure: 'What is measured each week: wait time, portion and temperature at the end of the tray, order and presentation, rating and complaints.',
      gate: 'Rule: week 3 starts only if the queue gets shorter. At the end, results are compared with the starting point.',
      note: 'Source: section 5.9 of the thesis (four-week small-scale trial).',
    },
    menu: {
      kicker: '04 — One menu per guest',
      h2: 'The same kitchen,',
      h2Muted: 'a menu for each guest',
      lead: 'Pick a type of guest. The order of the menu and what stands out change.',
      cardTitle: 'Menu',
      changed: 'What changes',
      note: 'Example menu.',
      targets: [
        { id: 'pareja', label: 'Couple · dinner', key: 'They want a moment. Mains and dessert rise.', icon: TARGET_ICONS[0] },
        { id: 'grupo', label: 'Group of friends', key: 'They want to share. Shareable dishes go up.', icon: TARGET_ICONS[1] },
        { id: 'turista', label: 'Passing tourist', key: 'They look for something familiar. Classics come first.', icon: TARGET_ICONS[2] },
        { id: 'mediodia', label: 'Work lunch', key: 'They have 45 minutes. The set menu comes first.', icon: TARGET_ICONS[3] },
      ],
      dishes: {
        burrata: { n: 'Burrata & tomato', d: 'Fresh starter', p: 12 },
        fritto: { n: 'Fritto misto', d: 'To share', p: 14 },
        pasta: { n: 'Fresh pasta of the day', d: 'Seasonal recipe', p: 13 },
        pizza: { n: 'Neapolitan pizza', d: '48-hour dough', p: 11 },
        carne: { n: "Chef's main", d: 'Market produce', p: 22 },
        tiramisu: { n: 'Tiramisù', d: 'House dessert', p: 7 },
        menu: { n: 'Lunch menu', d: 'Starter + main + coffee', p: 14 },
      },
      groups: [
        { id: 'pareja', l: 'Couple · dinner', t: 'Couple dinner', d: 'Slow pace. Mains and dessert rise.', k: 'Metric: spend per table', order: ORDER.pareja, hl: ['carne', 'tiramisu'] },
        { id: 'grupo', l: 'Group of friends', t: 'Group of friends', d: 'They want to share. Shareable dishes go up.', k: 'Metric: time to first order', order: ORDER.grupo, hl: ['fritto', 'pizza'] },
        { id: 'turista', l: 'Passing tourist', t: 'Passing tourist', d: 'They look for something familiar. Classics come first.', k: 'Metric: visit-to-table conversion', order: ORDER.turista, hl: ['pasta', 'pizza'] },
        { id: 'mediodia', l: 'Work lunch', t: 'Work lunch', d: 'They have 45 minutes. The set menu comes first.', k: 'Metric: table turnover', order: ORDER.mediodia, hl: ['menu'] },
      ],
    },
    scenario: {
      kicker: '05 — Configurator',
      h2: 'What happens if you change',
      h2Muted: 'format, price or location?',
      lead: 'Choose how your venue is. See whether the offer fits the audience and the place, and the indicative figures that follow.',
      labels: { format: 'Format', price: 'Price', location: 'Location', target: 'Audience' },
      formats: {
        osteria: 'Osteria',
        fine_dining: 'Fine dining',
        tavola_calda: 'Tavola calda',
        pizzeria_taglio: 'Pizzeria by the slice',
        pizzeria_servizio: 'Full-service pizzeria',
        mensa: 'Contract catering',
      },
      prices: { '1': '€ budget', '2': '€€ mid', '3': '€€€ premium' },
      locations: {
        centro: 'Historic centre',
        campus: 'University campus',
        uffici: 'Office district',
        periferia: 'Residential suburb',
        turistica: 'Tourist area',
      },
      targets: {
        studenti: 'Students',
        turisti: 'Tourists',
        lavoro: 'Work lunch',
        famiglie: 'Families',
      },
      outputs: {
        score: 'Offer coherence',
        covers: 'Covers per day',
        turns: 'Turns per day',
        ticket: 'Average ticket',
        monthly: 'Estimated revenue per month',
      },
      rules: {
        tc_premium: 'Tavola calda at a premium price: guests do not see the value of the price.',
        fine_low: 'Fine dining at a budget price: it does not pay for the staff each table needs.',
        taglio_premium: 'Pizza by the slice at a premium price: it breaks the promise of speed and price.',
        campus_premium: 'Premium price on campus: the audience budget does not reach it.',
        periferia_premium: 'Premium price in the suburbs: without a strong reason, nobody comes.',
        uffici_students: 'Students in the office district: they do not pass through at lunch.',
        periferia_tourists: 'Tourists in the suburbs: they do not come without a strong reason.',
        fine_students: 'Fine dining for students: the budget does not match the format.',
        tc_tourists: 'Tavola calda for tourists: it needs a clear signal from the street.',
        price1_turistica: 'Budget price in a tourist area: guests doubt the quality.',
        campus_students: 'Students on campus: the audience is already there.',
        uffici_lunch: 'Work lunch in the office district: concentrated demand and high turnover.',
        centro_tourists: 'Tourists in the historic centre: the format reads from the street.',
        taglio_lunch: 'Pizza by the slice for work lunch: service in minutes.',
      },
      neutral: 'Neutral combination: more data is needed to decide.',
      note: 'Indicative figures to compare combinations, not promises of results. They are calibrated with real data.',
    },
    method: {
      kicker: '06 — DMADV method',
      toolsLabel: 'Tools',
      h2: 'Five phases to',
      h2Muted: 'design a service',
      lead: 'Each phase has a deliverable. In the end the client gets not just ideas, but a system to run the venue.',
      phases: [
        { k: 'D', t: 'Define', what: 'A snapshot of today: what is sold, to whom, in which venue and with which resources.', gets: 'A starting point, with the weak spots visible.', tools: 'Project charter, SIPOC, ecosystem map, personas.' },
        { k: 'M', t: 'Measure', what: 'The service is measured as it is: times, costs, waste and feedback. Nothing assumed.', gets: 'A baseline of the KPIs from real data.', tools: 'VOC, Kano model, CTQ tree, benchmarking, journey map.' },
        { k: 'A', t: 'Analyse', what: 'Briefing with the company: goals, budget and what the client wants to be today.', gets: 'A clear brief: what to change, with what money and in what time.', tools: 'QFD, Pugh matrix, TRIZ, touchpoint analysis.' },
        { k: 'D', t: 'Design', what: 'Journey, menu, roles and format are designed and tested on a small scale.', gets: 'Prototyped proposals, not just ideas.', tools: 'Service blueprint, service FMEA, simulation, prototypes and role-play.' },
        { k: 'V', t: 'Verify', what: 'Checks that it works and leaves the management system running.', gets: 'A dashboard for daily work and a method to keep improving.', tools: 'Pilot, process capability, control charts, tests with real customers, SERVQUAL.' },
      ],
      note: 'Define, measure, analyse, design and verify: the DMADV cycle of the proposal\'s protocol.',
    },
    case: {
      kicker: '07 — Already applied',
      h2: 'The case',
      h2Muted: 'Hum.us Space Bononia',
      labels: { problem: 'Problem', did: 'What we did', status: 'Status' },
      problem: 'Queues of up to 8 minutes at the counter, a kitchen under pressure and dinner rated lower than lunch.',
      did: 'Separate flows (guided line and quick pickup), a modular menu, a five-point quality check and a single QR.',
      status: 'Results are expected: measuring after implementation is the next step.',
      kpis: [
        { label: 'Counter lead time', base: '8 min', target: '≤ 5 min' },
        { label: 'CSAT', base: '2.9', target: '≥ 4.2' },
        { label: 'Food cost', base: '70 %', target: '≤ 66 %' },
        { label: 'Digitalisation', base: '2.5', target: '≥ 4.2' },
      ],
      method: 'Method of the case: DMAIC, to improve an existing service.',
      cta: 'See the full case →',
    },
    about: {
      kicker: '08 — About me',
      h2: 'From the bar',
      h2Muted: 'to the diagram',
      lead: 'Before becoming a designer I was a waiter and a barista. I know the floor from the inside.',
      rows: [
        { k: 'Name', v: 'Adriano Parmentola' },
        { k: 'Lives in', v: 'Bologna' },
        { k: 'Studies', v: 'MSc in Advanced Design (Service Design), University of Bologna' },
        { k: 'Before', v: 'Barista and waiter' },
        { k: 'Languages', v: 'Italian (native), English C1, French A2, Spanish A2' },
      ],
      portfolio: 'See the projects →',
    },
    faq: {
      kicker: '09 — Questions',
      h2: 'Before you ask',
      items: [
        { q: 'Is it a job or an internship?', a: 'Neither. I am an external researcher for my thesis: no position, no tutor, about 3 months.' },
        { q: 'What do you need from us?', a: 'Access to observe, one contact for the data and a signature from someone responsible for the paperwork.' },
        { q: 'How much does it cost?', a: 'Nothing. It is thesis research, backed by the University of Bologna.' },
        { q: 'What happens to my data?', a: 'It stays confidential. You decide which figures can be used.' },
        { q: 'What if nothing useful comes out?', a: 'Every proposal rests on a measured figure. If the data does not support it, I do not propose it.' },
      ],
    },
    contact: {
      kicker: '10 — Let\'s talk',
      h2: 'Twenty minutes to see',
      h2Muted: 'if it fits',
      lead: 'A no-strings video call. Tell me how your service works today and I will tell you what I would measure first.',
      cta: 'Email me',
      subject: 'Misuro: let\'s talk',
      linkedin: 'LinkedIn',
      instagram: 'Instagram',
    },
    footer: 'Illustrative data and mockups. Not a promise of results.',
  },
};
