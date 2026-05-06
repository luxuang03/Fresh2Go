import { computed, ref } from 'vue'

const STORAGE_KEY = 'fresh2go_user'

function loadSavedUser() {
  const savedUser = localStorage.getItem(STORAGE_KEY)

  if (!savedUser) {
    return null
  }

  try {
    return JSON.parse(savedUser)
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

export const currentUser = ref(loadSavedUser())

export const isLoggedIn = computed(() => {
  return currentUser.value !== null
})

export function loginUser(email) {
  const user = {
    id: 1,
    fullName: 'Utente Demo',
    email: email,
    phone: '3331234567',
  }

  currentUser.value = user
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function registerUser(userData) {
  const user = {
    id: 1,
    fullName: userData.fullName,
    email: userData.email,
    phone: userData.phone || 'Non inserito',
  }

  currentUser.value = user
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
}

export function logoutUser() {
  currentUser.value = null
  localStorage.removeItem(STORAGE_KEY)
}