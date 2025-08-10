const BASE_URL = import.meta.env.VITE_COMPILER_API_URL || 'http://localhost:3001'

export type UserMetrics = {
  spins_total: number
  streak_current: number
  streak_best: number
  combo_multiplier: number
  total: number
  normal_count: number
  jaine_count: number
}

export const statsService = {
  async postSpin(address: string, rarity: string) {
    await fetch(`${BASE_URL}/api/stats/spin`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, rarity })
    })
  },
  async getUserMetrics(address: string): Promise<UserMetrics> {
    const res = await fetch(`${BASE_URL}/api/stats/user/${address}`)
    const json = await res.json()
    if (!res.ok || !json.success) throw new Error(json.error || 'Failed to load metrics')
    const d = json.data || {}
    return {
      spins_total: d.spins_total || 0,
      streak_current: d.streak_current || 0,
      streak_best: d.streak_best || 0,
      combo_multiplier: d.combo_multiplier || 1,
      total: d.total || 0,
      normal_count: d.normal_count || 0,
      jaine_count: d.jaine_count || 0,
    }
  }
}


