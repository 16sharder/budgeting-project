// The Navigation Bar Component:
// Used in all pages without forms
// Displays the navigation bar with links to important pages

import React from "react";
import { useHistory } from "react-router-dom";

function Navigation ({user, currency}) {
    const history = useHistory()
    
    return (
        <>
            <table className="navigator">
                <thead>
                    <tr>
                        <td className="navigator" onClick={() => history.push({pathname:"/main", state: {user: user, currency: currency}})}>Home</td>
                        <td className="navigator" onClick={() => history.push({pathname:"/accounts-view", state: {user: user, currency: currency}})}>Accounts Overview</td>
                        <td className="navigator" onClick={() => history.push({pathname:"/choose-month", state: {user: user, currency: currency}})}>Previous Spendings</td>
                        <td className="navigator" onClick={() => history.push("/")}>Log Out</td>
                    </tr>
                </thead>
            </table>
        </>
    )
}

export default Navigation