'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  FileText, 
  Image, 
  Tag, 
  Globe, 
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Save,
  X,
  Calendar,
  Users,
  AlertCircle
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface Category {
  id: string
  name: Record<string, string>
  description?: string
  icon?: string
  parent_id?: string
  is_active: boolean
  created_at: string
}

interface ContentPage {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  is_published: boolean
  publish_date: string | null
  author_id: string | null
  created_at: string
  updated_at: string
}

interface Announcement {
  id: string
  title: string
  content: string
  type: 'info' | 'warning' | 'success' | 'error' | 'maintenance'
  priority: number
  is_active: boolean
  start_date: string
  end_date: string | null
  target_audience: 'all' | 'users' | 'admins'
  created_at: string
  updated_at: string
}

interface ContentStats {
  total_pages: number
  published_pages: number
  draft_pages: number
  total_announcements: number
  active_announcements: number
  scheduled_announcements: number
  categories_count: number
  translations_count: number
  recent_updates: number
}

export function ContentManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [contentPages, setContentPages] = useState<ContentPage[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [contentStats, setContentStats] = useState<ContentStats>({
    total_pages: 0,
    published_pages: 0,
    draft_pages: 0,
    total_announcements: 0,
    active_announcements: 0,
    scheduled_announcements: 0,
    categories_count: 0,
    translations_count: 0,
    recent_updates: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'categories' | 'pages' | 'announcements'>('categories')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')
  const [newPageTitle, setNewPageTitle] = useState('')
  const [newAnnouncementTitle, setNewAnnouncementTitle] = useState('')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      setLoading(true)

      // Fetch content management stats
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_content_management_stats')

      if (statsError) throw statsError
      setContentStats(statsData || {})

      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      // Fetch content pages
      const { data: pagesData, error: pagesError } = await supabase
        .from('content_pages')
        .select('*')
        .order('updated_at', { ascending: false })

      if (pagesError) throw pagesError
      setContentPages(pagesData || [])

      // Fetch announcements
      const { data: announcementsData, error: announcementsError } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })

      if (announcementsError) throw announcementsError
      setAnnouncements(announcementsData || [])

    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryToggle = async (categoryId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update({ is_active: !isActive })
        .eq('id', categoryId)

      if (error) throw error
      
      setCategories(prev => prev.map(cat => 
        cat.id === categoryId ? { ...cat, is_active: !isActive } : cat
      ))
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) return

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([{
          name: { en: newCategoryName },
          is_active: true
        }])
        .select()

      if (error) throw error
      
      if (data) {
        setCategories(prev => [data[0], ...prev])
        setNewCategoryName('')
      }
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error
      
      setCategories(prev => prev.filter(cat => cat.id !== categoryId))
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handlePageToggle = async (pageId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('content_pages')
        .update({ 
          is_published: !currentStatus,
          publish_date: !currentStatus ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', pageId)

      if (error) throw error
      
      setContentPages(prev => prev.map(page => 
        page.id === pageId ? { ...page, is_published: !currentStatus } : page
      ))
    } catch (error) {
      console.error('Error updating page:', error)
    }
  }

  const handleAnnouncementToggle = async (announcementId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('announcements')
        .update({ 
          is_active: !currentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', announcementId)

      if (error) throw error
      
      setAnnouncements(prev => prev.map(announcement => 
        announcement.id === announcementId ? { ...announcement, is_active: !currentStatus } : announcement
      ))
    } catch (error) {
      console.error('Error updating announcement:', error)
    }
  }

  const handleAddPage = async () => {
    if (!newPageTitle.trim()) return

    try {
      const slug = newPageTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      
      const { data, error } = await supabase
        .from('content_pages')
        .insert([{
          title: newPageTitle,
          slug: slug,
          content: `# ${newPageTitle}\n\nStart writing your content here...`,
          is_published: false
        }])
        .select()

      if (error) throw error
      
      if (data) {
        setContentPages(prev => [data[0], ...prev])
        setNewPageTitle('')
      }
    } catch (error) {
      console.error('Error adding page:', error)
    }
  }

  const handleAddAnnouncement = async () => {
    if (!newAnnouncementTitle.trim()) return

    try {
      const { data, error } = await supabase
        .from('announcements')
        .insert([{
          title: newAnnouncementTitle,
          content: 'Enter your announcement content here...',
          type: 'info',
          priority: 1,
          is_active: false,
          target_audience: 'all'
        }])
        .select()

      if (error) throw error
      
      if (data) {
        setAnnouncements(prev => [data[0], ...prev])
        setNewAnnouncementTitle('')
      }
    } catch (error) {
      console.error('Error adding announcement:', error)
    }
  }

  const handleDeletePage = async (pageId: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return

    try {
      const { error } = await supabase
        .from('content_pages')
        .delete()
        .eq('id', pageId)

      if (error) throw error
      
      setContentPages(prev => prev.filter(page => page.id !== pageId))
    } catch (error) {
      console.error('Error deleting page:', error)
    }
  }

  const handleDeleteAnnouncement = async (announcementId: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return

    try {
      const { error } = await supabase
        .from('announcements')
        .delete()
        .eq('id', announcementId)

      if (error) throw error
      
      setAnnouncements(prev => prev.filter(announcement => announcement.id !== announcementId))
    } catch (error) {
      console.error('Error deleting announcement:', error)
    }
  }

  const getAnnouncementTypeColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'maintenance':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48 animate-pulse"></div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Content Management
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Manage categories, pages, and platform content.
        </p>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Pages</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {loading ? '...' : contentStats.total_pages}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {loading ? '...' : `${contentStats.published_pages} published`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Globe className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Announcements</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {loading ? '...' : contentStats.total_announcements}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {loading ? '...' : `${contentStats.active_announcements} active`}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <Tag className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {loading ? '...' : contentStats.categories_count}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Active categories
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Updates</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {loading ? '...' : contentStats.recent_updates}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                This week
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('categories')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'categories'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Tag className="w-4 h-4 inline mr-2" />
              Categories
            </button>
            <button
              onClick={() => setActiveTab('pages')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pages'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Pages
            </button>
            <button
              onClick={() => setActiveTab('announcements')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'announcements'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <Globe className="w-4 h-4 inline mr-2" />
              Announcements
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'categories' && (
            <div className="space-y-6">
              {/* Add Category */}
              <div className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder="New category name..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Category
                </button>
              </div>

              {/* Categories List */}
              <div className="space-y-3">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${category.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">
                          {category.name?.en || 'Unnamed Category'}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Created {new Date(category.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleCategoryToggle(category.id, category.is_active)}
                        className={`px-3 py-1 text-xs font-medium rounded ${
                          category.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200'
                        }`}
                      >
                        {category.is_active ? (
                          <>
                            <Eye className="w-3 h-3 mr-1 inline" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1 inline" />
                            Inactive
                          </>
                        )}
                      </button>
                      
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'pages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content Pages</h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="New page title..."
                    value={newPageTitle}
                    onChange={(e) => setNewPageTitle(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button 
                    onClick={handleAddPage}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Page
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                {contentPages.map((page) => (
                  <div key={page.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${page.is_published ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{page.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          /{page.slug} • Updated {formatDistanceToNow(new Date(page.updated_at), { addSuffix: true })}
                        </p>
                        {page.excerpt && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 max-w-md truncate">
                            {page.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageToggle(page.id, page.is_published)}
                        className={`px-3 py-1 text-xs font-medium rounded ${
                          page.is_published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200'
                        }`}
                      >
                        {page.is_published ? (
                          <>
                            <Eye className="w-3 h-3 mr-1 inline" />
                            Published
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3 mr-1 inline" />
                            Draft
                          </>
                        )}
                      </button>
                      
                      <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button 
                        onClick={() => handleDeletePage(page.id)}
                        className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Platform Announcements</h3>
                <div className="flex items-center space-x-4">
                  <input
                    type="text"
                    placeholder="New announcement title..."
                    value={newAnnouncementTitle}
                    onChange={(e) => setNewAnnouncementTitle(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button 
                    onClick={handleAddAnnouncement}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Announcement
                  </button>
                </div>
              </div>

              {announcements.length === 0 ? (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                  <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Announcements</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    Create announcements to notify users about platform updates, maintenance, or important news.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {announcements.map((announcement) => (
                    <div key={announcement.id} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className={`w-3 h-3 rounded-full mt-2 ${announcement.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-medium text-gray-900 dark:text-white">{announcement.title}</h4>
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAnnouncementTypeColor(announcement.type)}`}>
                              {announcement.type}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Priority: {announcement.priority}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                            {announcement.content}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <span className="flex items-center">
                              <Users className="w-3 h-3 mr-1" />
                              {announcement.target_audience}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {formatDistanceToNow(new Date(announcement.created_at), { addSuffix: true })}
                            </span>
                            {announcement.end_date && (
                              <span className="flex items-center">
                                <AlertCircle className="w-3 h-3 mr-1" />
                                Expires {formatDistanceToNow(new Date(announcement.end_date), { addSuffix: true })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAnnouncementToggle(announcement.id, announcement.is_active)}
                          className={`px-3 py-1 text-xs font-medium rounded ${
                            announcement.is_active
                              ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200'
                          }`}
                        >
                          {announcement.is_active ? 'Active' : 'Inactive'}
                        </button>
                        
                        <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                          <Edit className="w-4 h-4" />
                        </button>
                        
                        <button 
                          onClick={() => handleDeleteAnnouncement(announcement.id)}
                          className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}