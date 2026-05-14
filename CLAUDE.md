# Contexto del proyecto para Claude Code

@AGENTS.md

Este archivo le da contexto completo a Claude Code sobre el estado, la visión y las decisiones arquitectónicas de Reachly. Léelo antes de hacer cualquier cambio.

---

## Qué es Reachly

Plataforma CHILENA (nunca escribir en argentino) de matching algorítmico entre marcas e influencers de LATAM. "Tinder profesional" donde el match lo decide la data, no un humano con sesgos. Sin agencias intermediarias.

**Modelo de negocio:** comisión por campaña cerrada + suscripción para marcas + freemium. Influencers usan gratis.

---

## Decisión arquitectónica central: dos productos, no uno

Reachly NO es una sola app con dos vistas. Son dos productos visualmente y funcionalmente distintos sobre un mismo backend Supabase. Esta decisión es **inviolable** y debe respetarse en todo refactor o feature nueva.

| Lado | Producto influencer (Sofía) | Producto marca (Carla) |
|---|---|---|
| Plataforma | Mobile-first | Desktop-first |
| Estilo UI | Tinder/TikTok: swipe, vertical | LinkedIn/Notion: tabular, denso |
| Acceso | Gratis | Comisión + suscripción |
| Inicio post-login | Feed swipe | Dashboard |

**Implicación:** las páginas con misma "función" en ambos roles (mensajes, campañas, perfil) son **componentes independientes**, no un componente con condicionales. Mismo concepto, dos productos.

---

## Estructura objetivo de rutas

La estructura de rutas ya fue migrada de `/dashboard/[rol]/*` a `/[rol]/*` (refactor estructural completado). Ningún rol es el "default" — ambos son áreas hermanas simétricas. El árbol siguiente es la estructura vigente (las rutas marcadas POR CONSTRUIR aún no existen).

```
app/
├── (público)
│   ├── page.tsx                    ← landing
│   ├── sobre-nosotros/
│   ├── contacto/
│   ├── terminos/, privacidad/, cookies/, gdpr/
│   ├── blog/, prensa/, careers/    ← placeholders
│   └── u/[id]/, m/[id]/            ← perfiles públicos (renombrados desde /influencer/[id] y /marca/[id])
│
├── (auth)
│   ├── login/
│   ├── registro/
│   ├── onboarding/
│   └── auth/reset/
│
├── influencer/                     ← área completa de Sofía
│   ├── page.tsx                    ← redirige a swipe
│   ├── swipe/                      ← POR CONSTRUIR
│   ├── postulaciones/              ← POR CONSTRUIR
│   ├── mensajes/
│   └── perfil/                     ← unificada: incluye dashboard, ganancias, configuración, favoritos
│
├── marca/                          ← área completa de Carla
│   ├── page.tsx                    ← redirige a dashboard
│   ├── dashboard/
│   ├── campanas/
│   │   ├── page.tsx                ← listado
│   │   ├── crear/                  ← POR CONSTRUIR (wizard)
│   │   └── [id]/postulaciones/     ← POR CONSTRUIR
│   ├── comparador/
│   ├── tendencias/
│   ├── mensajes/
│   ├── pagos/                      ← POR CONSTRUIR
│   └── favoritos/                  ← elemento secundario en sidebar
│
└── (compartido privado)
    ├── notificaciones/             ← POR CONSTRUIR
    └── configuracion/              ← POR CONSTRUIR
```

---

## Modelo de datos

### Tablas existentes en Supabase

`profiles`, `influencers`, `brands`, `campaigns`, `campaign_categories`

### Tablas por construir (orden sugerido)

1. **`redes_verificadas`** — cuentas sociales conectadas y verificadas por influencer
2. **`colaboraciones_previas`** — historial de colabs registradas por el influencer
3. **`swipes`** — todos los swipes (izquierda y derecha) para alimentar el algoritmo
4. **`postulaciones`** — flujo activo influencer → campaña pública
5. **`invitaciones`** — flujo activo marca → influencer
6. **`matches`** — punto de unión cuando hay coincidencia
7. **`mensajes`** — chat aislado por match (NO por persona)
8. **`pagos`** — flujo de dinero por match con escrow ligero
9. **`notificaciones`** — centro unificado por usuario
10. **`favoritos`** — guardados (campañas para influencer, influencers para marca)

### Decisiones de modelo importantes

