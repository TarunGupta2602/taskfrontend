import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [companyFilter, setCompanyFilter] = useState('')
  const [cityFilter, setCityFilter] = useState('')

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok')
        return res.json()
      })
      .then((data) => {
        setUsers(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // Get unique companies and cities for filter dropdowns
  const companies = Array.from(new Set(users.map(u => u.company?.name))).filter(Boolean)
  const cities = Array.from(new Set(users.map(u => u.address?.city))).filter(Boolean)

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
    const matchesCompany = companyFilter ? user.company?.name === companyFilter : true
    const matchesCity = cityFilter ? user.address?.city === cityFilter : true
    return matchesSearch && matchesCompany && matchesCity
  })

  return (
    <div className="container">
      <header className="header enhanced-header main-header">
        <h1>User Directory</h1>
        <p className="subtitle">Browse and filter users fetched from a public API</p>
      </header>
      <div className="filters-bar large-filters">
        <input
          type="text"
          className="search-input large-input"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          className="filter-select large-select"
          value={companyFilter}
          onChange={e => setCompanyFilter(e.target.value)}
        >
          <option value="">All Companies</option>
          {companies.map(company => (
            <option key={company} value={company}>{company}</option>
          ))}
        </select>
        <select
          className="filter-select large-select"
          value={cityFilter}
          onChange={e => setCityFilter(e.target.value)}
        >
          <option value="">All Cities</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      <main>
        {loading && <div className="loader"></div>}
        {error && <p className="error">{error}</p>}
        {!loading && !error && (
          <ul className="user-list enhanced-list">
            {filteredUsers.length === 0 ? (
              <li className="no-results">No users found.</li>
            ) : (
              filteredUsers.map(user => (
                <li key={user.id} className="user-card enhanced-card">
                  <div className="avatar-circle">{user.name[0]}</div>
                  <div className="user-info">
                    <h2>{user.name}</h2>
                    <p><span className="label">Email:</span> {user.email}</p>
                    <p><span className="label">Phone:</span> {user.phone}</p>
                    <p><span className="label">Company:</span> {user.company.name}</p>
                    <p><span className="label">City:</span> {user.address.city}</p>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}
      </main>
      <footer className="footer">
        <p>Powered by <a href="https://jsonplaceholder.typicode.com/" target="_blank" rel="noopener noreferrer">JSONPlaceholder</a></p>
      </footer>
    </div>
  )
}

export default App
