-- Reachly — seed idempotente para poblar la DB con los mismos datos que lib/mocks.ts
--
-- Cómo correrlo:
--   psql "$DATABASE_URL" -f supabase/seed.sql
-- o desde el dashboard de Supabase → SQL Editor → pegar este archivo.
--
-- Requisitos previos (los users de auth NO se crean desde SQL puro):
--   1. Crear los users en Supabase Auth (dashboard → Authentication → Add user)
--      usando los UUIDs fijos que aparecen abajo, o
--   2. Si corres Supabase local, los FKs a auth.users no se aplican estrictamente
--      y este seed funcionará directo.
--
-- Demo logins sugeridos (para probar /mensajes end-to-end):
--   demo-influencer@reachly.app  →  UUID 00000000-0000-0000-0000-000000000101
--   demo-marca@reachly.app        →  UUID 00000000-0000-0000-0000-000000000201
--
-- Este seed es idempotente: correrlo 2 veces no duplica filas.

-- ============================================================
-- 1. Categorías de campaña
-- ============================================================
INSERT INTO campaign_categories (id, name) VALUES
  (1, 'Moda'),
  (2, 'Fitness'),
  (3, 'Tech'),
  (4, 'Gastronomía'),
  (5, 'Viajes'),
  (6, 'Gaming'),
  (7, 'Belleza'),
  (8, 'Lifestyle')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 2. Profiles (15 influencers + 6 marcas)
-- Las columnas asumidas: id uuid, nombre text, bio text, ubicacion text,
-- categorias text[], redes jsonb, tipo text ('influencer'|'marca')
-- ============================================================
INSERT INTO profiles (id, nombre, bio, ubicacion, categorias, tipo) VALUES
  -- Influencers
  ('00000000-0000-0000-0000-000000000101', 'Camila Rojas',       'Editora de moda y amante del streetwear latino.', 'Santiago, Chile',         ARRAY['Moda'],         'influencer'),
  ('00000000-0000-0000-0000-000000000102', 'Benjamín Torres',    'Entrenador personal certificado.',                 'Valparaíso, Chile',       ARRAY['Fitness'],      'influencer'),
  ('00000000-0000-0000-0000-000000000103', 'Valentina Paredes',  'Cocinera casera. Recetas chilenas.',               'Concepción, Chile',       ARRAY['Gastronomía'],  'influencer'),
  ('00000000-0000-0000-0000-000000000104', 'Diego Fuentes',      'Reviews de hardware y software.',                  'Ciudad de México, México',ARRAY['Tech'],         'influencer'),
  ('00000000-0000-0000-0000-000000000105', 'Antonia Silva',      'Viajera full-time.',                               'Buenos Aires, Argentina', ARRAY['Viajes'],       'influencer'),
  ('00000000-0000-0000-0000-000000000106', 'Martín Vargas',      'Streamer de FPS y estrategia.',                    'Lima, Perú',              ARRAY['Gaming'],       'influencer'),
  ('00000000-0000-0000-0000-000000000107', 'Sofía Ramírez',      'Moda sostenible y second-hand.',                   'Bogotá, Colombia',        ARRAY['Moda'],         'influencer'),
  ('00000000-0000-0000-0000-000000000108', 'Matías López',       'Running y triatlón.',                              'Santiago, Chile',         ARRAY['Fitness'],      'influencer'),
  ('00000000-0000-0000-0000-000000000109', 'Isidora Muñoz',      'Pastelería artesanal y masa madre.',               'Viña del Mar, Chile',     ARRAY['Gastronomía'],  'influencer'),
  ('00000000-0000-0000-0000-000000000110', 'Felipe Castro',      'Dev y entusiasta de la productividad.',            'Santiago, Chile',         ARRAY['Tech'],         'influencer'),
  ('00000000-0000-0000-0000-000000000111', 'Javiera Morales',    'Mochilera low-cost.',                              'São Paulo, Brasil',       ARRAY['Viajes'],       'influencer'),
  ('00000000-0000-0000-0000-000000000112', 'Tomás Herrera',      'Gameplays de lanzamientos triple A.',              'Ciudad de México, México',ARRAY['Gaming'],       'influencer'),
  ('00000000-0000-0000-0000-000000000113', 'Constanza Pérez',    'Inclusive fashion y body positivity.',             'Santiago, Chile',         ARRAY['Moda'],         'influencer'),
  ('00000000-0000-0000-0000-000000000114', 'Rodrigo Aguilar',    'Crossfit y calistenia.',                           'Medellín, Colombia',      ARRAY['Fitness'],      'influencer'),
  ('00000000-0000-0000-0000-000000000115', 'Francisca Navarro',  'Mujeres en tech.',                                 'Santiago, Chile',         ARRAY['Tech'],         'influencer'),
  -- Marcas
  ('00000000-0000-0000-0000-000000000201', 'Movistar',       NULL, 'Santiago, Chile', ARRAY['Tech','Lifestyle'],    'marca'),
  ('00000000-0000-0000-0000-000000000202', 'Falabella',      NULL, 'Santiago, Chile', ARRAY['Moda','Lifestyle'],    'marca'),
  ('00000000-0000-0000-0000-000000000203', 'Sodimac',        NULL, 'Santiago, Chile', ARRAY['Lifestyle','Viajes'],  'marca'),
  ('00000000-0000-0000-0000-000000000204', 'Mercado Libre',  NULL, 'Buenos Aires, Argentina', ARRAY['Tech','Moda'], 'marca'),
  ('00000000-0000-0000-0000-000000000205', 'Cencosud',       NULL, 'Santiago, Chile', ARRAY['Gastronomía','Lifestyle'], 'marca'),
  ('00000000-0000-0000-0000-000000000206', 'LATAM Airlines', NULL, 'Santiago, Chile', ARRAY['Viajes','Lifestyle'],  'marca')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 3. Influencers