- **Mensajes ligados al match, no a las personas.** Si la misma marca contrata al mismo influencer dos veces, son dos chats separados.
- **Swipes guardados en ambas direcciones.** Los rechazos son datos valiosos para el algoritmo.
- **Perfil de influencer nivel medio + métricas históricas + colaboraciones previas.** Suficiente para matching diferenciador sin matar el onboarding.

---

## Trabajo pendiente prioritario

### Refactor estructural — ✅ COMPLETADO (en producción)

El refactor estructural está terminado y desplegado. Las features nuevas
ya están desbloqueadas. Lo ejecutado:

1. ✅ **`lib/routes.ts`** creado como única fuente de verdad para rutas
   públicas, auth y privadas.
2. ✅ **Auth unificada en `useAuth.ts`.** Eliminado el bloque duplicado
   de consulta de usuario en `Nav.tsx`.
3. ✅ **Protección por rol simetrizada en `middleware.ts`** vía
   `enforceRoleArea`. Ambas áreas de rol tienen gating equivalente.
4. ✅ **Eliminado el "rol por defecto"** (`?? 'influencer'`). El tipo se
   persiste a `user_metadata` y `profiles` en el onboarding.
5. ✅ **Rutas migradas** de `/dashboard/[rol]/*` a `/[rol]/*`. Perfiles
   públicos renombrados a `/u/[id]` y `/m/[id]`. Las rutas con conflicto
   de roles (`/mensajes`, `/perfil`, `/favoritos`) segregadas por área
   en el sub-refactor 5d: `/marca/*` e `/influencer/*` con componentes
   compartidos (`MessagesView`, `PerfilEditor`) más wrappers thin.
   Favoritos quedó asimétrico — `/marca/favoritos` es ruta propia,
   las campañas guardadas de Sofía viven como tab en `/influencer/perfil`.

Ver `BACKLOG.md` para deuda técnica conocida y bugs pendientes
detectados durante los smoke tests del refactor.

### Páginas por construir (en orden de prioridad)

1. `/influencer/swipe` — feed estilo Tinder
2. `/marca/campanas/crear` — wizard de creación
3. `/marca/campanas/[id]/postulaciones` — vista de postulantes
4. `/influencer/postulaciones` — historial de Sofía
5. `/notificaciones` — centro unificado
6. `/configuracion` — ajustes de cuenta
7. `/marca/pagos` — historial de pagos

---

## Convenciones de código

### Para todo cambio nuevo

- **Respetar la separación de productos.** Si vas a tocar algo del flujo de influencer, no asumas que aplica a marca, y viceversa. Pregunta si tienes duda.
- **Usar `lib/routes.ts`** una vez creado. No duplicar listas de rutas.
- **Usar `useAuth.ts`** para cualquier lógica de autenticación en cliente. No reimplementar.
- **Tipos en `types/`.** Cualquier entidad nueva (Postulacion, Match, Mensaje, Pago, etc.) debe tener su archivo de tipos.
- **API en `lib/api.ts`.** Las funciones que consultan Supabase viven ahí. Mantener el patrón de fallback a mocks (ya implementado para influencers, campañas y marcas).

### Stack confirmado

- Next.js 16 App Router
- TypeScript
- Tailwind CSS 4 + shadcn/ui + Base UI + lucide-react
- Framer Motion para animaciones
- Supabase para auth, DB y storage
- Zustand para estado cliente
- Despliegue en Vercel

### Reglas de Next.js 16

Como dice `AGENTS.md`: **esta no es la versión de Next.js que conoces de memoria**. Antes de escribir código que use APIs específicas de Next.js, leer la documentación relevante en `node_modules/next/dist/docs/`.

---

## Decisiones técnicas pendientes (NO bloquean dev pero hay que resolver)

1. **Verificación de redes sociales:** OAuth oficial vs bio code vs servicios de terceros (Phyllo, HypeAuditor). Recomendación inicial: bio code + métricas auto-reportadas con disclaimer.
2. **Pasarela de pagos:** Stripe Connect vs Mercado Pago Marketplace vs modelo simple sin escrow real (retención manual con liberación a 7 días).
3. **Algoritmo de matching:** v1 con reglas simples (categoría + rango seguidores + ubicación), v2 con ML usando datos de swipes acumulados.
4. **Estructura del freemium:** ¿tiempo limitado, feature limitada, o ambas?

---

## Despliegue

Para subir cambios al fork de Walter (https://github.com/walterbjv/reachly-next) y que se vean en https://reachly-next.vercel.app, usar siempre:

```
git push origin main
```

Vercel despliega automáticamente al recibir el push. **No hacer push hasta que el usuario lo pida explícitamente.**