<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watchEffect } from "vue";
import { Calendar } from "@fullcalendar/core";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import deLocale from "@fullcalendar/core/locales/de";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { Event as VsgEvent } from "@vsg/sdk";
import CtaSection from "@/components/sections/CtaSection.vue";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
import ApiState from "@/components/ui/ApiState.vue";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

interface EventOccurrence {
  instanceId: string;
  event: VsgEvent;
  startsAt: string;
  endsAt: string | null;
}

const calendarElement = ref<HTMLElement | null>(null);
const calendar = ref<Calendar | null>(null);
const events = ref<VsgEvent[]>([]);
const selectedEvent = ref<EventOccurrence | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const eventOccurrences = computed(() => sortEventOccurrences(expandEventOccurrences(events.value)));
const upcomingEventOccurrences = computed(() =>
  eventOccurrences.value.filter((occurrence) => isOccurrenceWithinUpcomingRange(occurrence)),
);
const hasEvents = computed(() => eventOccurrences.value.length > 0);
const hasUpcomingEvents = computed(() => upcomingEventOccurrences.value.length > 0);
const showCalendar = computed(() => !error.value);

const selectedEventDateLabel = computed(() => {
  if (!selectedEvent.value) {
    return "";
  }

  return formatEventDateRange(selectedEvent.value.startsAt, selectedEvent.value.endsAt);
});

function isValidDateString(value: string | null | undefined): value is string {
  if (!value) {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
}

function sortEvents(items: VsgEvent[]): VsgEvent[] {
  return [...items].sort((a, b) => {
    return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  });
}

function sortEventOccurrences(items: EventOccurrence[]): EventOccurrence[] {
  return [...items].sort((a, b) => {
    return new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime();
  });
}

function addRecurrenceInterval(date: Date, recurrence: NonNullable<VsgEvent["recurrence"]>): Date {
  const next = new Date(date);

  switch (recurrence) {
    case "DAILY":
      next.setUTCDate(next.getUTCDate() + 1);
      return next;
    case "WEEKLY":
      next.setUTCDate(next.getUTCDate() + 7);
      return next;
    case "MONTHLY":
      next.setUTCMonth(next.getUTCMonth() + 1);
      return next;
    case "YEARLY":
      next.setUTCFullYear(next.getUTCFullYear() + 1);
      return next;
    default:
      return next;
  }
}

function expandEventOccurrences(items: VsgEvent[]): EventOccurrence[] {
  return items.flatMap((event) => {
    if (!isValidDateString(event.startsAt)) {
      return [];
    }

    const occurrences: EventOccurrence[] = [];
    const eventStart = new Date(event.startsAt);
    const eventEnd = isValidDateString(event.endsAt) ? new Date(event.endsAt) : null;
    const durationMs = eventEnd ? eventEnd.getTime() - eventStart.getTime() : null;

    let occurrenceStart = new Date(eventStart);
    let occurrenceIndex = 0;

    do {
      const occurrenceEnd =
        durationMs !== null ? new Date(occurrenceStart.getTime() + durationMs) : null;

      occurrences.push({
        instanceId: `${event.id}-${occurrenceIndex}`,
        event,
        startsAt: occurrenceStart.toISOString(),
        endsAt: occurrenceEnd?.toISOString() ?? null,
      });

      if (!event.recurrence || !isValidDateString(event.recurrenceUntil)) {
        break;
      }

      occurrenceStart = addRecurrenceInterval(occurrenceStart, event.recurrence);
      occurrenceIndex += 1;
    } while (occurrenceStart.getTime() <= new Date(event.recurrenceUntil).getTime());

    return occurrences;
  });
}

function toCalendarEvents(items: EventOccurrence[]): EventInput[] {
  return items.map((occurrence) => ({
    id: occurrence.instanceId,
    title: occurrence.event.title,
    start: occurrence.startsAt,
    end: isValidDateString(occurrence.endsAt) ? occurrence.endsAt : undefined,
    extendedProps: {
      eventId: occurrence.event.id,
      description: occurrence.event.description,
      location: occurrence.event.location,
    },
  }));
}

function getTodayBounds(now = new Date()): { todayStart: Date; tomorrowStart: Date } {
  const todayStart = new Date(now);
  todayStart.setHours(0, 0, 0, 0);

  const tomorrowStart = new Date(todayStart);
  tomorrowStart.setDate(tomorrowStart.getDate() + 1);

  return { todayStart, tomorrowStart };
}

function getUpcomingRange(now = new Date()): { rangeStart: Date; rangeEnd: Date } {
  const rangeStart = new Date(now);
  const rangeEnd = new Date(now);
  rangeEnd.setMonth(rangeEnd.getMonth() + 3);

  return { rangeStart, rangeEnd };
}

function getOccurrenceEnd(occurrence: EventOccurrence): Date | null {
  if (isValidDateString(occurrence.endsAt)) {
    return new Date(occurrence.endsAt);
  }

  if (isValidDateString(occurrence.startsAt)) {
    return new Date(occurrence.startsAt);
  }

  return null;
}

function isOccurrenceWithinUpcomingRange(occurrence: EventOccurrence, now = new Date()): boolean {
  const occurrenceStart = new Date(occurrence.startsAt);
  const occurrenceEnd = getOccurrenceEnd(occurrence);
  const { rangeStart, rangeEnd } = getUpcomingRange(now);

  return (
    !Number.isNaN(occurrenceStart.getTime()) &&
    occurrenceEnd !== null &&
    occurrenceEnd.getTime() >= rangeStart.getTime() &&
    occurrenceStart.getTime() <= rangeEnd.getTime()
  );
}

function findInitialEventOccurrence(items: EventOccurrence[], now = new Date()): EventOccurrence | null {
  const { tomorrowStart } = getTodayBounds(now);
  const upcomingOccurrences = items.filter((occurrence) => {
    const occurrenceEnd = getOccurrenceEnd(occurrence);

    return occurrenceEnd !== null && occurrenceEnd.getTime() >= now.getTime();
  });

  return (
    upcomingOccurrences.find((occurrence) => {
      const occurrenceStart = new Date(occurrence.startsAt);

      return occurrenceStart.getTime() < tomorrowStart.getTime();
    }) ??
    upcomingOccurrences.find((occurrence) => {
      const occurrenceStart = new Date(occurrence.startsAt);

      return occurrenceStart.getTime() >= now.getTime();
    }) ??
    null
  );
}

function formatEventDateRange(startsAt: string, endsAt: string | null): string {
  if (!isValidDateString(startsAt)) {
    return "Zeitpunkt unbekannt";
  }

  const start = new Date(startsAt);
  const end = isValidDateString(endsAt) ? new Date(endsAt) : null;

  const dateFormatter = new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const startLabel = `${dateFormatter.format(start)}, ${timeFormatter.format(start)}`;

  if (!end) {
    return `${startLabel} Uhr`;
  }

  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    return `${startLabel} – ${timeFormatter.format(end)} Uhr`;
  }

  return `${startLabel} Uhr – ${dateFormatter.format(end)}, ${timeFormatter.format(end)} Uhr`;
}

