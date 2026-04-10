import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { IoEyeOutline, IoPlayOutline, IoTrashOutline } from "react-icons/io5";
import type { TOperacao } from "../../../types/operacao.type";
import OperacaoService from "../../../services/operacao.service";
import AutomacaoService from "../../../services/automacao.service";
import TabelaGerenciada, {
  type TabelaGerenciadaColuna,
} from "../../Shared/TabelaGerenciada";
import styles from "./styles.module.scss";

const TABLE_KEY = "operacoes";
const DEFAULT_COLUMNS = ["key", "date", "nomeCliente", "nomeMotorista", "origemDestino", "lucro"];

const COLUMN_DEFS: Array<TabelaGerenciadaColuna<TOperacao>> = [
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

  const [operacoes, setOperacoes] = useState<TOperacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunningAutomation, setIsRunningAutomation] = useState(false);
  const [lastRunAt, setLastRunAt] = useState<string | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<TOperacao | null>(null);

  const selectedOperacao = useMemo(() => {
    if (!id) return null;
    const parsedId = Number(id);
    if (!Number.isFinite(parsedId)) return null;
    return operacoes.find((item) => item.id === parsedId) || null;
  }, [id, operacoes]);

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
        <TabelaGerenciada
          tabelaKey={TABLE_KEY}
          columns={COLUMN_DEFS}
          defaultVisibleColumns={DEFAULT_COLUMNS}
          data={operacoes}
          isLoading={isLoading}
          emptyMessage="Nenhuma operação encontrada."
          loadingMessage="Carregando operações..."
          getRowKey={(operacao) => operacao.id}
          renderCell={(operacao, columnKey) => renderCell(operacao, columnKey)}
          renderActions={(operacao) => (
            <>
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
            </>
          )}
        />
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
