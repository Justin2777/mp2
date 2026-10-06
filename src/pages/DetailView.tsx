import { Link, useParams } from 'react-router-dom'
import type { Pokemon } from '../types/Pokemon'
import { formatPokemonName } from '../utils/format'

interface DetailViewProps {
  pokemon: Pokemon[]
}

function DetailView({ pokemon }: DetailViewProps) {
  const { id } = useParams()

  const pokemonId = Number(id)

  const currentIndex = pokemon.findIndex(
    (item) => item.id === pokemonId,
  )

  if (currentIndex === -1) {
    return (
      <section className="page">
        <div className="not-found-card">
          <p className="eyebrow">404</p>
          <h1>Pokémon not found</h1>
          <p>
            The Pokémon you are looking for is not available in this
            collection.
          </p>

          <Link to="/" className="primary-button">
            Back to list
          </Link>
        </div>
      </section>
    )
  }

  const currentPokemon = pokemon[currentIndex]

  const previousIndex =
    currentIndex === 0 ? pokemon.length - 1 : currentIndex - 1

  const nextIndex =
    currentIndex === pokemon.length - 1 ? 0 : currentIndex + 1

  const previousPokemon = pokemon[previousIndex]
  const nextPokemon = pokemon[nextIndex]

  return (
    <section className="page detail-page">
      <div className="detail-topbar">
        <Link to="/" className="back-link">
          <span aria-hidden="true">←</span>
          Back to list
        </Link>

        <span className="detail-position">
          {currentIndex + 1} of {pokemon.length}
        </span>
      </div>

      <div className="detail-card">
        <div className="detail-visual">
          <div className="detail-number">
            #{currentPokemon.id.toString().padStart(3, '0')}
          </div>

          <div className="detail-image-container">
            {currentPokemon.image ? (
              <img
                src={currentPokemon.image}
                alt={formatPokemonName(currentPokemon.name)}
              />
            ) : (
              <span className="image-fallback detail-fallback">
                ?
              </span>
            )}
          </div>
        </div>

        <div className="detail-information">
          <div className="detail-title">
            <div>
              <p className="eyebrow">Pokémon Profile</p>
              <h1>{formatPokemonName(currentPokemon.name)}</h1>
            </div>

            <div className="type-list">
              {currentPokemon.types.map((type) => (
                <span
                  key={type}
                  className={`type-badge large type-${type}`}
                >
                  {formatPokemonName(type)}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-stats-grid">
            <div className="detail-stat-card">
              <span>Pokédex Number</span>
              <strong>
                #{currentPokemon.id.toString().padStart(3, '0')}
              </strong>
            </div>

            <div className="detail-stat-card">
              <span>Height</span>
              <strong>{currentPokemon.height / 10} m</strong>
            </div>

            <div className="detail-stat-card">
              <span>Weight</span>
              <strong>{currentPokemon.weight / 10} kg</strong>
            </div>

            <div className="detail-stat-card">
              <span>Base Experience</span>
              <strong>{currentPokemon.baseExperience}</strong>
            </div>
          </div>

          <div className="detail-section">
            <h2>Abilities</h2>

            <div className="ability-list">
              {currentPokemon.abilities.map((ability) => (
                <span key={ability} className="ability-badge">
                  {formatPokemonName(ability)}
                </span>
              ))}
            </div>
          </div>

          <div className="detail-section">
            <h2>Types</h2>

            <p>
              {formatPokemonName(currentPokemon.name)} is classified as{' '}
              {currentPokemon.types
                .map(formatPokemonName)
                .join(' / ')}
              .
            </p>
          </div>
        </div>
      </div>

      <div className="detail-navigation">
        <Link
          to={`/pokemon/${previousPokemon.id}`}
          className="detail-nav-button previous"
        >
          <span className="nav-arrow" aria-hidden="true">
            ←
          </span>

          <div>
            <span>Previous</span>
            <strong>
              {formatPokemonName(previousPokemon.name)}
            </strong>
          </div>
        </Link>

        <Link
          to={`/pokemon/${nextPokemon.id}`}
          className="detail-nav-button next"
        >
          <div>
            <span>Next</span>
            <strong>{formatPokemonName(nextPokemon.name)}</strong>
          </div>

          <span className="nav-arrow" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  )
}

export default DetailView