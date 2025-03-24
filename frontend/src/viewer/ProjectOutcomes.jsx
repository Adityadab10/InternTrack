import { RadarChart, BarChart } from "./Charts"

const ProjectOutcomes = ({ filters }) => {
  // Sample data - in a real app, this would come from an API
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
    { name: "PEO1: Technical Competence", value: 88, color: "rgba(139, 92, 246, 0.8)" },
    { name: "PEO2: Professional Skills", value: 82, color: "rgba(167, 139, 250, 0.8)" },
    { name: "PEO3: Ethical Responsibility", value: 75, color: "rgba(196, 181, 253, 0.8)" },
    { name: "PEO4: Innovation & Research", value: 79, color: "rgba(224, 231, 255, 0.8)" },
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
        <div className="card">
          <h3 className="text-xl font-medium mb-4">Program Outcomes (PO) Coverage</h3>
          <div className="h-80">
            <RadarChart data={poData} />
          </div>
        </div>

        <div className="card">
          <h3 className="text-xl font-medium mb-4">Program Educational Objectives (PEO)</h3>
          <div className="h-80">
            <BarChart data={peoData} />
          </div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-xl font-medium mb-4">SDG Contributions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="space-y-4">
              {sdgContributions.map((sdg) => (
                <div key={sdg.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <div className={`w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-3`}>
                      <span className="font-bold text-white">{sdg.id}</span>
                    </div>
                    <h4 className="font-medium">{sdg.name}</h4>
                    <span className="ml-auto font-bold">{sdg.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-600 rounded-full h-2.5">
                    <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${sdg.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-700 rounded-lg p-6">
            <h4 className="text-lg font-medium mb-4">SDG Impact Analysis</h4>
            <p className="text-gray-300 mb-4">
              Internships aligned with SDGs have shown significant impact on both student learning outcomes and
              community development. The data indicates strong correlation between SDG-aligned internships and improved
              program outcomes.
            </p>
            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium text-gray-400">Student Satisfaction</h5>
                <div className="w-full bg-gray-600 rounded-full h-2.5 mt-1">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "88%" }}></div>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-400">Industry Relevance</h5>
                <div className="w-full bg-gray-600 rounded-full h-2.5 mt-1">
                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "92%" }}></div>
                </div>
              </div>
              <div>
                <h5 className="text-sm font-medium text-gray-400">Community Impact</h5>
                <div className="w-full bg-gray-600 rounded-full h-2.5 mt-1">
                  <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "76%" }}></div>
                </div>
              </div>
            </div>
          </div>
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
                <td className="px-4 py-3">Electrical Engineering</td>
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
                <td className="px-4 py-3">Civil Engineering</td>
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

