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

export interface PuzzleResponse {
  categories: Category[]
  puzzleDate: string
  nextPuzzleDate: string | null
  prevPuzzleDate: string | null
}

export interface PuzzleDateListResponse {
  dates: string[]
}

const API_BASE_URL = 'https://9sengzv8jb.execute-api.us-east-2.amazonaws.com/prod'

export const puzzleService = {
  getPuzzle: async (puzzleDate?: string): Promise<PuzzleResponse> => {
    const url = new URL(`${API_BASE_URL}/puzzles`)
    if (puzzleDate) {
      url.searchParams.append('puzzledate', puzzleDate)
    }
    
    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    return {
      categories: data.result.puzzle.categories as Category[],
      puzzleDate: data.result.puzzle.publish_date,
      nextPuzzleDate: data.result.nextPuzzleDate || null,
      prevPuzzleDate: data.result.prevPuzzleDate || null,
    }
  },

  getAllPuzzleDates: async (): Promise<PuzzleDateListResponse> => {
    const url = new URL(`${API_BASE_URL}/puzzles`)
    url.searchParams.append('all', 'all')

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    return {
      dates: (data.result || []).map((item: { publish_date: string }) => item.publish_date),
    }
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

    const data = await response.json()

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
