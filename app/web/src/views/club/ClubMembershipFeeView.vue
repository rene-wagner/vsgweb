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
      headline-uuid="d808ab63-c264-4ece-a4ce-34f0ceb4061f"
      description-uuid="59e40b4c-1e21-4147-80ee-8fa40618b1d7"
      subtitle-uuid="b0ef8938-51ec-4a1b-ae79-a5c8badb6154"
    />

    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-6">
        <div class="prose prose-lg max-w-none font-body text-vsg-blue-700">
          <EditableContent
            uuid="a7971a4c-4666-408c-8c9e-afcab8a658a7"
            :content="clubMembershipFeeContent.content"
            content-class="prose prose-lg max-w-none font-body text-vsg-blue-700"
          />
        </div>
      </div>
    </section>
  </div>
</template>
