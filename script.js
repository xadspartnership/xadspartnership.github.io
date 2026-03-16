const SUPPORTED_LANGS = ["en", "tr"];

const i18n = {
  en: {
    meta: {
      pageTitle: "MyWifeAndYou | Link Page",
    },
    profile: {
      avatarAlt: "Profile photo",
      subtitle: "All my platforms and premium content in one link",
      verified: "Verified",
      followers: "487.3K Followers",
    },
    cta: {
      vip: "Enter VIP Access",
    },
    banners: {
      aria: "Affiliate banners",
      items: [
        {
          title: "Affiliate Banner 1",
          subtitle: "Replace URL and image in script.js",
        },
        {
          title: "Affiliate Banner 2",
          subtitle: "Replace URL and image in script.js",
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
      title: "MyWifeAndYou Link Page",
      text: "All my links are here:",
    },
  },
  tr: {
    meta: {
      pageTitle: "MyWifeAndYou | Link Sayfasi",
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
    banners: {
      aria: "Affiliate bannerlari",
      items: [
        {
          title: "Affiliate Banner 1",
          subtitle: "URL ve gorseli script.js icinden degistir",
        },
        {
          title: "Affiliate Banner 2",
          subtitle: "URL ve gorseli script.js icinden degistir",
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
      title: "MyWifeAndYou Link Sayfasi",
      text: "Tum linklerim burada:",
    },
  },
};

// Replace these with your CrakRevenue affiliate links and banner image URLs.
const bannerDefinitions = [
  {
    url: "https://example.com/affiliate-offer-1",
    image:
      "https://dummyimage.com/1200x675/240b0b/f20d0d&text=CrakRevenue+Banner+01",
  },
  {
    url: "https://example.com/affiliate-offer-2",
    image:
      "https://dummyimage.com/1200x675/2a0d0d/ff6a6a&text=CrakRevenue+Banner+02",
  },
];

const bannerContainer = document.getElementById("affiliateBanners");
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

function renderBanners() {
  if (!bannerContainer) {
    return;
  }

  bannerContainer.innerHTML = "";
  const localizedItems = dict.banners.items || i18n.en.banners.items;

  bannerDefinitions.forEach((banner, index) => {
    const localized = localizedItems[index] || i18n.en.banners.items[index];
    const anchor = document.createElement("a");
    anchor.className = "affiliate-banner";
    anchor.href = banner.url;
    anchor.target = "_blank";
    anchor.rel = "nofollow noopener noreferrer";
    anchor.style.setProperty("--index", index);

    anchor.innerHTML = `
      <img src="${banner.image}" alt="${localized.title}" loading="lazy" />
      <span class="affiliate-overlay">
        <h3>${localized.title}</h3>
        <p>${localized.subtitle}</p>
      </span>
    `;

    bannerContainer.appendChild(anchor);
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
renderBanners();
