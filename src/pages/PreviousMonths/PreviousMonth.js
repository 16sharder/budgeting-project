import React from 'react';
import {useLocation} from "react-router-dom"

import { useSelector } from 'react-redux/es/hooks/useSelector';

import { monthName, monthNumString } from '../../helperfuncs/DateCalculators';

import NetTable from '../../components/MainPage/NetTable';
import BasicBorders, {NoBorderFlourish} from '../../components/Styling/BorderDecoration';
import Navigation from '../../components/Styling/Navigation';

function PreviousMonth () {

    const location = useLocation()

    const accounts = useSelector(state => state.accounts.value)

    const {month} = location.state

    const monthNumStr = monthNumString(month)

    // retrieves the appropriate year
    const today = new Date()
    let year = today.getFullYear()
    if (month > today.getMonth()) {year = year - 1}

    return (
        <><div className='box'>
            <BasicBorders/>
            <NoBorderFlourish/>
            <Navigation/>
            <p></p>

            <h2>Financials in {monthName(month)}</h2>
            <div>Click on a section to view more details</div>
            <br></br>
            <NetTable data={["All Accounts", "All Accounts", monthNumStr, month, year]}/>
            {accounts.map((account, index) => 
            <NetTable data={[account.account, account.account, monthNumStr, month, year]} key={index}/>)}

            <p></p>
        </div></>
    )
}

export default PreviousMonth