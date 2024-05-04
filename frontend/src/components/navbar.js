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
        <nav className="navbar fixed-top border-bottom border-body border-dark text-dark" >
            <div className="container-fluid">
               
                <a className="navbar-brand" href="/"> <img className="border-0 pr-1" width={20} height={20} src="restaurent.jpeg"/>Restaurent</a>
                <div className="d-flex">
                {loggedIn && userType=='user' &&  <Link className="navbar-brand border active px-1 text-white rounded" to="/cart">Cart</Link>}
                {loggedIn && userType=='user'  &&  <Link className="navbar-brand border active px-1 text-white rounded" to="/orders">My Orders</Link>}
                {loggedIn && userType=='admin'  &&  <Link className="navbar-brand border active px-1 text-white rounded" to="/addItem">Add Food Item</Link>}
                {loggedIn && userType=='admin'  &&  <Link className="navbar-brand border active px-1 text-white rounded" to="/deliverydetails">Delivery Persons</Link>}
                {loggedIn && userType=='admin'  &&  <Link className="navbar-brand border active px-1 text-white rounded" to="/admin/orders">Orders</Link>}
                {loggedIn && <div className="navbar-brand"> Welcome, {name}</div>}
                {!loggedIn && <Link className="navbar-brand border bg-success px-1 text-white rounded" to="/login">Login</Link>}
               {!loggedIn &&  <Link className="navbar-brand border bg-success px-1 text-white rounded" to="/register">Register</Link>}
               {!loggedIn && <Link className="navbar-brand border bg-warning px-1 rounded" to="/login/admin">Admin Login</Link>}
               {/* {!loggedIn &&  <Link className="navbar-brand" to="/signup/admin">Admin Register</Link>} */}
               {/* {!loggedIn && <Link className="navbar-brand" to="/login/delivery">Delivery Login</Link>}
               {!loggedIn &&  <Link className="navbar-brand" to="/register/delivery">Delivery Register</Link>} */}
               {loggedIn &&  <div className="navbar-brand border bg-dark px-1 text-white rounded"  onClick={handleLogout}>Logout</div>}
                </div>
            </div>
        </nav>
    )
}

export default Navbar
