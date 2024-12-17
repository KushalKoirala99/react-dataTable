import { useEffect, useState, useRef } from "react";
import { fetchData } from "./data";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import BasicDemo from "./components/Paginator";
import "./App.css";
import { OverlayPanel } from "primereact/overlaypanel";

interface User {
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: null | string;
  date_start: number;
  date_end: number;
}

function App() {
  const [tableData, setTableData] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const [selectedRows, setSelectedRows] = useState<User[] | null>(null);
  const op = useRef(null);
  const [inputValue,setInputValue]= useState<number | string>("");

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchData(page);
        console.log(data.data);
        setTableData(data?.data);
        setTotalRecords(data.pagination.total);
        setLoading(false);
      } catch (e) {
        console.log("failed to getData", e);
      }
    }
    getData();
  }, [page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

 const handleSubmit = () => {
  const numberOfRows = Number(inputValue);
  if(numberOfRows > 0 && numberOfRows <= tableData.length){
    const selected = tableData.slice(0,numberOfRows);
    setSelectedRows(selected);
    setInputValue('');
  }
  else if (numberOfRows > tableData.length)
  {
    setSelectedRows(tableData);
    setInputValue("");

    const remaining  = numberOfRows - tableData.length;
    const nextPage = page + 1;
    const selectRemainingRows = (remaining: number,nextPage: number) => {
      if(remaining <= 0) return;
      fetchData(nextPage).then((data) => {
        const additionalRows =  data.data.slice(0, remaining);
        setSelectedRows((prev) => [...(prev || []), ...additionalRows]);

        if(additionalRows.length < remaining){
          selectRemainingRows(remaining - additionalRows.length, nextPage + 1);
        }
      });
    };
    selectRemainingRows(remaining,nextPage)
  }
  op.current.hide();
 }


  return (
    <>
      <div>
        <DataTable
          value={tableData}
          loading={loading}
          stripedRows
          selectionMode="multiple"
          selection={selectedRows}
          onSelectionChange={(e) => setSelectedRows(e.value)}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column selectionMode="multiple" style={{ width: "3rem" }} />
          <Column
            field="title"
            header={
              <div className="title">
                <button onClick={(e) => op.current.show(e)} className="btn">
                  <i className="pi pi-chevron-down "></i>
                  <OverlayPanel ref={op}>
                    <input type="text" placeholder="enter no of rows"
                    onChange={(e) => setInputValue(e.target.value)} />
                    <button onClick={handleSubmit}>Submit</button>
                  </OverlayPanel>
                </button>
                Title
              </div>
            }
          />
          <Column field="place_of_origin" header="Origin" />
          <Column field="artist_display" header="Artist Display" />
          <Column field="inscriptions" header="Inscriptioins" />
          <Column field="date_start" header="Date Start" />
          <Column field="date_end" header="Date End" />
        </DataTable>
      </div>
      <div>
        <BasicDemo
          onPageChange={handlePageChange}
          totalRecords={totalRecords}
        />
      </div>
    </>
  );
}

export default App;
