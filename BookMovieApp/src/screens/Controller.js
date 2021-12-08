import React from "react";
import Home from "./home/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Details from "./details/Details";
import { UserProvider } from "../UserProvider";
import BookShow from "../screens/bookshow/BookShow";
import Confirmation from "../screens/confirmation/Confirmation";


const Controller = () => {
  const baseUrl = "/api/v1/";
  return (
    <Router>
      <div className="main-container">
        <UserProvider>
          <Route
            exact
            path="/"
            render={(props) => <Home {...props} baseUrl={baseUrl} />}
          />
          <Route
            path="/bookshow/:id"
            render={(props) => <BookShow {...props} baseUrl={baseUrl} />}
          />
          <Route
            path="/movie/:id"
            render={(props) => <Details {...props} baseUrl={baseUrl} />}
          />
          <Route
            path="/confirm/:id"
            render={(props) => <Confirmation {...props} baseUrl={baseUrl} />}
          />
        </UserProvider>
      </div>
    </Router>
  );
};

export default Controller;
