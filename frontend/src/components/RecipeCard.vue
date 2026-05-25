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
  <article class="card recipe-card">
    <RouterLink
      class="recipe-image-link"
      :to="`/recipes/${recipe.id}`"
    >
      <div class="recipe-image">
        <span class="tag tag-accent recipe-type-tag">
          {{ recipeType }}
        </span>

        <img
          v-if="recipe.imageUrl"
          :src="recipe.imageUrl"
          :alt="recipe.name"
        />

        <span v-else class="recipe-placeholder">
          {{ recipe.name.charAt(0) }}
        </span>
      </div>
    </RouterLink>

    <div class="recipe-card-body">
      <h2 class="recipe-name">
        {{ recipe.name }}
      </h2>

      <p class="recipe-info muted-text">
        {{ recipe.servings }} porzioni · {{ ingredientsCount }} ingredienti
      </p>

      <div v-if="allergens.length > 0" class="tag-list">
        <span
          v-for="allergen in allergens"
          :key="allergen"
          class="tag recipe-allergen-tag"
        >
          {{ allergen }}
        </span>
      </div>
    </div>
  </article>
</template>