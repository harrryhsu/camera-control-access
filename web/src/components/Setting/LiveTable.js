import React, { useContext, useEffect, useRef } from "react";
import { UtilContext } from "context/UtilContext";
import MaterialTable from "material-table";

const LiveTable = (props) => {
  const {
    columns,
    route,
    disableUpdate,
    readonly,
    filter,
    style = {},
    updateInterval,
    ...rest
  } = props;
  const {
    setError,
    setSuccess,
    api: { GetTable, PostTable, PutTable, DeleteTable },
  } = useContext(UtilContext);
  const table = useRef();

  if (updateInterval) {
    useEffect(() => {
      var handle = setInterval(() => {
        table.current?.onQueryChange();
      }, updateInterval * 1000);

      return () => clearInterval(handle) || console.log("unmount");
    }, []);
  }

  return (
    <MaterialTable
      tableRef={table}
      columns={columns}
      data={(query) =>
        GetTable(route)({
          limit: query.pageSize,
          offset: query.pageSize * query.page,
          orderBy: query.orderBy?.field ?? "created",
          direction:
            query.orderDirection === "" ? "desc" : query.orderDirection,
          filters: query.filters.map((x) => ({
            field: x.column.field,
            value: x.column.lookup ? undefined : x.value,
            lookUp: x.column.lookup ? x.value : undefined,
          })),
        }).then(({ data, total }) => {
          return {
            data,
            page: query.page,
            totalCount: total,
          };
        })
      }
      editable={{
        onRowAdd: readonly
          ? undefined
          : (data) =>
              PutTable(route)(data)
                .then(() => setSuccess("Saved"))
                .catch(setError),
        onRowUpdate:
          disableUpdate || readonly
            ? undefined
            : (newData, oldData) =>
                PostTable(route)(newData)
                  .then(() => setSuccess("Saved"))
                  .catch(setError),
        onRowDelete: readonly
          ? undefined
          : (data) =>
              DeleteTable(route)(data)
                .then(() => setSuccess("Saved"))
                .catch(setError),
      }}
      options={{
        search: false,
        filtering: filter,
      }}
      style={{
        margin: "20px auto",
        ...style,
      }}
      actions={[
        {
          icon: "refresh",
          tooltip: "Refresh",
          isFreeAction: true,
          onClick: (event) => table.current?.onQueryChange(),
        },
      ]}
      {...rest}
    />
  );
};

export default LiveTable;
