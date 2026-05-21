import { reactive } from 'vue'

export const notifications = reactive([])

let notificationId = 0

export function showNotification(message, type = 'info') {
  const notification = {
    id: notificationId++,
    message,
    type,
  }

  notifications.push(notification)

  setTimeout(() => {
    removeNotification(notification.id)
  }, 3500)
}

export function removeNotification(id) {
  const notificationIndex = notifications.findIndex((notification) => {
    return notification.id === id
  })

  if (notificationIndex !== -1) {
    notifications.splice(notificationIndex, 1)
  }
}