<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, ref, watchEffect } from "vue";
import { Calendar } from "@fullcalendar/core";
import type { EventClickArg, EventInput } from "@fullcalendar/core";
import deLocale from "@fullcalendar/core/locales/de";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { Event as VsgEvent } from "@vsg/sdk";
import HeroSectionSmall from "@/components/sections/HeroSectionSmall.vue";
import ApiState from "@/components/ui/ApiState.vue";
import { getApiErrorMessage, vsg } from "@/lib/sdk";

const calendarElement = ref<HTMLElement | null>(null);
const calendar = ref<Calendar | null>(null);
const events = ref<VsgEvent[]>([]);
const selectedEvent = ref<VsgEvent | null>(null);
const isLoading = ref(true);
const error = ref<string | null>(null);

const hasEvents = computed(() => events.value.length > 0);
const showCalendar = computed(() => !error.value);

const selectedEventDateLabel = computed(() => {
  if (!selectedEvent.value) {
    return "";
  }

  return formatEventDateRange(selectedEvent.value.startsAt, selectedEvent.value.endsAt ?? null);
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

function toCalendarEvents(items: VsgEvent[]): EventInput[] {
  return items
    .filter((event) => isValidDateString(event.startsAt))
    .map((event) => ({
      id: String(event.id),
      title: event.title,
      start: event.startsAt,
      end: isValidDateString(event.endsAt) ? event.endsAt : undefined,
      extendedProps: {
        description: event.description,
        location: event.location,
      },
    }));
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

  const startLabel = `${dateFormatter.format(start)}, ${timeFormatter.format(start)} Uhr`;

  if (!end) {
    return startLabel;
  }

  const sameDay = start.toDateString() === end.toDateString();

  if (sameDay) {
    return `${startLabel} – ${timeFormatter.format(end)} Uhr`;
  }

  return `${startLabel} – ${dateFormatter.format(end)}, ${timeFormatter.format(end)} Uhr`;
}

function handleEventClick(clickInfo: EventClickArg): void {
  const eventId = Number.parseInt(clickInfo.event.id, 10);
  selectedEvent.value = events.value.find((event) => event.id === eventId) ?? null;
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
      right: "dayGridMonth",
    },
    buttonText: {
      today: "Heute",
      month: "Monat",
    },
    events: toCalendarEvents(events.value),
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
    selectedEvent.value = events.value[0] ?? null;

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

        <div v-if="showCalendar" class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div class="overflow-hidden rounded-3xl border border-vsg-blue-100 bg-white p-4 shadow-sm">
            <div ref="calendarElement" class="calendar-shell text-vsg-blue-900" />
          </div>

          <aside class="rounded-3xl border border-vsg-blue-100 bg-vsg-blue-50 p-6 text-vsg-blue-900">
            <p class="font-body text-sm font-bold uppercase tracking-wider text-vsg-blue-500">
              Termin-Details
            </p>

            <div v-if="selectedEvent" class="mt-4 space-y-4">
              <h2 class="font-display text-3xl tracking-wider text-vsg-blue-900">
                {{ selectedEvent.title }}
              </h2>
              <p class="font-body text-base text-vsg-blue-700">
                {{ selectedEventDateLabel }}
              </p>
              <p v-if="selectedEvent.location" class="font-body text-base text-vsg-blue-800">
                <span class="font-bold">Ort:</span> {{ selectedEvent.location }}
              </p>
              <p
                v-if="selectedEvent.description"
                class="whitespace-pre-line font-body text-base text-vsg-blue-800"
              >
                {{ selectedEvent.description }}
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
      </div>
    </section>
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
</style>
