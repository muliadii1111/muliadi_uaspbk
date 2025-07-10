import { defineStore } from 'pinia';

export const useCartStore = defineStore('cart', {
  state: () => ({
    items: [],
    newItem: {
      name: '',
      price: 0,
      quantity: 1
    }
  }),
  actions: {
    addItem() {
      if (this.newItem.name && this.newItem.price > 0) {
        this.items.push({ ...this.newItem });
        this.resetNewItem();
      }
    },
    removeItem(index) {
      this.items.splice(index, 1);
    },
    increaseQuantity(index) {
      this.items[index].quantity++;
    },
    decreaseQuantity(index) {
      if (this.items[index].quantity > 1) {
        this.items[index].quantity--;
      } else {
        this.removeItem(index);
      }
    },
    resetNewItem() {
      this.newItem = {
        name: '',
        price: 0,
        quantity: 1
      };
    }
  },
  getters: {
    totalPrice: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
    formattedTotalPrice: (state) => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }
});