<template>
  <main class="home-page">
    <section class="home-hero">
      <div class="home-hero-text">
        <h1>
          <span>La tua spesa</span>
          <span>pronta quando vuoi</span>
        </h1>

        <p>
          Scegli il supermercato, prepara il carrello e prenota il ritiro in pochi
          passaggi.
        </p>

        <div class="home-actions">
          <RouterLink to="/supermarkets" class="btn home-main-button">
            Scegli il tuo supermercato
          </RouterLink>

        </div>
      </div>

      <div class="home-hero-image">
        <img
          src="/images/hero-background.png"
          alt="Spesa Fresh2Go pronta per il ritiro"
        />
      </div>
    </section>

    <section class="home-steps" aria-label="Come funziona Fresh2Go">
      <div class="home-step">
        <div class="home-step-icon">▣</div>
        <div>
          <h2>Scegli</h2>
          <p>Seleziona il supermercato più vicino a te.</p>
        </div>
      </div>

      <div class="home-step">
        <div class="home-step-icon">🛒</div>
        <div>
          <h2>Aggiungi</h2>
          <p>Sfoglia il catalogo e aggiungi i prodotti al carrello.</p>
        </div>
      </div>

      <div class="home-step">
        <div class="home-step-icon">▢</div>
        <div>
          <h2>Ritira</h2>
          <p>Prenota il ritiro e passa a ritirare la tua spesa.</p>
        </div>
      </div>
    </section>
  </main>
</template>