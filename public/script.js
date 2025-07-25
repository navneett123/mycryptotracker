const priceCards = document.getElementById("price-cards");

async function fetchPrices() {
  try {
    const res = await fetch("/api/prices");
    const data = await res.json();
    priceCards.innerHTML = "";

    for (const [coin, details] of Object.entries(data)) {
      const card = document.createElement("div");
      card.className = "card";
      card.innerHTML = `
        <h2>${coin.toUpperCase()}</h2>
        <div class="price">$${details.usd.toLocaleString()}</div>
      `;
      priceCards.appendChild(card);
    }
  } catch (err) {
    console.error("Failed to fetch prices", err);
  }
}

fetchPrices();
setInterval(fetchPrices, 10000);
