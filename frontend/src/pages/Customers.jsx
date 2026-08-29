import { useEffect, useState } from 'react'

function Customers() {
    const [customers, setCustomers] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [active, setActive] = useState(true)

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
        .then(response => response.json())
        .then(data => {
            setCustomers([...customers, data])
        })
     }

    return (
        <div className="dashboard">
            <h1>Customers</h1>

           <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Active</th>
                    </tr>
                </thead>

                <tbody>
                    {customers.map(customer => (
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>{customer.name}</td>
                            <td>{customer.email}</td>
                            <td>{customer.active ? 'Yes' : 'No'}</td>
                        </tr>
                    ))}
                </tbody>
           </table>
        </div>
    )
}

export default Customers