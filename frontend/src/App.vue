<template>
  <div>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/supermarkets">Supermercati</RouterLink>
      <RouterLink to="/catalog">Catalogo</RouterLink>
      <RouterLink to="/recipes">Ricette</RouterLink>
      <RouterLink to="/cart">Carrello</RouterLink>
      <RouterLink to="/login">Login</RouterLink>
      <RouterLink to="/profile">Profilo</RouterLink>
    </nav>

    <RouterView />
  </div>
</template>

<style scoped>
nav {
  display: flex;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #dddddd;
}

a {
  color: #2e7d32;
  text-decoration: none;
  font-weight: 600;
}

a.router-link-active {
  text-decoration: underline;
}
</style>