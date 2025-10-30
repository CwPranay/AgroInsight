export function WeatherForecastSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded-lg w-64 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="h-11 bg-gray-200 rounded-xl w-40"></div>
            <div className="h-11 bg-gray-200 rounded-xl w-48"></div>
            <div className="h-11 bg-gray-200 rounded-xl w-24"></div>
          </div>
        </div>
      </div>

      {/* Forecast Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-md">
            <div className="text-center space-y-2">
              <div className="h-4 bg-gray-200 rounded w-12 mx-auto"></div>
              <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
              <div className="w-8 h-8 bg-gray-200 rounded-full mx-auto my-3"></div>
              <div className="h-8 bg-gray-200 rounded w-12 mx-auto"></div>
              <div className="h-3 bg-gray-200 rounded w-10 mx-auto"></div>
              <div className="h-3 bg-gray-200 rounded w-12 mx-auto mt-2"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Details Skeleton */}
      <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-gray-200">
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="h-7 bg-gray-200 rounded w-40 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="w-16 h-16 bg-gray-200 rounded-2xl"></div>
            </div>
            <div className="flex items-end gap-4">
              <div className="h-16 bg-gray-200 rounded w-24"></div>
              <div className="h-10 bg-gray-200 rounded w-16"></div>
            </div>
            <div className="h-20 bg-gray-200 rounded-xl"></div>
          </div>
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="grid grid-cols-2 gap-2 sm:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
