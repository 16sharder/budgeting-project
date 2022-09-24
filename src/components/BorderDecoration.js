import React from "react";

function BorderDecorations () {
    return (
        <>
            <div className='container top'></div>
            <div className='container redleft'></div>
            <div className='container redright'></div>
            <div className='container blueleft'></div>
            <div className='container blueright'></div>
            

            <div className='container topleft'></div>
            <div className='container topright'></div>
        </>
    )
}

export function BorderDecorationsBottom () {
    return (
        <>
            <div className='container bottom'></div>
            
            <div className='container bottomleft'></div>
            <div className='container bottomright'></div>
        </>
    )
}

export default BorderDecorations