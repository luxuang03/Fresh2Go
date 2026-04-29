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

<style scoped>
.app-header {
  border-bottom: 1px solid #dddddd;
  background-color: #ffffff;
}

.header-content {
  max-width: 1100px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.logo {
  color: #2e7d32;
  font-size: 24px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
}

.main-nav {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.main-nav a {
  color: #222222;
  text-decoration: none;
  font-weight: 500;
}

.main-nav a:hover {
  color: #2e7d32;
}

.main-nav a.router-link-active {
  color: #2e7d32;
  text-decoration: underline;
}
</style>