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
        id: 'a6e4c340-afd1-4405-b58e-8d7438ce9b55'
      },
      {
        name: "Kaalia of the Vast",
        id: 'e71c8c39-3fbb-4a42-9cf6-b3224f5a56fc'
      },
      {
        name: 'Tariel, Reckoner of Souls',
        id: 'b588dc15-68e6-4cbb-9345-a921c10f862d'
      },
      {
        name: 'Zedruu the Greathearted',
        id: 'c1f49150-9977-4ccb-b6cb-f89f7da9bf85'
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
        name: 'Yawgmoth, Thran Physician',
        id: '8690cbcc-f8fd-41f7-9e28-e61c12b04014'
      },
      {
        name: 'Klauth, Unrivaled Ancient',
        id: '7f5cf828-17b2-4105-9a9a-ee0ab720c2ee'
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
        name: 'Daxos of Meletis',
        id: 'd2eca63b-7fb2-4a69-84dd-aa0a038a2f8a'
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
