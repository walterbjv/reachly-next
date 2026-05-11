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
- [ ] **Nav incorrecto en perfiles públicos `/u/[id]` y `/m/[id]`.** 
      Estando logueado como marca o influencer, al visitar un perfil 
      público el Nav arriba muestra los items de landing pública 
      ("Servicios, Cómo funciona, Casos de éxito, Precios, FAQ") y 
      el botón "Plataforma →" que solo aparece para invitados. Debería 
      mostrar el Nav role-aware que corresponde al usuario logueado. 
      Bug del refactor 5a (cuando hicimos públicas estas rutas, algo 
      en el componente que decide qué Nav mostrar quedó usando "es ruta 
      pública" en lugar de "tiene sesión"). Detectado durante smoke 
      test del 5d-i.

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