-- ============================================================
INSERT INTO influencers (id, profile_id, full_name, bio, location, followers_count, engagement_rate) VALUES
  (101, '00000000-0000-0000-0000-000000000101', 'Camila Rojas',      'Editora de moda y amante del streetwear latino.', 'Santiago, Chile',         890000, 5.8),
  (102, '00000000-0000-0000-0000-000000000102', 'Benjamín Torres',   'Entrenador personal certificado.',                 'Valparaíso, Chile',       345000, 7.2),
  (103, '00000000-0000-0000-0000-000000000103', 'Valentina Paredes', 'Cocinera casera.',                                 'Concepción, Chile',       215000, 6.4),
  (104, '00000000-0000-0000-0000-000000000104', 'Diego Fuentes',     'Reviews de hardware y software.',                  'Ciudad de México, México',520000, 4.9),
  (105, '00000000-0000-0000-0000-000000000105', 'Antonia Silva',     'Viajera full-time.',                               'Buenos Aires, Argentina', 180000, 8.1),
  (106, '00000000-0000-0000-0000-000000000106', 'Martín Vargas',     'Streamer de FPS y estrategia.',                    'Lima, Perú',              720000, 6.8),
  (107, '00000000-0000-0000-0000-000000000107', 'Sofía Ramírez',     'Moda sostenible y second-hand.',                   'Bogotá, Colombia',         95000, 9.2),
  (108, '00000000-0000-0000-0000-000000000108', 'Matías López',      'Running y triatlón.',                              'Santiago, Chile',          68000, 5.3),
  (109, '00000000-0000-0000-0000-000000000109', 'Isidora Muñoz',     'Pastelería artesanal.',                            'Viña del Mar, Chile',     430000, 6.0),
  (110, '00000000-0000-0000-0000-000000000110', 'Felipe Castro',     'Dev y productividad.',                             'Santiago, Chile',         145000, 4.2),
  (111, '00000000-0000-0000-0000-000000000111', 'Javiera Morales',   'Mochilera low-cost.',                              'São Paulo, Brasil',       310000, 7.5),
  (112, '00000000-0000-0000-0000-000000000112', 'Tomás Herrera',     'Gameplays triple A.',                              'Ciudad de México, México',1200000, 3.8),
  (113, '00000000-0000-0000-0000-000000000113', 'Constanza Pérez',   'Inclusive fashion.',                               'Santiago, Chile',          42000, 8.7),
  (114, '00000000-0000-0000-0000-000000000114', 'Rodrigo Aguilar',   'Crossfit y calistenia.',                           'Medellín, Colombia',      560000, 5.9),
  (115, '00000000-0000-0000-0000-000000000115', 'Francisca Navarro', 'Mujeres en tech.',                                 'Santiago, Chile',         260000, 6.7)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 4. Brands
