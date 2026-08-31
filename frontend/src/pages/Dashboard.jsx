import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.css'

function Dashboard() {
    const [customers, setCustomers] = useState([])
    const [companies, setCompanies] = useState([])
    const [contacts, setContacts] = useState([])
    const [opportunities, setOpportunities] = useState([])

    useEffect(() => {
        fetch('http://127.0.0.1:8001/customers/')
            .then(response => response.json())
            .then(data => setCustomers(data))

        fetch('http://127.0.0.1:8001/companies/')
            .then(response => response.json())
            .then(data => setCompanies(data))

        fetch('http://127.0.0.1:8001/contacts/')
            .then(response => response.json())
            .then(data => setContacts(data))

        fetch('http://127.0.0.1:8001/opportunities/')
            .then(response => response.json())
            .then(data => setOpportunities(data))
    }, [])

    const totalPipeline = opportunities.reduce(
        (total, opportunity) => total + opportunity.value,
        0
    )

    return (
        <div className="dashboard">
            <h1>Sales CRM Dashboard</h1>

            <div className="stats">

                <Link to="/customers" className="card-link">
                    <div className="card">
                        <h2>Customers</h2>
                        <p>{customers.length}</p>
                    </div>
                </Link>

                <Link to="/companies" className="card-link">
                    <div className="card">
                        <h2>Companies</h2>
                        <p>{companies.length}</p>
                    </div>
                </Link>

                <Link to="/contacts" className="card-link">
                     <div className="card">
                       <h2>Contacts</h2>
                       <p>{contacts.length}</p>
                   </div>
                </Link>

            <Link to="/opportunities" className="card-link">
                <div className="card">
                    <h2>Opportunities</h2>
                    <p>{opportunities.length}</p>
                </div>
            </Link>

                <div className="card">
                    <h2>Total Pipeline</h2>
                    <p>${totalPipeline.toLocaleString()}</p>
                    </div>
                </div>
        </div>
    )
}

export default Dashboard