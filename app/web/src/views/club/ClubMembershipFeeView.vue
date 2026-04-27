<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
import { clubMembershipFeeContent } from "@/content/club-membership-fee-content";
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      :headline="clubMembershipFeeContent.headline"
      :description="clubMembershipFeeContent.description"
      headline-uuid="club-membership-fee-hero-headline"
      description-uuid="club-membership-fee-hero-description"
    />

    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-6">
        <div class="prose prose-lg max-w-none font-body text-vsg-blue-700">
          <EditableContent
            uuid="club-membership-fee-content"
            :content="clubMembershipFeeContent.content"
            content-class="prose prose-lg max-w-none font-body text-vsg-blue-700"
          />
        </div>
      </div>
    </section>
  </div>
</template>
