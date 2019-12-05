import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboardprofile from "./pages/Dashboardprofile";
import Home from "./pages/Home";
import NewCompany from "./pages/NewCompany";
import NewOffer from "./pages/NewOffer";
import Search from "./pages/Search";

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Search} />
        <Route path="/dashboardprofile" component={Dashboardprofile} />
        <Route path="/home" component={Home} />
        <Route path="/newcompany" component={NewCompany} />
        <Route path="/newoffer" component={NewOffer} />
        <Route path="/Login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}