function selectEventOccurrence(occurrence: EventOccurrence): void {
  selectedEvent.value = occurrence;

  if (isValidDateString(occurrence.startsAt)) {
    calendar.value?.gotoDate(occurrence.startsAt);
  }
}

function handleEventClick(clickInfo: EventClickArg): void {
  const occurrence = eventOccurrences.value.find(
    (eventOccurrence) => eventOccurrence.instanceId === clickInfo.event.id,
  );

  if (occurrence) {
    selectEventOccurrence(occurrence);
  }
}

function destroyCalendar(): void {
  calendar.value?.destroy();
  calendar.value = null;
}

function renderCalendar(): void {
  if (!calendarElement.value) {
    return;
  }

  destroyCalendar();

  calendar.value = new Calendar(calendarElement.value, {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: "dayGridMonth",
    locale: deLocale,
    firstDay: 1,
    height: "auto",
    fixedWeekCount: false,
    headerToolbar: {
      left: "prev,next today",
      center: "title",
      right: "",
    },
    buttonText: {
      today: "Heute",
    },
    events: toCalendarEvents(eventOccurrences.value),
    eventClick: handleEventClick,
  });

  calendar.value.render();
}

async function loadEvents(): Promise<void> {
  isLoading.value = true;
  error.value = null;

  try {
    const response = await vsg.events.list();
    events.value = sortEvents(response.member);
    selectedEvent.value = findInitialEventOccurrence(eventOccurrences.value);
  } catch (loadError) {
    error.value = getApiErrorMessage(loadError, "Termine konnten nicht geladen werden.");
  } finally {
    isLoading.value = false;

    if (!error.value) {
      await nextTick();
      renderCalendar();
    }
  }
}

onMounted(() => {
  void loadEvents();
});

onUnmounted(() => {
  destroyCalendar();
});

watchEffect(() => {
  document.title = "Terminkalender | VSG Kugelberg";
});
</script>

