<script setup lang="ts">
import Navbar from '@shared/components/Navbar.vue';
import Footer from '@shared/components/Footer.vue';
import ToastContainer from '@shared/components/ToastContainer.vue';
import CookieConsentBanner from '@shared/components/CookieConsentBanner.vue';
</script>

<template>
  <div class="min-h-screen overflow-x-hidden bg-vsg-blue-900 text-white">
    <Navbar />
    <main>
      <router-view />
    </main>
    <Footer />
    <ToastContainer />
    <CookieConsentBanner />
  </div>
</template>
