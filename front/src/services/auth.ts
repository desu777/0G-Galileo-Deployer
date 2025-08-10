import { signMessage } from '@wagmi/core'
import { config } from '../lib/wagmi'

const BASE_URL = import.meta.env.VITE_COMPILER_API_URL || 'http://localhost:3001'

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export const authService = {
  async requestNonce(address: string): Promise<{ nonce: string; message: string; address: string }> {
    const res = await fetch(`${BASE_URL}/api/auth/nonce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address })
    })
    const json: ApiResponse & { nonce?: string; message?: string; address?: string } = await res.json()
    if (!res.ok || !json.success || !json.nonce || !json.message) {
      throw new Error(json.error || json.message || 'Failed to get nonce')
    }
    return { nonce: json.nonce, message: json.message, address: json.address || address }
  },

  async verify(address: string, signature: string, message: string): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ address, signature, message })
    })
    const json: ApiResponse = await res.json()
    if (!res.ok || !json.success) {
      throw new Error(json.error || json.message || 'Verification failed')
    }
  },

  async ensureAuthenticated(address?: string | null): Promise<boolean> {
    if (!address) return false
    const key = `auth_verified_${address.toLowerCase()}`
    if (localStorage.getItem(key) === 'true') return true
    const { message } = await this.requestNonce(address)
    const signature = await signMessage(config, { message })
    await this.verify(address, signature, message)
    localStorage.setItem(key, 'true')
    return true
  }
}


