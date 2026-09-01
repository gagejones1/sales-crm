import { useEffect, useState } from 'react'

function Customers() {
    const [customers, setCustomers] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [active, setActive] = useState(true)
    const [editingCustomer, setEditingCustomer] = useState(null)
    const [search, setSearch] = useState('')
    const [error, setError] = useState('')
    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        fetch(`${API_URL}/customers/`)
        .then(response => response.json())
        .then(data => setCustomers(data))
    }, [])

    const addCustomer = (event) => {
        event.preventDefault()

        fetch(`${API_URL}/customers/`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                active: active
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add customer')
            }

            return response.json()
        })
        .then(data => {
            setCustomers([...customers, data])
            setName('')
            setEmail('')
            setActive(true)
        })
        .catch(error => {
            console.error(error)
            setError(error.message)
        })
     }

     const deleteCustomer = (customerID) => {
        fetch(`${API_URL}/customers/${customerID}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete customer')
            }

            setCustomers(customers.filter(customer => customer.id !== customerID))
        })
        .catch(error => {
            console.error(error)
            setError(error.message)
        })
     }

     const updateCustomer = (event) => {
        event.preventDefault()

        fetch(`${API_URL}/customers/${editingCustomer.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name, 
                email: email,
                active: active
            })
        })

        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update customer')
            }

            return response.json()
        })
        .then(data => {
            setCustomers(
                customers.map(customer =>
                    customer.id === data.id ? data : customer
                )
            )

            setEditingCustomer(null)
            setName('')
            setEmail('')
            setActive(true)
        })
        .catch(error => {
            console.error(error)
            setError(error.message)
        })
     }

     const filteredCustomers = customers.filter(customer =>
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="dashboard">
            <h1>Customers</h1>

            {error && <p>{error}</p>}

            <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />

            <form onSubmit={editingCustomer ? updateCustomer : addCustomer}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <label>
                    Active
                        <input  
                            type="checkbox"
                            checked={active}
                            onChange={(event) => setActive(event.target.checked)}
                        />
                        </label>

                        <button type="submit">
                            {editingCustomer ? 'Update Customer' : 'Add Customer'}
                        </button>

                        {editingCustomer && (
                            <button
                                type="button"
                                onClick={() => {
                                    setEditingCustomer(null)
                                    setName('')
                                    setEmail('')
                                    setActive(true)
                                }}
                                >
                                    Cancel Edit
                                </button>
                        )}
                        </form>
                    
           <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Active</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredCustomers.length === 0 && (
                        <tr>
                            <td colSpan="5">No customers found.</td>
                        </tr>
                    )}

                    {filteredCustomers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.active ? 'Yes' : 'No'}</td>
                            <td>
                                <button
                                 onClick={() => {
                                    setEditingCustomer(customer)
                                    setName(customer.name)
                                    setEmail(customer.email)
                                    setActive(customer.active)
                                 }}
                                 >
                                    Edit
                                </button>

                                <button onClick={() => deleteCustomer(customer.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
           </table>
        </div>
    )
}

export default Customers