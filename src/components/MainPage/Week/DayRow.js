// The Day Row Component:
// Used in the WeeklyTable Component
// Creates a row that composes each individual day to be displayed in the table

import React from 'react';

function Day({day, viewDetails, currency}) {
    const copyDay = day.slice()
    for (let idx in day) {
        if (copyDay[idx] === 0) copyDay[idx] = ""
        else if (typeof(copyDay[idx]) === "string") copyDay[0] = day[0]
        else copyDay[idx] = `${currency}${day[idx].toFixed(2)}`
    }
    return(
        <tr className='color1'>
            <td className='bold color2 verticalB'>
                {day[0]}
            </td>
            <td onClick={ () => viewDetails(day[0], "Groceries")}>
                {copyDay[1]}
            </td>
            <td onClick={ () => viewDetails(day[0], "Eating Out")}>
                {copyDay[2]}
            </td>
            <td onClick={ () => viewDetails(day[0], "Clothing")}>
                {copyDay[3]}
            </td>
            <td onClick={ () => viewDetails(day[0], "House Supplies")}>
                {copyDay[4]}
            </td>
            <td onClick={ () => viewDetails(day[0], "Work Supplies")}>
                {copyDay[5]}
            </td>
            <td onClick={ () => viewDetails(day[0], "Travel")}>
                {copyDay[6]}
            </td>
            <td onClick={ () => viewDetails(day[0], "Bills")}>
                {copyDay[7]}
            </td>
            <td onClick={ () => viewDetails(day[0], "Cash")}>
                {copyDay[8]}
            </td>
            <td onClick={ () => viewDetails(day[0], "Emergencies")}>
                {copyDay[9]}
            </td>
            <td onClick={ () => viewDetails(day[0], "Other")}>
                {copyDay[10]}
            </td>
            <td className='verticalB color4'>
                {currency}{day.slice(1).reduce((a, b) => a + b, 0).toFixed(2)}
            </td>
        </tr>
    )
}

export default Day