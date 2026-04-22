import { createApp, type ComponentPublicInstance } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./style.css";
import "easymde/dist/easymde.min.css";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import {
  faAddressBook,
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowRightArrowLeft,
  faArrowRightFromBracket,
  faArrowsRotate,
  faArrowUpRightFromSquare,
  faBolt,
  faCalendar,
  faChartSimple,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChild,
  faCircle,
  faCircleInfo,
  faClock,
  faCog,
  faCopy,
  faCubes,
  faDownload,
  faEnvelope,
  faEye,
  faEyeSlash,
  faFileArrowDown,
  faFolder,
  faFolderPlus,
  faGauge,
  faGrip,
  faHouse,
  faImage,
  faInbox,
  faLocationDot,
  faNewspaper,
  faPen,
  faPenToSquare,
  faPeopleGroup,
  faPerson,
  faPhone,
  faPlus,
  faSitemap,
  faSpinner,
  faTrash,
  faTriangleExclamation,
  faUpload,
  faUser,
  faUsers,
  faWrench,
  faXmark,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";

function logClientError(prefix: string, error: unknown, context?: unknown): void {
  console.error(prefix, error);

  if (context !== undefined) {
    console.error("[VSG] Error context", context);
  }
}

library.add(
  faArrowDown,
  faArrowLeft,
  faArrowRight,
  faArrowsRotate,
  faArrowRightArrowLeft,
  faArrowRightFromBracket,
  faArrowUpRightFromSquare,
  faBolt,
  faCalendar,
  faChartSimple,
  faCheck,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faChild,
  faCircle,
  faCircleInfo,
  faClock,
  faCopy,
  faDownload,
  faEnvelope,
  faEye,
  faEyeSlash,
  faFileArrowDown,
  faFilePdf,
  faFolder,
  faFolderPlus,
  faGrip,
  faHouse,
  faImage,
  faInbox,
  faLocationDot,
  faPen,
  faPenToSquare,
  faPeopleGroup,
  faPerson,
  faPhone,
  faPlus,
  faSpinner,
  faTrash,
  faTriangleExclamation,
  faUpload,
  faUser,
  faUsers,
  faWrench,
  faXmark,
  // Sidebar icons
  faGauge, // Dashboard
  // faHouse, // Startseite
  faPeopleGroup, // Verein
  faCubes, // Abteilungen
  // faCalendar, // Termine
  faAddressBook, // Kontakte
  faSitemap, // Kategorien
  faNewspaper, // Beiträge
  // faImage, // Mediathek
  // faUsers, // Benutzer
  faCog, // Einstellungen
);

const app = createApp(App);

app.config.errorHandler = (error, instance, info) => {
  logClientError("[VSG] Vue runtime error", error, {
    info,
    component: (instance as ComponentPublicInstance | null)?.$options.name,
  });
};

window.addEventListener("error", (event) => {
  logClientError("[VSG] Window error", event.error ?? event.message);
});

window.addEventListener("unhandledrejection", (event) => {
  logClientError("[VSG] Unhandled promise rejection", event.reason);
});

app.use(createPinia());
app.use(router);
app.component("FontAwesomeIcon", FontAwesomeIcon);

app.mount("#app");
