import { useEffect, useState } from 'react'

function Customers() {
    const [customers, setCustomers] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [active, setActive] = useState(true)
    const [editingCustomer, setEditingCustomer] = useState(null)

    useEffect(() => {
        fetch('http://127.0.0.1:8001/customers/')
        .then(response => response.json())
        .then(data => setCustomers(data))
    }, [])

    const addCustomer = (event) => {
        event.preventDefault()

        fetch('http://127.0.0.1:8001/customers/', {
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
        })
     }

     const deleteCustomer = (customerID) => {
        fetch(`http://127.0.0.1:8001/customers/${customerID}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete customer')
            }

            setCustomers(customers.filter(customer => customer.id !== customerID))
        })
     }

     const updateCustomer = (event) => {
        event.preventDefault()

        fetch(`http://127.0.0.1:8001/customers/${editingCustomer.id}`, {
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
        })
     }

    return (
        <div className="dashboard">
            <h1>Customers</h1>

            <form onSubmit={editingCustomer ? updateCustomer : addCustomer}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
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
                    {customers.map(customer => (
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