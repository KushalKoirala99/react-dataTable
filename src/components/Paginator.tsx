import { useState } from "react";
import { Paginator, PaginatorPageChangeEvent } from "primereact/paginator";

interface page {
  onPageChange: (page: number) => void;
  totalRecords: number;
}

export default function BasicDemo({onPageChange,totalRecords}: page) {
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(10);

 const handlePageChange = (e: PaginatorPageChangeEvent) => {
    setFirst(e.first);
    setRows(e.rows);
    onPageChange(e.page +1);
 }

  return (
    <div className="card">
      <Paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        // rowsPerPageOptions={[10, 20, 30]}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