-- ============================================================
INSERT INTO brands (id, profile_id, company_name, description) VALUES
  (201, '00000000-0000-0000-0000-000000000201', 'Movistar',       'Telco líder en LATAM. Buscamos creadores que cuenten historias auténticas sobre conexión, tecnología y vida digital.'),
  (202, '00000000-0000-0000-0000-000000000202', 'Falabella',      'Retail con presencia en 7 países. Colaboramos con influencers de moda, hogar y tecnología para campañas estacionales.'),
  (203, '00000000-0000-0000-0000-000000000203', 'Sodimac',        'Mejoramiento del hogar. Proyectos DIY, jardín y soluciones prácticas con comunidad.'),
  (204, '00000000-0000-0000-0000-000000000204', 'Mercado Libre',  'E-commerce #1 de LATAM. Campañas de alto alcance en 18 países.'),
  (205, '00000000-0000-0000-0000-000000000205', 'Cencosud',       'Holding retail con Jumbo, Paris, Easy. Foco en gastronomía y lifestyle.'),
  (206, '00000000-0000-0000-0000-000000000206', 'LATAM Airlines', 'Aerolínea regional. Colaboraciones para contenido de viaje y descubrimiento.')
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 5. Campañas
-- ============================================================
INSERT INTO campaigns (id, brand_id, category_id, title, description, budget_range, status, min_followers) VALUES
  (301, 201, 3, 'Conexión sin límites',            'Creadores de tech y lifestyle para contar cómo usan 5G en su día a día.',          '$2K-$5K USD',  'activa',   100000),
  (302, 202, 1, 'Colección primavera 2026',        'Busco editoras de moda para lookbook de la nueva colección.',                      '$3K-$8K USD',  'activa',   150000),
  (303, 203, 8, 'Proyectos DIY verano',            'Creadores de lifestyle que muestren renovaciones chicas en casa.',                 '$1K-$3K USD',  'activa',    50000),
  (304, 204, 3, 'Compra segura en ML',             'Testimoniales auténticos de compras en la plataforma.',                            '$500-$2K USD', 'activa',    30000),
  (305, 205, 4, 'Recetas Jumbo',                   'Chefs caseros con recetas usando productos de Jumbo.',                             '$1K-$3K USD',  'activa',    80000),
  (306, 206, 5, 'Descubre tu próximo destino',     'Creadores de viajes para contenido sobre rutas LATAM.',                            '$2K-$6K USD',  'activa',   100000),
  (307, 201, 3, 'Q2 Gaming partnership',           'Streamers de gaming para torneo patrocinado.',                                      '$4K-$10K USD', 'borrador',  300000),
  (308, 202, 1, 'Campaña día de la madre 2025',    'Campaña cerrada. Resultados disponibles a solicitud.',                             '$5K-$12K USD', 'cerrada',  200000)
ON CONFLICT (id) DO NOTHING;

-- ============================================================
-- 6. Mensajes demo (entre demo-influencer@ y demo-marca@)
-- Asume tabla messages con columnas: id, sender_id, recipient_id, content, created_at
-- Ajustar nombres de columnas si el esquema difiere.
-- ============================================================
INSERT INTO messages (sender_id, recipient_id, content) VALUES
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'Hola Camila, vimos tu perfil y nos encantaría trabajar contigo en la campaña de primavera.'),
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000201', '¡Hola! Me interesa, ¿me puedes compartir el brief?'),
  ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101', 'Por supuesto, te lo mando hoy más tarde.')
ON CONFLICT DO NOTHING;
