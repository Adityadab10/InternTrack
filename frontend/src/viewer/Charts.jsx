export const BarChart = ({ data }) => {
    const maxValue = Math.max(...data.map((item) => item.count || item.value))
  
    return (
      <div className="h-full flex flex-col justify-end">
        <div className="flex h-full items-end space-x-2">
          {data.map((item, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div
                className="w-full rounded-t-md"
                style={{
                  height: `${((item.count || item.value) / maxValue) * 100}%`,
                  backgroundColor: item.color || "rgba(139, 92, 246, 0.8)",
                  minHeight: "4px",
                }}
              ></div>
              <div
                className="text-xs mt-2 text-center truncate w-full"
                style={{ transform: "rotate(-45deg)", transformOrigin: "left top" }}
              >
                {item.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export const PieChart = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0)
    let cumulativePercentage = 0
  
    return (
      <div className="h-full flex items-center justify-center">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const startAngle = cumulativePercentage * 3.6 // 3.6 = 360 / 100
              cumulativePercentage += percentage
              const endAngle = cumulativePercentage * 3.6
  
              const x1 = 50 + 40 * Math.cos((startAngle - 90) * (Math.PI / 180))
              const y1 = 50 + 40 * Math.sin((startAngle - 90) * (Math.PI / 180))
              const x2 = 50 + 40 * Math.cos((endAngle - 90) * (Math.PI / 180))
              const y2 = 50 + 40 * Math.sin((endAngle - 90) * (Math.PI / 180))
  
              const largeArcFlag = percentage > 50 ? 1 : 0
  
              const pathData = [`M 50 50`, `L ${x1} ${y1}`, `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`, `Z`].join(" ")
  
              return (
                <path key={index} d={pathData} fill={`hsl(${index * 40}, 70%, 60%)`} stroke="#1f2937" strokeWidth="1" />
              )
            })}
            <circle cx="50" cy="50" r="20" fill="#1f2937" />
          </svg>
        </div>
  
        <div className="ml-8">
          <div className="space-y-2">
            {data.map((item, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-3 h-3 rounded-sm mr-2"
                  style={{ backgroundColor: `hsl(${index * 40}, 70%, 60%)` }}
                ></div>
                <span className="text-sm">
                  {item.name} ({item.value}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  export const LineChart = ({ data }) => {
    const maxValue = Math.max(...data.map((item) => item.count))
    const points = data
      .map((item, index) => {
        const x = (index / (data.length - 1)) * 100
        const y = 100 - (item.count / maxValue) * 100
        return `${x},${y}`
      })
      .join(" ")
  
    return (
      <div className="h-full flex flex-col">
        <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
          <polyline points={points} fill="none" stroke="rgba(139, 92, 246, 0.8)" strokeWidth="2" />
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100
            const y = 100 - (item.count / maxValue) * 100
            return (
              <circle key={index} cx={x} cy={y} r="2" fill="white" stroke="rgba(139, 92, 246, 0.8)" strokeWidth="1" />
            )
          })}
        </svg>
  
        <div className="flex justify-between mt-2">
          {data.map((item, index) => (
            <div key={index} className="text-xs">
              {item.month}
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export const RadarChart = ({ data }) => {
    const sides = data.length
    const angleStep = (Math.PI * 2) / sides
    const center = { x: 50, y: 50 }
    const radius = 40
  
    const getCoordinates = (angle, value) => {
      const adjustedValue = value / 100
      return {
        x: center.x + radius * adjustedValue * Math.cos(angle),
        y: center.y + radius * adjustedValue * Math.sin(angle),
      }
    }
  
    const points = data
      .map((item, index) => {
        const angle = index * angleStep - Math.PI / 2 // Start from top
        const coords = getCoordinates(angle, item.value)
        return `${coords.x},${coords.y}`
      })
      .join(" ")
  
    return (
      <div className="h-full flex items-center justify-center">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Background grid */}
          {[20, 40, 60, 80, 100].map((level) => {
            const gridPoints = Array.from({ length: sides })
              .map((_, index) => {
                const angle = index * angleStep - Math.PI / 2
                const coords = getCoordinates(angle, level)
                return `${coords.x},${coords.y}`
              })
              .join(" ")
  
            return (
              <polygon key={level} points={gridPoints} fill="none" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" />
            )
          })}
  
          {/* Axes */}
          {data.map((_, index) => {
            const angle = index * angleStep - Math.PI / 2
            const endCoords = getCoordinates(angle, 100)
  
            return (
              <line
                key={index}
                x1={center.x}
                y1={center.y}
                x2={endCoords.x}
                y2={endCoords.y}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="0.5"
              />
            )
          })}
  
          {/* Data polygon */}
          <polygon points={points} fill="rgba(139, 92, 246, 0.3)" stroke="rgba(139, 92, 246, 0.8)" strokeWidth="1" />
  
          {/* Data points */}
          {data.map((item, index) => {
            const angle = index * angleStep - Math.PI / 2
            const coords = getCoordinates(angle, item.value)
  
            return (
              <circle
                key={index}
                cx={coords.x}
                cy={coords.y}
                r="1.5"
                fill="white"
                stroke="rgba(139, 92, 246, 0.8)"
                strokeWidth="0.5"
              />
            )
          })}
        </svg>
  
        <div className="ml-4 text-xs space-y-1">
          {data.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              <span>
                {item.name.split(":")[0]}: {item.value}%
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  