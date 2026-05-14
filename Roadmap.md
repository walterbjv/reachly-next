# Roadmap de producto de Reachly

Este documento recoge **hacia dónde va Reachly**: las épicas de producto,
las mejoras de identidad visual y las features que falta construir. Es
distinto de `BACKLOG.md` — el backlog es "algo roto que arreglar", el
roadmap es "algo nuevo que construir".

El refactor estructural (ver `CLAUDE.md`) ya está completo y en
producción. Eso desbloquea todo lo que está acá.

Ningún item tiene fecha. El orden dentro de cada sección no implica
prioridad absoluta — la priorización se decide sesión a sesión.

---

## Épicas de producto

Las piezas grandes. Cada una es un proyecto en sí mismo, probablemente
multi-sesión, y varias dependen de tablas de Supabase que aún no existen
(ver `CLAUDE.md` → "Tablas por construir").

### Core social funcional

**El producto central de Reachly no existe todavía.** Hoy hay cuentas
(2 influencers founders, 1 marca founder) pero no pueden interactuar
entre sí de ninguna forma: un influencer no aparece si lo buscas, no se
puede seguir, no se puede mensajear; la cuenta de marca tampoco se
encuentra, y por lo tanto no se puede participar en sus campañas, ni
hacer match, ni nada. Reachly es una plataforma de matching donde hoy
no se puede hacer match.

Esta épica es el conjunto de features que convierten a Reachly de
"maqueta navegable" en "producto usable". Sub-puntos que implica:

- Búsqueda real de usuarios (influencer encuentra influencer, marca
  encuentra influencer, influencer encuentra marca).
- Seguir / dejar de seguir.
- Participar en campañas: un influencer postula a una campaña de una
  marca real.
- Match: el punto de unión cuando marca e influencer coinciden.
- Mensajería real entre cuentas que tienen un match (no el chat
  maqueta actual).
- Notificaciones de toda esa actividad.

Depende de las tablas `swipes`, `postulaciones`, `invitaciones`,
`matches`, `mensajes`, `notificaciones`, `favoritos`. Es el corazón del
roadmap — probablemente lo primero que se ataque después del refactor.

### Integración real con redes sociales

Vincular una cuenta de red social **de forma verificada**: que el
influencer conecte SU Instagram (o TikTok, YouTube, Twitch, Kick,
Twitter/X) y quede probado que es suya, de manera que nadie más pueda
reclamarla. Esto es OAuth real con cada plataforma, no el campo de texto
libre actual.

Plataformas objetivo: Instagram, Facebook, TikTok, Kick, Twitch,
Twitter/X.

Es distinto del item menor "links de redes clickeables" (ver más abajo
en Mejoras): ese solo hace que el handle escrito a mano sea un enlace.
Esta épica es la vinculación con prueba de propiedad. Es también la base
técnica de la verificación de identidad.

Decisión técnica pendiente registrada en `CLAUDE.md`: OAuth oficial vs
bio code vs servicios de terceros (Phyllo, HypeAuditor).

### Verificación de identidad y de cuenta

Que no se pueda registrar una cuenta de marca que no te pertenece, ni
vincular una cuenta de red social que no es tuya. Reachly necesita un
mecanismo de verificación para que las marcas y los perfiles sean
confiables.

Va de la mano con la épica de integración con redes sociales —
verificar la propiedad de una cuenta social es parte del mismo problema.

### Login con Google funcional

El botón "Iniciar sesión con Google" existe en `/login` pero no
funciona. Implementarlo: credenciales OAuth en Google Cloud Console,
redirect URIs en Supabase Auth, conectar `signInWithOAuth({ provider:
'google' })`.

Técnicamente es un bug (botón que no hace nada), pero se agrupa acá
porque está atado al tema de autenticación social. Nota: cuando aterrice
el login social hay que resolver el item del BACKLOG sobre el step
"elige tu rol" en onboarding — Google signup no setea `tipo`.

### Chatbot funcional

Un chatbot dentro de Reachly. Alcance, propósito y ubicación todavía sin
definir — registrar la intención, definir el detalle cuando se priorice.

---

## Identidad visual y estética

Reachly funciona, pero se ve genérica. Esta sección es un proyecto
multi-sesión de diseño. Conviene atacarla en bloque, no item suelto.

### Unificar el estilo: landing vs resto de la app

La landing page tiene un estilo distinto al resto de la aplicación, que
es más simple. Hay dos lenguajes visuales conviviendo. Unificarlos en
uno solo y coherente.

### Identidad propia: salir del look genérico

Aun siendo mejor que el resto, la landing todavía se ve como "SaaS B2B
de IA genérico". Reachly necesita identidad propia: animaciones y la
integración de unos personajes ya diseñados (Mati los tiene listos, los
comparte cuando se trabaje esta sección).

### Honestidad de la landing

