import React, { useEffect } from "react";
import useState from "react-usestateref";
import {
  Switch,
  Route,
  Redirect,
  withRouter,
  useHistory,
} from "react-router-dom";
// creates a beautiful scrollbar
import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Navbar from "components/Navbars/Navbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";

import styles from "assets/jss/material-dashboard-react/layouts/adminStyle.js";

import bgImage from "assets/img/background.jpg";
import logo from "assets/img/logo2.png";
import { Alert } from "components/Alert/Alert";
import { UtilProvider } from "context/UtilContext";
import translation from "translation/zh_tw";
import { Dialog } from "@material-ui/core";
import { ApiWrapper } from "api/api";
import Dashboard from "@material-ui/icons/Dashboard";
import Traffic from "views/Traffic/Traffic";
import CachedIcon from "@material-ui/icons/Cached";
import { IconButton } from "@material-ui/core";
import Form from "components/Form";
import TabBuilder from "views/TabBuilder";

let ps;

const useStyles = makeStyles(styles);

const Admin = ({ history, ...rest }) => {
  const classes = useStyles();
  const mainPanel = React.createRef();
  const [message, setMessage] = useState(["", ""]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogSrc, setDialogSrc] = useState({
    src: null,
    lock: false,
    container: undefined,
  });
  const [metadata, setMetadata] = useState(null);
  const [routes, setRoutes] = useState([]);
  const api = ApiWrapper();

  const t = (w) => {
    if (!metadata) return w;
    return metadata.TRANSLATION[w] ?? w;
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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

  const getMetadata = () => api.GetMetadata().then(setMetadata).catch(setError);

  useEffect(() => {
    if (metadata) {
      const routes = metadata.STREAM.map((stream) => ({
        path: `/traffic/${stream.id}`,
        name: stream.name,
        icon: Dashboard,
        component: () => <TabBuilder pages={metadata.PAGE} id={stream.id} />,
        layout: "/admin",
        isLoaded: true,
        suffix: () => (
          <IconButton
            style={{ position: "absolute", right: 0, top: 0 }}
            onClick={(e) => {
              e.preventDefault();
              setDialogSrc({
                src: () => (
                  <>
                    <Form
                      existingForm={stream}
                      onUpdate={(form) => {
                        api
                          .PostStream({ stream: form, id: stream.id })
                          .then(() => {
                            setDialogSrc({ src: null });
                            getMetadata();
                          })
                          .catch(setError);
                      }}
                      onDelete={() =>
                        api
                          .DeleteStream({ id: stream.id })
                          .then(() => getMetadata())
                          .then(() => setDialogSrc({ src: null }))
                          .catch(setError)
                      }
                      config={metadata.TARGET_CONFIG.addForm}
                    />
                  </>
                ),
              });
            }}
          >
            <CachedIcon />
          </IconButton>
        ),
      }));
      if (routes.length < 10)
        routes.push({
          name: t("Add"),
          icon: Dashboard,
          layout: "/admin",
          isLoaded: true,
          onClick: () => {
            setDialogSrc({
              src: () => (
                <Form
                  config={metadata.TARGET_CONFIG.addForm}
                  onSubmit={(form) => {
                    api
                      .PutStream(form)
                      .then(() => {
                        setDialogSrc({ src: null });
                        getMetadata();
                      })
                      .catch(setError);
                  }}
                />
              ),
            });
          },
        });
      routes.push({
        name: t("System"),
        icon: Dashboard,
        layout: "/admin",
        isLoaded: true,
        onClick: async () => {
          const systemForm = (await api.GetSystem().catch(setError)) ?? {};
          setDialogSrc({
            src: () => (
              <Form
                existingForm={systemForm}
                config={metadata.TARGET_CONFIG.systemForm}
                onSubmit={(form) => {
                  api
                    .PostSystem(form)
                    .then(() => {
                      setDialogSrc({ src: null });
                      getMetadata();
                    })
                    .catch(setError);
                }}
              />
            ),
          });
        },
      });
      setRoutes(routes);

      if (metadata.STREAM.length)
        history.push("/admin/traffic/" + metadata.STREAM.first().id);
    }
  }, [metadata]);

  useEffect(() => {
    getMetadata();
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
    const resizeFunction = () => {
      if (window.innerWidth >= 960) {
        setMobileOpen(false);
      }
    };
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
        metadata,
        t,
      }}
    >
      <div className={classes.wrapper}>
        <Alert
          severity={message[0]}
          open={message[0] !== ""}
          onClose={() => setMessage(["", ""])}
          duration={3000}
        >
          {message[1] ? t(message[1]) : ""}
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
          image={bgImage}
          handleDrawerToggle={handleDrawerToggle}
          open={mobileOpen}
          color={"grey"}
          {...rest}
        />
        <div className={classes.mainPanel} ref={mainPanel}>
          <Navbar
            routes={routes}
            handleDrawerToggle={handleDrawerToggle}
            {...rest}
          />
          {metadata ? (
            <div className={classes.content}>
              <div className={classes.container}>
                <Switch>
                  <Route exact path={"/admin"} component={null} />
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
                  {routes.length == 0 ? (
                    <Redirect from="/" to={"/admin"} />
                  ) : null}
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
