import { NavLink } from 'react-router-dom'

interface NavbarProps {
  pokemonCount: number
}

function Navbar({ pokemonCount }: NavbarProps) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <NavLink to="/" className="brand">
          <span className="brand-ball" />
          <span>Pokédex Explorer</span>
        </NavLink>

        <nav className="nav-links">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            List
          </NavLink>

          <NavLink
            to="/gallery"
            className={({ isActive }) =>
              isActive ? 'nav-link active' : 'nav-link'
            }
          >
            Gallery
          </NavLink>
        </nav>

        <div className="pokemon-count">
          {pokemonCount > 0 ? `${pokemonCount} Pokémon` : 'Loading...'}
        </div>
      </div>
    </header>
  )
}

export default Navbar