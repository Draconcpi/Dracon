-- ================================================================
-- Dragon Eyes / Constellation — Tables + Seed Data
-- Execute this in the Neon SQL Editor
-- ================================================================

-- 1) Create Tables
CREATE TABLE IF NOT EXISTS "constellation_characters" (
    "id" TEXT NOT NULL,
    "charId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#a855f4',
    "cx" DOUBLE PRECISION NOT NULL DEFAULT 400,
    "cy" DOUBLE PRECISION NOT NULL DEFAULT 200,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "constellation_characters_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "constellation_lines" (
    "id" TEXT NOT NULL,
    "fromId" TEXT NOT NULL,
    "toId" TEXT NOT NULL,
    CONSTRAINT "constellation_lines_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "constellation_lore" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "chapter" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "constellation_lore_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "constellation_gallery" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT,
    "accent" TEXT NOT NULL DEFAULT '#a855f4',
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "constellation_gallery_pkey" PRIMARY KEY ("id")
);

-- 2) Indexes
CREATE UNIQUE INDEX IF NOT EXISTS "constellation_characters_charId_key" ON "constellation_characters"("charId");
CREATE UNIQUE INDEX IF NOT EXISTS "constellation_lines_fromId_toId_key" ON "constellation_lines"("fromId", "toId");

-- 3) Foreign Keys
ALTER TABLE "constellation_lines"
  ADD CONSTRAINT "constellation_lines_fromId_fkey"
  FOREIGN KEY ("fromId") REFERENCES "constellation_characters"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "constellation_lines"
  ADD CONSTRAINT "constellation_lines_toId_fkey"
  FOREIGN KEY ("toId") REFERENCES "constellation_characters"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- ================================================================
-- 4) Seed Data — Characters
-- ================================================================
INSERT INTO "constellation_characters" ("id", "charId", "name", "role", "description", "color", "cx", "cy", "imageUrl", "order", "active", "updatedAt")
VALUES
  ('char_lyra',   'lyra',   'Lyra',   'A Vidente Estelar',         'Nascida sob a chuva de meteoros de Aldebaran, Lyra enxerga os fios do destino entrelaçados nas estrelas. Seus olhos refletem constelações que outros não podem ver.', '#a855f4', 200, 120, NULL, 0, true, CURRENT_TIMESTAMP),
  ('char_ignis',  'ignis',  'Ignis',  'O Guardião do Fogo Arcano', 'Forjado nas chamas primordiais, Ignis carrega dentro de si o fogo que deu origem ao primeiro sol. Seu olhar pode derreter aço e iluminar as trevas mais profundas.', '#f97316', 400, 80,  NULL, 1, true, CURRENT_TIMESTAMP),
  ('char_nyx',    'nyx',    'Nyx',    'A Sombra Silenciosa',       'Filha da noite eterna, Nyx se move entre dimensões como uma brisa gelada. Suas asas escuras carregam segredos que nem os deuses se atrevem a pronunciar.', '#6366f1', 600, 150, NULL, 2, true, CURRENT_TIMESTAMP),
  ('char_aurion', 'aurion', 'Aurion', 'O Cavaleiro Celestial',     'Último descendente dos Cavaleiros de Orion, Aurion porta a espada que corta entre realidades. Jurou proteger o equilíbrio entre luz e escuridão.', '#eab308', 300, 260, NULL, 3, true, CURRENT_TIMESTAMP),
  ('char_seraph', 'seraph', 'Seraph', 'O Dragão Ancestral',        'O mais antigo dos seres mágicos, Seraph testemunhou o nascimento e a morte de incontáveis estrelas. Seus olhos — os Dragon Eyes — são a chave para todo o poder cósmico.', '#ef4444', 500, 300, NULL, 4, true, CURRENT_TIMESTAMP),
  ('char_elara',  'elara',  'Elara',  'A Curandeira das Raízes',   'Conectada ao coração da terra, Elara canaliza a energia vital das raízes antigas. Onde ela pisa, flores nascem — onde ela chora, florestas inteiras despertam.', '#22c55e', 150, 310, NULL, 5, true, CURRENT_TIMESTAMP),
  ('char_zephyr', 'zephyr', 'Zephyr', 'O Mensageiro dos Ventos',   'Rápido como o pensamento, Zephyr percorre os céus carregando mensagens entre os reinos. Dizem que ele sussurra profecias ao ouvido de quem está prestes a mudar o mundo.', '#06b6d4', 700, 240, NULL, 6, true, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- ================================================================
-- 5) Seed Data — Constellation Lines
-- ================================================================
INSERT INTO "constellation_lines" ("id", "fromId", "toId")
VALUES
  ('line_01', 'char_lyra',   'char_ignis'),
  ('line_02', 'char_ignis',  'char_nyx'),
  ('line_03', 'char_lyra',   'char_aurion'),
  ('line_04', 'char_ignis',  'char_aurion'),
  ('line_05', 'char_ignis',  'char_seraph'),
  ('line_06', 'char_nyx',    'char_seraph'),
  ('line_07', 'char_nyx',    'char_zephyr'),
  ('line_08', 'char_aurion', 'char_seraph'),
  ('line_09', 'char_aurion', 'char_elara'),
  ('line_10', 'char_elara',  'char_seraph'),
  ('line_11', 'char_seraph', 'char_zephyr')
