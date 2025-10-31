export function SoilInsightsSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Location Bar Skeleton */}
      <div className="bg-gray-200 rounded-xl h-16"></div>

      {/* Main Properties Grid Skeleton */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            <div className="h-8 bg-gray-200 rounded-full w-24"></div>
          </div>
        ))}
      </div>

      {/* Summary Skeleton */}
      <div className="bg-gray-100 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-6 bg-gray-200 rounded w-40 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>

      {/* Recommendations Skeleton */}
      <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
        <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-3 h-12"></div>
          ))}
        </div>
      </div>
    </div>
  )
}
