// The Border Decoration Component:
// Used in all pages
// Displays the decorations on the borders, created with css styling

import React from "react";

function BasicBorders () {
    return (
        <>
            <div className='filler'></div>

            <div className="fixed">
                <div className="verticals color1">
                <div className="verticals color5"></div></div>
            

                <div className='container cornerDec topleft'></div>
                <div className='container cornerDec topright'></div>
            </div>
            
            <div className='container bottom'></div>
        </>
    )
}

export function BorderFlourish () {
    return (
        <>
            <div className='container top'></div>

            <div className="fixed">
                <div className='container cornerDec bottomleft'></div>
                <div className='container cornerDec bottomright'></div>
            </div>
        </>
    )
}

export function NoBorderFlourish () {
    return (
        <>
            <div className='container top noflourish'></div>
        </>
    )
}

export default BasicBorders