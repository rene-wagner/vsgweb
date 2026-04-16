<script setup lang="ts">
import { onMounted } from 'vue';
import { useMembershipFeeStore } from '../../stores/membershipFeeStore';
import MarkdownRenderer from '@/shared/components/MarkdownRenderer.vue';
import ApiState from '@/shared/components/ApiState.vue';
import HeroSection from '../../components/HeroSection.vue';
import ContentSection from '../../components/ContentSection.vue';
import Alert from '@/shared/components/Alert.vue';

const membershipFeeStore = useMembershipFeeStore();

onMounted(async () => {
  await membershipFeeStore.fetchMembershipFee();
});
</script>

<template>
  <div class="min-h-screen text-white overflow-x-hidden selection:bg-vsg-gold-500 selection:text-vsg-blue-900">
    <HeroSection
      headline="BEITRAGSORDNUNG"
      description="Mitgliedsbeiträge und Zahlungsmodalitäten"
      min-height="70vh"
    />

    <ContentSection>
      <Alert variant="info">
        <p class="font-body text-lg text-vsg-blue-700">
          <strong class="text-vsg-blue-900">Fragen zur Beitragsordnung?</strong>
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
        :is-loading="membershipFeeStore.isLoading"
        :error="membershipFeeStore.error"
        :empty="!membershipFeeStore.membershipFee?.content"
        empty-message="Die Beitragsordnung wird derzeit aktualisiert."
      >
        <div class="prose prose-lg max-w-none">
          <MarkdownRenderer :content="membershipFeeStore.membershipFee!.content" />
        </div>
      </ApiState>
    </ContentSection>
  </div>
</template>
