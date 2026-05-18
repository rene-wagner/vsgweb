<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
  type ChartConfiguration,
} from "chart.js";
import type { ClubHistoryMembershipStat } from "@vsg/types";
import Section from "@/components/sections/Section.vue";

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Filler,
  Tooltip,
  Legend,
);

interface Props {
  stats: ClubHistoryMembershipStat[];
}

const props = defineProps<Props>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
let chart: Chart | null = null;

const sortedStats = computed(() => [...props.stats].sort((a, b) => a.year - b.year));
const latestStat = computed(() => {
  return sortedStats.value.length > 0 ? sortedStats.value[sortedStats.value.length - 1] : null;
});
const peakStat = computed(() =>
  sortedStats.value.reduce<ClubHistoryMembershipStat | null>(
    (peak, stat) => (peak === null || stat.memberCount > peak.memberCount ? stat : peak),
    null,
  ),
);
const averageMembers = computed(() => {
  if (sortedStats.value.length === 0) {
    return null;
  }

  const total = sortedStats.value.reduce((sum, stat) => sum + stat.memberCount, 0);
  return Math.round(total / sortedStats.value.length);
});

function buildChart(): void {
  if (!canvasRef.value || sortedStats.value.length === 0) {
    return;
  }

  chart?.destroy();

  const context = canvasRef.value.getContext("2d");

  if (!context) {
    return;
  }

  const gradient = context.createLinearGradient(0, 0, 0, 320);
  gradient.addColorStop(0, "rgba(252, 211, 77, 0.38)");
  gradient.addColorStop(1, "rgba(252, 211, 77, 0)");

  const configuration: ChartConfiguration<"line"> = {
    type: "line",
    data: {
      labels: sortedStats.value.map((stat) => String(stat.year)),
      datasets: [
        {
          label: "Mitglieder",
          data: sortedStats.value.map((stat) => stat.memberCount),
          borderColor: "#0057b7",
          backgroundColor: gradient,
          fill: true,
          tension: 0.35,
          borderWidth: 3,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: "#fcd34d",
          pointBorderColor: "#002d5c",
          pointBorderWidth: 2,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          backgroundColor: "#002d5c",
          titleColor: "#fcd34d",
          bodyColor: "#ffffff",
          displayColors: false,
          callbacks: {
            label: (context) => `${context.parsed.y} Mitglieder`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(0, 45, 92, 0.08)",
          },
          ticks: {
            color: "#004a94",
            maxRotation: 0,
            autoSkip: true,
          },
        },
        y: {
          beginAtZero: false,
          grid: {
            color: "rgba(0, 45, 92, 0.08)",
          },
          ticks: {
            color: "#004a94",
            callback: (value) => `${value}`,
          },
        },
      },
    },
  };

  chart = new Chart(context, configuration);
}

onMounted(() => {
  buildChart();
});

onUnmounted(() => {
  chart?.destroy();
  chart = null;
});

watch(sortedStats, () => {
  buildChart();
});
</script>

<template>
  <Section
    id="mitgliederentwicklung"
    subtitle="Mitgliederentwicklung"
    title="Wachstum in Zahlen"
    subtitle-uuid="cbaf1f0c-e7e7-4f75-a8d5-b7b12731c61d"
    title-uuid="0f7b9437-b0c1-4cdb-8ef7-4f4e59c4fd1d"
    description="Die Entwicklung zeigt, wie sich der Verein über die Jahre verändert hat. Besonders starke Schübe entstanden durch neue Abteilungen und die kontinuierliche Arbeit im Breitensport."
    description-uuid="98e5ef48-00cf-4b73-a8c0-6d8ae6c4ef0a"
    background="white"
  >
    <div class="mt-16 grid gap-6 xl:grid-cols-[0.9fr_1.6fr]">
      <div class="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
        <div class="border border-vsg-blue-100 bg-white p-6 shadow-sm">
          <p class="font-body text-sm uppercase tracking-[0.25em] text-vsg-blue-600">
            Aktuellster Stand
          </p>
          <p class="mt-3 font-display text-5xl text-vsg-blue-900">
            {{ latestStat?.memberCount ?? "–" }}
          </p>
          <p class="mt-2 font-body text-base text-vsg-blue-700">
            Mitglieder im Jahr {{ latestStat?.year ?? "–" }}
          </p>
        </div>

        <div class="border border-vsg-gold-200 bg-vsg-gold-50 p-6 shadow-sm">
          <p class="font-body text-sm uppercase tracking-[0.25em] text-vsg-blue-600">Höchststand</p>
          <p class="mt-3 font-display text-5xl text-vsg-blue-900">
            {{ peakStat?.memberCount ?? "–" }}
          </p>
          <p class="mt-2 font-body text-base text-vsg-blue-700">
            erreicht im Jahr {{ peakStat?.year ?? "–" }}
          </p>
        </div>

        <div class="border border-vsg-blue-100 bg-vsg-blue-900 p-6 shadow-sm">
          <p class="font-body text-sm uppercase tracking-[0.25em] text-vsg-blue-200">
            Durchschnitt
          </p>
          <p class="mt-3 font-display text-5xl text-vsg-gold-400">{{ averageMembers ?? "–" }}</p>
          <p class="mt-2 font-body text-base text-vsg-blue-100">
            Mitglieder über den gesamten Zeitraum
          </p>
        </div>
      </div>

      <div class="border border-vsg-blue-100 bg-white p-6 shadow-sm">
        <div class="h-[22rem] md:h-[28rem]">
          <canvas ref="canvasRef" aria-label="Diagramm zur Mitgliederentwicklung" />
        </div>
      </div>
    </div>
  </Section>
</template>
