export interface Card {
  name: string
  id: string
}

export interface Category {
  name: string
  cards: Card[]
  color: 'yellow' | 'green' | 'blue' | 'purple'
  difficulty: number
}

export interface GameState {
  categories: Category[]
  selected: Card[]
  solved: string[]
  mistakes: number
  gameOver: boolean
  won: boolean
  message: string
}
