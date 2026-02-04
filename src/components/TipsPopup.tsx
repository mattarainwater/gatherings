import React from 'react'

interface TipsPopupProps {
  onClose: () => void
}

export const TipsPopup: React.FC<TipsPopupProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100">
          Hints
        </h2>

        <div className="space-y-4 text-gray-700 dark:text-gray-300">
          <section>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">General</h3>
            <ul className="list-disc list-inside space-y-2 ml-2">
              <li>The Oracle text may be used, even if the printing doesn't use it</li>
              <li>The specific printing of a card may or may not be relevant</li>
              <li>Art, characters, and other flavor elements may or may not be relevant</li>
            </ul>
          </section>
          <section>
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Categories</h3>
            <p>
              The following are <i>general</i> guidelines for the different category difficulty levels:
            </p>
            <br/>
            <div className="space-y-2 ml-2">
              <div className="flex items-center gap-3">
                <div className="min-w-4 min-h-4 bg-yellow-400 rounded"></div>Typically the gathering can be found directly in the card's name, art, or rules text.
              </div>
              <div className="flex items-center gap-3">
                <div className="min-w-4 min-h-4 bg-green-500 rounded"></div>Similar to Yellow, but may require more attention to detail and may contain a tricky member or two.
              </div>
              <div className="flex items-center gap-3">
                <div className="min-w-4 min-h-4 bg-blue-500 rounded"></div>Not obviously on the card itself, may require some outside knowledge of the card, but may be able to figure it out with some lateral thinking.
              </div>
              <div className="flex items-center gap-3">
                <div className="min-w-4 min-h-4 bg-purple-600 rounded"></div>Probably not on the card at all and may involve lore connections, real-world events, or other obscure references.
              </div>
            </div>
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
