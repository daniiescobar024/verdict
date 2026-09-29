/**
 * All user-facing copy. English is the source of truth for keys; Spanish must
 * provide every key (enforced by the `Messages` type).
 */
export const en = {
  'meta.tagline': 'Web performance audits that speak business.',
  'nav.home': 'Verdict home',
  'nav.compare': 'Compare',
  'nav.skip': 'Skip to content',
  'theme.toLight': 'Switch to light theme',
  'theme.toDark': 'Switch to dark theme',
  'lang.switch': 'Ver en español',
  'lang.code': 'ES',

  'home.eyebrow': 'Powered by Google Lighthouse',
  'home.title': 'Know what your website is *costing you*.',
  'home.lead':
    'Verdict runs a full Lighthouse audit and translates the numbers into what a business owner actually cares about: speed, trust, reach and lost enquiries.',
  'home.pillar.speed.title': 'Speed that holds attention',
  'home.pillar.speed.body':
    'Core Web Vitals from lab tests and, when available, from real Chrome users.',
  'home.pillar.trust.title': 'Accessibility that widens reach',
  'home.pillar.trust.body': 'Every visitor should be able to read, navigate and contact you.',
  'home.pillar.search.title': 'Search readiness',
  'home.pillar.search.body': 'The technical signals Google needs before it can rank a page.',
  'home.recent': 'Recent audits',
  'home.clearRecent': 'Clear',
  'home.footer': 'Verdict is an independent project. Data from the Google PageSpeed Insights API.',

  'form.label': 'Website address',
  'form.placeholder': 'yourbusiness.com',
  'form.device': 'Device',
  'form.mobile': 'Mobile',
  'form.desktop': 'Desktop',
  'form.submit': 'Run audit',
  'form.invalid': 'Enter a public web address, like acme.com or https://acme.com/pricing.',
  'form.hint': 'Mobile is the default: it is how most visitors meet a site today.',

  'loading.title': 'Auditing {url}',
  'loading.note':
    'Lighthouse is loading the page on a real device profile. This usually takes 20–40 seconds.',
  'loading.step.1': 'Requesting the page from Google’s servers',
  'loading.step.2': 'Rendering on a throttled {device}',
  'loading.step.3': 'Measuring paint, layout shifts and blocking time',
  'loading.step.4': 'Checking accessibility, best practices and SEO',
  'loading.step.5': 'Writing the verdict',

  'error.title': 'The audit could not finish',
  'error.INVALID_URL': 'That address does not look like a public website. Check it and try again.',
  'error.RATE_LIMITED':
    'The PageSpeed quota is exhausted for now. Wait a minute and retry, or configure your own free API key.',
  'error.UNREACHABLE':
    'Google could not load that page. It may be down, blocking bots, or not return HTML.',
  'error.TIMEOUT': 'The page took too long to analyse. Heavy sites sometimes do — try once more.',
  'error.UPSTREAM': 'PageSpeed returned an unexpected response. Try again in a moment.',
  'error.NETWORK': 'You appear to be offline. Check your connection and retry.',
  'error.retry': 'Try again',
  'error.newAudit': 'Audit another site',

  'report.eyebrow': 'Audit report',
  'report.audited': 'Audited {date} · {device} · Lighthouse {version}',
  'report.redirected': 'Redirected to {url}',
  'report.rerun': 'Re-run',
  'report.switchTo': 'View {device}',
  'report.share': 'Copy link',
  'report.copied': 'Link copied',
  'report.print': 'Save as PDF',
  'report.compare': 'Compare with…',
  'report.screenshot': 'How the page looked to Lighthouse on {device}',

  'score.title': 'Lighthouse scores',
  'score.performance': 'Performance',
  'score.accessibility': 'Accessibility',
  'score.bestPractices': 'Best practices',
  'score.seo': 'SEO',
  'score.aria': '{label}: {score} out of 100, {rating}',
  'score.na': 'Not available',

  'rating.good': 'good',
  'rating.needs-improvement': 'needs improvement',
  'rating.poor': 'poor',

  'verdict.good.title': 'Fast, and ready to convert.',
  'verdict.good.body':
    'This page loads quickly and stays stable. Visitors reach your offer without friction — protect it as the site grows.',
  'verdict.needs-improvement.title': 'Friction is costing you visitors.',
  'verdict.needs-improvement.body':
    'The page works, but it makes people wait. Every extra second before the main content appears is a chance for them to leave for a competitor.',
  'verdict.poor.title': 'This page is leaking enquiries.',
  'verdict.poor.body':
    'Visitors wait too long for anything useful to appear, especially on phones. Fixing the items below is the fastest route to more calls and form submissions.',
  'verdict.unknown.title': 'Partial results.',
  'verdict.unknown.body':
    'Lighthouse could not score performance for this page. Review the details below.',

  'lab.title': 'Lab measurements',
  'lab.caption':
    'One controlled load on a simulated {device}. Reproducible, ideal for spotting regressions.',
  'field.title': 'Real-user experience',
  'field.caption':
    '75th percentile of real Chrome visits over the last 28 days (Chrome UX Report).',
  'field.origin': 'Not enough traffic on this page — showing the whole domain instead.',
  'field.empty':
    'Not enough real-world traffic for Google to publish field data yet. Lab results are the best guide for now.',
  'field.overall': 'Core Web Vitals assessment: {rating}',

  'metric.fcp': 'First Contentful Paint',
  'metric.lcp': 'Largest Contentful Paint',
  'metric.tbt': 'Total Blocking Time',
  'metric.cls': 'Cumulative Layout Shift',
  'metric.si': 'Speed Index',
  'metric.inp': 'Interaction to Next Paint',
  'metric.ttfb': 'Time to First Byte',
  'metric.fcp.why': 'When visitors first see something happen. Until then, the page feels broken.',
  'metric.lcp.why':
    'When the main content — hero, headline, product — is visible. The moment people decide to stay.',
  'metric.tbt.why': 'How long the page ignores taps and clicks while it is busy running scripts.',
  'metric.cls.why':
    'How much the layout jumps while loading. Jumps cause mis-taps and erode trust.',
  'metric.si.why': 'How quickly the visible area fills in overall.',
  'metric.inp.why': 'How fast the page responds when someone taps, types or clicks.',
  'metric.ttfb.why':
    'How quickly the server starts answering. Slow hosting delays everything else.',
  'metric.target': 'Good ≤ {value}',

  'findings.title': 'What to fix first',
  'findings.caption':
    'Ordered by severity and estimated time saved. Hand this list to your developer.',
  'findings.empty': 'No failing audits. This page passes every scored check.',
  'findings.critical': 'Critical',
  'findings.warning': 'Improve',
  'findings.savings': 'Est. {value} faster',
  'findings.learn': 'Learn more',
  'findings.filter': 'Filter by category',
  'findings.all': 'All',

  'compare.title': 'Head to head',
  'compare.lead': 'Audit two sites on the same device profile and see where each one wins.',
  'compare.a': 'Your site',
  'compare.b': 'Competitor',
  'compare.submit': 'Compare',
  'compare.metric': 'Metric',
  'compare.lead.label': 'Leader',
  'compare.tie': 'Even',
  'compare.faster': '{url} leads on {count} of {total} measures.',

  'notFound.title': 'Nothing to audit here.',
  'notFound.body': 'This page does not exist. Start a new audit instead.',
} as const;

