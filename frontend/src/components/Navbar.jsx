export default function Navbar() {
  return (
      <nav className="bg-gradient-to-r from-blue-800 to-cyan-500 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-blue-700">FYJ</div>
            <h1 className="text-2xl font-bold text-white">Further Your Journey</h1>
          </div>
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center font-bold text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
        </div>
      </nav>
  )
}
