/*!

=========================================================
* Material Dashboard React - v1.10.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/material-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import "polyfill";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/zh-tw";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { CookiesProvider } from "react-cookie";

// core components
import Admin from "layouts/Admin.js";

import "assets/css/material-dashboard-react.css?v=1.10.0";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "rgb(0,0,0)",
    },
    secondary: {
      main: "#717171",
    },
  },
  overrides: {
    MuiTypography: {
      body1: {
        lineHeight: 1,
      },
    },
  },
});

moment.locale("zh-tw");
ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <MuiPickersUtilsProvider
      libInstance={moment}
      utils={MomentUtils}
      locale="zh-tw"
    >
      <CookiesProvider>
        <BrowserRouter>
          <Switch>
            <Route path="/admin" component={Admin} />
            <Redirect from="/" to="/admin/traffic" />
          </Switch>
        </BrowserRouter>
      </CookiesProvider>
    </MuiPickersUtilsProvider>
  </MuiThemeProvider>,
  document.getElementById("root")
);
