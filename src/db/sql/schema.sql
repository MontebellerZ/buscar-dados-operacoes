-- Habilita o suporte a chaves estrangeiras (importante no SQLite)
PRAGMA foreign_keys = ON;
-- Tabela de Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  senha TEXT NOT NULL,
  -- Colunas padrão
  ativo INTEGER NOT NULL DEFAULT 0,
  criadoEm TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  criadoPor INTEGER,
  atualizadoPor INTEGER,
  FOREIGN KEY (criadoPor) REFERENCES Usuarios(id),
  FOREIGN KEY (atualizadoPor) REFERENCES Usuarios(id)
);
-- Tabela de Operacoes
CREATE TABLE IF NOT EXISTS Operacoes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL UNIQUE,
  issueId INTEGER NOT NULL UNIQUE,
  date TEXT NOT NULL,
  -- Formato recomendado: YYYY-MM-DD
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
  -- Colunas padrão
  ativo INTEGER NOT NULL DEFAULT 1,
  criadoEm TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  atualizadoEm TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  criadoPor INTEGER,
  atualizadoPor INTEGER,
  FOREIGN KEY (criadoPor) REFERENCES Usuarios(id),
  FOREIGN KEY (atualizadoPor) REFERENCES Usuarios(id)
);
-- Trigger para atualizar automaticamente o campo 'atualizadoEm' na tabela Usuarios
CREATE TRIGGER IF NOT EXISTS update_usuarios_timestamp
AFTER
UPDATE ON Usuarios BEGIN
UPDATE Usuarios
SET atualizadoEm = CURRENT_TIMESTAMP
WHERE id = OLD.id;
END;
-- Trigger para atualizar automaticamente o campo 'atualizadoEm' na tabela Operacoes
CREATE TRIGGER IF NOT EXISTS update_operacoes_timestamp
AFTER
UPDATE ON Operacoes BEGIN
UPDATE Operacoes
SET atualizadoEm = CURRENT_TIMESTAMP
WHERE id = OLD.id;
END;