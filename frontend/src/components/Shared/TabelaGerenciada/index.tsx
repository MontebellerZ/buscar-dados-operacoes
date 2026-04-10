import { useEffect, useMemo, useRef, useState } from "react";
import { IoEllipsisHorizontalSharp } from "react-icons/io5";
import TabelaStorage from "../../../stores/store/tabela.store";
import styles from "./styles.module.scss";

export type TabelaGerenciadaColuna<T> = {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type TabelaGerenciadaProps<T> = {
  tabelaKey: string;
  columns: Array<TabelaGerenciadaColuna<T>>;
  defaultVisibleColumns: string[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  getRowKey: (row: T) => string | number;
  renderCell?: (row: T, columnKey: string) => React.ReactNode;
  renderActions?: (row: T) => React.ReactNode;
};

function defaultRenderCell<T>(row: T, columnKey: string) {
  const value = (row as Record<string, unknown>)[columnKey];

  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return String(value);
}

function TabelaGerenciada<T>({
  tabelaKey,
  columns,
  defaultVisibleColumns,
  data,
  isLoading = false,
  emptyMessage = "Nenhum registro encontrado.",
  loadingMessage = "Carregando...",
  getRowKey,
  renderCell,
  renderActions,
}: TabelaGerenciadaProps<T>) {
  const columnSelectorRef = useRef<HTMLDivElement | null>(null);
  const [isColumnMenuOpen, setIsColumnMenuOpen] = useState(false);
  const [selectedColumns, setSelectedColumns] = useState<string[]>(
    () => TabelaStorage.getByTabela(tabelaKey) || defaultVisibleColumns,
  );

  const visibleColumns = useMemo(() => {
    const unique = Array.from(new Set(selectedColumns));
    return unique.filter((columnKey) => columns.some((column) => column.key === columnKey));
  }, [columns, selectedColumns]);

  useEffect(() => {
    const safeColumns = visibleColumns.length ? visibleColumns : defaultVisibleColumns;
    TabelaStorage.saveByTabela(tabelaKey, safeColumns);
  }, [defaultVisibleColumns, tabelaKey, visibleColumns]);

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
    setSelectedColumns((prev) => {
      if (prev.includes(columnKey)) {
        const next = prev.filter((item) => item !== columnKey);
        return next.length ? next : defaultVisibleColumns;
      }

      return [...prev, columnKey];
    });
  };

  const renderValue = renderCell || defaultRenderCell;

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {visibleColumns.map((columnKey) => {
              const column = columns.find((item) => item.key === columnKey);
              return <th key={columnKey}>{column?.label || columnKey}</th>;
            })}

            {renderActions && (
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
                      {columns.map((column) => (
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
            )}
          </tr>
        </thead>

        <tbody>
          {!isLoading && data.length === 0 && (
            <tr>
              <td
                colSpan={visibleColumns.length + (renderActions ? 1 : 0)}
                className={styles.emptyState}
              >
                {emptyMessage}
              </td>
            </tr>
          )}

          {isLoading && (
            <tr>
              <td
                colSpan={visibleColumns.length + (renderActions ? 1 : 0)}
                className={styles.emptyState}
              >
                {loadingMessage}
              </td>
            </tr>
          )}

          {!isLoading &&
            data.map((row) => (
              <tr key={getRowKey(row)}>
                {visibleColumns.map((columnKey) => {
                  const column = columns.find((item) => item.key === columnKey);
                  const value = column?.render ? column.render(row) : renderValue(row, columnKey);

                  return <td key={`${getRowKey(row)}-${columnKey}`}>{value}</td>;
                })}

                {renderActions && (
                  <td className={styles.actionsColumn}>
                    <div className={styles.rowActions}>{renderActions(row)}</div>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default TabelaGerenciada;
