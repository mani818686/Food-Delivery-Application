import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
function Navbar() {
    const firstName = useSelector((state)=>state.user.user.firstName)
    const lastName = useSelector((state)=>state.user.user.lastName)
    
    const name = localStorage.getItem("name") || lastName +" "+firstName
    const loggedIn =localStorage.getItem("userLoggedIn")
    const userType = localStorage.getItem("userType")
    
    const navigate = useNavigate()

    const handleLogout = () =>{
        localStorage.clear()
        navigate("/")
    }

    return (
        <nav className="navbar fixed-top bg-dark border-bottom border-body text-white" data-bs-theme="dark">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">E-Commerce Fashion</a>
                <div className="d-flex">
                {loggedIn && userType=='user' &&  <Link className="navbar-brand" to="/cart">Cart</Link>}
                {loggedIn && userType=='user'  &&  <Link className="navbar-brand" to="/orders">My Orders</Link>}
                {loggedIn && userType=='admin'  &&  <Link className="navbar-brand" to="/addProducts">Add Product</Link>}
                {loggedIn && <div className="navbar-brand"> Welcome, {name}</div>}
                {!loggedIn && <Link className="navbar-brand" to="/login">Login</Link>}
               {!loggedIn &&  <Link className="navbar-brand" to="/register">Register</Link>}
               {!loggedIn && <Link className="navbar-brand" to="/login/admin">Admin Login</Link>}
               {!loggedIn &&  <Link className="navbar-brand" to="/signup/admin">Admin Register</Link>}
               {/* {!loggedIn && <Link className="navbar-brand" to="/login/delivery">Delivery Login</Link>}
               {!loggedIn &&  <Link className="navbar-brand" to="/register/delivery">Delivery Register</Link>} */}
               {loggedIn &&  <div className="navbar-brand"  onClick={handleLogout}>Logout</div>}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
