"use client";

import { Table } from "@tanstack/react-table";
import { useState } from "react";

export default function ExamsCreate() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [table, setTable] = useState<Table<any>>();

  return (
    <main>
      <h1>Criado em</h1>
    </main>
  );
}
