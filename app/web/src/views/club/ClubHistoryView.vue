<script setup lang="ts">
import CtaSection from "@/components/content/CtaSection.vue";
import HeroSectionSmall from "@/components/content/HeroSectionSmall.vue";
import MarkdownRenderer from "@/components/ui/MarkdownRenderer.vue";
import FactCard from "@/components/ui/FactCard.vue";
import Timeline from "@/components/ui/Timeline.vue";
import Chart from "@/components/ui/Chart.vue";
import Accordion from "@/components/ui/Accordion.vue";
import { clubHistoryContent } from "@/content/club-history-content";
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      :headline="clubHistoryContent.heroHeadline"
      :description="clubHistoryContent.heroDescription"
      :subtitle="clubHistoryContent.heroSubtitle"
      :editable-headline="false"
      :editable-description="false"
      :primary-cta-label="clubHistoryContent.heroPrimaryCtaLabel"
      :primary-cta-anchor="clubHistoryContent.heroPrimaryCtaAnchor"
      :secondary-cta-label="clubHistoryContent.heroSecondaryCtaLabel"
      :secondary-cta-anchor="clubHistoryContent.heroSecondaryCtaAnchor"
    />

    <section id="gruendung" class="bg-white py-24">
      <div class="mx-auto max-w-7xl px-6">
        <div class="grid items-start gap-16 lg:grid-cols-2">
          <div class="space-y-8">
            <div class="flex items-center gap-4">
              <div class="h-px w-12 bg-vsg-gold-600"></div>
              <span class="font-display text-2xl tracking-widest text-vsg-gold-600 uppercase">
                {{ clubHistoryContent.foundingTagline }}
              </span>
            </div>

            <h2 class="font-display text-5xl text-vsg-blue-900 uppercase md:text-6xl">
              {{ clubHistoryContent.foundingHeadline }}
            </h2>

            <div class="font-body text-lg leading-relaxed text-vsg-blue-700">
              <MarkdownRenderer :content="clubHistoryContent.foundingDescription" />
            </div>

            <FactCard
              :title="clubHistoryContent.foundingFactCardHeadline"
              :facts="clubHistoryContent.foundingFacts"
            />
          </div>

          <Timeline
            :title="clubHistoryContent.foundingMilestonesHeadline"
            :items="clubHistoryContent.foundingMilestones"
          />
        </div>
      </div>
    </section>

    <section id="entwicklung" class="bg-gray-50 py-24">
      <div class="mx-auto max-w-7xl px-6">
        <div class="mb-16 text-center">
          <h2 class="mb-4 font-display text-5xl text-vsg-blue-900 uppercase md:text-6xl">
            {{ clubHistoryContent.developmentHeadline }}
          </h2>
          <div class="mx-auto max-w-2xl font-body text-lg text-vsg-blue-700">
            <MarkdownRenderer :content="clubHistoryContent.developmentDescription" />
          </div>
        </div>

        <div class="mb-20 rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <div class="mb-8 flex items-center justify-between">
            <h3 class="font-display text-2xl tracking-widest text-vsg-gold-600 uppercase">
              {{ clubHistoryContent.developmentChartHeadline }}
            </h3>
            <div class="flex items-center gap-4 text-xs tracking-tighter text-vsg-blue-600 uppercase">
              <span class="flex items-center gap-1">
                <div class="h-3 w-3 rounded-full bg-vsg-gold-500"></div>
                {{ clubHistoryContent.developmentChartLegendLabel }}
              </span>
            </div>
          </div>
          <div class="h-100 w-full">
            <Chart :data="clubHistoryContent.developmentChartData" />
          </div>
        </div>

        <div class="mx-auto max-w-4xl space-y-4">
          <h3 class="mb-8 text-center font-display text-3xl tracking-widest text-vsg-blue-900 uppercase">
            {{ clubHistoryContent.developmentChronicleHeadline }}
          </h3>
          <Accordion :items="clubHistoryContent.developmentChronicleGroups" />
        </div>
      </div>
    </section>

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
