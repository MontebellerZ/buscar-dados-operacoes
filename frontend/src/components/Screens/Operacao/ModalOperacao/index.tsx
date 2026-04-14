import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";
import type { TOperacao } from "../../../../types/operacao.type";
import OperacaoService from "../../../../services/operacao.service";
import {
  formatCurrency,
  formatCurrencyDigitsToNumber,
  formatCurrencyMask,
  formatCurrencyToDigits,
  formatDateTime,
  formatText,
} from "../../../../utils/formatters";
import Button from "../../../Shared/Button";
import Modal from "../../../Shared/Modal";
import styles from "./styles.module.scss";

type ModalOperacaoProps = {
  operacao: TOperacao;
  onClose: () => void;
  onRefreshList: () => Promise<void>;
};

function ModalOperacao(props: ModalOperacaoProps) {
  const [validado, setValidado] = useState(props.operacao.validado);
  const [freteLiquido, setFreteLiquido] = useState(props.operacao.freteLiquido);
  const [taxaMotorista, setTaxaMotorista] = useState(props.operacao.taxaMotorista);

  const [isSavingOperacao, setIsSavingOperacao] = useState(false);
  const [isDeletingOperacao, setIsDeletingOperacao] = useState(false);

  const isLoading = useMemo(
    () => isSavingOperacao || isDeletingOperacao,
    [isDeletingOperacao, isSavingOperacao],
  );

  const lucro = useMemo(() => {
    if (freteLiquido == null || taxaMotorista == null) {
      return { value: props.operacao.lucro, percent: undefined };
    }

    const lucro = freteLiquido - taxaMotorista;
    const porcentagem = freteLiquido === 0 ? 0 : (lucro / freteLiquido) * 100;

    return { value: lucro, percent: porcentagem };
  }, [freteLiquido, props.operacao.lucro, taxaMotorista]);

  const requestClose = () => {
    const changedValidado = validado !== props.operacao.validado;
    const changedFreteLiquido = freteLiquido !== props.operacao.freteLiquido;
    const changedTaxaMotorista = taxaMotorista !== props.operacao.taxaMotorista;

    if (changedFreteLiquido || changedValidado || changedTaxaMotorista) {
      const confirmClose = window.confirm(
        "Existem alterações não salvas. Deseja fechar e perder as alterações?",
      );
      if (!confirmClose) return;
    }

    setIsSavingOperacao(false);
    setIsDeletingOperacao(false);

    props.onClose();
  };

  const saveOperacao = async () => {
    const confirmSave = window.confirm("Deseja salvar as alterações desta operação?");
    if (!confirmSave) return;

    const updatedOperacao: TOperacao = {
      ...props.operacao,
      validado,
      freteLiquido,
      taxaMotorista,
      lucro: lucro.value,
    };

    setIsSavingOperacao(true);

    return await OperacaoService.Update(updatedOperacao)
      .then(async () => {
        props.onClose();
        toast.success("Operação atualizada com sucesso.");

        await props.onRefreshList();
      })
      .catch((err) => toast.error(err?.toString?.() || "Erro ao salvar operação."))
      .finally(() => setIsSavingOperacao(false));
  };

  const deleteOperacao = async () => {
    const confirmDelete = window.confirm(
      `Deseja realmente excluir a operação ${props.operacao.key}?`,
    );
    if (!confirmDelete) return;

    setIsDeletingOperacao(true);

    return OperacaoService.Delete(props.operacao.id)
      .then(async () => {
        props.onClose();
        toast.success("Operação excluída com sucesso.");

        await props.onRefreshList();
      })
      .catch((err) => toast.error(err?.toString?.() || "Erro ao excluir operação."))
      .finally(() => setIsDeletingOperacao(false));
  };

  const maskedFreteLiquido = useMemo(
    () => formatCurrencyMask(formatCurrencyToDigits(freteLiquido)),
    [freteLiquido],
  );
  const setMaskedFreteLiquido = useCallback(
    (value: string) => setFreteLiquido(formatCurrencyDigitsToNumber(value)),
    [],
  );

  const maskedTaxaMotorista = useMemo(
    () => formatCurrencyMask(formatCurrencyToDigits(taxaMotorista)),
    [taxaMotorista],
  );
  const setMaskedTaxaMotorista = useCallback(
    (value: string) => setTaxaMotorista(formatCurrencyDigitsToNumber(value)),
    [],
  );

  return (
    <Modal
      isOpen
      onRequestClose={requestClose}
      title={`Operação ${props.operacao.key}`}
      width="lg"
      actions={
        <>
          <Button onClick={requestClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={saveOperacao} disabled={isLoading}>
            {isSavingOperacao ? "Salvando..." : "Salvar"}
          </Button>
          <Button variant="danger" onClick={deleteOperacao} disabled={isLoading}>
            Excluir
          </Button>
        </>
      }
    >
      <div className={styles.modalFields}>
        <div>
          <span className={styles.fieldLabel}>Key</span>
          <span className={styles.fieldValue}>{formatText(props.operacao.key)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>Data</span>
          <span className={styles.fieldValue}>{formatDateTime(props.operacao.date)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>Cliente</span>
          <span className={styles.fieldValue}>{formatText(props.operacao.nomeCliente)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>Motorista</span>
          <span className={styles.fieldValue}>{formatText(props.operacao.nomeMotorista)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>CPF Motorista</span>
          <span className={styles.fieldValue}>{formatText(props.operacao.cpfMotorista)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>Origem/Destino</span>
          <span className={styles.fieldValue}>{formatText(props.operacao.origemDestino)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>Placas</span>
          <span className={styles.fieldValue}>{formatText(props.operacao.placas)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>NF</span>
          <span className={styles.fieldValue}>{formatText(props.operacao.nf)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>Pedido</span>
          <span className={styles.fieldValue}>{formatText(props.operacao.pedido)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>Qtde PLTs</span>
          <span className={styles.fieldValue}>{formatText(props.operacao.qtdePlts)}</span>
        </div>
        <div>
          <span className={styles.fieldLabel}>Frete Líquido</span>
          <input
            className={`${styles.fieldInput} ${styles.currencyMaskedInput}`}
            type="text"
            value={maskedFreteLiquido}
            onChange={(e) => setMaskedFreteLiquido(e.target.value)}
            disabled={isLoading}
            inputMode="numeric"
          />
        </div>
        <div>
          <span className={styles.fieldLabel}>Taxa Motorista</span>
          <input
            className={`${styles.fieldInput} ${styles.currencyMaskedInput}`}
            type="text"
            value={maskedTaxaMotorista}
            onChange={(e) => setMaskedTaxaMotorista(e.target.value)}
            disabled={isLoading}
            inputMode="numeric"
          />
        </div>
        <div className={styles.fullWidthField}>
          <span className={styles.fieldLabel}>Lucro</span>
          <span className={styles.fieldValue}>{formatCurrency(lucro.value)}</span>
          <small className={styles.fieldInfo}>
            {typeof lucro.percent === "number"
              ? `${lucro.percent.toFixed(2)}% em cima do frete líquido`
              : "Percentual indisponível (frete líquido ou taxa motorista sem valor)."}
          </small>
        </div>
        <label className={styles.fullWidthField}>
          <span className={styles.fieldLabel}>Validado</span>
          <select
            className={styles.fieldSelect}
            value={String(validado)}
            onChange={(event) => setValidado(event.target.value === "true")}
            disabled={isLoading}
          >
            <option value="true">Sim</option>
            <option value="false">Não</option>
          </select>
        </label>
      </div>
    </Modal>
  );
}

export default ModalOperacao;
