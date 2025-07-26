// utils/authGuard.ts
import { useEffect } from 'react'
import { useRouter } from 'next/router'
import supabase from '../lib/supabaseClient'

export const useAuthGuard = () => {
  const router = useRouter()

  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession()
      if (!data.session) router.push('/login')
    }
    check()
  }, [router])
}
