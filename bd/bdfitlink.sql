-- Adicionar coluna para status de completude nos treinos
ALTER TABLE "Treinos"
ADD COLUMN "Completo" BOOLEAN NOT NULL DEFAULT false;

-- Adicionar coluna para data de nascimento em Clientes
ALTER TABLE "Clientes"
ADD COLUMN "Data_Nascimento" DATE;

-- Adicionar coluna para altura em Clientes
ALTER TABLE "Clientes"
ADD COLUMN "Altura" DECIMAL;

-- Adicionar coluna para meta em Clientes
ALTER TABLE "Clientes"
ADD COLUMN "Meta" VARCHAR(255);