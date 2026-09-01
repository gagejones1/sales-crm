import { useEffect, useState } from 'react'

function Contacts() {
    const [contacts, setContacts] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [companyID, setCompanyID] = useState('')
    const [editingContact, setEditingContact] = useState(null)
    const [companies, setCompanies] = useState([])
    const [search, setSearch] = useState('')
    const [error, setError] = useState('')

    useEffect(() => {
        fetch('http://127.0.0.1:8001/contacts/')
        .then(response => response.json())
        .then(data => setContacts(data))

        fetch('http://127.0.0.1:8001/companies/')
        .then(response => response.json())
        .then(data => setCompanies(data))
    }, [])

    const addContact = (event) => {
        event.preventDefault()

        fetch('http://127.0.0.1:8001/contacts/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                company_id: companyID
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add contact')
            }

            return response.json()
        })
        .then(data => {
            setContacts([...contacts, data])
            setName('')
            setEmail('')
            setCompanyID('')
        })
        .catch(error => {
            console.error(error)
            setError(error.message)
        })
    }

    const deleteContact = (contactID) => {
        fetch(`http://127.0.0.1:8001/contacts/${contactID}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete contact')
            }

            setContacts(
                contacts.filter(contact => contact.id !== contactID)
            )
        })
    }

    const updateContact = (event) => {
        event.preventDefault()

        fetch(`http://127.0.0.1:8001/contacts/${editingContact.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                email: email,
                company_id: companyID
            })
        })
         .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update contact')
            }

            return response.json()
        })
        .then(data => {
            setContacts(
                contacts.map(contact =>
                    contact.id === data.id ? data : contact
                )
            )

            setEditingContact(null)
            setName('')
            setEmail('')
            setCompanyID('')
        })
        .catch(error => {
            console.error(error)
        })
    }

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.email.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="dashboard">
            <h1>Contacts</h1>

            {error && <p>{error}</p>}

            <input
                type="text"
                placeholder="Search contacts..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />

            <form onSubmit={editingContact ? updateContact: addContact}>
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

               <select
                    value={companyID}
                    onChange={(event) => setCompanyID(event.target.value)}
                    required
                >
                    <option value="">Select Company</option>

                    {companies.map(company => (
                        <option key={company.id} value={company.id}>
                            {company.name}
                        </option>
                    ))}
                </select>

                <button type="submit">
                    {editingContact ? 'Update Contact' : 'Add Contact'}
                </button>

                {editingContact && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingContact(null)
                            setName('')
                            setEmail('')
                            setCompanyID('')
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
            <th>Company</th>
            <th>Actions</th>
        </tr>
    </thead>

    <tbody>
        {filteredContacts.length === 0 && (
            <tr>
                <td colSpan="5">No contacts found.</td>
            </tr>
        )}

        {filteredContacts.map(contact => (
            <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>
                    {companies.find(company => company.id === contact.company_id)?.name}
                </td>
                <td>
                    <button
                        onClick={() => {
                            setEditingContact(contact)
                            setName(contact.name)
                            setEmail(contact.email)
                            setCompanyID(contact.company_id)
                        }}
                    >
                        Edit
                    </button>

                    <button onClick={() => deleteContact(contact.id)}>
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

export default Contacts