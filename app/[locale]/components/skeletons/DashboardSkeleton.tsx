export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Filter Section Skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-20"></div>
              <div className="h-12 bg-gray-200 rounded-xl"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Results Section Skeleton */}
      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200">
        {/* Table Header */}
        <div className="hidden md:block mb-4">
          <div className="grid grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
        
        {/* Table Rows */}
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="hidden md:grid md:grid-cols-6 gap-4 py-4 border-b border-gray-100">
              {[...Array(6)].map((_, j) => (
                <div key={j} className="h-4 bg-gray-200 rounded"></div>
              ))}
            </div>
          ))}
          
          {/* Mobile Cards */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="md:hidden bg-gray-50 rounded-xl p-4 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-32"></div>
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, j) => (
                  <div key={j} className="space-y-1">
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
