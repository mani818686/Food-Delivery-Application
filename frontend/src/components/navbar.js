
function Navbar() {
    return (
        <nav className="navbar bg-dark border-bottom border-body text-white" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">E-Commerce Fashion</a>
                <div className="d-flex">
                <a className="navbar-brand" href="/login">Login</a>
                <a className="navbar-brand" href="/register">Register</a>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
