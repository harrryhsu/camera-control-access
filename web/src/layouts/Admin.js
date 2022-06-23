import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import LinearProgress from "@material-ui/core/LinearProgress";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/background.jpg";
import logo from "assets/img/logo2.png";
import { Alert } from "components/Alert/Alert";
import { UtilProvider } from "context/UtilContext";
import translation from "translation/zh_tw";
import { Dialog, Snackbar } from "@material-ui/core";
import { ApiWrapper } from "api/api";
import Dashboard from "@material-ui/icons/Dashboard";
import Traffic from "views/Traffic/Traffic";

let ps;

const useStyles = makeStyles(styles);

const Admin = ({ history, ...rest }) => {
  const classes = useStyles();
  const mainPanel = React.createRef();
  const [image, setImage] = useState(bgImage);
  const [color, setColor] = useState("grey");
  const [message, setMessage] = useState(["", ""]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogSrc, setDialogSrc] = useState({
    src: null,
    lock: false,
    container: undefined,
  });
  const [metadata, setMetadata] = useState({ targets: {} });
  const api = ApiWrapper();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  const setError = (errObj) => {
    if (typeof errObj == "string") return setMessage(["error", errObj]);
    else
      setMessage([
        "error",
        translation.error["ER_UNKNOWN"] + errObj?.message ?? errObj,
      ]);
  };
  const setSuccess = (msg) => setMessage(["success", msg]);

  const routes = Object.keys(metadata.targets).map((id) => ({
    path: `/traffic/${id}`,
    name: "Traffic: " + metadata.targets[id].name,
    icon: Dashboard,
    component: Traffic,
    layout: "/admin",
    isLoaded: true,
  }));

  useEffect(() => {
    api.GetMetadata().then(setMetadata).catch(setError);
  }, []);

  // initialize and destroy the PerfectScrollbar plugin
  useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false,
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    // Specify how to clean up after this effect:
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);

  return (
    <UtilProvider
      value={{
        set: setMessage,
        setError,
        setSuccess,
        setDialogSrc: (src, container = undefined) =>
          setDialogSrc({
            src,
            lock: false,
            container: container ?? undefined,
          }),
        api,
      }}
    >
      <div className={classes.wrapper}>
        <Alert
          severity={message[0]}
          open={message[0] !== ""}
          onClose={() => setMessage(["", ""])}
          duration={3000}
        >
          {message[1]}
        </Alert>
        <Dialog
          onClose={() =>
            !dialogSrc.lock
              ? setDialogSrc({
                  src: null,
                  lock: false,
                  container: dialogSrc.container,
                })
              : null
          }
          open={dialogSrc.src !== null}
          maxWidth="md"
          style={{ borderRadius: "6px" }}
          container={dialogSrc.container}
          id="global-dialog"
        >
          {typeof dialogSrc.src == "function" ? dialogSrc.src() : dialogSrc.src}
        </Dialog>
        <Sidebar
          routes={routes}
          logoText=""
          logo={logo}
          image={image}
          handleDrawerToggle={handleDrawerToggle}
          open={mobileOpen}
          color={color}
          {...rest}
        />
        <div className={classes.mainPanel} ref={mainPanel}>
          <Navbar
            routes={routes}
            handleDrawerToggle={handleDrawerToggle}
            {...rest}
          />
          {Object.keys(metadata.targets).length ? (
            <div className={classes.content}>
              <div className={classes.container}>
                <Switch>
                  {routes.map((prop, key) => {
                    if (prop.layout === "/admin") {
                      return (
                        <Route
                          path={prop.layout + prop.path}
                          component={prop.component}
                          key={key}
                        />
                      );
                    }
                    return null;
                  })}
                  <Redirect from="/" to={"/admin/traffic/1"} />
                </Switch>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </UtilProvider>
  );
};

export default withRouter(Admin);
