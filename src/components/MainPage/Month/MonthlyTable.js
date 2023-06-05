// The Month Table Component:
// Used on the MainPage and the PreviousSpendings Page
// Displays the table with all of the given month's spending data
        // uses the WeeklyRow Component to display its rows
        // includes each category in the header

import React from 'react';
import Week from "./WeeklyRow"

function MonthlyTable({month, viewWeek, total, currency}) {
    return(
        <table id="monthly">
            <thead>
                <tr className='toprow horizontalB'>
                    <th className='bold verticalB'></th>
                    <th>Groceries</th>
                    <th>Eating Out</th>
                    <th>Clothing</th>
                    <th>House Supplies</th>
                    <th>Work Supplies</th>
                    <th>Travel</th>
                    <th>Bills</th>
                    <th>Cash</th>
                    <th>Emergency</th>
                    <th>Other</th>
                    <th className="verticalB">Total</th>
                </tr>
            </thead>
            <tbody>
                {month.map((week, index) => <Week week={week} viewWeek={viewWeek} currency={currency} key={index}/>)}
                <tr className='horizontalB'>
                    <td className='corner verticalB'>Total</td>
                    {total.slice(1, 11).map((cat, index) => <td key={index}>{cat.toLocaleString('en', {style: "currency", currency: currency})}</td>)}
                    <td className='verticalB'>{total[11].toLocaleString('en', {style: "currency", currency: currency})}</td>
                </tr>
            </tbody>
        </table>
    )
}

export default MonthlyTable