export default function ProjectsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">プロジェクト</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-2">プロジェクト1</h3>
          <p className="text-gray-600">プロジェクトの説明</p>
        </div>
      </div>
    </div>
  )
}
