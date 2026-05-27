<script setup>
import { reactive } from 'vue'


const cardData = reactive({
  number: '',
  expiry: '',
  cvv: ''
})

const cardErrors = reactive({
  number: '',
  expiry: '',
  cvv: ''
})


function formatCardNumber(event) {
  let val = event.target.value.replace(/\D/g, '')
  val = val.replace(/(.{4})/g, '$1 ').trim()
  cardData.number = val
}


function luhnCheck(num) {
  const arr = (num + '').replace(/\D/g, '').split('').reverse()
  if (!arr.length) return false
  
  let sum = 0
  for (let i = 0; i < arr.length; i++) {
    let n = parseInt(arr[i], 10)
    if (i % 2 !== 0) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
  }
  return sum % 10 === 0
}


function isExpiryValid(val) {
  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(val)) return false
  const [month, year] = val.split('/')
  
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = parseInt(now.getFullYear().toString().slice(-2), 10)
  
  const expMonth = parseInt(month, 10)
  const expYear = parseInt(year, 10)

  if (expYear < currentYear) return false
  if (expYear === currentYear && expMonth < currentMonth) return false
  return true
}


function validate() {
  cardErrors.number = ''
  cardErrors.expiry = ''
  cardErrors.cvv = ''

  const rawCard = cardData.number.replace(/\s/g, '')
  if (rawCard === '') {
    cardErrors.number = 'Inserisci il numero di carta.'
  } else if (!luhnCheck(rawCard)) {
    cardErrors.number = 'Numero di carta non valido.'
  }

  if (cardData.expiry === '') {
    cardErrors.expiry = 'Inserisci la scadenza.'
  } else if (!isExpiryValid(cardData.expiry)) {
    cardErrors.expiry = 'Scadenza non valida (usa MM/YY).'
  }

  if (cardData.cvv === '') {
    cardErrors.cvv = 'Inserisci il CVV.'
  } else if (!/^\d{3,4}$/.test(cardData.cvv)) {
    cardErrors.cvv = 'Il CVV deve avere 3 o 4 cifre.'
  }

  
  return cardErrors.number === '' && cardErrors.expiry === '' && cardErrors.cvv === ''
}


defineExpose({
  validate
})
</script>

<template>
  <div class="checkout-section">
    <h3>Dati di pagamento</h3>

    <div class="form-row">
      <label for="cardNumber">Numero di carta</label>
      <input
        id="cardNumber"
        v-model="cardData.number"
        @input="formatCardNumber"
        type="text"
        placeholder="0000 0000 0000 0000"
        maxlength="19"
      >
      <p v-if="cardErrors.number" class="form-error">
        {{ cardErrors.number }}
      </p>
    </div>

    <div class="form-row-group">
      <div class="form-row">
        <label for="cardExpiry">Scadenza (MM/YY)</label>
        <input
          id="cardExpiry"
          v-model="cardData.expiry"
          type="text"
          placeholder="MM/YY"
          maxlength="5"
        >
        <p v-if="cardErrors.expiry" class="form-error">
          {{ cardErrors.expiry }}
        </p>
      </div>

      <div class="form-row">
        <label for="cardCvv">CVV</label>
        <input
          id="cardCvv"
          v-model="cardData.cvv"
          type="text"
          placeholder="123"
          maxlength="4"
        >
        <p v-if="cardErrors.cvv" class="form-error">
          {{ cardErrors.cvv }}
        </p>
      </div>
    </div>
  </div>
</template>