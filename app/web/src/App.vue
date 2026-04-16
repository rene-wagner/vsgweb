<script setup lang="ts">
import Navbar from "@/components/app/Navbar.vue";
import Footer from "@/components/app/Footer.vue";
import ToastContainer from "@/components/app/ToastContainer.vue";
import CookieConsentBanner from "@/components/app/CookieConsentBanner.vue";
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
