import { computed, toValue, type MaybeRefOrGetter } from "vue";

export type SectionBackground = "white" | "gray";

export function useSectionBackground(background: MaybeRefOrGetter<SectionBackground | undefined>) {
  return computed(() => (toValue(background) === "gray" ? "bg-gray-50" : "bg-white"));
}
