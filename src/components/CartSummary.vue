<template>
  <div class="cart-summary">
    <div class="total-section">
      <span>Total Items: {{ totalItems }}</span>
      <span>Total Price: Rp {{ formatPrice(totalPrice) }}</span>
    </div>
    <button @click="checkout" class="checkout-btn">Checkout</button>
  </div>
</template>

<script setup>
defineProps(['totalItems', 'totalPrice']);

const emit = defineEmits(['checkout']);

const checkout = () => {
  emit('checkout');
};

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
</script>