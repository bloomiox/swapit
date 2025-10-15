'use client'

import { useState } from 'react'

export function useAddItemModal() {
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)

  const openAddItem = () => setIsAddItemOpen(true)
  const closeAddItem = () => setIsAddItemOpen(false)

  return {
    isAddItemOpen,
    openAddItem,
    closeAddItem
  }
}