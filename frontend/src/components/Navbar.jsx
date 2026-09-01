import { Link } from 'react-router-dom'

function Navbar() {
    return (
        <nav className="navbar">
            <h2>Sales CRM</h2>

            <div className="nav-links">
                <Link to="/">Dashboard</Link>
                <Link to="/customers">Customers</Link>
                <Link to="/companies">Companies</Link>
                <Link to="/contacts">Contacts</Link>
                <Link to="/opportunities">Opportunities</Link>
            </div>
        </nav>
        )
    }

    export default Navbar