import './styling/App.css';
import './styling/Decorations.css';
import './styling/Buttons.css';
import './styling/Forms.css';
import './styling/SpecialCases.css';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import MainPage from "./pages/MainPage";
import WeekPage from './pages/WeekPage';
import ViewDetails from './pages/Entries/ViewDetails';
import AddEntry from './pages/Entries/AddEntry';
import Accounts from './pages/Accounts/Accounts';
import AddAccount from './pages/Accounts/AddAccount';
import Earnings from './pages/Earnings/EarningDetails';
import AddEarning from './pages/Earnings/AddEarning';
import Transfer from './pages/Accounts/AddTransfer';
import ChooseMonth from './pages/PreviousMonths/ChooseMonth';
import PreviousMonth from './pages/PreviousMonths/PreviousMonth';
import SpendingsPage from './pages/PreviousMonths/PreviousSpendings';
import WeekPage2 from './pages/PreviousMonths/WeekPage2';
import EditEntry from './pages/Entries/EditEntry';
import EditEarning from './pages/Earnings/EditEarning';
import EditTransfer from './pages/Accounts/EditTransfer';
import ViewTransfers from './pages/Accounts/ViewTransfers';

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

          <Route path="/edit" >
            <EditEntry />
          </Route>
          <Route path="/edit-earning" >
            <EditEarning />
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
          <Route path="/edit-transfer" >
            <EditTransfer />
          </Route>
          <Route path="/view-transfers" >
            <ViewTransfers />
          </Route>


          <Route path="/choose-month" >
            <ChooseMonth />
          </Route>
          <Route path="/previous-month" >
            <PreviousMonth />
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
