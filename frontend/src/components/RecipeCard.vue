<script setup>
import { computed } from 'vue'

const props = defineProps({
  recipe: {
    type: Object,
    required: true,
  },
})

const recipeType = computed(() => {
  return props.recipe.recipeType || props.recipe.type || 'ricetta'
})

const ingredientsCount = computed(() => {
  if (props.recipe.ingredientsCount !== undefined) {
    return Number(props.recipe.ingredientsCount)
  }

  if (!props.recipe.ingredients) {
    return 0
  }

  return props.recipe.ingredients.length
})

const allergens = computed(() => {
  return props.recipe.allergens || []
})
</script>

<template>
  <article class="recipe-card">
    <div class="recipe-image">
      <span>{{ recipe.name.charAt(0) }}</span>
    </div>

    <div class="recipe-content">
      <p class="recipe-type">{{ recipeType }}</p>

      <h3>{{ recipe.name }}</h3>

      <p class="recipe-description">
        {{ recipe.description }}
      </p>

      <div class="recipe-info">
        <span>{{ recipe.servings }} porzioni</span>
        <span>{{ ingredientsCount }} ingredienti</span>
      </div>

      <div v-if="allergens.length > 0" class="recipe-allergens">
        <span
          v-for="allergen in allergens"
          :key="allergen"
        >
          {{ allergen }}
        </span>
      </div>

      <p v-else class="recipe-no-allergens">
        Nessun allergene indicato
      </p>

      <RouterLink
        class="btn-secondary"
        :to="`/recipes/${recipe.id}`"
      >
        Vedi ricetta
      </RouterLink>
    </div>
  </article>
</template>