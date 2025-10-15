// Custom event utilities for the app

// Profile update events
export const dispatchProfileUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('profileUpdated'))
    console.log('Profile update event dispatched')
  }
}

export const addProfileUpdateListener = (callback: () => void) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('profileUpdated', callback)
  }
}

export const removeProfileUpdateListener = (callback: () => void) => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('profileUpdated', callback)
  }
}

// Other custom events can be added here as needed
export const dispatchItemUpdate = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('itemUpdated'))
  }
}

export const addItemUpdateListener = (callback: () => void) => {
  if (typeof window !== 'undefined') {
    window.addEventListener('itemUpdated', callback)
  }
}

export const removeItemUpdateListener = (callback: () => void) => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('itemUpdated', callback)
  }
}