import { useEffect, useState } from 'react'
import { Link, Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import DetailView from './pages/DetailView'
import GalleryView from './pages/GalleryView'
import ListView from './pages/ListView'
import { fetchPokemon } from './services/pokemonApi'
import type { Pokemon } from './types/Pokemon'
import './App.css'

function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false

    fetchPokemon()
      .then((data) => {
        if (!cancelled) {
          setPokemon(data)
          setError('')
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            'We could not load Pokémon data. Please check your connection and try again.',
          )
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [reloadKey])

  function handleRetry() {
    setLoading(true)
    setError('')
    setReloadKey((current) => current + 1)
  }

  return (
    <div className="app">
      <Navbar pokemonCount={pokemon.length} />

      <main className="main-content">
        {loading ? (
          <div className="status-card">
            <div className="loading-spinner" />

            <h1>Loading Pokémon...</h1>

            <p>Fetching data from PokéAPI.</p>
          </div>
        ) : error ? (
          <div className="status-card error-card">
            <h1>Something went wrong</h1>

            <p>{error}</p>

            <button
              type="button"
              onClick={handleRetry}
            >
              Try again
            </button>
          </div>
        ) : (
          <Routes>
            <Route
              path="/"
              element={<ListView pokemon={pokemon} />}
            />

            <Route
              path="/gallery"
              element={<GalleryView pokemon={pokemon} />}
            />

            <Route
              path="/pokemon/:id"
              element={<DetailView pokemon={pokemon} />}
            />

            <Route
              path="*"
              element={
                <section className="page">
                  <div className="not-found-card">
                    <p className="eyebrow">404</p>

                    <h1>Page not found</h1>

                    <p>
                      The page you requested does not exist.
                    </p>

                    <Link to="/" className="primary-button">
                      Return home
                    </Link>
                  </div>
                </section>
              }
            />
          </Routes>
        )}
      </main>

      <footer className="site-footer">
        <p>Pokémon data provided by PokéAPI.</p>
        <p>CS 409 · MP2 Front-end App</p>
      </footer>
    </div>
  )
}

export default App