export type MessageKey = keyof typeof en;
export type Messages = Record<MessageKey, string>;

export const es: Messages = {
  'meta.tagline': 'Auditorías web que hablan el idioma del negocio.',
  'nav.home': 'Inicio de Verdict',
  'nav.compare': 'Comparar',
  'nav.skip': 'Saltar al contenido',
  'theme.toLight': 'Cambiar a tema claro',
  'theme.toDark': 'Cambiar a tema oscuro',
  'lang.switch': 'View in English',
  'lang.code': 'EN',

  'home.eyebrow': 'Con la tecnología de Google Lighthouse',
  'home.title': 'Descubrí cuánto te está *costando* tu sitio web.',
  'home.lead':
    'Verdict ejecuta una auditoría completa de Lighthouse y traduce los números a lo que le importa a un negocio: velocidad, confianza, alcance y consultas perdidas.',
  'home.pillar.speed.title': 'Velocidad que retiene',
  'home.pillar.speed.body':
    'Core Web Vitals de pruebas de laboratorio y, cuando existen, de usuarios reales de Chrome.',
  'home.pillar.trust.title': 'Accesibilidad que amplía el alcance',
  'home.pillar.trust.body': 'Cualquier visitante debería poder leer, navegar y contactarte.',
  'home.pillar.search.title': 'Preparación para buscadores',
  'home.pillar.search.body':
    'Las señales técnicas que Google necesita antes de posicionar una página.',
  'home.recent': 'Auditorías recientes',
  'home.clearRecent': 'Borrar',
  'home.footer':
    'Verdict es un proyecto independiente. Datos de la API de Google PageSpeed Insights.',

  'form.label': 'Dirección del sitio',
  'form.placeholder': 'tunegocio.com',
  'form.device': 'Dispositivo',
  'form.mobile': 'Móvil',
  'form.desktop': 'Escritorio',
  'form.submit': 'Auditar',
  'form.invalid': 'Ingresá una dirección pública, como acme.com o https://acme.com/precios.',
  'form.hint': 'Móvil es lo predeterminado: así llega hoy la mayoría de los visitantes.',

  'loading.title': 'Auditando {url}',
  'loading.note':
    'Lighthouse está cargando la página con un perfil de dispositivo real. Suele tardar entre 20 y 40 segundos.',
  'loading.step.1': 'Solicitando la página desde los servidores de Google',
  'loading.step.2': 'Renderizando en un {device} con red limitada',
  'loading.step.3': 'Midiendo pintado, saltos de diseño y bloqueos',
  'loading.step.4': 'Revisando accesibilidad, buenas prácticas y SEO',
  'loading.step.5': 'Redactando el veredicto',

  'error.title': 'La auditoría no pudo completarse',
  'error.INVALID_URL': 'Esa dirección no parece un sitio web público. Revisala y volvé a intentar.',
  'error.RATE_LIMITED':
    'Se agotó la cuota de PageSpeed por ahora. Esperá un minuto y reintentá, o configurá tu propia clave gratuita.',
  'error.UNREACHABLE':
    'Google no pudo cargar esa página. Puede estar caída, bloquear bots o no devolver HTML.',
  'error.TIMEOUT':
    'La página tardó demasiado en analizarse. A veces pasa con sitios pesados: probá una vez más.',
  'error.UPSTREAM': 'PageSpeed devolvió una respuesta inesperada. Probá de nuevo en un momento.',
  'error.NETWORK': 'Parece que no tenés conexión. Revisala y reintentá.',
  'error.retry': 'Reintentar',
  'error.newAudit': 'Auditar otro sitio',

  'report.eyebrow': 'Informe de auditoría',
  'report.audited': 'Auditado el {date} · {device} · Lighthouse {version}',
  'report.redirected': 'Redirigido a {url}',
  'report.rerun': 'Volver a auditar',
  'report.switchTo': 'Ver {device}',
  'report.share': 'Copiar enlace',
  'report.copied': 'Enlace copiado',
  'report.print': 'Guardar PDF',
  'report.compare': 'Comparar con…',
  'report.screenshot': 'Cómo vio Lighthouse la página en {device}',

  'score.title': 'Puntajes de Lighthouse',
  'score.performance': 'Rendimiento',
  'score.accessibility': 'Accesibilidad',
  'score.bestPractices': 'Buenas prácticas',
  'score.seo': 'SEO',
  'score.aria': '{label}: {score} de 100, {rating}',
  'score.na': 'No disponible',

  'rating.good': 'bueno',
  'rating.needs-improvement': 'mejorable',
  'rating.poor': 'deficiente',

  'verdict.good.title': 'Rápida y lista para convertir.',
  'verdict.good.body':
    'La página carga rápido y se mantiene estable. Los visitantes llegan a tu oferta sin fricción: cuidalo a medida que el sitio crezca.',
  'verdict.needs-improvement.title': 'La fricción te está costando visitas.',
  'verdict.needs-improvement.body':
    'La página funciona, pero hace esperar. Cada segundo extra antes de ver el contenido principal es una oportunidad para que se vayan a la competencia.',
  'verdict.poor.title': 'Esta página está perdiendo consultas.',
  'verdict.poor.body':
    'Los visitantes esperan demasiado para ver algo útil, sobre todo en el celular. Corregir los puntos de abajo es el camino más corto a más llamadas y formularios.',
  'verdict.unknown.title': 'Resultados parciales.',
  'verdict.unknown.body':
    'Lighthouse no pudo puntuar el rendimiento de esta página. Revisá el detalle más abajo.',

  'lab.title': 'Mediciones de laboratorio',
  'lab.caption':
    'Una carga controlada en un {device} simulado. Reproducible e ideal para detectar retrocesos.',
  'field.title': 'Experiencia de usuarios reales',
  'field.caption':
    'Percentil 75 de visitas reales en Chrome durante los últimos 28 días (Chrome UX Report).',
  'field.origin': 'No hay suficiente tráfico en esta página: se muestra el dominio completo.',
  'field.empty':
    'Todavía no hay suficiente tráfico real para que Google publique datos de campo. Por ahora, el laboratorio es la mejor guía.',
  'field.overall': 'Evaluación de Core Web Vitals: {rating}',

  'metric.fcp': 'First Contentful Paint',
  'metric.lcp': 'Largest Contentful Paint',
  'metric.tbt': 'Total Blocking Time',
  'metric.cls': 'Cumulative Layout Shift',
  'metric.si': 'Speed Index',
  'metric.inp': 'Interaction to Next Paint',
  'metric.ttfb': 'Time to First Byte',
  'metric.fcp.why':
    'Cuándo el visitante ve que algo pasa. Hasta ese momento, la página parece rota.',
  'metric.lcp.why':
    'Cuándo aparece el contenido principal: portada, titular, producto. El momento en que deciden quedarse.',
  'metric.tbt.why': 'Cuánto tiempo la página ignora toques y clics mientras ejecuta scripts.',
  'metric.cls.why':
    'Cuánto salta el diseño mientras carga. Los saltos provocan toques errados y restan confianza.',
  'metric.si.why': 'Qué tan rápido se completa el área visible en general.',
  'metric.inp.why': 'Qué tan rápido responde la página cuando alguien toca, escribe o hace clic.',
  'metric.ttfb.why':
    'Qué tan rápido empieza a responder el servidor. Un hosting lento retrasa todo lo demás.',
  'metric.target': 'Bueno ≤ {value}',

  'findings.title': 'Qué corregir primero',
  'findings.caption':
    'Ordenado por gravedad y tiempo estimado de ahorro. Esta lista es para tu desarrollador.',
  'findings.empty': 'Sin auditorías fallidas. Esta página aprueba todos los controles puntuados.',
  'findings.critical': 'Crítico',
  'findings.warning': 'Mejorar',
  'findings.savings': 'Aprox. {value} más rápido',
  'findings.learn': 'Más información',
  'findings.filter': 'Filtrar por categoría',
  'findings.all': 'Todas',

  'compare.title': 'Cara a cara',
  'compare.lead':
    'Auditá dos sitios con el mismo perfil de dispositivo y mirá dónde gana cada uno.',
  'compare.a': 'Tu sitio',
  'compare.b': 'Competidor',
  'compare.submit': 'Comparar',
  'compare.metric': 'Métrica',
  'compare.lead.label': 'Lidera',
  'compare.tie': 'Empate',
  'compare.faster': '{url} lidera en {count} de {total} indicadores.',

  'notFound.title': 'Acá no hay nada para auditar.',
  'notFound.body': 'Esta página no existe. Empezá una auditoría nueva.',
};
