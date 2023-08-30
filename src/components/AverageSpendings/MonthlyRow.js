// The Month Row Component:
// Used in the AveragesTable Component
// Creates a row that composes each individual month to be displayed in the table

import React from 'react';

function Month({month, viewMonth, currency}) {
    return(
        <tr className='color1'>
            <td className='verticalB bold color2 dates' onClick={ () => viewMonth(month[13])}>
                {month[0]}
            </td>

            {month.slice(1, 11).map((cat, index) => <td onClick={ () => viewMonth(month[13])} key={index}> 
                {cat.toLocaleString('en', {style: "currency", currency: currency})}
            </td>)}
            
            <td className='verticalB color4' onClick={ () => viewMonth(month[13])}>
                {month[12].toLocaleString('en', {style: "currency", currency: currency})}
            </td>
        </tr>
    )
}

export default Month