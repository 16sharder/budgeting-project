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
                    <td>{currency}{total[1].toFixed(2)}</td>
                    <td>{currency}{total[2].toFixed(2)}</td>
                    <td>{currency}{total[3].toFixed(2)}</td>
                    <td>{currency}{total[4].toFixed(2)}</td>
                    <td>{currency}{total[5].toFixed(2)}</td>
                    <td>{currency}{total[6].toFixed(2)}</td>
                    <td>{currency}{total[7].toFixed(2)}</td>
                    <td>{currency}{total[8].toFixed(2)}</td>
                    <td>{currency}{total[9].toFixed(2)}</td>
                    <td>{currency}{total[10].toFixed(2)}</td>
                    <td className='verticalB'>{currency}{total[11].toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
    )
}

export default MonthlyTable