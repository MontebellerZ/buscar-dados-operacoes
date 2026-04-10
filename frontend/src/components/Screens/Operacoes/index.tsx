import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import {
  IoEllipsisHorizontalSharp,
  IoEyeOutline,
  IoPlayOutline,
  IoTrashOutline,
} from "react-icons/io5";
import type { TOperacao } from "../../../types/operacao.type";
import OperacaoService from "../../../services/operacao.service";
import AutomacaoService from "../../../services/automacao.service";
import TabelaStorage from "../../../stores/store/tabela.store";
import styles from "./styles.module.scss";

const TABLE_KEY = "operacoes";
const DEFAULT_COLUMNS = ["key", "date", "nomeCliente", "nomeMotorista", "origemDestino", "lucro"];

const COLUMN_DEFS: Array<{ key: string; label: string }> = [
  { key: "key", label: "Key" },
  { key: "date", label: "Data" },
  { key: "nomeCliente", label: "Cliente" },
  { key: "nomeMotorista", label: "Motorista" },
  { key: "cpfMotorista", label: "CPF Motorista" },
  { key: "origemDestino", label: "Origem/Destino" },
  { key: "placas", label: "Placas" },
  { key: "nf", label: "NF" },
  { key: "pedido", label: "Pedido" },
  { key: "qtdePlts", label: "Qtde PLTs" },
  { key: "freteLiquido", label: "Frete Líquido" },
  { key: "taxaMotorista", label: "Taxa Motorista" },
  { key: "lucro", label: "Lucro" },
  { key: "validado", label: "Validado" },
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  dateStyle: "short",
  timeStyle: "short",
});

function parseDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return dateFormatter.format(date);
}

function renderCell(operacao: TOperacao, columnKey: string) {
  const value = operacao[columnKey as keyof TOperacao];

  if (columnKey === "date") {
    return parseDate(value as string | Date);
  }

  if (["freteLiquido", "taxaMotorista", "lucro"].includes(columnKey)) {
    if (typeof value !== "number") return "-";
    return currencyFormatter.format(value);
  }

  if (columnKey === "validado") {
    return value ? "Sim" : "Não";
  }

  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
}

