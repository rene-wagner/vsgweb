<script setup lang="ts">
import AccordionSection from "@/components/content/AccordionSection.vue";
import CtaSection from "@/components/content/CtaSection.vue";
import ChartSection from "@/components/content/ChartSection.vue";
import EditableContent from "@/components/content/EditableContent.vue";
import FestivalSection from "@/components/content/FestivalSection.vue";
import HallOfFameSection from "@/components/content/HallOfFameSection.vue";
import HeroSectionSmall from "@/components/content/HeroSectionSmall.vue";
import FactCard from "@/components/ui/FactCard.vue";
import Timeline from "@/components/ui/Timeline.vue";
import { clubHistoryContent } from "@/content/club-history-content";
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      :headline="clubHistoryContent.heroHeadline"
      :description="clubHistoryContent.heroDescription"
      headline-uuid="club-history-hero-headline"
      description-uuid="club-history-hero-description"
      subtitle-uuid="club-history-hero-subtitle"
    />

    <section id="gruendung" class="bg-white py-24">
      <div class="mx-auto max-w-7xl px-6">
        <div class="grid items-start gap-16 lg:grid-cols-2">
          <div class="space-y-8">
            <div class="flex items-center gap-4">
              <div class="h-px w-12 bg-vsg-gold-600"></div>
              <EditableContent
                uuid="club-history-founding-tagline"
                :content="clubHistoryContent.foundingTagline"
                tag="span"
                content-class="font-display text-2xl tracking-widest text-vsg-gold-600 uppercase"
              />
            </div>

            <EditableContent
              uuid="club-history-founding-headline"
              :content="clubHistoryContent.foundingHeadline"
              tag="h2"
              content-class="font-display text-5xl text-vsg-blue-900 uppercase md:text-6xl"
            />

            <div class="font-body text-lg leading-relaxed text-vsg-blue-700">
              <EditableContent
                uuid="club-history-founding-description"
                :content="clubHistoryContent.foundingDescription"
                content-class="font-body text-lg leading-relaxed text-vsg-blue-700"
              />
            </div>

            <FactCard
              :title="clubHistoryContent.foundingFactCardHeadline"
              :facts="clubHistoryContent.foundingFacts"
            />
          </div>

          <Timeline
            :title="clubHistoryContent.foundingMilestonesHeadline"
            title-uuid="club-history-founding-milestones-headline"
            :items="clubHistoryContent.foundingMilestones"
          />
        </div>
      </div>
    </section>

    <ChartSection
      id="entwicklung"
      :subtitle="clubHistoryContent.developmentSubtitle"
      :title="clubHistoryContent.developmentHeadline"
      :description="clubHistoryContent.developmentDescription"
      subtitle-uuid="club-history-development-subtitle"
      title-uuid="club-history-development-headline"
      description-uuid="club-history-development-description"
      :chart-title="clubHistoryContent.developmentChartHeadline"
      chart-title-uuid="club-history-development-chart-title"
      :chart-legend-label="clubHistoryContent.developmentChartLegendLabel"
      chart-legend-label-uuid="club-history-development-chart-legend-label"
      :data="clubHistoryContent.developmentChartData"
      background="gray"
    />

    <AccordionSection
      :subtitle="clubHistoryContent.developmentChronicleSubtitle"
      :title="clubHistoryContent.developmentChronicleHeadline"
      :description="clubHistoryContent.developmentChronicleDescription"
      subtitle-uuid="club-history-chronicle-subtitle"
      title-uuid="club-history-chronicle-headline"
      description-uuid="club-history-chronicle-description"
      :items="clubHistoryContent.developmentChronicleGroups"
      background="white"
    />

    <FestivalSection
      id="festivals"
      :subtitle="clubHistoryContent.festivalsSubtitle"
      :headline="clubHistoryContent.festivalsHeadline"
      :description="clubHistoryContent.festivalsDescription"
      :items="clubHistoryContent.festivalsItems"
      subtitle-uuid="club-history-festivals-subtitle"
      headline-uuid="club-history-festivals-headline"
      description-uuid="club-history-festivals-description"
      item-headline-uuid-prefix="club-history-festivals-item-headline"
      item-text-uuid-prefix="club-history-festivals-item-text"
      background="gray"
    />

    <HallOfFameSection
      id="hall-of-fame"
      :subtitle="clubHistoryContent.hallOfFameSubtitle"
      :headline="clubHistoryContent.hallOfFameHeadline"
      :description="clubHistoryContent.hallOfFameDescription"
      :categories="clubHistoryContent.hallOfFameCategories"
      :items="clubHistoryContent.hallOfFameItems"
      subtitle-uuid="club-history-hall-of-fame-subtitle"
      headline-uuid="club-history-hall-of-fame-headline"
      description-uuid="club-history-hall-of-fame-description"
      item-title-uuid-prefix="club-history-hall-of-fame-item-title"
      item-description-uuid-prefix="club-history-hall-of-fame-item-description"
      item-highlight-uuid-prefix="club-history-hall-of-fame-item-highlight"
      background="white"
    />

    <CtaSection
      :headline="clubHistoryContent.ctaHeadline"
      :description="clubHistoryContent.ctaDescription"
      headline-uuid="club-history-cta-headline"
      description-uuid="club-history-cta-description"
      :primary-button-text="clubHistoryContent.ctaPrimaryButtonText"
      :primary-button-link="clubHistoryContent.ctaPrimaryButtonLink"
      theme="gold"
    />
  </div>
</template>
