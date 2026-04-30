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
