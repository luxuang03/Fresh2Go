<template>
  <main>
    <section class="auth-page">
      <div class="auth-card card">
        <div class="auth-intro">
          <h1 class="page-title">Accedi</h1>
          <p class="page-description">
            Accedi al tuo account per gestire il profilo e visualizzare lo storico degli ordini.
          </p>
        </div>

        <form class="auth-form">
          <div class="form-row">
            <label for="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="mario.rossi@email.com"
              required
            />
          </div>

          <div class="form-row">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Inserisci la password"
              required
            />
          </div>

          <button class="btn auth-button" type="submit">Accedi</button>

          <p class="auth-link-text">
            Non hai ancora un account?
            <RouterLink to="/register">Registrati</RouterLink>
          </p>
        </form>
      </div>
    </section>
  </main>
</template>