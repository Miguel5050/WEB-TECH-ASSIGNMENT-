import './App.css'
import { useState } from 'react'
import { Navigate, Routes, Route } from 'react-router-dom'
import LibraryHeader from './components/LibraryHeader'
import LibraryMain from './components/LibraryMain'
import LibraryLogin from './components/LibraryLogin'
import OfficeManager from './components/OfficeManager'

function RequireAuthentication({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const libraryFooter = "About Us";
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  function loginSuccess() {
    setIsAuthenticated(true)
  }

  return (
    <>
      {isAuthenticated && <LibraryHeader isAuthenticated={isAuthenticated} />}
      <Routes>
        <Route
          path="/"
          element={<LibraryLogin onLoginSuccess={loginSuccess} />}
        />
        <Route
          path="/main"
          element={
            <RequireAuthentication isAuthenticated={isAuthenticated}>
              <div className="Main container">
                <em>Welcome to the Library Management System</em>
                <div className="body">
                  <p>LIST OF AVAILABLE BOOKS</p>
                  <ul>
                    <li>Pride and Prejudice - Jane Austen - $12.99</li>
                    <li>Frankenstein - Mary Shelley - $10.99</li>
                    <li>To Kill a Mockingbird - Harper Lee - $14.99</li>
                    <li>The Great Gatsby - F. Scott Fitzgerald - $11.99</li>
                  </ul>
                </div>
                <LibraryMain />
              </div>
            </RequireAuthentication>
          }
        />
        <Route
          path="/office"
          element={
            <RequireAuthentication isAuthenticated={isAuthenticated}>
              <OfficeManager />
            </RequireAuthentication>
          }
        />
      </Routes>
      {isAuthenticated && (
        <>
          <br />
          <footer>
            <h1>{libraryFooter}</h1>
            <p>&copy; 2026 Library Management System. All rights reserved.</p>
          </footer>
        </>
      )}
    </>
  )
}

export default App
