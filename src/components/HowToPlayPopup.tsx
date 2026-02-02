import React from 'react'

interface HowToPlayPopupProps {
  onClose: () => void
}

export const HowToPlayPopup: React.FC<HowToPlayPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          How to Play Gatherings
        </h2>

        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Objective</h3>
            <p>
              Find groups of four Magic: The Gathering cards that share a common connection. 
              You must identify all four categories to win!
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">How to Play</h3>
            <ol className="list-decimal list-inside space-y-2 ml-2">
              <li>Select four cards that you think belong to the same category</li>
              <li>Click "Submit" to check if your guess is correct</li>
              <li>If correct, the cards will be revealed with their category name</li>
              <li>If incorrect, you'll lose one of your four attempts</li>
              <li>Continue until you've found all categories or run out of attempts</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Categories</h3>
            <p className="mb-2">Categories are ordered by difficulty:</p>
            <div className="space-y-2 ml-2">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-400 rounded"></div>
                <span className="font-medium">Yellow</span> - Easiest
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded"></div>
                <span className="font-medium">Green</span> - Easy
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span className="font-medium">Blue</span> - Medium
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-600 rounded"></div>
                <span className="font-medium">Purple</span> - Hardest
              </div>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Tips</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Start with the easiest connections you can spot</li>
              <li>Look at card names, types, abilities or lore connections</li>
              <li>Some categories might involve more obscure facts about the cards</li>
              <li>Be careful of red herrings - cards that seem related but aren't in the same group</li>
              <li>Use the "Shuffle" button to rearrange cards for a fresh perspective</li>
              <li>Click "Deselect All" to clear your current selection</li>
            </ul>
          </section>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  )
}
