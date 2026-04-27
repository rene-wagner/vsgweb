<script setup lang="ts">
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import CardSection from "@/components/sections/CardSection.vue";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
import Card from "@/components/cards/Card.vue";
import ApiState from "@/components/ui/ApiState.vue";
import { clubBoardContent } from "@/content/club-board-content";
import { getMediaUrl } from "@/services/media-items/media-item.service";
import { useContactPeopleStore } from "@/stores/contactPeopleStore";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const contactPeopleStore = useContactPeopleStore();
const { boardContactPeople, isBoardLoading, boardError } = storeToRefs(contactPeopleStore);

onMounted(() => {
  void contactPeopleStore.ensureBoardLoaded();
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
      headline-uuid="eafad2b5-2378-4daa-9076-57177260b0ab"
      description-uuid="3f35f0ef-3049-454e-a21a-466d15afaff0"
      subtitle-uuid="6a456144-30d6-40c2-85cd-abd8f264368b"
    />

    <CardSection
      :title="clubBoardContent.sectionHeadline"
      :description="clubBoardContent.sectionDescription"
      subtitle-uuid="860bca74-5933-4e8b-872e-7c046fdcbb27"
      title-uuid="97a4f95d-03d5-46fb-b9f0-2fa0417c91cd"
      description-uuid="eed8113c-a686-42cc-9a7c-4ba96c323eaf"
      background="white"
    >
      <ApiState
        class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-4"
        :is-loading="isBoardLoading"
        :error="boardError"
        :empty="boardContactPeople.length === 0"
        empty-message="Derzeit sind keine Kontaktpersonen verfügbar."
      >
        <Card
          v-for="(person, index) in boardContactPeople"
          :key="person.id"
          :title="`${person.firstName} ${person.lastName}`"
          :image-src="person.profileImage ? getMediaUrl(person.profileImage) : undefined"
          :image-alt="`Profilbild von ${person.firstName} ${person.lastName}`"
          image-layout="left"
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
