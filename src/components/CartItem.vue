<template>
  <div class="cart-item">
    <div class="item-info">
      <span class="item-name">{{ item.name }}</span>
      <span class="item-price">Rp {{ formatPrice(item.price * item.quantity) }}</span>
    </div>
    <div class="item-controls">
      <div class="quantity-control">
        <button @click="$emit('decrease')">-</button>
        <span>{{ item.quantity }}</span>
        <button @click="$emit('increase')">+</button>
      </div>
      <button @click="$emit('remove')" class="remove-btn">🗑️</button>
    </div>
  </div>
</template>

<script setup>
defineProps(['item']);

const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
</script>

<style scoped>
.cart-item {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  margin-bottom: 1rem;
  background: #fff9f0;
  border-radius: 8px;
}
/* CSS lengkap disesuaikan */
</style>