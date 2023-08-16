import * as React from "react";
import styles from "./Table.module.scss";

// Componente table

const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <table ref={ref} className={styles.table} {...props} />
));
Table.displayName = "Table";

// Cabeçalho do Header

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead className={styles.table__header} ref={ref} {...props} />
));
TableHeader.displayName = "TableHeader";

// Head de cada coluna

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th ref={ref} className={styles.thead} {...props} />
));
TableHead.displayName = "TableHead";

// Corpo da tabela

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody ref={ref} {...props} className={styles.table__body} />
));
TableBody.displayName = "TableBody";

// Rodapé da tabela

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => <tfoot ref={ref} {...props} />);
TableFooter.displayName = "TableFooter";

// Linha da tabela

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr ref={ref} {...props} className={styles.table__row} />
));
TableRow.displayName = "TableRow";

// Valor de cada linha

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td ref={ref} className={styles.tcell} {...props} />
));
TableCell.displayName = "TableCell";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
};