<template>
  <div
    class="min-h-screen overflow-x-hidden text-white selection:bg-vsg-gold-500 selection:text-vsg-blue-900"
  >
    <HeroSectionSmall
      headline="Terminkalender"
      description="Alle anstehenden Termine auf einen Blick."
      headline-uuid="b8cbc973-fe6a-4677-8326-5c9737704dd5"
      description-uuid="be5cf4ad-1266-4077-a854-55dc005a3bd9"
      subtitle-uuid="5409d606-6d30-4782-9cc3-f0a7a769d12f"
    />

    <section class="bg-white py-16">
      <div class="mx-auto max-w-7xl px-6">
        <ApiState :is-loading="isLoading" :error="error" />

        <div v-if="showCalendar" class="space-y-12">
          <div class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div
              class="overflow-hidden rounded-md border border-vsg-blue-100 bg-white p-4 shadow-sm"
            >
              <div ref="calendarElement" class="calendar-shell text-vsg-blue-900" />
            </div>

            <aside
              class="rounded-md border border-vsg-blue-100 bg-vsg-blue-50 p-6 text-vsg-blue-900"
            >
              <p class="font-body text-sm font-bold uppercase tracking-wider text-vsg-blue-500">
                Termin-Details
              </p>

              <div v-if="selectedEvent" class="mt-4 space-y-4">
                <h2 class="font-display text-3xl tracking-wider text-vsg-blue-900">
                  {{ selectedEvent.event.title }}
                </h2>
                <p class="font-body text-base text-vsg-blue-700">
                  {{ selectedEventDateLabel }}
                </p>
                <p v-if="selectedEvent.event.location" class="font-body text-base text-vsg-blue-800">
                  <span class="font-bold">Ort:</span> {{ selectedEvent.event.location }}
                </p>
                <p
                  v-if="selectedEvent.event.description"
                  class="whitespace-pre-line font-body text-base text-vsg-blue-800"
                >
                  {{ selectedEvent.event.description }}
                </p>
              </div>

              <p v-else-if="hasEvents" class="mt-4 font-body text-base text-vsg-blue-700">
                Wähle einen Termin im Kalender aus, um weitere Informationen zu sehen.
              </p>

              <p v-else class="mt-4 font-body text-base text-vsg-blue-700">
                Derzeit sind keine Termine verfügbar.
              </p>
            </aside>
          </div>

          <section
            class="rounded-md border border-vsg-gold-200 bg-vsg-gold-50 p-6 text-vsg-blue-900 shadow-sm"
            aria-labelledby="upcoming-events-heading"
          >
            <div class="max-w-3xl">
              <p class="font-body text-sm font-bold uppercase tracking-wider text-vsg-blue-500">
                Terminübersicht
              </p>
              <h2
                id="upcoming-events-heading"
                class="mt-2 font-display text-3xl tracking-wider text-vsg-blue-900"
              >
                Anstehende Termine
              </h2>
              <p class="mt-2 font-body text-base text-vsg-blue-700">
                Die nächsten Termine in den kommenden 3 Monaten.
              </p>
            </div>

            <div v-if="hasUpcomingEvents" class="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              <button
                v-for="occurrence in upcomingEventOccurrences"
                :key="occurrence.instanceId"
                type="button"
                class="group rounded-md border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-vsg-gold-400 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-vsg-gold-400"
                :class="
                  selectedEvent?.instanceId === occurrence.instanceId
                    ? 'border-vsg-gold-400 ring-2 ring-vsg-gold-200'
                    : 'border-vsg-blue-100'
                "
                @click="selectEventOccurrence(occurrence)"
              >
                <p class="font-body text-sm font-bold uppercase tracking-wider text-vsg-blue-500">
                  {{ formatEventDateRange(occurrence.startsAt, occurrence.endsAt) }}
                </p>
                <h3
                  class="mt-3 font-display text-2xl tracking-wider text-vsg-blue-900 transition group-hover:text-vsg-blue-700"
                >
                  {{ occurrence.event.title }}
                </h3>
              </button>
            </div>

            <p v-else class="mt-8 rounded-md bg-white p-5 font-body text-base text-vsg-blue-700">
              In den nächsten 3 Monaten sind keine Termine geplant.
            </p>
          </section>
        </div>
      </div>
    </section>

    <CtaSection
      headline=""
      description=""
      headline-uuid="f0da9902-792c-43d7-9f5c-b53bec8eea6c"
      description-uuid="bd911e4e-23ae-4062-a62a-99074ddb0076"
    />
  </div>
</template>

<style scoped>
.calendar-shell :deep(.fc) {
  --fc-border-color: var(--color-vsg-blue-100);
  --fc-button-bg-color: var(--color-vsg-blue-900);
  --fc-button-border-color: var(--color-vsg-blue-900);
  --fc-button-hover-bg-color: var(--color-vsg-blue-700);
  --fc-button-hover-border-color: var(--color-vsg-blue-700);
  --fc-button-active-bg-color: var(--color-vsg-blue-700);
  --fc-button-active-border-color: var(--color-vsg-blue-700);
  --fc-event-bg-color: var(--color-vsg-gold-400);
  --fc-event-border-color: var(--color-vsg-gold-400);
  --fc-event-text-color: var(--color-vsg-blue-900);
  --fc-today-bg-color: rgba(252, 211, 77, 0.12);
  font-family: var(--font-body);
}

.calendar-shell :deep(.fc-toolbar-title),
.calendar-shell :deep(.fc-col-header-cell-cushion) {
  font-family: var(--font-display);
  letter-spacing: 0.08em;
}

.calendar-shell :deep(.fc-daygrid-event) {
  border-radius: 0.5rem;
  font-weight: 700;
  padding: 0.125rem 0.375rem;
}

.calendar-shell :deep(.fc-button) {
  box-shadow: none;
  text-transform: uppercase;
}

@media (max-width: 640px) {
  .calendar-shell :deep(.fc-header-toolbar) {
    gap: 0.75rem;
  }

  .calendar-shell :deep(.fc-toolbar-chunk) {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.5rem;
  }

  .calendar-shell :deep(.fc-button-group) {
    display: inline-flex;
    gap: 0.5rem;
  }
}
</style>
