import { computed, ref } from 'vue'
import {
  getCurrentUser,
  loginRequest,
  logoutRequest,
  registerRequest,
} from '../services/api'

export const currentUser = ref(null)

export const isLoggedIn = computed(() => {
  return currentUser.value !== null
})

export async function checkCurrentUser() {
  try {
    const data = await getCurrentUser()
    currentUser.value = data.user
    return data.user
  } catch (error) {
    currentUser.value = null
    return null
  }
}

export async function loginUser(email, password) {
  const data = await loginRequest({
    email,
    password,
  })

  currentUser.value = data.user
  return data.user
}

export async function registerUser(userData) {
  const data = await registerRequest(userData)

  return data.user
}

export async function logoutUser() {
  await logoutRequest()
  currentUser.value = null
}