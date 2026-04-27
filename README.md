# Reachly

> La plataforma que conecta marcas con influencers en LATAM mediante matching algorítmico, sin intermediarios.

---

## Tabla de contenidos

1. [Qué es Reachly](#qué-es-reachly)
2. [El problema que resuelve](#el-problema-que-resuelve)
3. [Modelo de negocio](#modelo-de-negocio)
4. [Los dos productos](#los-dos-productos)
5. [Tipos de usuario](#tipos-de-usuario)
6. [Arquitectura conceptual](#arquitectura-conceptual)
7. [Mapa de páginas](#mapa-de-páginas)
8. [Navegación](#navegación)
9. [Modelo de datos](#modelo-de-datos)
10. [Stack técnico](#stack-técnico)
11. [Estado actual del proyecto](#estado-actual-del-proyecto)
12. [Decisiones técnicas pendientes](#decisiones-técnicas-pendientes)
13. [Cómo correr el proyecto localmente](#cómo-correr-el-proyecto-localmente)
14. [Despliegue](#despliegue)

---

## Qué es Reachly

Reachly es una plataforma de descubrimiento bilateral con matching algorítmico que conecta marcas con creadores de contenido en LATAM. El match no lo decide un humano con sesgos, lo decide un algoritmo que cruza datos reales de audiencia, engagement, categorías y rendimiento histórico.

En una frase: **un Tinder profesional entre marcas e influencers, donde quien decide es la data.**

---

## El problema que resuelve

Hoy las marcas contactan influencers por correo electrónico o vía agencias de publicidad. El criterio de selección suele ser superficial: se elige al influencer "de moda" o al de mayor número de seguidores, sin considerar realmente sus métricas, ni si su audiencia coincide con el público objetivo de la campaña.

Esto produce tres problemas:

- **Sesgo del reclutador.** La elección depende del gusto u opinión del marketero, no de los datos.
- **Intermediarios costosos.** Las agencias se quedan con un porcentaje significativo y enlentecen el proceso.
- **Resultados inciertos.** Sin métricas reales del calce marca-audiencia, las campañas rinden por debajo de su potencial.

Reachly elimina los intermediarios, automatiza el descubrimiento mediante datos verificados, y abre la conversación directa entre marca e influencer dentro de la plataforma.

---

## Modelo de negocio

- **Comisión por campaña cerrada.** Reachly retiene un porcentaje del monto de cada campaña que se cierra y se ejecuta exitosamente dentro de la plataforma.
- **Suscripción para marcas.** Las marcas pagan un plan mensual para acceder a funciones avanzadas (comparador, tendencias, búsquedas ilimitadas).
- **Acceso freemium.** La marca puede probar la plataforma con una primera campaña gratis o con una vista limitada del comparador, antes de pagar. Esto reduce la fricción inicial y demuestra valor antes de cobrar.
- **Acceso gratuito para influencers.** El influencer no paga por usar la plataforma. Esta decisión es estratégica: el lado más difícil de captar en una plataforma de dos lados es la oferta (los influencers), por lo que se prioriza llenar ese lado con cero fricción económica.

---

## Los dos productos

Reachly **no es una sola app con dos vistas**. Son **dos productos visualmente y funcionalmente distintos** que comparten un mismo backend. Esta es una decisión de arquitectura central del proyecto.

| | Producto influencer | Producto marca |
|---|---|---|
| Audiencia | Creadores jóvenes (18-30 años) | Equipos de marketing profesionales |
| Plataforma principal | Mobile-first | Desktop-first |
| Estilo de UI | Tipo Tinder o TikTok: swipe, vertical, gamificado | Tipo LinkedIn o Notion: tabular, horizontal, datos densos |
| Acceso | Gratuito | Comisión + suscripción |
| Inicio post-login | Feed de campañas (acción inmediata) | Dashboard (panorama antes de actuar) |

Esta dualidad implica que páginas con la misma "función" (mensajes, campañas, perfil) se construyen como **dos componentes independientes**, uno por rol. La estructura de carpetas refleja esa realidad: `app/influencer/` y `app/marca/` son dos áreas hermanas, simétricas, sin que ninguna sea "la principal" o "el default".

---

## Tipos de usuario

### Sofía — la influencer

Tiene entre 18 y 30 años. Cuenta con seguidores en Instagram, TikTok o YouTube. Hasta ahora ha hecho colaboraciones esporádicas, vía DM o canjes. Quiere monetizar su trabajo de manera profesional sin tener que perseguir marcas.

**Su loop principal en Reachly:**

1. Abre la app desde el celular.
2. Revisa notificaciones: ¿algún match nuevo? ¿algún mensaje?
3. Entra al feed de campañas y hace swipe (derecha = me interesa, izquierda = no).
4. Si una campaña pública le llama mucho la atención, postula activamente con un mensaje.
5. Si una marca acepta su postulación o ella acepta una invitación de marca, se genera un match.
6. Conversa con la marca por chat, negocia condiciones, acuerda y entrega contenido.
7. Recibe el pago retenido por Reachly una vez que la marca aprueba el contenido entregado.

### Carla — la marca

Tiene 30+ años. Es gerente o ejecutiva de marketing en una empresa con presupuesto para campañas de influencer marketing. Ha trabajado con agencias antes, conoce el dolor de los procesos manuales y los influencers mal elegidos.

**Su loop principal en Reachly:**

1. Entra desde su laptop.
2. Ve su dashboard: campañas activas, postulaciones nuevas, mensajes pendientes.
3. Crea una nueva campaña con un wizard paso a paso (objetivo, presupuesto, audiencia esperada, entregables).
4. Revisa los influencers que el algoritmo le sugiere y las postulaciones recibidas.
5. Compara candidatos lado a lado en el comparador.
6. Invita al o los seleccionados, conversa por chat, negocia.
7. Cierra el trato, paga la cifra acordada (que queda retenida en Reachly), recibe el contenido, aprueba.

---

## Arquitectura conceptual

Reachly se sostiene sobre **tres motores** internos:

1. **Motor de perfiles.** Recolecta y mantiene los datos ricos de cada usuario (categorías, audiencia, métricas, redes verificadas, colaboraciones previas). Lo alimentan las páginas de registro, onboarding y perfil.
2. **Motor de matching.** Cruza ambos lados del mercado y calcula compatibilidad entre marcas y campañas con influencers. Es el corazón diferenciador de Reachly. Sus consumidores son el feed de swipe (Sofía), el buscador y comparador (Carla), y las recomendaciones del dashboard.
3. **Motor de comunicación.** Donde marca e influencer hablan, negocian, cierran y la plataforma procesa el pago. Lo componen los matches, mensajes y pagos.

El frontend está dividido en dos áreas hermanas (`/influencer` y `/marca`), pero ambos consumen los mismos tres motores a través de un backend único en Supabase.

---

## Mapa de páginas

### Área pública (sin sesión)

| Ruta | Estado | Propósito |
|---|---|---|
| `/` | Real | Landing principal de Reachly |
| `/sobre-nosotros` | Real | Quiénes somos los tres fundadores |
| `/contacto` | Real | Formulario de contacto |
| `/terminos` | Real | Términos de uso |
| `/privacidad` | Real | Política de privacidad |
| `/cookies` | Real | Política de cookies |
| `/gdpr` | Real | Cumplimiento GDPR |
| `/blog` | Placeholder | Próximamente |
| `/prensa` | Placeholder | Próximamente |
| `/careers` | Placeholder | Próximamente |

### Área de autenticación

| Ruta | Estado | Propósito |
|---|---|---|
| `/login` | Existe | Inicio de sesión |
| `/registro` | Existe | Registro con elección de rol (influencer o marca) |
| `/onboarding` | Existe | Tutorial corto y completar perfil |
| `/auth/reset` | Existe | Recuperar contraseña |

### Área influencer (`/influencer/*`)

| Ruta | Estado | Propósito |
|---|---|---|
| `/influencer` | A migrar | Pantalla de inicio (redirige al swipe) |
| `/influencer/swipe` | **Por construir** | Feed estilo Tinder de campañas |
| `/influencer/postulaciones` | **Por construir** | Campañas a las que postuló y su estado |
| `/influencer/mensajes` | A migrar | Chats con marcas |
| `/influencer/perfil` | A migrar | Perfil unificado: incluye dashboard, ganancias, configuración, favoritos |

### Área marca (`/marca/*`)

| Ruta | Estado | Propósito |
|---|---|---|
| `/marca` | A migrar | Pantalla de inicio (redirige al dashboard) |
| `/marca/dashboard` | A migrar | Panel de control con resumen |
| `/marca/campanas` | A migrar | Listado de mis campañas |
| `/marca/campanas/crear` | **Por construir** | Wizard para crear campaña |
| `/marca/campanas/[id]/postulaciones` | **Por construir** | Quién postuló a esta campaña |
| `/marca/comparador` | A migrar | Comparar influencers lado a lado |
| `/marca/tendencias` | A migrar | Inteligencia de mercado |
| `/marca/mensajes` | A migrar | Chats con influencers |
| `/marca/pagos` | **Por construir** | Historial de pagos y facturación |

### Área compartida

| Ruta | Estado | Propósito |
|---|---|---|
| `/notificaciones` | **Por construir** | Centro unificado de notificaciones |
| `/configuracion` | **Por construir** | Ajustes de cuenta, notificaciones, eliminar cuenta |
| `/u/[id]` | A renombrar | Perfil público de influencer (hoy `/influencer/[id]`) |
| `/m/[id]` | A renombrar | Perfil público de marca (hoy `/marca/[id]`) |

### Páginas diferidas a v2

Panel de admin · Equipos de marca · Estadísticas avanzadas para influencer · Centro de ayuda

---

## Navegación

### Barra de Sofía (mobile, inferior, 5 elementos)

`Inicio` · `Notificaciones` · `Mensajes` · `Mis postulaciones` · `Mi perfil`

`Mi perfil` es una pantalla rica unificada estilo Instagram "Yo": contiene dashboard, ganancias, configuración, favoritos y accesos rápidos en una sola superficie.

### Sidebar de Carla (desktop, lateral, 7 elementos principales + secundarios)

**Principales:** `Dashboard` · `Mis campañas` · `Buscar influencers` · `Comparador` · `Mensajes` · `Notificaciones` · `Pagos`

**Secundarios:** `Favoritos`

### Punto de partida post-login

| Rol | Va a | Por qué |
|---|---|---|
| Sofía | `/influencer/swipe` | Acción inmediata, es el corazón de su producto |
| Carla | `/marca/dashboard` | Necesita ver el panorama antes de actuar |

### Atajos críticos

- Una campaña → sus postulaciones (1 clic)
- Un perfil de influencer → invitarlo a una campaña
- Un mensaje en el chat → ver el perfil del otro
- Una notificación de match → abrir el chat directamente
- Una tarjeta del swipe → ver el perfil de la marca de esa campaña

---

## Modelo de datos

Reachly se sostiene sobre las siguientes tablas en Supabase. Las flechas en la lista indican la dirección de la relación: "una entidad A tiene muchas B".

### Tablas existentes

- **`profiles`** — datos comunes del usuario: id, email, nombre, tipo (influencer o marca), foto, país.
- **`influencers`** — datos específicos del influencer: seguidores, engagement, categorías de contenido, edad, demografía de audiencia, tarifa orientativa, idiomas, frecuencia de publicación.
- **`brands`** — datos específicos de la marca: nombre de empresa, descripción, rubro.
- **`campaigns`** — campañas creadas por marcas: título, descripción, presupuesto, estado (borrador, activa, cerrada), seguidores mínimos requeridos.
- **`campaign_categories`** — categorías de campañas (Belleza, Moda, Tecnología, etc.).

### Tablas por construir

- **`redes_verificadas`** — cada red social que el influencer conecta y verifica (Instagram, TikTok, YouTube). Guarda: plataforma, identificador, método de verificación, snapshot de métricas.
- **`colaboraciones_previas`** — historial de colaboraciones que el influencer registra. Útil como señal de calidad para el algoritmo.
- **`swipes`** — cada vez que un influencer hace swipe sobre una campaña. **Se guardan los swipes en ambas direcciones** (izquierda y derecha) porque los rechazos son datos valiosos para el algoritmo.
- **`postulaciones`** — cuando el influencer postula activamente a una campaña pública. Estados: pendiente · aceptada · rechazada · retirada.
- **`invitaciones`** — cuando la marca invita activamente a un influencer a su campaña. Estados: enviada · aceptada · rechazada · expirada.
- **`matches`** — punto de unión cuando hay coincidencia (ya sea por aceptación de postulación o de invitación). Del match cuelgan el chat y el pago.
- **`mensajes`** — mensajes del chat. **Cada match tiene su propio chat aislado.** Si la misma marca contrata al mismo influencer en dos campañas distintas, son dos chats separados.
- **`pagos`** — flujo de dinero por match: monto bruto, comisión Reachly, monto neto al influencer, estado (retenido o liberado).
- **`notificaciones`** — centro unificado de notificaciones por usuario.
- **`favoritos`** — guardados de Sofía (campañas) y Carla (influencers).

---

## Stack técnico

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS 4
- **UI:** shadcn/ui + Base UI + lucide-react
- **Animaciones:** Framer Motion
- **Backend (BaaS):** Supabase (auth, base de datos PostgreSQL, storage)
- **Estado cliente:** Zustand
- **Despliegue:** Vercel

---

## Estado actual del proyecto

El proyecto está en una etapa de **consolidación arquitectónica**. La funcionalidad básica existe pero está construida bajo el modelo "una app con dos vistas", y debe migrarse al modelo "dos productos sobre un backend compartido" descrito en este documento.

### Trabajo prioritario por delante

1. **Refactor estructural de rutas.** Migrar `/dashboard/influencer/*` y `/dashboard/marca/*` a `/influencer/*` y `/marca/*`. Renombrar perfiles públicos (`/u/[id]`, `/m/[id]`) para evitar conflicto.
2. **Centralizar configuración de rutas.** Crear `lib/routes.ts` como única fuente de verdad para rutas públicas, de auth y privadas. Hoy esa lista está duplicada en `middleware.ts`, `Header.tsx` y `nav-links.ts`.
3. **Unificar la lógica de autenticación.** El `Nav.tsx` duplica lógica que ya vive en `useAuth.ts`. Hay que consolidar todo en el hook.
4. **Simetrizar la protección por rol.** Hoy `/dashboard/marca` está protegido contra influencers, pero `/dashboard/influencer` no está protegido contra marcas. Ambos deben tener protección equivalente.
5. **Eliminar el "rol por defecto".** El middleware asume que un usuario sin rol es influencer. Debe redirigir a una pantalla de "completar perfil" en su lugar.
6. **Construir las 7 páginas nuevas** detalladas en el [Mapa de páginas](#mapa-de-páginas).
7. **Construir las tablas de datos pendientes** detalladas en [Modelo de datos](#modelo-de-datos).

---

## Decisiones técnicas pendientes

Estas decisiones no bloquean el avance inmediato, pero deben resolverse antes de v1 público.

### Verificación de redes sociales

Cómo se verifican las cuentas de Instagram, TikTok y YouTube de los influencers. Opciones:

- **OAuth oficial** (Instagram Graph API, TikTok API): datos reales, requiere aprobación de Meta y TikTok (semanas o meses), gratis.
- **Bio code** (clásico): el influencer pone un código en su bio temporalmente. Verifica propiedad pero no métricas. Gratis y rápido de implementar.
- **Servicios de terceros** (Phyllo, HypeAuditor, Modash): API que entrega métricas verificadas. Caro por consulta.

**Sugerencia para v1:** combinar bio code (verifica propiedad) con métricas auto-reportadas por el influencer marcadas con disclaimer. Migrar a OAuth oficial o servicios pagos cuando haya tracción.

### Pasarela de pagos

Cómo se cobra a la marca, se retiene el monto, y se libera al influencer.

- **Stripe Connect:** estándar global, fricción mínima en algunos países LATAM por límites geográficos.
- **Mercado Pago Marketplace:** muy presente en LATAM, mejor cobertura local.
- **Modelo simple v1:** sin escrow real, solo retención manual con liberación a 7 días después de la publicación aprobada. Más simple de implementar.

### Algoritmo de matching

- **v1:** reglas simples (categoría coincidente + rango de seguidores + ubicación = score) son suficientes para empezar.
- **v2:** añadir machine learning con datos de swipes acumulados.

### Estructura de la primera campaña gratis

¿Es tiempo-limitada (un mes), feature-limitada (sin comparador), o ambas? Decisión de producto pendiente.

---

## Cómo correr el proyecto localmente

```bash
# Instalar dependencias
npm install

# Levantar entorno de desarrollo
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000) en el navegador.

### Variables de entorno requeridas

Crear un archivo `.env.local` en la raíz:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

---

## Despliegue

El proyecto se despliega automáticamente en Vercel al hacer push a la rama `main` del fork principal:

```bash
git push walter main
```

Vercel detecta el push y despliega en producción en `reachly-next.vercel.app`.

**Importante:** no hacer push hasta que el cambio esté validado y probado localmente.

---

*Última actualización: abril 2026.*
