import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import Companies from './pages/Companies'
import Contacts from './pages/Contacts'
import Opportunities from './pages/Opportunities'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/companies" element={<Companies />} />
      <Route path="/contacts" element={<Contacts />} />
      <Route path="/opportunities" element={<Opportunities />} />
    </Routes>
  )
}

export default App