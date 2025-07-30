let COINS = ["bitcoin", "ethereum", "solana", "dogecoin"];
const priceCards = document.getElementById("price-cards");

async function fetchPrices() {
  try {
    const ids = COINS.join(',');
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
    const res = await fetch(url);
    const data = await res.json();

    priceCards.innerHTML = "";

    for (const [coin, details] of Object.entries(data)) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h2>${coin.toUpperCase()}</h2>
        <div class="price">$${details.usd?.toLocaleString() ?? 'N/A'}</div>
      `;
      priceCards.appendChild(card);
    }
  } catch (err) {
    console.error("Failed to fetch prices", err);
  }
}

// Initial + auto refresh
fetchPrices();
setInterval(fetchPrices, 10000);

// Dark mode toggle
const toggle = document.getElementById("darkToggle");
const modeLabel = document.getElementById("modeLabel");

toggle.addEventListener("change", (e) => {
  const isDark = e.target.checked;
  document.body.classList.toggle("dark", isDark);
  modeLabel.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
});
