import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from "./pages/MainPage";
import WeekPage from './pages/WeekPage';
import ViewDetails from './pages/ViewDetails';
import AddEntry from './pages/AddEntry';
import Accounts from './pages/Accounts';
import AddAccount from './pages/AddAccount';
import Earnings from './pages/Earnings';
import AddEarning from './pages/AddEarning';
import Transfer from './pages/AddTransfer';
import ChooseMonth from './pages/ChooseMonth';
import SpendingsPage from './pages/PreviousSpendings';
import WeekPage2 from './pages/WeekPage2';

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

          <Route path="/earnings" >
            <Earnings />
          </Route>
          <Route path="/add-earning" >
            <AddEarning />
          </Route>


          <Route path="/accounts-view" >
            <Accounts />
          </Route>
          <Route path="/add-account" >
            <AddAccount />
          </Route>

          <Route path="/transfer" >
            <Transfer />
          </Route>


          <Route path="/choose-month" >
            <ChooseMonth />
          </Route>
          <Route path="/previous-spendings" >
            <SpendingsPage />
          </Route>
          <Route path="/weekly-view2" >
            <WeekPage2 />
          </Route>
        </header>
      </Router>
    </div>
  );
}

export default App;
