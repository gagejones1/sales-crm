import { useEffect, useState } from 'react'

function Opportunities() {
    const [opportunities, setOpportunities] = useState([])
    const [name, setName] = useState('')
    const [value, setValue] = useState('')
    const [stage, setStage] = useState('')
    const [companyID, setCompanyID] = useState('')
    const [editingOpportunity, setEditingOpportunity] = useState(null)

    useEffect(() => {
        fetch('http://127.0.0.1:8001/opportunities/')
        .then(response => response.json())
        .then(data => setOpportunities(data))
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

    return (
        <div className="dashboard">
            <h1>Opportunities</h1>

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

                  <input
                    type="text"
                    placeholder="Stage"
                    value={stage}
                    onChange={(event) => setStage(event.target.value)}
                />

                  <input
                    type="number"
                    placeholder="Company ID"
                    value={companyID}
                    onChange={(event) => setCompanyID(event.target.value)}
                />

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
            <th>Company ID</th>
            <th>Actions</th>
        </tr>
    </thead>

    <tbody>
        {opportunities.map(opportunity => (
            <tr key={opportunity.id}>
                <td>{opportunity.id}</td>
                <td>{opportunity.name}</td>
                <td>{opportunity.value}</td>
                <td>{opportunity.stage}</td>
                <td>{opportunity.company_id}</td>
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