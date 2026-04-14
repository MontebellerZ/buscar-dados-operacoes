import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { IoEyeOutline, IoPlayOutline } from "react-icons/io5";
import type { TOperacao } from "../../../types/operacao.type";
import OperacaoService from "../../../services/operacao.service";
import AutomacaoService from "../../../services/automacao.service";
import { formatDateTime } from "../../../utils/formatters";
import TabelaGerenciada from "../../Shared/TabelaGerenciada";
import Button from "../../Shared/Button";
import ModalOperacao from "../Operacao/ModalOperacao";
import styles from "./styles.module.scss";
import colunasTabelaOperacoes from "./colunasTabelaOperacoes";
import Consts from "../../../config/consts";

const TABLE_KEY = "operacoes";

function Operacoes() {
  const [operacoes, setOperacoes] = useState<TOperacao[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOperacoes, setTotalOperacoes] = useState(0);
  const [lastRunAt, setLastRunAt] = useState<string>();

  const [isLoading, setIsLoading] = useState(true);
  const [isRunningAutomation, setIsRunningAutomation] = useState(false);

  const [openedOperacao, setOpenedOperacao] = useState<TOperacao>();
  const latestLoadRequestId = useRef(0);

  const loadLastAutomationRun = useCallback(async () => {
    return AutomacaoService.GetLastByNome("operacoesAtlassian")
      .then((data) => setLastRunAt(data?.criadoEm))
      .catch((err) => toast.error(err?.toString?.() || "Erro ao buscar a última execução."));
  }, []);

  const loadOperacoes = useCallback(async (page: number) => {
    const requestId = ++latestLoadRequestId.current;

    setIsLoading(true);

    return OperacaoService.GetPaginated(page)
      .then((data) => {
        if (requestId !== latestLoadRequestId.current) return;
        setOperacoes(data.items);
        setTotalOperacoes(data.total);
      })
      .catch((err) => {
        if (requestId !== latestLoadRequestId.current) return;
        toast.error(err?.toString?.() || "Erro ao buscar operações.");
      })
      .finally(() => {
        if (requestId !== latestLoadRequestId.current) return;
        setIsLoading(false);
      });
  }, []);

  const loadData = useCallback(
    async (page: number) => {
      await Promise.all([loadOperacoes(page), loadLastAutomationRun()]);
    },
    [loadLastAutomationRun, loadOperacoes],
  );

  const handlePageChange = useCallback(
    (page: number) => {
      if (page === currentPage) return;

      setCurrentPage(page);
      loadData(page);
    },
    [currentPage, loadData],
  );

  const runAutomation = useCallback(async () => {
    setIsRunningAutomation(true);

    return AutomacaoService.OperacoesAtlassian()
      .then(() => {
        setIsLoading(true);
        toast.success("Automação executada com sucesso.");
      })
      .then(() => {
        handlePageChange(1);
      })
      .catch((err) => toast.error(err?.toString?.() || "Erro ao executar automação."))
      .finally(() => setIsRunningAutomation(false));
  }, [handlePageChange]);

  useEffect(() => {
    loadData(1);
  }, [loadData]);

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

      <TabelaGerenciada
        tabelaKey={TABLE_KEY}
        columns={colunasTabelaOperacoes}
        data={operacoes}
        page={currentPage}
        totalItems={totalOperacoes}
        onPageChange={handlePageChange}
        itensPorPagina={Consts.pageSize}
        isLoading={isLoading}
        emptyMessage="Nenhuma operação encontrada."
        allowColumnEdit
        renderActions={(operacao) => (
          <>
            <Button variant="icon" title="Ver operação" onClick={() => setOpenedOperacao(operacao)}>
              <IoEyeOutline />
            </Button>
          </>
        )}
      />

      {openedOperacao ? (
        <ModalOperacao
          operacao={openedOperacao}
          onClose={() => setOpenedOperacao(undefined)}
          onRefreshList={async () => loadData(currentPage)}
        />
      ) : (
        <></>
      )}
    </section>
  );
}

export default Operacoes;
