import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from "./pages/MainPage";
import WeekPage from './pages/WeekPage';
import ViewDetails from './pages/ViewDetails';
import AddEntry from './pages/AddEntry';
import AddAccount from './pages/AddAccount';

function App() {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <Route path="/" exact>
            <LoginPage />
          </Route>
          <Route path="/main" >
            <MainPage />
          </Route>
          <Route path="/weekly-view" >
            <WeekPage />
          </Route>
          <Route path="/view-details" >
            <ViewDetails />
          </Route>
          <Route path="/add-entry" >
            <AddEntry />
          </Route>
          <Route path="/add-account" >
            <AddAccount />
          </Route>
        </header>
      </Router>
    </div>
  );
}

export default App;
