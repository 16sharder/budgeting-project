// The Week Table Component:
// Used on the WeekPage and the WeekPage2
// Displays the table with all of the given week's spending data
        // uses the DayRow Component to display its rows
        // includes each category in the header

import React from 'react';
import Day from "./DayRow"

function WeeklyTable({week, viewDetails, total, currency}) {
    return(
        <table id="weekly">
            <thead>
                <tr className='toprow horizontalB'>
                    <th className='verticalB'></th>
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
                {week.map((day, index) => <Day day={day} viewDetails={viewDetails} currency={currency} key={index}/>)}
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
                    <td className='verticalB'>{currency}{total.slice(1).reduce((a, b) => a + b, 0).toFixed(2)}</td>
                </tr>
            </tbody>
        </table>
    )
}

export default WeeklyTable