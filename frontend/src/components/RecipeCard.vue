<script setup>
defineProps({
  recipe: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <article class="recipe-card">
    <div class="recipe-image">
      <span>{{ recipe.name.charAt(0) }}</span>
    </div>

    <div class="recipe-content">
      <p class="recipe-type">{{ recipe.type }}</p>

      <h3>{{ recipe.name }}</h3>

      <p class="recipe-description">
        {{ recipe.description }}
      </p>

      <div class="recipe-info">
        <span>{{ recipe.servings }} porzioni</span>
        <span>{{ recipe.ingredients.length }} ingredienti</span>
      </div>

      <div v-if="recipe.allergens.length > 0" class="recipe-allergens">
        <span v-for="allergen in recipe.allergens" :key="allergen">
          {{ allergen }}
        </span>
      </div>

      <p v-else class="recipe-no-allergens">
        Nessun allergene indicato
      </p>

      <RouterLink class="btn-secondary" :to="`/recipes/${recipe.id}`">
        Vedi ricetta
      </RouterLink>
    </div>
  </article>
</template>