import React from "react";
import {
  Route,
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";

import Request from "./pages/request";
import Response from "./pages/response";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/s/:meta">
          <Response />
        </Route>
        <Route path="/">
          <Request />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
