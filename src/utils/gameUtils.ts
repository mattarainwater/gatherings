import { Category } from '../types'

export const SAMPLE_PUZZLE: Category[] = [
  {
    name: 'Blue Creatures',
    words: ['Snapcaster Mage', 'Merfolk Mistbinder', 'Frost Augur', 'Chilling Shade'],
    color: 'yellow',
    difficulty: 1
  },
  {
    name: 'Black Spells',
    words: ['Duress', 'Inquisition of Kozilek', 'Thoughtseize', 'Dark Ritual'],
    color: 'green',
    difficulty: 2
  },
  {
    name: 'Red Dragons',
    words: ['Embercleave', 'Glorybringer', 'Hellkite Charger', 'Stormbreath Dragon'],
    color: 'blue',
    difficulty: 3
  },
  {
    name: 'Green Artifacts',
    words: ['Llanowar Elves', 'Elvish Archdruid', 'Fyndhorn Elves', 'Heritage Druid'],
    color: 'purple',
    difficulty: 4
  }
]

const COLOR_MAP: Record<string, string> = {
  yellow: 'bg-yellow-300',
  green: 'bg-green-400',
  blue: 'bg-blue-500',
  purple: 'bg-purple-600'
}

export const getColorClass = (color: 'yellow' | 'green' | 'blue' | 'purple'): string => {
  return COLOR_MAP[color] || 'bg-gray-400'
}

export const shuffleArray = <T,>(arr: T[]): T[] => {
  const result = [...arr]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]]
  }
  return result
}
