import { useEffect, useState } from 'react'
import axios from 'axios'
import './OfficeManager.css'

const OFFICES_API = 'http://localhost:8082/api/offices'

async function fetchAllOffices() {
  const response = await axios.get(OFFICES_API)
  return response.data
}

function OfficeManager() {
  const [offices, setOffices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [deletingRoom, setDeletingRoom] = useState('')
  const [officeName, setOfficeName] = useState('')
  const [newRoomNumber, setNewRoomNumber] = useState('')
  const [roomToRemove, setRoomToRemove] = useState('')

  useEffect(() => {
    let cancelled = false

    fetchAllOffices()
      .then(data => {
        if (!cancelled) {
          setOffices(data)
          setLoadError('')
          setIsLoading(false)
        }
      })
      .catch(error => {
        if (!cancelled) {
          const message = error.response?.data?.message
            || 'Could not load offices. Check that the server is running and try again.'
          setLoadError(message)
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [])

  async function refreshOffices() {
    setIsLoading(true)
    try {
      const data = await fetchAllOffices()
      setOffices(data)
      setLoadError('')
    } catch (error) {
      const message = error.response?.data?.message
        || 'Could not load offices. Check that the server is running and try again.'
      setLoadError(message)
    } finally {
      setIsLoading(false)
    }
  }

  async function saveOffice(event) {
    event.preventDefault()

    try {
      const response = await axios.post(`${OFFICES_API}/save`, {
        name: officeName.trim(),
        roomNumber: newRoomNumber.trim(),
      })

      if (response.status === 201) {
        window.alert('Office saved successfully.')
        setOfficeName('')
        setNewRoomNumber('')
        await refreshOffices()
      } else {
        window.alert('The office could not be saved.')
      }
    } catch (error) {
      const message = error.response?.data?.message
        || 'The office could not be saved. Check that the server is running and try again.'
      window.alert(message)
    }
  }

  async function deleteOfficeByRoomNumber(rawRoomNumber) {
    const roomNumber = rawRoomNumber.trim()

    if (!roomNumber) {
      window.alert('Enter a room number before deleting an office.')
      return false
    }

    const confirmed = window.confirm(`Are you sure you want to delete office room "${roomNumber}"?`)
    if (!confirmed) {
      return false
    }

    setDeletingRoom(roomNumber)
    try {
      const response = await axios.delete(
        `${OFFICES_API}/room/${encodeURIComponent(roomNumber)}`,
      )

      if (response.status === 204) {
        const target = roomNumber.toLowerCase()
        setOffices(current =>
          current.filter(office => office.roomNumber.trim().toLowerCase() !== target),
        )
        window.alert('Office deleted successfully.')
        return true
      }

      window.alert('The office could not be deleted.')
      return false
    } catch (error) {
      const message = error.response?.data?.message
        || 'The office could not be deleted. Check that the server is running and try again.'
      window.alert(message)
      return false
    } finally {
      setDeletingRoom('')
    }
  }

  async function removeOffice(event) {
    event.preventDefault()
    const deleted = await deleteOfficeByRoomNumber(roomToRemove)
    if (deleted) {
      setRoomToRemove('')
    }
  }

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredOffices = offices.filter(office => {
    if (!normalizedQuery) {
      return true
    }

    return (
      office.name.toLowerCase().includes(normalizedQuery)
      || office.roomNumber.toLowerCase().includes(normalizedQuery)
    )
  })

  return (
    <section className="office-manager" aria-labelledby="office-manager-title">
      <header className="office-manager__header">
        <p className="office-manager__eyebrow">CLINIC FACILITIES</p>
        <h2 id="office-manager-title">Office management</h2>
        <p>Register rooms, search existing offices, and remove offices that are no longer in use.</p>
      </header>

      <div className="office-manager__forms">
        <form className="office-card" onSubmit={saveOffice}>
          <h3>Register an office</h3>
          <label htmlFor="office-name">Office name</label>
          <input
            id="office-name"
            name="officeName"
            type="text"
            value={officeName}
            onChange={event => setOfficeName(event.target.value)}
            maxLength={100}
            required
          />
          <label htmlFor="new-room-number">Room number</label>
          <input
            id="new-room-number"
            name="newRoomNumber"
            type="text"
            value={newRoomNumber}
            onChange={event => setNewRoomNumber(event.target.value)}
            maxLength={40}
            required
          />
          <button type="submit">Save office</button>
        </form>

        <form className="office-card office-card--remove" onSubmit={removeOffice}>
          <h3>Remove an office</h3>
          <p>Enter the room number assigned to the office.</p>
          <label htmlFor="remove-room-number">Room number</label>
          <input
            id="remove-room-number"
            name="roomToRemove"
            type="text"
            value={roomToRemove}
            onChange={event => setRoomToRemove(event.target.value)}
            maxLength={40}
          />
          <button type="submit" disabled={Boolean(deletingRoom)}>
            Delete office
          </button>
        </form>
      </div>

      <div className="office-card office-directory">
        <div className="office-directory__toolbar">
          <div>
            <h3>All offices</h3>
            <p className="office-directory__count">
              Showing {filteredOffices.length} of {offices.length} offices
            </p>
          </div>
          <div className="office-directory__controls">
            <label htmlFor="office-search" className="office-directory__search-label">
              Search offices
            </label>
            <input
              id="office-search"
              name="searchQuery"
              type="search"
              placeholder="Search by office name or office number..."
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
            />
            <button
              type="button"
              className="office-directory__refresh"
              onClick={refreshOffices}
              disabled={isLoading}
            >
              Refresh
            </button>
          </div>
        </div>

        {isLoading ? (
          <p className="office-directory__message">Loading offices...</p>
        ) : loadError ? (
          <div className="office-directory__error" role="alert">
            <p>{loadError}</p>
          </div>
        ) : offices.length === 0 ? (
          <p className="office-directory__message">No offices have been registered yet.</p>
        ) : filteredOffices.length === 0 ? (
          <p className="office-directory__message">
            No offices match &ldquo;{searchQuery.trim()}&rdquo;.
          </p>
        ) : (
          <div className="office-table-wrapper">
            <table className="office-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Office Name</th>
                  <th>Office Number</th>
                  <th>Availability</th>
                  <th>Activity Count</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOffices.map(office => (
                  <tr key={office.id}>
                    <td>{office.id}</td>
                    <td>{office.name}</td>
                    <td>{office.roomNumber}</td>
                    <td>
                      <span
                        className={
                          office.available
                            ? 'office-badge office-badge--available'
                            : 'office-badge office-badge--occupied'
                        }
                      >
                        {office.available ? 'Available' : 'Occupied'}
                      </span>
                    </td>
                    <td>{office.activityCount}</td>
                    <td>
                      <div className="office-actions">
                        <button
                          type="button"
                          className="office-action-btn office-action-btn--update"
                          onClick={() => window.alert('Update functionality is not implemented yet.')}
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          className="office-action-btn office-action-btn--delete"
                          onClick={() => deleteOfficeByRoomNumber(office.roomNumber)}
                          disabled={deletingRoom === office.roomNumber}
                        >
                          {deletingRoom === office.roomNumber ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  )
}

export default OfficeManager
