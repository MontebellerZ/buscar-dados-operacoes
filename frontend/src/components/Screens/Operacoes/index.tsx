import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { IoEyeOutline, IoPlayOutline, IoTrashOutline } from "react-icons/io5";
import type { TOperacao } from "../../../types/operacao.type";
import OperacaoService from "../../../services/operacao.service";
import AutomacaoService from "../../../services/automacao.service";
import { formatCurrency, formatDateTime, formatText } from "../../../utils/formatters";
import TabelaGerenciada, { type TabelaGerenciadaColuna } from "../../Shared/TabelaGerenciada";
import Button from "../../Shared/Button";
import styles from "./styles.module.scss";

const TABLE_KEY = "operacoes";
const ITEMS_PER_PAGE = 50;
const COLUMN_DEFS: TabelaGerenciadaColuna<TOperacao>[] = [
  { key: "key", label: "Key", render: (row) => formatText(row.key), default: true },
  { key: "date", label: "Data", render: (row) => formatDateTime(row.date), default: true },
  {
    key: "nomeCliente",
    label: "Cliente",
    render: (row) => formatText(row.nomeCliente),
    default: true,
  },
  {
    key: "nomeMotorista",
    label: "Motorista",
    render: (row) => formatText(row.nomeMotorista),
    default: true,
  },
  { key: "cpfMotorista", label: "CPF Motorista", render: (row) => formatText(row.cpfMotorista) },
  {
    key: "origemDestino",
    label: "Origem/Destino",
    render: (row) => formatText(row.origemDestino),
    default: true,
  },
  { key: "placas", label: "Placas", render: (row) => formatText(row.placas) },
  { key: "nf", label: "NF", render: (row) => formatText(row.nf) },
  { key: "pedido", label: "Pedido", render: (row) => formatText(row.pedido) },
  { key: "qtdePlts", label: "Qtde PLTs", render: (row) => formatText(row.qtdePlts) },
  {
    key: "freteLiquido",
    label: "Frete Líquido",
    render: (row) => formatCurrency(row.freteLiquido),
  },
  {
    key: "taxaMotorista",
    label: "Taxa Motorista",
    render: (row) => formatCurrency(row.taxaMotorista),
  },
  { key: "lucro", label: "Lucro", render: (row) => formatCurrency(row.lucro), default: true },
  { key: "validado", label: "Validado", render: (row) => (row.validado ? "Sim" : "Não") },
];

function Operacoes() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [operacoes, setOperacoes] = useState<TOperacao[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOperacoes, setTotalOperacoes] = useState(0);
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

  const loadOperacoes = async (page: number) => {
    return OperacaoService.GetPaginated(page, ITEMS_PER_PAGE)
      .then((data) => {
        setOperacoes(data.items);
        setTotalOperacoes(data.total);

        if (data.page !== page) {
          setCurrentPage(data.page);
        }
      })
      .catch((err) => {
        toast.error(err?.toString?.() || "Erro ao buscar operações.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage) return;
    setIsLoading(true);
    setCurrentPage(page);
  };

  useEffect(() => {
    let isMounted = true;

    loadOperacoes(currentPage).catch(() => undefined);

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
  }, [currentPage]);

  const runAutomation = async () => {
    setIsRunningAutomation(true);

    return AutomacaoService.OperacoesAtlassian()
      .then(() => {
        setIsLoading(true);
        setCurrentPage(1);
        toast.success("Automação executada com sucesso.");
        return Promise.all([loadOperacoes(1), loadLastAutomationRun()]);
      })
      .catch((err) => toast.error(err?.toString?.() || "Erro ao executar automação."))
      .finally(() => setIsRunningAutomation(false));
  };

  const confirmDelete = async () => {
    if (!deleteCandidate) return;

    return OperacaoService.Delete(deleteCandidate.id)
      .then(async () => {
        setIsLoading(true);
        await loadOperacoes(currentPage);
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
            {lastRunAt ? formatDateTime(lastRunAt) : "Ainda não executada"}
          </p>
        </div>

        <div className={styles.headerActions}>
          <Button variant="primary" onClick={runAutomation} disabled={isRunningAutomation}>
            <IoPlayOutline />
            {isRunningAutomation ? "Executando..." : "Rodar automação"}
          </Button>
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

          <Button onClick={() => navigate("/main/operacoes")}>
            Fechar detalhe
          </Button>
        </article>
      )}

      <TabelaGerenciada
        tabelaKey={TABLE_KEY}
        columns={COLUMN_DEFS}
        data={operacoes}
        page={currentPage}
        totalItems={totalOperacoes}
        onPageChange={handlePageChange}
        itensPorPagina={ITEMS_PER_PAGE}
        isLoading={isLoading}
        emptyMessage="Nenhuma operação encontrada."
        loadingMessage="Carregando operações..."
        allowColumnEdit
        renderActions={(operacao) => (
          <>
            <Button
              variant="icon"
              title="Ver operação"
              onClick={() => navigate(`/main/operacoes/${operacao.id}`)}
            >
              <IoEyeOutline />
            </Button>

            <Button
              variant="icon"
              title="Excluir operação"
              onClick={() => setDeleteCandidate(operacao)}
            >
              <IoTrashOutline />
            </Button>
          </>
        )}
      />

      {deleteCandidate && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h3>Confirmar exclusão</h3>
            <p>
              Deseja realmente excluir a operação <strong>{deleteCandidate.key}</strong>?
            </p>
            <div className={styles.modalActions}>
              <Button onClick={() => setDeleteCandidate(null)}>
                Cancelar
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Operacoes;
