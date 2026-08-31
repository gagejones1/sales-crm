import { useEffect, useState } from 'react'

function Opportunities() {
    const [opportunities, setOpportunities] = useState([])
    const [name, setName] = useState('')
    const [value, setValue] = useState('')
    const [stage, setStage] = useState('')
    const [companyID, setCompanyID] = useState('')
    const [editingOpportunity, setEditingOpportunity] = useState(null)
    const [companies, setCompanies] = useState([])
    const [search, setSearch] = useState('')
    const [stageFilter, setStageFilter] = useState('')

    useEffect(() => {
        fetch('http://127.0.0.1:8001/opportunities/')
        .then(response => response.json())
        .then(data => setOpportunities(data))

        fetch('http://127.0.0.1:8001/companies/')
        .then(response => response.json())
        .then(data => setCompanies(data))
    }, [])

    const addOpportunity = (event) => {
        event.preventDefault()

        fetch('http://127.0.0.1:8001/opportunities/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                value: value,
                stage: stage,
                company_id: companyID
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add opportunity')
            }

            return response.json()
        })
        .then(data => {
            setOpportunities([...opportunities, data])
            setName('')
            setValue('')
            setStage('')
            setCompanyID('')
        })
        .catch(error => {
            console.error(error)
        })
    }

    const deleteOpportunity = (opportunityID) => {
    fetch(`http://127.0.0.1:8001/opportunities/${opportunityID}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to delete opportunity')
        }

        setOpportunities(
            opportunities.filter(opportunity => opportunity.id !== opportunityID)
        )
    })
}

    const updateOpportunity = (event) => {
    event.preventDefault()

    fetch(`http://127.0.0.1:8001/opportunities/${editingOpportunity.id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            value: value,
            stage: stage,
            company_id: companyID
        })
    })
    .then(response => {
    if (!response.ok) {
        throw new Error('Failed to update opportunity')
    }

    return response.json()
    })
    .then(data => {
        setOpportunities(
            opportunities.map(opportunity =>
                opportunity.id === data.id ? data : opportunity
            )
        )

        setEditingOpportunity(null)
        setName('')
        setValue('')
        setStage('')
        setCompanyID('')
    })
    .catch(error => {
        console.error(error)
    })
    }

    const filteredOpportunities = opportunities.filter(opportunity => {
    const companyName =
        companies.find(company => company.id === opportunity.company_id)?.name || ''

    const matchesSearch =
        opportunity.name.toLowerCase().includes(search.toLowerCase()) ||
        companyName.toLowerCase().includes(search.toLowerCase())

    const matchesStage =
        stageFilter === '' || opportunity.stage === stageFilter

    return matchesSearch && matchesStage
})

    return (
        <div className="dashboard">
            <h1>Opportunities</h1>

            <input
                type="text"
                placeholder="Search opportunities..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
            />

            <select
                value={stageFilter}
                onChange={(event) => setStageFilter(event.target.value)}
            >
                <option value="">All Stages</option>
                <option value="Lead">Lead</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal">Proposal</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
            </select>

            <form onSubmit={editingOpportunity ? updateOpportunity : addOpportunity}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />

                 <input
                    type="number"
                    placeholder="Value"
                    value={value}
                    onChange={(event) => setValue(event.target.value)}
                />

                <select
                    value={stage}
                    onChange={(event) => setStage(event.target.value)}
                >
                    <option value="">Select Stage</option>
                    <option value="Lead">Lead</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                </select>

                <select
                    value={companyID}
                    onChange={(event) => setCompanyID(event.target.value)}
                >
                    <option value="">Select Company</option>

                    {companies.map(company => (
                        <option key={company.id} value={company.id}>
                            {company.name}
                        </option>
                    ))}
                </select>

                    <button type="submit">
                        {editingOpportunity ? 'Update Opportunity' : 'Add Opportunity'}
                    </button>

                    {editingOpportunity && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingOpportunity(null)
                                setName('')
                                setValue('')
                                setStage('')
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
            <th>Value</th>
            <th>Stage</th>
            <th>Company</th>
            <th>Actions</th>
        </tr>
    </thead>

    <tbody>
        {filteredOpportunities.map(opportunity => (
            <tr key={opportunity.id}>
                <td>{opportunity.id}</td>
                <td>{opportunity.name}</td>
                <td>${opportunity.value.toLocaleString()}
                </td>
                <td>{opportunity.stage}</td>
                <td>{companies.find(company => company.id === opportunity.company_id)?.name}
                </td>
                <td>
            <button
                onClick={() => {
                    setEditingOpportunity(opportunity)
                    setName(opportunity.name)
                    setValue(opportunity.value)
                    setStage(opportunity.stage)
                    setCompanyID(opportunity.company_id)
                }}
            >
                Edit
            </button>

            <button onClick={() => deleteOpportunity(opportunity.id)}>
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

export default Opportunities