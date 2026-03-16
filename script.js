const SUPPORTED_LANGS = ["en", "tr"];

const i18n = {
  en: {
    meta: {
      pageTitle: "XADS | Link Page",
    },
    profile: {
      avatarAlt: "Profile photo",
      subtitle: "All my platforms and premium content in one link",
      verified: "Verified",
      followers: "12.4K Followers",
    },
    cta: {
      vip: "Enter VIP Access",
    },
    links: {
      aria: "Profile links",
      items: [
        {
          title: "YouTube",
          subtitle: "Weekly videos and live streams",
        },
        {
          title: "Instagram",
          subtitle: "Daily reels and stories",
        },
        {
          title: "Discord Community",
          subtitle: "Live chat and member events",
        },
        {
          title: "Join Newsletter",
          subtitle: "Get new drops by email",
        },
      ],
    },
    actions: {
      copy: "Copy Link",
      share: "Share",
    },
    status: {
      copied: "Link copied to clipboard.",
      copyNotSupported: "Clipboard copy is not available now.",
      shareOpened: "Share dialog opened.",
      shareCanceled: "Sharing canceled.",
      sharedFallback: "Sharing not supported, link copied.",
      shareNotAvailable: "Sharing is not available now.",
    },
    shareData: {
      title: "XADS Link Page",
      text: "All my links are here:",
    },
  },
  tr: {
    meta: {
      pageTitle: "XADS | Link Sayfasi",
    },
    profile: {
      avatarAlt: "Profil fotografi",
      subtitle: "Tek linkte tum platformlarim ve ozel icerikler",
      verified: "Dogrulanmis",
      followers: "12.4K Takipci",
    },
    cta: {
      vip: "VIP Alana Gec",
    },
    links: {
      aria: "Profil linkleri",
      items: [
        {
          title: "YouTube",
          subtitle: "Haftalik video ve canli yayinlar",
        },
        {
          title: "Instagram",
          subtitle: "Gunluk reels ve hikayeler",
        },
        {
          title: "Discord Toplulugu",
          subtitle: "Canli sohbet ve topluluk etkinlikleri",
        },
        {
          title: "Bultene Katil",
          subtitle: "Yeni icerikleri e-posta ile al",
        },
      ],
    },
    actions: {
      copy: "Linki Kopyala",
      share: "Paylas",
    },
    status: {
      copied: "Link panoya kopyalandi.",
      copyNotSupported: "Kopyalama su an desteklenmiyor.",
      shareOpened: "Paylasim penceresi acildi.",
      shareCanceled: "Paylasim iptal edildi.",
      sharedFallback: "Paylasim desteklenmiyor, link kopyalandi.",
      shareNotAvailable: "Paylasim su an kullanilamiyor.",
    },
    shareData: {
      title: "XADS Link Sayfasi",
      text: "Tum linklerim burada:",
    },
  },
};

const linkDefinitions = [
  {
    url: "https://youtube.com",
    icon: "play_circle",
  },
  {
    url: "https://instagram.com",
    icon: "photo_camera",
  },
  {
    url: "https://discord.com",
    icon: "forum",
  },
  {
    url: "https://example.com/newsletter",
    icon: "mail",
  },
];

const linksContainer = document.getElementById("linksContainer");
const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");
const statusText = document.getElementById("statusText");
const activeLang = detectLanguage();
const dict = i18n[activeLang];

function detectLanguage() {
  const browserCandidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language || "en"];

  for (const lang of browserCandidates) {
    const shortCode = lang.toLowerCase().split("-")[0];
    if (SUPPORTED_LANGS.includes(shortCode)) {
      return shortCode;
    }
  }

  return "en";
}

function getByPath(target, path) {
  return path.split(".").reduce((acc, key) => acc?.[key], target);
}

function applyTranslations() {
  document.documentElement.lang = activeLang;

  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    const value = getByPath(dict, key);
    if (typeof value === "string") {
      element.textContent = value;
    }
  });

  document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
    const mappings = element.dataset.i18nAttr
      .split(";")
      .map((item) => item.trim())
      .filter(Boolean);

    mappings.forEach((mapping) => {
      const [attr, key] = mapping.split(":").map((item) => item.trim());
      const value = getByPath(dict, key);
      if (attr && typeof value === "string") {
        element.setAttribute(attr, value);
      }
    });
  });
}

function renderLinks() {
  linksContainer.innerHTML = "";
  const localizedItems = dict.links.items || i18n.en.links.items;

  linkDefinitions.forEach((link, index) => {
    const localized = localizedItems[index] || i18n.en.links.items[index];
    const anchor = document.createElement("a");
    anchor.className = "link-item";
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.style.setProperty("--index", index);

    anchor.innerHTML = `
      <span class="link-icon material-symbols-outlined">${link.icon}</span>
      <span class="link-copy">
        <h3>${localized.title}</h3>
        <p>${localized.subtitle}</p>
      </span>
      <span class="arrow-icon material-symbols-outlined">arrow_forward_ios</span>
    `;

    linksContainer.appendChild(anchor);
  });
}

function setStatus(message) {
  statusText.textContent = message;
  window.clearTimeout(setStatus.timeoutId);
  setStatus.timeoutId = window.setTimeout(() => {
    statusText.textContent = "";
  }, 2200);
}

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    setStatus(dict.status.copied);
  } catch (error) {
    setStatus(dict.status.copyNotSupported);
  }
});

shareBtn.addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: dict.shareData.title,
        text: dict.shareData.text,
        url: window.location.href,
      });
      setStatus(dict.status.shareOpened);
    } catch (error) {
      setStatus(dict.status.shareCanceled);
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(window.location.href);
    setStatus(dict.status.sharedFallback);
  } catch (error) {
    setStatus(dict.status.shareNotAvailable);
  }
});

applyTranslations();
renderLinks();
