export default function SetupRequiredPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              🔧 Setup Required
            </h1>
            <p className="text-gray-600">
              TalentBid needs to be configured with Supabase to work properly
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">Quick Setup Guide</h3>
              <ol className="list-decimal list-inside space-y-2 text-blue-800 text-sm">
                <li>Open <code className="bg-blue-100 px-2 py-1 rounded">GETTING_STARTED.md</code> for detailed instructions</li>
                <li>Create a free Supabase account at <a href="https://database.new" target="_blank" className="underline font-medium">database.new</a></li>
                <li>Run the database migration from <code className="bg-blue-100 px-2 py-1 rounded">supabase/migrations/001_initial_schema.sql</code></li>
                <li>Copy your Supabase URL and API key</li>
                <li>Update <code className="bg-blue-100 px-2 py-1 rounded">.env.local</code> with your credentials</li>
                <li>Restart the development server</li>
              </ol>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <h3 className="font-semibold text-yellow-900 mb-2">Current Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-yellow-800">Supabase URL: Not configured</span>
                </div>
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  <span className="text-yellow-800">Supabase API Key: Not configured</span>
                </div>
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-yellow-800">Emergent LLM Key: Configured</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded">
              <h3 className="font-semibold text-gray-900 mb-2">Documentation</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <div>📄 <code className="bg-gray-200 px-2 py-1 rounded">GETTING_STARTED.md</code> - Quick 15-minute setup</div>
                <div>📄 <code className="bg-gray-200 px-2 py-1 rounded">SUPABASE_SETUP.md</code> - Detailed Supabase guide</div>
                <div>📄 <code className="bg-gray-200 px-2 py-1 rounded">DEPLOYMENT.md</code> - Production deployment</div>
                <div>📄 <code className="bg-gray-200 px-2 py-1 rounded">README.md</code> - Project overview</div>
              </div>
            </div>

            <div className="text-center pt-4">
              <a
                href="/"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold"
              >
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
