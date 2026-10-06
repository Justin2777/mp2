import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Pokemon } from '../types/Pokemon'
import { formatPokemonName } from '../utils/format'

interface ListViewProps {
  pokemon: Pokemon[]
}

type SortProperty = 'id' | 'name' | 'height' | 'baseExperience'
type SortDirection = 'asc' | 'desc'

function ListView({ pokemon }: ListViewProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortProperty, setSortProperty] = useState<SortProperty>('id')
  const [sortDirection, setSortDirection] =
    useState<SortDirection>('asc')

  const visiblePokemon = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    const filteredPokemon = pokemon.filter((item) => {
      if (query === '') {
        return true
      }

      const matchesName = item.name.toLowerCase().includes(query)
      const matchesId = item.id.toString().includes(query)
      const matchesType = item.types.some((type) =>
        type.toLowerCase().includes(query),
      )

      return matchesName || matchesId || matchesType
    })

    return [...filteredPokemon].sort((a, b) => {
      let comparison: number

      if (sortProperty === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortProperty === 'height') {
        comparison = a.height - b.height
      } else if (sortProperty === 'baseExperience') {
        comparison = a.baseExperience - b.baseExperience
      } else {
        comparison = a.id - b.id
      }

      return sortDirection === 'asc' ? comparison : -comparison
    })
  }, [pokemon, searchQuery, sortProperty, sortDirection])

  function clearSearch() {
    setSearchQuery('')
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Pokémon Database</p>

          <h1>Explore Pokémon</h1>

          <p className="page-description">
            Search by name, number, or type, then sort the results using
            different Pokémon attributes.
          </p>
        </div>

        <div className="result-count">
          <strong>{visiblePokemon.length}</strong>

          <span>
            {visiblePokemon.length === 1 ? 'result' : 'results'}
          </span>
        </div>
      </div>

      <div className="controls-panel">
        <div className="search-field">
          <label htmlFor="pokemon-search">
            Search Pokémon
          </label>

          <div className="search-input-wrapper">
            <input
              id="pokemon-search"
              type="search"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Try Pikachu, 25, or fire..."
            />

            {searchQuery !== '' && (
              <button
                type="button"
                className="clear-search-button"
                onClick={clearSearch}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="sort-controls">
          <div className="control-group">
            <label htmlFor="sort-property">
              Sort by
            </label>

            <select
              id="sort-property"
              value={sortProperty}
              onChange={(event) =>
                setSortProperty(
                  event.target.value as SortProperty,
                )
              }
            >
              <option value="id">
                Pokédex Number
              </option>

              <option value="name">
                Name
              </option>

              <option value="height">
                Height
              </option>

              <option value="baseExperience">
                Base Experience
              </option>
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="sort-direction">
              Order
            </label>

            <select
              id="sort-direction"
              value={sortDirection}
              onChange={(event) =>
                setSortDirection(
                  event.target.value as SortDirection,
                )
              }
            >
              <option value="asc">
                Ascending
              </option>

              <option value="desc">
                Descending
              </option>
            </select>
          </div>
        </div>
      </div>

      {visiblePokemon.length === 0 ? (
        <div className="empty-state">
          <h2>No Pokémon found</h2>

          <p>
            Try a different name, Pokédex number, or type.
          </p>

          <button
            type="button"
            onClick={clearSearch}
          >
            Clear search
          </button>
        </div>
      ) : (
        <div className="pokemon-list">
          <div className="list-header">
            <span>Pokémon</span>
            <span>Type</span>
            <span>Height</span>
            <span>Experience</span>
            <span />
          </div>

          {visiblePokemon.map((item) => (
            <Link
              key={item.id}
              to={`/pokemon/${item.id}`}
              className="pokemon-list-item"
            >
              <div className="pokemon-identity">
                <div className="list-image-container">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={formatPokemonName(item.name)}
                    />
                  ) : (
                    <span className="image-fallback">
                      ?
                    </span>
                  )}
                </div>

                <div>
                  <span className="pokemon-number">
                    #
                    {item.id
                      .toString()
                      .padStart(3, '0')}
                  </span>

                  <h2>
                    {formatPokemonName(item.name)}
                  </h2>
                </div>
              </div>

              <div className="type-list">
                {item.types.map((type) => (
                  <span
                    key={type}
                    className={`type-badge type-${type}`}
                  >
                    {formatPokemonName(type)}
                  </span>
                ))}
              </div>

              <div className="list-stat">
                <strong>
                  {item.height / 10} m
                </strong>

                <span>
                  Height
                </span>
              </div>

              <div className="list-stat">
                <strong>
                  {item.baseExperience}
                </strong>

                <span>
                  Base XP
                </span>
              </div>

              <div className="view-detail">
                View details

                <span aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default ListView