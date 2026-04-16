'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

export function AdminLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="border-white/10 text-white/50 hover:text-white hover:border-white/30 font-mono text-xs"
    >
      Abmelden
    </Button>
  )
}
