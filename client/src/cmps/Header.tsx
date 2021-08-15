import { NavLink } from "react-router-dom"

export const Header = () => {
    return (
        <div className="header">
            <ul>
                <li>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li>
                    <NavLink to="/doc">My Docs</NavLink>
                </li>
            </ul>
        </div>
    )
}
