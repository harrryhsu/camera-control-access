import React, { useContext, useRef } from "react";
import MaterialTable from "material-table";
import { UtilContext } from "context/UtilContext";
import translation from "translation/zh_tw";
import DateTimeRangePicker from "components/CustomInput/DateTimeRangePicker";

export default function Record() {
  const tableRef = useRef();
  const { api, setError, setDialogSrc } = useContext(UtilContext);

  const columns = [
    {
      title: translation.global.id,
      field: "id",
      type: "string",
      editable: "never",
    },
    {
      title: translation.global.time,
      field: "created",
      type: "datetime",
      editable: "never",
      filterComponent: ({ onFilterChanged }) => (
        <DateTimeRangePicker onChange={(v) => onFilterChanged(1, v)} />
      ),
    },
    {
      title: translation.global.rego,
      field: "rego",
      type: "string",
      editable: "never",
    },
    {
      title: translation.global.image,
      field: "image",
      type: "string",
      editable: "never",
      sorting: false,
      filtering: false,
      render: (data) => (
        <a
          href="#"
          onClick={() =>
            setDialogSrc(() => (
              <img
                src={api.GetImageSource(data.id, "l")}
                style={{
                  padding: "20px",
                }}
              />
            ))
          }
        >
          <img src={api.GetImageSource(data.id, "s")} height="30px" />
        </a>
      ),
    },
  ];

  return (
    <>
      <MaterialTable
        tableRef={tableRef}
        title=""
        columns={columns}
        data={(query) => {
          const mid = query.filters.first((x) => x.column.field == "id")?.value;
          const created =
            query.filters.first((x) => x.column.field == "created")?.value ??
            [];
          const rego = query.filters.first((x) => x.column.field == "rego")
            ?.value;
          return api
            .PostRecord({
              limit: query.pageSize,
              offset: query.pageSize * query.page,
              mid,
              timeStart: created[0],
              timeEnd: created[1],
              rego,
            })
            .then((data) => {
              return {
                data: data.records.map((entry) => ({
                  ...entry,
                  image: entry.id,
                })),
                page: query.page,
                totalCount: data.total,
              };
            })
            .catch((err) => {
              setError(err);
              throw err;
            });
        }}
        localization={translation.global.localization}
        options={{
          search: false,
          columnsButton: true,
          filtering: true,
          headerStyle: {
            fontSize: "1.125rem",
          },
        }}
      />
    </>
  );
}
