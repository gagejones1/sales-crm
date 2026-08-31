import { useEffect, useState } from 'react'

function Contacts() {
    const [contacts, setContacts] = useState([])
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [companyID, setCompanyID] = useState('')
    const [editingContact, setEditingContact] = useState(null)

    useEffect(() => {
        fetch('http://127.0.0.1:8001/contacts/')
        .then(response => response.json())
        .then(data => setContacts(data))
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

    return (
        <div className="dashboard">
            <h1>Contacts</h1>

            <form onSubmit={editingContact ? updateContact: addContact}>
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

                <input
                    type="number"
                    placeholder="Company ID"
                    value={companyID}
                    onChange={(event) => setCompanyID(event.target.value)}
                />

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
            <th>Company ID</th>
            <th>Actions</th>
        </tr>
    </thead>

    <tbody>
        {contacts.map(contact => (
            <tr key={contact.id}>
                <td>{contact.id}</td>
                <td>{contact.name}</td>
                <td>{contact.email}</td>
                <td>{contact.company_id}</td>
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