// The Day Row Component:
// Used in the WeeklyTable Component
// Creates a row that composes each individual day to be displayed in the table

import React from 'react';

function Day({day, viewDetails, currency}) {
    const copyDay = day.slice()
    for (let idx in day) {
        if (copyDay[idx] === 0) copyDay[idx] = ""
        else if (typeof(copyDay[idx]) === "string") copyDay[0] = day[0]
        else copyDay[idx] = `${day[idx].toLocaleString('en', {style: "currency", currency: currency})}`
    }

    
    const catsArray = ["Groceries", "Eating Out", "Clothing", "House Supplies", "Work Supplies", "Travel", "Bills", "Cash", "Emergencies", "Other"]
    return(
        <tr className='color1'>
            <td className='bold color2 verticalB'>
                {day[0]}
            </td>

            {copyDay.slice(1, 11).map((cat, index) => 
            <td onClick={ () => viewDetails(day[0], catsArray[index])} key={index}>{cat}</td>)}

            <td className='verticalB color4'>
                {day.slice(1).reduce((a, b) => a + b, 0).toLocaleString('en', {style: "currency", currency: currency})}
            </td>
        </tr>
    )
}

export default Day