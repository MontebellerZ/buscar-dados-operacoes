-- CreateTable
CREATE TABLE "Operacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "key" TEXT NOT NULL,
    "issueId" INTEGER NOT NULL,
    "date" DATETIME NOT NULL,
    "nomeCliente" TEXT NOT NULL,
    "nomeMotorista" TEXT NOT NULL,
    "cpfMotorista" TEXT NOT NULL,
    "origemDestino" TEXT NOT NULL,
    "placas" TEXT NOT NULL,
    "nf" TEXT,
    "pedido" TEXT,
    "qtdePlts" TEXT,
    "freteLiquido" REAL,
    "taxaMotorista" REAL,
    "validado" BOOLEAN NOT NULL DEFAULT false,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RunsAutomacao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "automacao" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "Operacao_key_key" ON "Operacao"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Operacao_issueId_key" ON "Operacao"("issueId");
