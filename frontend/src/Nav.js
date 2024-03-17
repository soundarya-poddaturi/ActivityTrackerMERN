import React from 'react';

const Nav=()=>
{
    return (
        <ul className="nav">
            <li className="nav-item">
                <a className="nav-link active" aria-current="page" href="/home">Home</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="/activity">Activity</a>
            </li>
            <li className="nav-item">
                <a className="nav-link" href="/graph">Metrics</a>
            </li>
        </ul>
    )
}
export default Nav;