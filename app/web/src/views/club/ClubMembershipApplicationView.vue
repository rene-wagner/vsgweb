<script setup lang="ts">
import EditableContent from "@/components/content/EditableContent.vue";
import MembershipApplicationForm from "@/components/forms/MembershipApplicationForm.vue";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      headline=""
      description=""
      headline-uuid="11efd754-cacd-4c62-9a34-0c36444caba3"
      description-uuid="f6d749da-3c43-406e-a687-16b495ffd2b4"
      subtitle-uuid="bfe0eaac-fca7-4bb5-ab4b-e56ef0e99237"
    />

    <section class="bg-white py-16">
      <div class="mx-auto max-w-5xl px-6">
        <div class="prose prose-lg max-w-none font-body text-vsg-blue-700">
          <EditableContent
            uuid="27ef5807-6fad-48fd-b6de-b94b6e0fe376"
            content-class="prose prose-lg max-w-none font-body text-vsg-blue-700"
          />
        </div>
      </div>
    </section>

    <section id="mitgliedsantrag-formular" class="bg-gray-100 py-16">
      <div class="mx-auto max-w-5xl px-6">
        <div class="prose prose-lg mb-8 max-w-none font-body text-vsg-blue-700">
          <EditableContent
            uuid="7d7b0d26-e4c5-4a41-a0f4-c7126ea6e1f1"
            content-class="prose prose-lg max-w-none font-body text-vsg-blue-700"
          />
        </div>

        <MembershipApplicationForm />
      </div>
    </section>
  </div>
</template>
