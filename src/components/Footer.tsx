import React from 'react'

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-gray-800 sm:bg-gray-100 sm:dark:bg-gray-900 py-4 px-4 mt-auto transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-300">
        <div className="text-center sm:text-left">
          Gatherings is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. 
          <br />
          Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.
        </div>
      </div>
    </footer>
  )
}
