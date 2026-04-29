<template>
  <header class="app-header">
    <div class="header-content">
      <RouterLink to="/" class="logo">
        Fresh2Go
      </RouterLink>

      <nav class="main-nav" aria-label="Navigazione principale">
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/supermarkets">Supermercati</RouterLink>
        <RouterLink to="/catalog">Catalogo</RouterLink>
        <RouterLink to="/recipes">Ricette</RouterLink>
        <RouterLink to="/cart">Carrello</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/profile">Profilo</RouterLink>
      </nav>
    </div>
  </header>
</template>
