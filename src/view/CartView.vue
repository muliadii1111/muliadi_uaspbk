<template>
  <div class="cart-view">
    <h1>Keranjang Belanja</h1>
    
    <div class="add-item-form">
      <input v-model="newItem.name" placeholder="Nama Item">
      <input v-model.number="newItem.price" type="number" placeholder="Harga">
      <button @click="addItem">+ Tambah</button>
    </div>

    <div class="cart-items">
      <CartItem 
        v-for="(item, index) in cartItems" 
        :key="index"
        :item="item"
        @increase="increaseQuantity(index)"
        @decrease="decreaseQuantity(index)"
        @remove="removeItem(index)"
      />
    </div>

    <CartSummary 
      :total-items="cartItems.length" 
      :total-price="totalPrice"
      @checkout="handleCheckout"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import CartItem from '@/components/CartItem.vue';
import CartSummary from '@/components/CartSummary.vue';

const newItem = ref({
  name: '',
  price: 0,
  quantity: 1
});

const cartItems = ref([]);

const totalPrice = computed(() => {
  return cartItems.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

// Method untuk manipulasi cart
const addItem = () => {
  if (newItem.value.name && newItem.value.price > 0) {
    cartItems.value.push({ ...newItem.value });
    resetNewItem();
  }
};

const removeItem = (index) => {
  cartItems.value.splice(index, 1);
};

// Method lainnya (increase/decrease quantity)
</script>