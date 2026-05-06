<template>
  <main>
    <section class="auth-page">
      <div class="auth-card card">
        <div class="auth-intro">
          <h1 class="page-title">Crea un account</h1>
          <p class="page-description">
            Registrati per salvare i tuoi dati, confermare gli ordini e consultare lo storico
            della spesa.
          </p>
        </div>

        <form class="auth-form">
          <div class="form-row">
            <label for="fullName">Nome completo</label>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="Mario Rossi"
              required
            />
          </div>

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
            <label for="phone">Telefono</label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Opzionale"
            />
          </div>

          <div class="form-row">
            <label for="password">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Inserisci una password"
              required
            />
          </div>

          <div class="form-row">
            <label for="confirmPassword">Conferma password</label>
            <input
              id="confirmPassword"
              type="password"
              name="confirmPassword"
              placeholder="Ripeti la password"
              required
            />
          </div>

          <button class="btn auth-button" type="submit">Registrati</button>

          <p class="auth-link-text">
            Hai già un account?
            <RouterLink to="/login">Accedi</RouterLink>
          </p>
        </form>
      </div>
    </section>
  </main>
</template>