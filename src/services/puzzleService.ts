import { Category } from '../types'

export interface CreatePuzzleRequest {
  publishDate: string
  categories: Category[]
}

export interface CreatePuzzleResponse {
  id: string
  createdAt: string
  success: boolean
}

const API_BASE_URL = 'https://9sengzv8jb.execute-api.us-east-2.amazonaws.com/prod'

export const puzzleService = {
  getPuzzle: async (): Promise<Category[]> => {
    const response = await fetch(`${API_BASE_URL}/puzzles`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_API_KEY || '',
      },
    })

    const data = await response.json()
    if (!data.statusCode || data.statusCode !== 200) {
      throw new Error(`Failed to fetch puzzle: ${data.statusCode}`)
    }
    const puzzle = JSON.parse(data.returnBody)
    return puzzle.categories
  },

  createPuzzle: async (request: CreatePuzzleRequest): Promise<CreatePuzzleResponse> => {
    const response = await fetch(`${API_BASE_URL}/puzzles`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_API_KEY || '',
      },
      body: JSON.stringify(request),
    })
    console.log(response)

    const data = await response.json()
    console.log(data)

    if (!data.statusCode || data.statusCode !== 200) {
      throw new Error(data.returnBody || `API request failed with status ${data.statusCode}`)
    }

    return {
      id: data.id || `puzzle-${Date.now()}`,
      createdAt: data.createdAt || new Date().toISOString(),
      success: true,
    }
  },
}
