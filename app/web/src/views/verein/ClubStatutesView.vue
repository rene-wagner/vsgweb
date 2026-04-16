<script setup lang="ts">
import { onMounted } from 'vue';
import { useStatutesStore } from '../../stores/statutesStore';
import MarkdownRenderer from '@/shared/components/MarkdownRenderer.vue';
import ApiState from '@/shared/components/ApiState.vue';
import HeroSection from '../../components/HeroSection.vue';
import ContentSection from '../../components/ContentSection.vue';
import Alert from '@/shared/components/Alert.vue';

const statutesStore = useStatutesStore();

onMounted(async () => {
  await statutesStore.fetchStatutes();
});
</script>

<template>
  <div class="min-h-screen text-white overflow-x-hidden selection:bg-vsg-gold-500 selection:text-vsg-blue-900">
    <HeroSection
      headline="SATZUNG"
      description="Die Vereinssatzung des VSG Kugelberg e.V."
      min-height="70vh"
    />

    <ContentSection>
      <Alert variant="info">
        <p class="font-body text-lg text-vsg-blue-700">
          <strong class="text-vsg-blue-900">Fragen zur Satzung?</strong>
          Wenden Sie sich gerne an unseren Vorstand über die
          <RouterLink
            to="/kontakt"
            class="text-vsg-gold-600 underline hover:text-vsg-gold-700"
          >
            Kontaktseite </RouterLink
          >.
        </p>
      </Alert>

      <ApiState
        :is-loading="statutesStore.isLoading"
        :error="statutesStore.error"
        :empty="!statutesStore.statutes?.content"
        empty-message="Die Satzung wird derzeit aktualisiert."
      >
        <div class="prose prose-lg max-w-none">
          <MarkdownRenderer :content="statutesStore.statutes!.content" />
        </div>
      </ApiState>
    </ContentSection>
  </div>
</template>
