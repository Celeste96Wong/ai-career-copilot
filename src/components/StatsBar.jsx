import { useEffect, useState } from 'react'
import { getStats } from '../lib/supabase'

export default function StatsBar() {
  const [stats, setStats] = useState({ total_resumes: 0, total_users: 0, feedback_count: 0 })

  useEffect(() => {
    getStats().then(setStats)
  }, [])

  const items = [
    { label: 'Resumes Analyzed', value: stats.total_resumes, icon: '📄' },
    { label: 'Users', value: stats.total_users, icon: '👥' },
    { label: 'Feedback Received', value: stats.feedback_count, icon: '⭐' },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-6 py-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="flex items-center gap-3 bg-card border border-border rounded-xl px-6 py-4 min-w-[160px]"
        >
          <span className="text-2xl">{item.icon}</span>
          <div>
            <p className="text-2xl font-bold text-white">{item.value}</p>
            <p className="text-xs text-muted">{item.label}</p>
          </div>
        </div>
      ))}
    </div>
  )
}