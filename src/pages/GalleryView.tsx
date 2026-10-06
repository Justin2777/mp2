import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Pokemon } from '../types/Pokemon'
import { formatPokemonName } from '../utils/format'

interface GalleryViewProps {
  pokemon: Pokemon[]
}

function GalleryView({ pokemon }: GalleryViewProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const availableTypes = useMemo(() => {
    const typeSet = new Set<string>()

    pokemon.forEach((item) => {
      item.types.forEach((type) => typeSet.add(type))
    })

    return Array.from(typeSet).sort()
  }, [pokemon])

  const visiblePokemon = useMemo(() => {
    if (selectedTypes.length === 0) {
      return pokemon
    }

    return pokemon.filter((item) =>
      selectedTypes.every((type) => item.types.includes(type)),
    )
  }, [pokemon, selectedTypes])

  function toggleType(type: string) {
    setSelectedTypes((currentTypes) => {
      if (currentTypes.includes(type)) {
        return currentTypes.filter((item) => item !== type)
      }

      return [...currentTypes, type]
    })
  }

  function clearFilters() {
    setSelectedTypes([])
  }

  return (
    <section className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Visual Collection</p>
          <h1>Pokémon Gallery</h1>
          <p className="page-description">
            Browse Pokémon artwork and filter the gallery by one or more
            types.
          </p>
        </div>

        <div className="result-count">
          <strong>{visiblePokemon.length}</strong>
          <span>
            {visiblePokemon.length === 1 ? 'Pokémon' : 'Pokémon'}
          </span>
        </div>
      </div>

      <div className="filter-panel">
        <div className="filter-heading">
          <div>
            <h2>Filter by type</h2>
            <p>Select one or more types to narrow the gallery.</p>
          </div>

          {selectedTypes.length > 0 && (
            <button
              type="button"
              className="clear-filter-button"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="type-filter-list">
          {availableTypes.map((type) => {
            const isSelected = selectedTypes.includes(type)

            return (
              <button
                key={type}
                type="button"
                className={
                  isSelected
                    ? `type-filter active type-${type}`
                    : `type-filter type-${type}`
                }
                onClick={() => toggleType(type)}
                aria-pressed={isSelected}
              >
                {formatPokemonName(type)}
              </button>
            )
          })}
        </div>

        <div className="active-filter-summary">
          {selectedTypes.length === 0 ? (
            <span>Showing all Pokémon</span>
          ) : (
            <span>
              Active filters:{' '}
              {selectedTypes.map(formatPokemonName).join(' + ')}
            </span>
          )}
        </div>
      </div>

      {visiblePokemon.length === 0 ? (
        <div className="empty-state">
          <h2>No Pokémon match these types</h2>
          <p>
            Try removing one of the selected filters or show all Pokémon
            again.
          </p>

          <button type="button" onClick={clearFilters}>
            Show all Pokémon
          </button>
        </div>
      ) : (
        <div className="gallery-grid">
          {visiblePokemon.map((item) => (
            <Link
              key={item.id}
              to={`/pokemon/${item.id}`}
              className="pokemon-card"
            >
              <div className="card-number">
                #{item.id.toString().padStart(3, '0')}
              </div>

              <div className="card-image-container">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={formatPokemonName(item.name)}
                  />
                ) : (
                  <span className="image-fallback">?</span>
                )}
              </div>

              <div className="card-content">
                <h2>{formatPokemonName(item.name)}</h2>

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

                <div className="card-stats">
                  <div>
                    <strong>{item.height / 10} m</strong>
                    <span>Height</span>
                  </div>

                  <div>
                    <strong>{item.weight / 10} kg</strong>
                    <span>Weight</span>
                  </div>
                </div>

                <div className="card-link">
                  View details
                  <span aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

export default GalleryView