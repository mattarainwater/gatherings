import { Category } from '../types'

export interface CreatePuzzleRequest {
  categories: Category[]
}

export interface CreatePuzzleResponse {
  id: string
  createdAt: string
  success: boolean
}

/**
 * Mock service for creating puzzles
 * In a real application, this would make an API request to a backend server
 */
export const puzzleService = {
  createPuzzle: async (request: CreatePuzzleRequest): Promise<CreatePuzzleResponse> => {
    console.log(request)
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        resolve({
          id: `puzzle-${Date.now()}`,
          createdAt: new Date().toISOString(),
          success: true,
        })
      }, 1000)
    })
  },
}
