const links = [
  {
    title: "YouTube",
    subtitle: "Haftalik video ve canli yayinlar",
    url: "https://youtube.com",
    icon: "play_circle",
  },
  {
    title: "Instagram",
    subtitle: "Gunluk reels ve hikayeler",
    url: "https://instagram.com",
    icon: "photo_camera",
  },
  {
    title: "Discord Toplulugu",
    subtitle: "Canli sohbet ve topluluk etkinlikleri",
    url: "https://discord.com",
    icon: "forum",
  },
  {
    title: "Bultene Katil",
    subtitle: "Yeni icerikleri e-posta ile al",
    url: "https://example.com/newsletter",
    icon: "mail",
  },
];

const linksContainer = document.getElementById("linksContainer");
const copyBtn = document.getElementById("copyBtn");
const shareBtn = document.getElementById("shareBtn");
const statusText = document.getElementById("statusText");

function renderLinks() {
  linksContainer.innerHTML = "";

  links.forEach((link, index) => {
    const anchor = document.createElement("a");
    anchor.className = "link-item";
    anchor.href = link.url;
    anchor.target = "_blank";
    anchor.rel = "noreferrer";
    anchor.style.setProperty("--index", index);

    anchor.innerHTML = `
      <span class="link-icon material-symbols-outlined">${link.icon}</span>
      <span class="link-copy">
        <h3>${link.title}</h3>
        <p>${link.subtitle}</p>
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
    setStatus("Link panoya kopyalandi.");
  } catch (error) {
    setStatus("Kopyalama su an desteklenmiyor.");
  }
});

shareBtn.addEventListener("click", async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: "XADS Link Sayfasi",
        text: "Tum linklerim burada:",
        url: window.location.href,
      });
      setStatus("Paylasim penceresi acildi.");
    } catch (error) {
      setStatus("Paylasim iptal edildi.");
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(window.location.href);
    setStatus("Paylasim desteklenmiyor, link kopyalandi.");
  } catch (error) {
    setStatus("Paylasim su an kullanilamiyor.");
  }
});

renderLinks();
