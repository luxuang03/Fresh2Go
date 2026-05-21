<script setup>
import { notifications, removeNotification } from '../services/notification'
</script>

<template>
  <div class="notification-container">
    <div
      v-for="notification in notifications"
      :key="notification.id"
      class="notification-message"
      :class="`notification-${notification.type}`"
    >
      <span>{{ notification.message }}</span>

      <button
        type="button"
        class="notification-close"
        @click="removeNotification(notification.id)"
      >
        ×
      </button>
    </div>
  </div>
</template>