ON CONFLICT ("id") DO NOTHING;

-- ================================================================
-- 6) Seed Data — Lore
-- ================================================================
INSERT INTO "constellation_lore" ("id", "title", "text", "chapter", "order", "updatedAt")
VALUES
  ('lore_01', 'A Origem',                  'No princípio, antes do tempo ter nome, existiam apenas os Olhos do Dragão — sete estrelas primordiais que observavam o vazio infinito. Cada estrela carregava dentro de si uma centelha de consciência, um fragmento de poder que moldaria toda a existência.', 1, 0, CURRENT_TIMESTAMP),
  ('lore_02', 'O Despertar',               'Quando a primeira estrela piscou, o universo tremeu. A energia liberada criou as primeiras formas de vida — seres feitos de luz e sombra, conectados às estrelas por fios invisíveis de magia. Esses seres se tornaram os guardiões do equilíbrio cósmico.', 2, 1, CURRENT_TIMESTAMP),
  ('lore_03', 'A Guerra das Constelações', 'Mas o poder atrai ambição. Uma entidade do vazio, conhecida apenas como O Eclipse, tentou devorar os Dragon Eyes para reescrever a realidade. Os guardiões se uniram na Constelação do Dragão — uma formação lendária que canaliza o poder combinado de todas as estrelas.', 3, 2, CURRENT_TIMESTAMP),
  ('lore_04', 'O Legado',                  'A guerra não teve vencedor — apenas sobreviventes. Os guardiões se espalharam pelos reinos, cada um carregando a memória de sua estrela. Dizem que quando os sete se reencontrarem, a Constelação do Dragão brilhará novamente e o destino do cosmos será decidido.', 4, 3, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- ================================================================
-- 7) Seed Data — Gallery
-- ================================================================
INSERT INTO "constellation_gallery" ("id", "title", "imageUrl", "accent", "order", "updatedAt")
VALUES
  ('gal_01', 'Conceito — Constelação do Dragão', NULL, '#a855f4', 0, CURRENT_TIMESTAMP),
  ('gal_02', 'Estudo — Olhos de Seraph',         NULL, '#ef4444', 1, CURRENT_TIMESTAMP),
  ('gal_03', 'Cena — O Despertar',               NULL, '#f97316', 2, CURRENT_TIMESTAMP),
  ('gal_04', 'Conceito — Floresta de Elara',     NULL, '#22c55e', 3, CURRENT_TIMESTAMP),
  ('gal_05', 'Cena — Guerra das Constelações',   NULL, '#6366f1', 4, CURRENT_TIMESTAMP),
  ('gal_06', 'Estudo — Lâmina de Aurion',        NULL, '#eab308', 5, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;
