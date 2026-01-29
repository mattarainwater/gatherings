export interface Category {
  name: string
  words: string[]
  color: 'yellow' | 'green' | 'blue' | 'purple'
  difficulty: number
}

export interface GameState {
  categories: Category[]
  selected: string[]
  solved: string[]
  mistakes: number
  gameOver: boolean
  won: boolean
  message: string
}
