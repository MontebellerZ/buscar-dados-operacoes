-- Habilita o suporte a chaves estrangeiras (importante no SQLite)
PRAGMA foreign_keys = ON;
-- Tabela de Operacoes
CREATE TABLE IF NOT EXISTS Operacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  issueId INTEGER NOT NULL UNIQUE,
  date TEXT NOT NULL,
  nomeCliente TEXT NOT NULL,
  nomeMotorista TEXT NOT NULL,
  cpfMotorista TEXT NOT NULL,
  origemDestino TEXT NOT NULL,
  placas TEXT NOT NULL,
  nf TEXT,
  pedido TEXT,
  qtdePlts TEXT,
  freteLiquido REAL,
  taxaMotorista REAL,
  validado INTEGER NOT NULL DEFAULT 0,
  ativo INTEGER NOT NULL DEFAULT 1,
  criadoEm TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- Trigger para atualizar automaticamente o campo 'atualizadoEm' na tabela Operacoes
CREATE TRIGGER IF NOT EXISTS update_operacoes_timestamp
AFTER
UPDATE ON Operacoes BEGIN
UPDATE Operacoes
SET atualizadoEm = CURRENT_TIMESTAMP
WHERE id = OLD.id;
END;