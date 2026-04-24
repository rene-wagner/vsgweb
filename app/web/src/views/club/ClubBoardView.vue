<script setup lang="ts">
import CardSection from "@/components/content/CardSection.vue";
import HeroSectionSmall from "@/components/content/HeroSectionSmall.vue";
import { clubBoardContent } from "@/content/club-board-content";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { computed } from "vue";

const sortedBoardMembers = computed(() => {
  return [...clubBoardContent.boardMembers].sort((a, b) => a.sort - b.sort);
});

function getBadgeColor(index: number): string {
  return index === 0 ? "bg-vsg-gold-400" : "bg-vsg-blue-200";
}
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      :headline="clubBoardContent.heroHeadline"
      :description="clubBoardContent.heroDescription"
      headline-uuid="club-board-hero-headline"
      description-uuid="club-board-hero-description"
    />

    <CardSection
      :title="clubBoardContent.sectionHeadline"
      :description="clubBoardContent.sectionDescription"
      title-uuid="club-board-section-headline"
      description-uuid="club-board-section-description"
      background="white"
      :columns="3"
    >
      <article
        v-for="(member, index) in sortedBoardMembers"
        :key="member.id"
        class="rounded-3xl border border-vsg-blue-100 bg-white p-6 shadow-[0_20px_60px_-40px_rgba(12,42,84,0.45)]"
      >
        <div class="flex items-start gap-4">
          <div
            class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
            :class="getBadgeColor(index)"
          >
            <FontAwesomeIcon icon="user" class="text-xl text-vsg-blue-900" />
          </div>

          <div class="min-w-0 space-y-3">
            <span
              class="inline-flex rounded-full px-3 py-1 text-sm font-medium text-vsg-blue-900"
              :class="getBadgeColor(index)"
            >
              {{ member.type }}
            </span>

            <p class="font-body text-2xl font-semibold text-vsg-blue-900">
              {{ member.firstName }} {{ member.lastName }}
            </p>
          </div>
        </div>
      </article>
    </CardSection>
  </div>
</template>
