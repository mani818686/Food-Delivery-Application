import { Link } from "react-router-dom"
function Navbar() {
    return (
        <nav className="navbar fixed-top bg-dark border-bottom border-body text-white" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">E-Commerce Fashion</a>
                <div className="d-flex">
                <Link className="navbar-brand" to="/login">Login</Link>
                <Link className="navbar-brand" to="/register">Register</Link>
                <Link className="navbar-brand" to="/cart">Cart</Link>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
