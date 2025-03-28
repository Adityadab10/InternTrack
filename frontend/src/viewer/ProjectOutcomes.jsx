import { BarChart } from "./Charts"

const ProjectOutcomes = ({ filters }) => {
  const poData = [
    { name: "PO1: Engineering Knowledge", value: 85 },
    { name: "PO2: Problem Analysis", value: 78 },
    { name: "PO3: Design Solutions", value: 92 },
    { name: "PO4: Investigation", value: 65 },
    { name: "PO5: Modern Tool Usage", value: 88 },
    { name: "PO6: Engineer and Society", value: 72 },
    { name: "PO7: Environment & Sustainability", value: 80 },
    { name: "PO8: Ethics", value: 75 },
    { name: "PO9: Individual & Team Work", value: 90 },
    { name: "PO10: Communication", value: 82 },
    { name: "PO11: Project Management", value: 70 },
    { name: "PO12: Lifelong Learning", value: 76 },
  ]

  const peoData = [
    { name: "Technical Competence", value: 88 },
    { name: "Professional Skills", value: 82 },
    { name: "Ethical Responsibility", value: 75 },
    { name: "Innovation & Research", value: 79 },
  ]

  const sdgContributions = [
    { id: 4, name: "Quality Education", percentage: 85 },
    { id: 9, name: "Industry & Innovation", percentage: 78 },
    { id: 8, name: "Decent Work", percentage: 72 },
    { id: 11, name: "Sustainable Cities", percentage: 65 },
    { id: 3, name: "Good Health", percentage: 58 },
    { id: 7, name: "Clean Energy", percentage: 52 },
  ]

  return (
    <div className="space-y-6">
    <h2 className="text-2xl font-bold">Project Outcomes</h2>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Program Outcomes (PO) Coverage */}
      <div className="card">
        <h3 className="text-xl font-medium mb-4">Program Outcomes (PO) Coverage</h3>
        <div className="space-y-3">
          {poData.map((po) => (
            <div key={po.category} className="flex items-center">
              <div className="w-24 text-sm text-gray-400">{po.category}</div>
              <div className="flex-grow bg-gray-700 rounded-full h-3 mr-4">
                <div 
                  className="bg-purple-600 h-3 rounded-full" 
                  style={{ width: `${po.value}%` }}
                ></div>
              </div>
              <div className="w-12 text-right text-sm font-medium">
                {po.value}%
              </div>
              <div className="w-40 pl-4 text-sm text-gray-300">
                {po.name}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Program Educational Objectives (PEO) */}
      <div className="card">
        <h3 className="text-xl font-medium mb-4">Program Educational Objectives (PEO)</h3>
        <div className="space-y-4">
          {peoData.map((peo, index) => (
            <div 
              key={peo.name} 
              className="bg-gray-700 rounded-lg p-4 flex items-center"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mr-4 text-white font-bold"
                style={{
                  backgroundColor: `rgba(139, 92, 246, ${0.6 + index * 0.1})`,
                }}
              >
                {peo.value}%
              </div>
              <div>
                <h4 className="font-semibold text-purple-300">{peo.name}</h4>
                <p className="text-sm text-gray-400">{peo.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <div className="card">
        <h3 className="text-xl font-medium mb-4">SDG Contributions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sdgContributions.map((sdg) => (
            <div key={sdg.id} className="bg-gray-700 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3">
                  <span className="font-bold text-white">{sdg.id}</span>
                </div>
                <h4 className="font-medium flex-grow">{sdg.name}</h4>
                <span className="font-bold">{sdg.percentage}%</span>
              </div>
              <div className="w-full bg-gray-600 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${sdg.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-medium mb-4">Department-wise PO Achievement</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-700">
                <th className="px-4 py-3 text-left">Department</th>
                <th className="px-4 py-3 text-center">PO1</th>
                <th className="px-4 py-3 text-center">PO2</th>
                <th className="px-4 py-3 text-center">PO3</th>
                <th className="px-4 py-3 text-center">PO4</th>
                <th className="px-4 py-3 text-center">PO5</th>
                <th className="px-4 py-3 text-center">Overall</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-700">
                <td className="px-4 py-3">Computer Science</td>
                <td className="px-4 py-3 text-center">92%</td>
                <td className="px-4 py-3 text-center">88%</td>
                <td className="px-4 py-3 text-center">90%</td>
                <td className="px-4 py-3 text-center">85%</td>
                <td className="px-4 py-3 text-center">94%</td>
                <td className="px-4 py-3 text-center font-bold text-purple-400">90%</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-4 py-3">ECS Engineering</td>
                <td className="px-4 py-3 text-center">88%</td>
                <td className="px-4 py-3 text-center">85%</td>
                <td className="px-4 py-3 text-center">82%</td>
                <td className="px-4 py-3 text-center">80%</td>
                <td className="px-4 py-3 text-center">86%</td>
                <td className="px-4 py-3 text-center font-bold text-purple-400">84%</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-4 py-3">Mechanical Engineering</td>
                <td className="px-4 py-3 text-center">85%</td>
                <td className="px-4 py-3 text-center">82%</td>
                <td className="px-4 py-3 text-center">88%</td>
                <td className="px-4 py-3 text-center">84%</td>
                <td className="px-4 py-3 text-center">80%</td>
                <td className="px-4 py-3 text-center font-bold text-purple-400">84%</td>
              </tr>
              <tr className="border-b border-gray-700">
                <td className="px-4 py-3">AIDS Engineering</td>
                <td className="px-4 py-3 text-center">80%</td>
                <td className="px-4 py-3 text-center">78%</td>
                <td className="px-4 py-3 text-center">82%</td>
                <td className="px-4 py-3 text-center">85%</td>
                <td className="px-4 py-3 text-center">76%</td>
                <td className="px-4 py-3 text-center font-bold text-purple-400">80%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default ProjectOutcomes