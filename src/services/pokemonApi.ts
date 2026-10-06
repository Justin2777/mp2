import axios from 'axios'
import type { Pokemon } from '../types/Pokemon'

const API_BASE_URL = 'https://pokeapi.co/api/v2'

interface PokemonListItem {
  name: string
  url: string
}

interface PokemonListResponse {
  results: PokemonListItem[]
}

interface PokemonDetailResponse {
  id: number
  name: string
  height: number
  weight: number
  base_experience: number | null
  sprites: {
    front_default: string | null
    other?: {
      'official-artwork'?: {
        front_default: string | null
      }
    }
  }
  types: {
    type: {
      name: string
    }
  }[]
  abilities: {
    ability: {
      name: string
    }
  }[]
}

function convertPokemon(data: PokemonDetailResponse): Pokemon {
  return {
    id: data.id,
    name: data.name,
    image:
      data.sprites.other?.['official-artwork']?.front_default ??
      data.sprites.front_default ??
      '',
    types: data.types.map((item) => item.type.name),
    height: data.height,
    weight: data.weight,
    abilities: data.abilities.map((item) => item.ability.name),
    baseExperience: data.base_experience ?? 0,
  }
}

export async function fetchPokemon(limit = 100): Promise<Pokemon[]> {
  const listResponse = await axios.get<PokemonListResponse>(
    `${API_BASE_URL}/pokemon`,
    {
      params: {
        limit,
      },
    },
  )

  const detailRequests = listResponse.data.results.map((item) =>
    axios.get<PokemonDetailResponse>(item.url),
  )

  const detailResponses = await Promise.all(detailRequests)

  return detailResponses
    .map((response) => convertPokemon(response.data))
    .sort((a, b) => a.id - b.id)
}