function Operacoes() {
  const navigate = useNavigate();
  const { id } = useParams();
  const columnSelectorRef = useRef<HTMLDivElement | null>(null);

  const [operacoes, setOperacoes] = useState<TOperacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningAutomation, setIsRunningAutomation] = useState(false);
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [deleteCandidate, setDeleteCandidate] = useState<TOperacao | null>(null);
  const [columns, setColumns] = useState<string[]>(
    () => TabelaStorage.getByTabela(TABLE_KEY) || DEFAULT_COLUMNS,
  );

  const selectedOperacao = useMemo(() => {
    if (!id) return null;
    const parsedId = Number(id);
    if (!Number.isFinite(parsedId)) return null;
    return operacoes.find((item) => item.id === parsedId) || null;
  }, [id, operacoes]);

  const visibleColumns = useMemo(() => {
    const uniqueColumns = Array.from(new Set(columns));
    return uniqueColumns.filter((column) => COLUMN_DEFS.some((col) => col.key === column));
  }, [columns]);

  const loadLastAutomationRun = async () => {
    return AutomacaoService.GetLastByNome("operacoesAtlassian")
      .then((data) => setLastRunAt(data?.criadoEm ?? null))
      .catch(() => setLastRunAt(null));
  };

  useEffect(() => {
    let isMounted = true;

    OperacaoService.GetAll()
      .then((data) => {
        if (isMounted) setOperacoes(data);
      })
      .catch((err) => toast.error(err?.toString?.() || "Erro ao buscar operações."))
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    AutomacaoService.GetLastByNome("operacoesAtlassian")
      .then((data) => {
        if (isMounted) setLastRunAt(data?.criadoEm ?? null);
      })
      .catch(() => {
        if (isMounted) setLastRunAt(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    TabelaStorage.saveByTabela(TABLE_KEY, visibleColumns.length ? visibleColumns : DEFAULT_COLUMNS);
  }, [visibleColumns]);

  useEffect(() => {
    if (!isColumnMenuOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!columnSelectorRef.current?.contains(event.target as Node)) {
        setIsColumnMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isColumnMenuOpen]);

  const toggleColumn = (columnKey: string) => {
    setColumns((prev) => {
      if (prev.includes(columnKey)) {
        const next = prev.filter((item) => item !== columnKey);
        return next.length ? next : DEFAULT_COLUMNS;
      }

      return [...prev, columnKey];
    });
  };

  const runAutomation = async () => {
    setIsRunningAutomation(true);

    return AutomacaoService.OperacoesAtlassian()
      .then((data) => {
        setOperacoes(data);
        toast.success("Automação executada com sucesso.");
        return loadLastAutomationRun();
      })
      .catch((err) => toast.error(err?.toString?.() || "Erro ao executar automação."))
      .finally(() => setIsRunningAutomation(false));
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;

    return OperacaoService.Delete(deleteCandidate.id)
      .then(() => {
        setOperacoes((prev) => prev.filter((item) => item.id !== deleteCandidate.id));
        toast.success("Operação excluída com sucesso.");
        if (selectedOperacao?.id === deleteCandidate.id) {
          navigate("/main/operacoes");
        }
      })
      .catch((err) => toast.error(err?.toString?.() || "Erro ao excluir operação."))
      .finally(() => setDeleteCandidate(null));
  };

  return (
    <section className={styles.page}>
      <header className={styles.header}>
        <div>
          <h1>Operações</h1>
          <p>
            Última execução da automação <strong>operacoesAtlassian</strong>:{" "}
            {lastRunAt ? parseDate(lastRunAt) : "Ainda não executada"}
          </p>
        </div>

        <div className={styles.headerActions}>
          <button type="button" onClick={runAutomation} disabled={isRunningAutomation}>
            <IoPlayOutline />
            {isRunningAutomation ? "Executando..." : "Rodar automação"}
          </button>
        </div>
      </header>

      {selectedOperacao && (
        <article className={styles.detailCard}>
          <div>
            <h2>Operação {selectedOperacao.key}</h2>
            <p>Cliente: {selectedOperacao.nomeCliente}</p>
            <p>Motorista: {selectedOperacao.nomeMotorista}</p>
            <p>Origem/Destino: {selectedOperacao.origemDestino}</p>
          </div>

          <button type="button" onClick={() => navigate("/main/operacoes")}>
            Fechar detalhe
          </button>
        </article>
      )}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {visibleColumns.map((column) => (
                <th key={column}>
                  {COLUMN_DEFS.find((item) => item.key === column)?.label || column}
                </th>
              ))}
              <th className={styles.actionsColumn}>
                <div className={styles.columnSelector} ref={columnSelectorRef}>
                  <button
                    type="button"
                    title="Selecionar colunas"
                    aria-label="Selecionar colunas"
                    onClick={() => setIsColumnMenuOpen((prev) => !prev)}
                  >
                    <IoEllipsisHorizontalSharp />
                  </button>

                  {isColumnMenuOpen && (
                    <div className={styles.columnMenu}>
                      {COLUMN_DEFS.map((column) => (
                        <label key={column.key}>
                          <input
                            type="checkbox"
                            checked={visibleColumns.includes(column.key)}
                            onChange={() => toggleColumn(column.key)}
                          />
                          {column.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            {!isLoading && operacoes.length === 0 && (
              <tr>
                <td colSpan={visibleColumns.length + 1} className={styles.emptyState}>
                  Nenhuma operação encontrada.
                </td>
              </tr>
            )}

            {isLoading && (
              <tr>
                <td colSpan={visibleColumns.length + 1} className={styles.emptyState}>
                  Carregando operações...
                </td>
              </tr>
            )}

            {!isLoading &&
              operacoes.map((operacao) => (
                <tr key={operacao.id}>
                  {visibleColumns.map((column) => (
                    <td key={`${operacao.id}-${column}`}>{renderCell(operacao, column)}</td>
                  ))}

                  <td className={styles.actionsColumn}>
                    <div className={styles.rowActions}>
                      <button
                        type="button"
                        title="Ver operação"
                        onClick={() => navigate(`/main/operacoes/${operacao.id}`)}
                      >
                        <IoEyeOutline />
                      </button>

                      <button
                        type="button"
                        title="Excluir operação"
                        onClick={() => setDeleteCandidate(operacao)}
                      >
                        <IoTrashOutline />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {deleteCandidate && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirmar exclusão</h3>
            <p>
              Deseja realmente excluir a operação <strong>{deleteCandidate.key}</strong>?
            </p>
            <div className={styles.modalActions}>
              <button type="button" onClick={() => setDeleteCandidate(null)}>
                Cancelar
              </button>
              <button type="button" className={styles.deleteButton} onClick={confirmDelete}>
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Operacoes;