La landing está llena de información falsa: marcas que no han trabajado
con Reachly, números inventados, métricas que no son reales. Revisar
**página por página** y dejar solo lo verdadero, o marcar claramente lo
que es ilustrativo.

### Mostrar producto real en la landing

La landing no tiene un solo screenshot real. El hero tiene 4 mock-cards
diminutas hechas en CSS que sugieren UI pero no la muestran. "Cómo
funciona" son círculos numerados con texto. "Servicios" y "Precios" son
listas con checks. Para una plataforma cuyo valor es "el match lo decide
el algoritmo, no un humano", el algoritmo no se ve por ningún lado — el
usuario tiene que creer en abstracto.

Qué hacer:
- Un screenshot grande bajo el hero (o reemplazando las mock-cards): la
  pantalla de swipe del lado influencer, o el comparador del lado marca.
  Real, no mock.
- En "Cómo funciona", cada paso con una mini-captura acompañando, no
  solo número y texto.

### Rediseño estético del perfil

Toda la estética del perfil, aunque funciona, es anticuada y básica.
Rediseñar. Relacionado con el item del BACKLOG sobre "editar perfil
idéntico para ambos roles" y con la "Frankenstein debt" del componente
compartido `PerfilEditor`.

### Rediseño de los dashboards

Los dashboards de marca e influencer son genéricos: no muestran
información real y, como el resto de la app, se ven básicos y poco
estéticos. Rediseñar con data real una vez que el core social los
alimente.

---

## Mejoras y features menores

Cosas más acotadas. Algunas son de una sola sesión.

### Links de redes sociales clickeables

Hoy en el perfil puedes escribir tus redes pero el handle es texto
muerto — al hacer clic no va a ningún lado. Hacerlos enlaces que abran
la red correspondiente (`instagram.com/<handle>`, etc.) en pestaña
nueva. Aplica también a perfiles públicos `/u/[id]`.

Esto es el item barato. NO confundir con la épica "Integración real con
redes sociales", que es la vinculación verificada con prueba de
propiedad.

### Foto real en vez de iniciales

Los creadores se muestran con iniciales (ej. "CR", "BT") en vez de su
foto real. Usar la imagen real del perfil.

### Imagen de fondo editable en el perfil

Permitir editar la imagen de fondo del perfil, tanto para marca como
para influencer, estilo LinkedIn o Facebook (el "cover").

### Publicaciones propias de Reachly

Hoy el portafolio del influencer solo permite **referenciar** posts
externos por URL (linkear un post de Instagram, YouTube, etc.).
Permitir crear publicaciones propias dentro de Reachly — para marcas y
para influencers. Decidir si Reachly se mantiene como agregador de
contenido externo o se vuelve también un lugar de publicación propia.

### Más categorías de campañas y de nichos

Ampliar el catálogo de categorías de campañas y de nichos de
influencers. Hoy el set es reducido.

### Ubicación en tiempo real del dispositivo

Usar la ubicación en tiempo real del dispositivo para mostrar campañas
que se adecúen a dónde está el usuario (campañas cercanas / relevantes
por zona).

### Decisión de producto: qué se ve al entrar

Hoy, al iniciar sesión, llegas al dashboard correspondiente según rol
(marca o influencer). Pero quizás el dashboard no debería ser lo primero
que ves — si el dashboard es "una sección más" y no el centro del
producto, la pantalla de entrada podría ser otra cosa (el feed swipe
para Sofía, por ejemplo).

Decisión todavía sin tomar. Recomendaciones para cuando se retome:
- **Influencer (Sofía):** el README ya apunta a que su inicio post-login
  debería ser el feed swipe (`/influencer/swipe`), no el dashboard. Hoy
  `/influencer/page.tsx` redirige a dashboard solo como interino porque
  el swipe no existe — ya hay un comentario `// TEMPORAL` en ese archivo.
- **Marca (Carla):** el dashboard como inicio tiene más sentido para
  ella (su producto es tipo LinkedIn/Notion, el panel ES el centro). Acá
  probablemente no haya que cambiar nada.
- En la práctica esta "decisión" puede resolverse sola cuando se
  construya `/influencer/swipe` como parte del core social.

---

## Pre-lanzamiento

Cosas a hacer **antes de tener usuarios reales** más allá de los 3
founders. No urgentes hoy precisamente porque aún no hay usuarios
reales, pero bloqueantes antes de abrir Reachly al público.

### Auditoría de seguridad / vulnerabilidades

Revisar todo el código en busca de vulnerabilidades antes del
lanzamiento público. Con solo 3 usuarios founders no es urgente, pero es
obligatorio antes de abrir registro real.

### Límite de recargas / protección contra sobrecarga

Poner un límite a las recargas (o mecanismo equivalente) para evitar
sobrecargas de la página. Definir el mecanismo concreto cuando se
priorice.