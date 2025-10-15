'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState('dashboard')
  const router = useRouter()

  useEffect(() => {
    checkAdminAccess()
  }, [])

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/login')
        return
      }

      // Check if user is admin - first check database, then fallback to email list
      const { data: userProfile } = await supabase
        .from('users')
        .select('is_admin, role')
        .eq('id', user.id)
        .single()

      const adminEmails = [
        'admin@swapit.com',
        'support@swapit.com',
        'gregor.herz@yopmail.com', // Your email
      ]

      const isUserAdmin = userProfile?.is_admin || 
                         userProfile?.role === 'admin' ||
                         adminEmails.includes(user.email || '') || 
                         user.user_metadata?.role === 'admin'

      if (!isUserAdmin) {
        router.push('/')
        return
      }

      setUser(user)
      setIsAdmin(true)
    } catch (error) {
      console.error('Error checking admin access:', error)
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader user={user} />
      
      <div className="flex">
        <AdminSidebar 
          activeSection={activeSection} 
          onSectionChange={setActiveSection} 
        />
        
        <main className="flex-1 p-6">
          <AdminDashboard activeSection={activeSection} />
        </main>
      </div>
    </div>
  )
}