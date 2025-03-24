import { BarChart, PieChart, LineChart } from "./Charts"

const StatisticsOverview = ({ filters }) => {
  // Sample data - in a real app, this would come from an API
  const departmentStats = [
    { name: "Computer Science", count: 145, color: "rgba(139, 92, 246, 0.8)" },
    { name: "Electrical Engineering", count: 98, color: "rgba(167, 139, 250, 0.8)" },
    { name: "Mechanical Engineering", count: 76, color: "rgba(196, 181, 253, 0.8)" },
    { name: "Civil Engineering", count: 62, color: "rgba(224, 231, 255, 0.8)" },
    { name: "Chemical Engineering", count: 54, color: "rgba(199, 210, 254, 0.8)" },
  ]

  const sectorStats = [
    { name: "Technology", value: 35 },
    { name: "Manufacturing", value: 25 },
    { name: "Healthcare", value: 15 },
    { name: "Finance", value: 15 },
    { name: "Others", value: 10 },
  ]

  const monthlyTrends = [
    { month: "Jan", count: 45 },
    { month: "Feb", count: 52 },
    { month: "Mar", count: 61 },
    { month: "Apr", count: 58 },
    { month: "May", count: 63 },
    { month: "Jun", count: 72 },
    { month: "Jul", count: 85 },
    { month: "Aug", count: 93 },
    { month: "Sep", count: 81 },
    { month: "Oct", count: 75 },
    { month: "Nov", count: 68 },
    { month: "Dec", count: 72 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Internship Statistics Overview</h2>
        <div className="flex space-x-2">
          <select className="select-field text-sm">
            <option>2023-2024</option>
            <option>2022-2023</option>
            <option>2021-2022</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card bg-gradient-to-br from-purple-900 to-purple-700">
          <h3 className="text-lg font-medium mb-1">Total Internships</h3>
          <p className="text-3xl font-bold">435</p>
          <p className="text-purple-200 text-sm mt-2">↑ 12% from last year</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium mb-1">Companies</h3>
          <p className="text-3xl font-bold">87</p>
          <p className="text-purple-200 text-sm mt-2">↑ 8% from last year</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium mb-1">Faculty Mentors</h3>
          <p className="text-3xl font-bold">42</p>
          <p className="text-purple-200 text-sm mt-2">↑ 5% from last year</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-medium mb-1">SDGs Covered</h3>
          <p className="text-3xl font-bold">14</p>
          <p className="text-purple-200 text-sm mt-2">↑ 16% from last year</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-xl font-medium mb-4">Internships by Department</h3>
          <div className="h-80">
            <BarChart data={departmentStats} />
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-medium mb-4">Industry Sectors</h3>
          <div className="h-80">
            <PieChart data={sectorStats} />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-medium mb-4">Monthly Internship Trends</h3>
        <div className="h-80">
          <LineChart data={monthlyTrends} />
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-medium mb-4">Top SDG Contributions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { id: 4, name: "Quality Education", count: 87, color: "bg-red-600" },
            { id: 9, name: "Industry & Innovation", count: 76, color: "bg-orange-600" },
            { id: 8, name: "Decent Work", count: 65, color: "bg-yellow-600" },
            { id: 11, name: "Sustainable Cities", count: 54, color: "bg-green-600" },
            { id: 3, name: "Good Health", count: 43, color: "bg-blue-600" },
          ].map((sdg) => (
            <div key={sdg.id} className="bg-gray-700 rounded-lg p-4 flex flex-col items-center">
              <div className={`${sdg.color} w-12 h-12 rounded-full flex items-center justify-center mb-2`}>
                <span className="font-bold text-white">{sdg.id}</span>
              </div>
              <h4 className="text-sm font-medium text-center">{sdg.name}</h4>
              <p className="text-lg font-bold mt-1">{sdg.count}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatisticsOverview

