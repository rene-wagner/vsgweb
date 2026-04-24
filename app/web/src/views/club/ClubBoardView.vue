<script setup lang="ts">
import { storeToRefs } from "pinia";
import CardSection from "@/components/sections/CardSection.vue";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
import Card from "@/components/ui/Card.vue";
import ApiState from "@/components/ui/ApiState.vue";
import { clubBoardContent } from "@/content/club-board-content";
import { getMediaUrl } from "@/services/media-items/media-item.service";
import { useContactPeopleStore } from "@/stores/contactPeopleStore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const contactPeopleStore = useContactPeopleStore();
const { contactPeople, isLoading, error } = storeToRefs(contactPeopleStore);

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
    >
      <ApiState
        class="mt-16 grid grid-cols-2 gap-4"
        :is-loading="isLoading"
        :error="error"
        :empty="contactPeople.length === 0"
        empty-message="Derzeit sind keine Kontaktpersonen verfuegbar."
      >
        <Card
          v-for="(person, index) in contactPeople"
          :key="person.id"
          :title="`${person.firstName} ${person.lastName}`"
          :image-src="person.profileImage ? getMediaUrl(person.profileImage) : undefined"
          :image-alt="`Profilbild von ${person.firstName} ${person.lastName}`"
        >
          <template #icon>
            <div
              class="flex h-16 w-16 shrink-0 items-center justify-center rounded-full"
              :class="getBadgeColor(index)"
            >
              <FontAwesomeIcon icon="user" class="text-xl text-vsg-blue-900" />
            </div>
          </template>

          <span
            class="mt-2 inline-flex rounded-full px-3 py-1 text-sm font-medium text-vsg-blue-900"
            :class="getBadgeColor(index)"
          >
            {{ person.type }}
          </span>
        </Card>
      </ApiState>
    </CardSection>
  </div>
</template>
