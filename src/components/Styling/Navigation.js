// The Navigation Bar Component:
// Used in all pages without forms
// Displays the navigation bar with links to important pages

import React from "react";
import { useHistory } from "react-router-dom";

function Navigation ({user, currency, lastUsed}) {
    const history = useHistory()
    
    return (
        <>
            <table className="navigator">
                <thead>
                    <tr>
                        <td className="navigator" onClick={() => history.push({pathname:"/main", state: {user, currency, lastUsed}})}>Home</td>
                        <td className="navigator" onClick={() => history.push({pathname:"/accounts-view", state: {user, currency}})}>Accounts Overview</td>
                        <td className="navigator" onClick={() => history.push({pathname:"/choose-month", state: {user, currency, lastUsed}})}>Previous Spendings</td>
                        <td className="navigator" onClick={() => history.push("/")}>Log Out</td>
                    </tr>
                </thead>
            </table>
        </>
    )
}

export default Navigation