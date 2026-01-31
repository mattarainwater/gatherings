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
