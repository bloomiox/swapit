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
  X
} from 'lucide-react'

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
  is_published: boolean
  created_at: string
  updated_at: string
}

export function ContentManagement() {
  const [categories, setCategories] = useState<Category[]>([])
  const [contentPages, setContentPages] = useState<ContentPage[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'categories' | 'pages' | 'announcements'>('categories')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategoryName, setNewCategoryName] = useState('')

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      // Fetch categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: false })

      if (categoriesError) throw categoriesError
      setCategories(categoriesData || [])

      // Mock content pages data
      const mockPages: ContentPage[] = [
        {
          id: '1',
          title: 'About SwapIt',
          slug: 'about',
          content: 'SwapIt is a sustainable marketplace for item exchanges...',
          is_published: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'How It Works',
          slug: 'how-it-works',
          content: 'Learn how to use SwapIt to exchange items...',
          is_published: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          title: 'Community Guidelines',
          slug: 'guidelines',
          content: 'Our community guidelines ensure a safe environment...',
          is_published: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ]
      setContentPages(mockPages)

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

  const handlePageToggle = (pageId: string) => {
    setContentPages(prev => prev.map(page => 
      page.id === pageId ? { ...page, is_published: !page.is_published } : page
    ))
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
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  New Page
                </button>
              </div>

              <div className="space-y-3">
                {contentPages.map((page) => (
                  <div key={page.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${page.is_published ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{page.title}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          /{page.slug} • Updated {new Date(page.updated_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageToggle(page.id)}
                        className={`px-3 py-1 text-xs font-medium rounded ${
                          page.is_published
                            ? 'bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200'
                        }`}
                      >
                        {page.is_published ? 'Published' : 'Draft'}
                      </button>
                      
                      <button className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                        <Edit className="w-4 h-4" />
                      </button>
                      
                      <button className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400">
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
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center">
                  <Plus className="w-4 h-4 mr-2" />
                  New Announcement
                </button>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-8 text-center">
                <Globe className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Announcements</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  Create announcements to notify users about platform updates, maintenance, or important news.
                </p>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Create First Announcement
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}