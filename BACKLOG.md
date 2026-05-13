# Backlog conocido de Reachly

Lista de bugs detectados, features pendientes y deuda técnica que se
atacarán después de completar los 5 puntos del refactor estructural
documentados en CLAUDE.md.

## Bugs detectados durante el refactor

Estos bugs son consecuencia de la estructura "una app con dos vistas"
y se espera que muchos se resuelvan naturalmente al ejecutar el punto 5
(migración a /[rol]/*). Reevaluar después de ese punto.

- [ ] Botón "Ver campañas" en /dashboard/marca redirige al listado
      general en vez de filtrar por campañas de la marca actual
- [ ] Botón "Buscar influencers" en /dashboard/marca no funciona
      (verificar si la página destino existe)
- [ ] Sección "Mis campañas" del dashboard de marca muestra estructura
      de listado de influencer (con marca de origen y botón postular).
      Debe mostrar campañas creadas por la marca actual con sus métricas
- [ ] Click en influencer del bloque "Matches recientes" no permite
      contactar/contratar (depende de tablas invitaciones, matches y
      mensajes pendientes de construir)
- [ ]- [ ] **Nav incorrecto en perfiles públicos `/u/[id]` y `/m/[id]` 
      + bug de sesión.** Estando logueado como marca o influencer, 
      al visitar un perfil público el Nav arriba muestra los items 
      de landing pública ("Servicios, Cómo funciona, Casos de éxito, 
      Precios, FAQ") y el botón "Plataforma →" que solo aparece para 
      invitados. Bug del refactor 5a (cuando hicimos públicas estas 
      rutas, algo en el componente que decide qué Nav mostrar quedó 
      usando "es ruta pública" en lugar de "tiene sesión"). 
      
      **Manifestación más grave detectada en 5d-ii:** si estando 
      logueado entras a /u/[id] o /m/[id] por URL directa y luego 
      haces "atrás" del navegador, te desloguea. El Nav incorrecto 
      no es solo cosmético — algo está invalidando la sesión en esa 
      ruta. Subir prioridad de este bug.
      
      Detectado originalmente en 5d-i (cosmético) y agravado en 
      5d-ii (afecta sesión).

- [ ] **Botón "Ver campañas" en sección Contacto del perfil de influencer 
      mal etiquetado/conectado.** En `/u/[id]`, la sección "Contacto" 
      muestra un botón grande "Ver campañas" que sugiere ser la forma 
      de contactar al influencer, pero al hacer click te lleva al 
      listado general de campañas (`/campanas`). O el copy es incorrecto 
      (debería decir "Mensaje directo") o el destino es incorrecto 
      (debería iniciar conversación). Detectado durante smoke test del 
      5d-i.

- [ ] **Falta botón "Mensaje directo" en perfiles `/u/[id]` y `/m/[id]`.** 
      La página `/marca/mensajes` muestra explícitamente el mensaje 
      "Visitá el perfil de un influencer y hacé click en 'Mensaje 
      directo' para iniciar", pero ese botón no existe en los perfiles. 
      El query param `?with=<id>` en `/marca/mensajes` o `/influencer/mensajes` 
      probablemente solo abre conversaciones existentes, no crea nuevas. 
      Implementar el botón "Mensaje directo" en los perfiles públicos 
      con la lógica de crear conversación + redirigir a `/[rol]/mensajes?with=<id>`. 
      Detectado durante smoke test del 5d-i.
- [ ] **Falta mensaje de éxito visible al guardar cambios en /perfil.** 
      Editas nombre, bio o ubicación, presionas "Guardar" y no hay 
      feedback visual al usuario (toast, mensaje en línea, banner). 
      Los datos sí se persisten en Supabase pero el usuario no sabe 
      si la acción funcionó. Considerar toast component o mensaje 
      inline tras handleSaveProfile. Detectado durante smoke test 
      del 5d-ii.

- [ ] **Dashboard de marca no tiene botón "Editar perfil".** El 
      dashboard de influencer tiene una card de bienvenida con 
      botón "Editar perfil" que lleva a /influencer/perfil. El 
      dashboard de marca no tiene equivalente — para editar perfil 
      hay que navegar al dropdown del avatar. Considerar añadir 
      card o botón análogo en /marca/dashboard que vaya a 
      /marca/perfil. Detectado durante smoke test del 5d-ii.

- [ ] **Editar perfil idéntico para marca e influencer.** Hoy 
      /marca/perfil y /influencer/perfil renderizan exactamente la 
      misma UI (PerfilEditor compartido). Conceptualmente deberían 
      diferir: marca necesita campos de empresa (rubro, descripción, 
      tamaño, sitio web), influencer necesita redes sociales, 
      categorías de contenido, portfolio. Relacionado con el 
      "Frankenstein debt" registrado en Notas arquitectónicas — 
      cuando llegue el momento, evaluar si extender PerfilEditor 
      con props o explotarlo en 2 componentes distintos. Detectado 
      durante smoke test del 5d-ii.

- [ ] **Redes sociales en perfil de influencer no son clickeables.** 
      Cuando un influencer añade su Instagram, TikTok, etc., el 
      handle se muestra como texto plano. Debería ser un link que 
      abra la red correspondiente (https://instagram.com/<handle>, 
      etc.) en nueva pestaña. Aplica también en perfiles públicos 
      /u/[id]. Detectado durante smoke test del 5d-ii.

- [ ] **Portfolio solo permite referenciar posts externos por URL.** 
      Hoy el "portafolio" del influencer es una lista de tarjetas 
      con título + URL a un post de otra red (Instagram, YouTube, 
      LinkedIn). No se pueden crear posts propios dentro de Reachly 
      (con texto, imágenes subidas a Supabase Storage, etc.). 
      Decidir si el roadmap incluye un editor de posts propio o si 
      Reachly se mantiene como agregador de contenido externo. 
      Detectado durante smoke test del 5d-ii.

- [ ] **Bug: Buscar influencer desde cuenta de marca no funciona.** 
      Desde /marca/dashboard u otra área de marca, intento buscar 
      mi propia cuenta de influencer (que sé que existe) y no 
      aparece en los resultados. Tampoco hay opción de "seguir" 
      un influencer desde su perfil público. Verificar la query de 
      búsqueda en Supabase y la integración del componente de 
      búsqueda en Nav.tsx. Detectado durante smoke test del 5d-ii.
- [ ] **`/campanas` no segregado por rol — feed conceptualmente solo 
      de influencer.** Hoy `/campanas` muestra "Campañas disponibles" 
      con CTA "Postularme a esta campaña" — es el feed donde Sofía 
      ve ofertas para postular. Pero Carla (marca) también ve esta 
      ruta desde su Nav, lo cual es conceptualmente incorrecto: ella 
      crea sus campañas, no las ve listadas como ofertas. Falta 
      segregar igual que hicimos con mensajes/perfil/favoritos: 
      `/marca/campanas` (sus campañas creadas) y `/influencer/campanas` 
      (feed de ofertas). Probablemente requiere extraer un componente 
      compartido o duplicar según divergencia. Candidato a 5e/5f del 
      refactor estructural. Detectado durante smoke test del 5d-iii.

- [ ] **Falta corazón en detalle de campaña `/campanas/[id]`.** 
      En el listado `/campanas` cada tarjeta tiene corazón para 
      favoritar, pero al entrar al detalle de una campaña específica 
      no hay forma de favoritar/desfavoritar desde ahí. Inconsistente 
      con el detalle de influencer que tampoco lo tiene 
      (bug ya registrado del Nav). Detectado durante smoke test del 
      5d-iii.

- [ ] **Conteo de favoritos vs items renderizados desalineado.** 
      En `/marca/favoritos` y en el tab "Campañas guardadas" de 
      `/influencer/perfil`, el conteo dice "N en tu lista" pero N 
      cuenta los IDs en localStorage, no los items realmente 
      renderizables. Cuando hay IDs huérfanos (favoritos guardados 
      que apuntan a influencers/campañas que ya no existen en DB), 
      el conteo confunde: dice "2" pero solo se ve 1. Considerar 
      filtrar los IDs válidos antes de mostrar el conteo, o 
      implementar limpieza automática de huérfanos al cargar 
      (descartar IDs que no matcheen ningún item del fetch). 
      Detectado durante smoke test del 5d-iii.

- [ ] **Caso real del bug "Fuente de verdad de tipo" descubierto 
      en cuenta de test.** Durante el smoke test del 5d-iii la 
      cuenta de Matix en `auth.user_metadata.tipo === 'influencer'` 
      pero `profiles.tipo === NULL`. Esto causó que `PerfilEditor` 
      no mostrara el tab "Campañas guardadas" porque lee desde 
      `profile.tipo` y el filtro `=== 'influencer'` no matcheaba. 
      El refactor del punto 4 escribe ambas fuentes, pero cuentas 
      creadas antes de ese fix quedaron con `profiles.tipo` en NULL. 
      Subraya la urgencia del item ya registrado "Fuente de verdad 
      de tipo" en Notas arquitectónicas — vale la pena un script de 
      migración o reparación que rellene los `profiles.tipo` NULL 
      desde `auth.user_metadata.tipo`. Detectado durante smoke test 
      del 5d-iii.

## Bugs del flujo de onboarding (detectados durante smoke test del punto 3-4)

Estos 3 bugs comparten causa raíz: el onboarding fue construido genérico,
sin la separación por rol que CLAUDE.md establece. Las observaciones 2 y 3
probablemente se resuelven de forma más limpia después del punto 5 del
refactor estructural (migración a /[rol]/*).

- [ ] **Registro nuevo NO redirige a /onboarding automáticamente.**
      Usuario se registra, llega a la app, pero su perfil queda incompleto
      (sin bio, sin categorías, sin redes). Si nunca visita /onboarding
      manualmente, queda invisible para el algoritmo de matching. Bug
      pre-existente al refactor, identificado durante smoke test.

- [ ] **Onboarding idéntico para marca e influencer.** Hoy todos los
      usuarios ven el mismo formulario, optimizado para influencers
      (categorías de contenido, redes sociales). Carla debería ver campos
      de empresa: rubro, descripción, presupuesto orientativo. Pendiente
      de definir post-punto-5: ¿una página /onboarding con vista
      condicional, o dos páginas /marca/onboarding y /influencer/onboarding?

- [ ] **Pantalla final del onboarding genérica.** Hoy ofrece "explorar
      campañas E influencers" — debería ser solo lo relevante al rol:
      Sofía va a su feed swipe, Carla va a su dashboard. La redirección
      final debería respetar el rol seteado.

## Bugs de UX detectados durante el smoke test del punto 5a

- [ ] Crear 404 contextuales para perfiles inexistentes. Hoy /u/{id}
      y /m/{id} con IDs que no existen muestran el 404 genérico de
      Reachly ("Página no encontrada"). El mensaje técnicamente es
      correcto, pero confuso: la página existe, lo que no existe es
      el perfil. Crear app/u/[id]/not-found.tsx y app/m/[id]/not-found.tsx
      con mensajes específicos ("Este influencer ya no está en Reachly...",
      "Esta marca no existe...") y CTAs apropiados (botón a explorador
      en lugar de "Volver al inicio").

      Niveles más ambiciosos posibles para futuro: 404 con diseño
      distinto por área (mobile/influencer vs desktop/marca), o
      sistema completo de errores (500, 403, 401). Decidir según
      feedback de usuarios reales.
 - [ ] No hay forma fácil de volver a páginas públicas (landing, sobre 
      nosotros, términos, blog, etc.) desde el Nav de la app cuando 
      estás logueado. Hoy las únicas vías son el botón atrás del 
      navegador, editar la URL manualmente, o cerrar sesión. 
      Solución recomendada: añadir un Footer global (o al menos en 
      las páginas privadas) con links a las páginas públicas. 
      Patrón estándar de SaaS (Stripe, Notion, GitHub lo hacen así). 
      Detectado tras el cierre del refactor 5b mientras navegando 
      como marca.

## Inconsistencia entre nav actual y nav acordado

La barra de Carla actualmente muestra: Explorar, Campañas, Tendencias,
Comparador, Mensajes, Guardados.

La barra acordada en planificación de producto debe ser: Dashboard,
Mis campañas, Buscar influencers, Comparador, Mensajes, Notificaciones,
Pagos.

- [ ] Reemplazar items de Nav.tsx para Carla según lo acordado
- [ ] Verificar también la barra de Sofía: debe ser Inicio,
      Notificaciones, Mensajes, Mis postulaciones, Mi perfil

**Avance parcial (5d-iii, 2026-05):** Sofía perdió "Guardados" del
Nav raíz — las campañas guardadas ahora viven como tab dentro de
`/influencer/perfil`, alineado con la visión del README ("Mi perfil"
rico unificado). Carla mantiene "Guardados" en su barra apuntando
ahora a `/marca/favoritos`. Los items restantes acordados para
ambas barras (Dashboard, Notificaciones, Pagos, Mis postulaciones,
etc.) siguen pendientes — se reemplazan cuando esas páginas existan.

## Optimización pendiente (no urgente)

- [ ] Doble fetch de profile en cargas con Header + Nav. Antes del
      refactor también pasaba (no es regresión). Para deduplicar hay
      que mover el estado a Context, SWR o React Query. Reevaluar
      cuando haya más consumidores de useAuth o cuando se note
      impacto de performance.
- [ ] Implementar Google OAuth para el botón "Iniciar sesión con
      Google" en /login. Hoy el botón existe pero no funciona.
      Requiere: configurar credenciales OAuth en Google Cloud Console,
      registrar redirect URIs en Supabase Auth, conectar el flujo
      signInWithOAuth({ provider: 'google' }). No es urgente para v1
      si el login con email funciona, pero baja la fricción de registro.
- [ ] Warning de Next.js: "Detected scroll-behavior: smooth on the
      <html> element". Recomienda añadir data-scroll-behavior="smooth"
      al <html> en app/layout.tsx para evitar comportamiento raro
      durante transiciones de ruta. Cosmético pero limpia la consola.
- [ ] Onboarding sigue haciendo silent default a 'influencer' cuando
      `tipo` falta tanto en Zustand como en user_metadata
      (app/onboarding/page.tsx:41). Tras el punto 4 ahora el valor se
      persiste a ambas fuentes, pero la elección sigue siendo
      automática. Solución: añadir un step "elige tu rol" al onboarding
      cuando tipo está missing, con la misma UI que el step 1 de
      /registro. Elevar a urgente cuando aterrice Google OAuth (que
      hoy no setea tipo en signup).
- [ ] Hint TypeScript pre-existente: `router` declarado y no usado en
      app/onboarding/page.tsx:21. Detectado durante el punto 4, no
      relacionado con el refactor. Remover en una pasada de cleanup.

## Notas de infraestructura

- **Ubicación del repo local:** el proyecto vive en
  `/Users/Mati/Projects/reachly-next`. Se movió desde
  `~/Desktop/reachly-next` (2026-05) porque esa ruta estaba sincronizada
  con iCloud Drive y la sincronización corrompió el `.git` del original.
  La copia en Desktop quedó deprecada y puede borrarse — no usar nunca
  más esa ruta como working directory.

## Notas arquitectónicas

- **Fuente de verdad de `tipo` (post punto 4):** distribuida en dos
  capas. `user_metadata.tipo` es la fuente operacional rápida, leída
  por middleware en cada request privado sin hit a DB. `profiles.tipo`
  es la fuente de consulta para joins y agregaciones, leída por
  useAuth y auth/callback con fallback a user_metadata. Onboarding
  escribe ambas para mantenerlas sincronizadas. **Cualquier flujo
  futuro que cambie el rol del usuario DEBE escribir las dos.** Si la
  lista de fuentes crece o aparece un tercer escritor, considerar
  centralizar en un helper `setUserRole(userId, tipo)` en lib/api.ts.

- **Frankenstein debt en componentes compartidos (post 5d-i y 5d-ii):**
  Componentes compartidos MessagesView y PerfilEditor (creados en 5d-i
  y 5d-ii) asumen UI similar entre roles. Cuando se construya el diseño
  mobile-first de Sofía y/o desktop-first de Carla y la divergencia
  visual sea grande, evaluar si conviene explotar el componente
  compartido y permitir duplicación intencional en cada wrapper. Hoy
  compartir es eficiente; en el futuro puede volverse un Frankenstein
  con props condicionales.

## Resuelto

- [x] Header en /dashboard/marca mostraba PublicHeader tras login y
      requería hard refresh para ver Nav. Resuelto en el punto 2 del
      refactor estructural: useAuth ahora se subscribe a
      onAuthStateChange y reacciona en vivo a SIGNED_IN, SIGNED_OUT,
      TOKEN_REFRESHED y USER_UPDATED.

## Páginas y tablas pendientes (referencia)

Ver CLAUDE.md sección "Páginas por construir" y "Modelo de datos >
Tablas por construir" para el detalle. Este backlog se enfoca en bugs
y deuda específica, no en el plan de construcción.