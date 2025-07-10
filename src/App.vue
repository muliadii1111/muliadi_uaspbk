<template>
  <div id="app">
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
</script>

<style>
body {
  margin: 0;
  font-family: 'Merriweather', serif;
  background-color: #f5f0e6;
}
</style>
