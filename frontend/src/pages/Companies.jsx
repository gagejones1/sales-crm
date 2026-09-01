import { useEffect, useState } from 'react'

function Companies() {
    const [companies, setCompanies] = useState([])
    const [name, setName] = useState('')
    const [industry, setIndustry] = useState('')
    const [website, setWebsite] = useState('')
    const [editingCompany, setEditingCompany] = useState(null)
    const [search, setSearch] = useState('')
    const [error, setError] = useState('')
    const API_URL = import.meta.env.VITE_API_URL

    useEffect(() => {
        fetch(`${API_URL}/companies/`)
        .then(response => response.json())
        .then(data => setCompanies(data))
    }, [])

    const addCompany = (event) => {
        event.preventDefault()

        fetch(`${API_URL}/companies/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                industry: industry,
                website: website
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add company')
            }

            return response.json()
        })
        .then(data => {
            setCompanies([...companies, data])
            setName('')
            setIndustry('')
            setWebsite('')
        })
        .catch(error => {
            console.error(error)
            setError(error.message)
        })
    }

    const deleteCompany = (companyID) => {
    fetch(`${API_URL}/companies/${companyID}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete company')
        }

        setCompanies(
            companies.filter(company => company.id !== companyID)
        )
    })
}

    const updateCompany = (event) => {
        event.preventDefault()

        fetch(`${API_URL}/companies/${editingCompany.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                industry: industry,
                website: website
            })
        })

        .then(response => {
    if (!response.ok) {
        throw new Error('Failed to update company')
    }

    return response.json()
})
.then(data => {
    setCompanies(
        companies.map(company =>
            company.id === data.id ? data : company
        )
    )

    setEditingCompany(null)
    setName('')
    setIndustry('')
    setWebsite('')
})
.catch(error => {
    console.error(error)
    setError(error.message)
})
    }

     const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(search.toLowerCase()) ||
        (company.industry || '').toLowerCase().includes(search.toLowerCase()) ||
        (company.website || '').toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="dashboard">
            <h1>Companies</h1>

            {error && <p>{error}</p>}

            <input
                type="text"
                placeholder="Search companies..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />

            <form onSubmit={editingCompany ? updateCompany : addCompany}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                <input
                    type="text"
                    placeholder="Industry"
                    value={industry}
                    onChange={(event) => setIndustry(event.target.value)}
                />

               <input
                    type="text"
                    placeholder="Website"
                    value={website}
                    onChange={(event) => setWebsite(event.target.value)}
                />

                <button type="submit">
                    {editingCompany ? 'Update Company' : 'Add Company'}
            </button>

            {editingCompany && (
    <button
        type="button"
        onClick={() => {
            setEditingCompany(null)
            setName('')
            setIndustry('')
            setWebsite('')
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
                        <th>Industry</th>
                        <th>Website</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredCompanies.length === 0 && (
                        <tr>
                            <td colSpan="5">No companies found.</td>
                        </tr>
                    )}

                    {filteredCompanies.map(company => (
                        <tr key={company.id}>
                            <td>{company.id}</td>
                            <td>{company.name}</td>
                            <td>{company.industry}</td>
                            <td>{company.website}</td>
                            <td>
                                <button 
                                    onClick={() => {
                                        setEditingCompany(company)
                                        setName(company.name)
                                        setIndustry(company.industry)
                                        setWebsite(company.website)
                                    }}
                                >
                                    Edit
                                </button>

                                <button onClick={() => deleteCompany(company.id)}>
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

export default Companies