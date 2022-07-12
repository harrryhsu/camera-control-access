import React, { useContext, useRef } from "react";
import MaterialTable from "material-table";
import { UtilContext } from "context/UtilContext";
import translation from "translation/zh_tw";

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
        data={(query) =>
          api
            .GetRecord()
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
            })
        }
        localization={translation.global.localization}
        options={{
          search: false,
          columnsButton: true,
          headerStyle: {
            fontSize: "1.125rem",
          },
        }}
      />
    </>
  );
}
