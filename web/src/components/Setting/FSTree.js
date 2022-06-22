import React, { useContext, useEffect } from "react";
import useStateRef from "react-usestateref";
import { UtilContext } from "context/UtilContext";
import TreeView from "@material-ui/lab/TreeView";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";

const FSTree = (props) => {
  const { api, setError, setSuccess } = useContext(UtilContext);
  const [data, setData, dataRef] = useStateRef({
    root: { files: [], links: [], loaded: false },
  });

  useEffect(() => {
    api.GetVolume().then(({ drives }) => {
      setData({
        root: {
          files: [],
          links: drives,
          loaded: true,
        },
        ...drives.reduce(
          (acc, v) => ({
            ...acc,
            [v]: {
              files: [],
              links: [],
              loaded: false,
            },
          }),
          {}
        ),
      });
    });
  }, []);

  const onExpand = (path) => {
    api.GetDirectory(path).then(({ files, directories }) => {
      setData({
        ...dataRef.current,
        [path]: { files: files, links: directories, loaded: true },
        ...directories.reduce(
          (acc, v) => ({
            ...acc,
            [v]: {
              files: [],
              links: [],
              loaded: false,
            },
          }),
          {}
        ),
      });
    });
  };

  const buildTree = (path) => {
    const node = dataRef.current[path];
    return (
      <TreeItem nodeId={path} label={path} onIconClick={() => onExpand(path)}>
        {node.loaded ? null : (
          <TreeItem nodeId={path + "-loading"} label="Loading" />
        )}
        {node.links.map((link) => buildTree(link))}
        {node.files.map((file, i) => (
          <TreeItem nodeId={file} label={file} key={i} />
        ))}
      </TreeItem>
    );
  };

  return (
    <>
      <TreeView
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {buildTree("root")}
      </TreeView>
    </>
  );
};

export default FSTree;
