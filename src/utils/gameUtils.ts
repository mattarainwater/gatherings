import { Category } from '../types'

export const SAMPLE_PUZZLE: Category[] = [
  {
    name: '"Iconic" Typal Commanders',
    cards: [
      {
        name: 'Giada, Font of Hope',
        id: '0b235e9f-a8a6-45d7-b301-bc6db752dda8'
      },
      {
        name: 'Miirym, Sentinel Wyrm',
        id: '96f0daf2-36c5-4b3e-ab81-7317682a406b'
      },
      {
        name: "Be'lakor, the Dark Master",
        id: '7a55dc69-defe-4e6a-925e-31aaee89a8a0'
      },
      {
        name: 'Gargos, Vicious Watcher',
        id: '4e446e90-6e31-43ed-bcb1-a01422b503c0'
      },
    ],
    color: 'yellow',
    difficulty: 1
  },
  {
    name: 'Commanders from CMD Set',
    cards: [
      {
        name: 'Animar, Soul of Elements',
        id: 'cb073d5b-9515-492d-9b2d-0f64e85f1da8'
      },
      {
        name: "Kaalia of the Vast",
        id: '4b71d89b-7ba4-406f-8736-ac62b9864f21'
      },
      {
        name: 'Tariel, Reckoner of Souls',
        id: 'c09448cf-70c9-494d-90e2-63a958b49bcd'
      },
      {
        name: 'Zedruu the Greathearted',
        id: 'f851b861-4e9c-4422-8156-37d7bf2928cd'
      },
    ],
    color: 'green',
    difficulty: 2
  },
  {
    name: 'Has A Namesake "Will"',
    cards: [
      {
        name: 'Akroma, Angel of Wrath',
        id: '814245de-6105-43ef-acbf-d12d304b6331'
      },
      {
        name: 'Jeska, Thrice Reborn',
        id: '48caf4c4-745c-4072-bf3d-1a3fa7c3bc9c'
      },
      {
        name: 'Tevesh Szat, Doom of Fools',
        id: '8f244716-78ab-46f5-b6e9-fc1e6db28052'
      },
      {
        name: 'Kamahl, Fist of Krosa',
        id: 'c960672d-06ad-4d41-8904-9c007f824756'
      },
    ],
    color: 'blue',
    difficulty: 3
  },
  {
    name: 'Was Made Into a Zombie',
    cards: [
      {
        name: 'Mikaeus, the Lunarch',
        id: 'fb885d30-c6e5-494a-bc01-3d5085b8e262'
      },
      {
        name: 'Glissa Sunseeker',
        id: '670c3106-71fc-464e-8c94-81bf7fafc3e6'
      },
      {
        name: 'Balthor the Stout',
        id: 'e81ecdc5-d2c7-4292-9b59-fd6bf3ba29d5'
      },
      {
        name: 'Rorix Bladewing',
        id: '7f2caba5-9f30-4b5e-833e-68c85a47ef7c'
      },
    ],
    color: 'purple',
    difficulty: 4
  }
]

const COLOR_MAP: Record<string, string> = {
  yellow: 'bg-yellow-300',
  green: 'bg-green-400',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500'
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
