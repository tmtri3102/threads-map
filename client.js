const map = L.map("map").setView([21.0285, 105.8542], 15); // lat, lng, zoom

// Tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
  minZoom: 15,
  attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

// Locate user
locateMe();
map.on("locationfound", (e) => {
  L.circleMarker(e.latlng, {
    radius: 8, // Radius in pixels
    color: "blue",
    fillColor: "#30f",
    fillOpacity: 0.8,
  }).addTo(map);
});
function locateMe() {
  map.locate({ setView: true, maxZoom: 18 });
}

// Custom marker
const customIcon = L.icon({
  iconUrl: "icon.svg",
  iconSize: [36, 36], // width, height in pixels
  iconAnchor: [16, 32], // point of the icon which corresponds to marker's location
  popupAnchor: [0, -32], // point from which the popup should open relative to iconAnchor
  className: "custom-marker",
});

// Show card
fetch("/api/locations")
  .then(async (res) => {
    if (!res.ok) {
      // Improved error handling for the initial location fetch
      const err = await res.json();
      throw new Error(err.error || `HTTP error! status: ${res.status}`);
    }
    return res.json();
  })
  .then((locationsData) => {
    locationsData.forEach((loc) => {
      let marker = L.marker([loc.lat, loc.lng], { icon: customIcon }).addTo(
        map
      );
      marker.on("click", function () {
        const card = document.getElementById("card");
        card.style.display = "flex"; // Show the card
        card.innerHTML = `
              <div class="card-media">
                <img src="sample.jpg" />
              </div>
              <div class="card-content">
                <p id="thread-text">Loading content...</p>
                <div class="card-buttons">
                  <button>Button 1</button>
                  <button>Button 2</button>
                </div>
              </div>
            <div id="close-card">✖</div>
        `;
        map.setView([loc.lat, loc.lng], map.getZoom());

        // Play audio
        // document.getElementById("play-audio").addEventListener("click", () => {
        //   const description =
        //     document.getElementById("description").textContent;
        //   const utterance = new SpeechSynthesisUtterance(description);
        //   speechSynthesis.speak(utterance);
        // });
        const closeButton = document.getElementById("close-card");
        if (closeButton) {
          closeButton.onclick = () => (card.style.display = "none");
        }

        // Fetch thread content
        const threadText = document.getElementById("thread-text");
        if (loc.threadPostId) {
          fetch(`/api/thread/${loc.threadPostId}`)
            .then((res) => res.json())
            .then((threadData) => {
              console.log("Thread data fetched:", threadData);
              let mediaHtml = "";
              if (
                threadData.media_url &&
                (threadData.media_type === "IMAGE" ||
                  threadData.media_type === "CAROUSEL_ALBUM")
              ) {
                mediaHtml = `<img src="${threadData.media_url}">`;
              } else if (
                threadData.media_url &&
                threadData.media_type === "VIDEO"
              ) {
                mediaHtml = `<video><source src="${threadData.media_url}" type="video/mp4">Video not supported.</video>`;
              }
              if (threadData.text.length > 70) {
                threadText.textContent = threadData.text.slice(0, 70) + "...";
              } else {
                threadText.textContent = threadData.text;
              }
              const cardMedia = document.querySelector(".card-media");
              if (mediaHtml) {
                const cardMedia = document.querySelector(".card-media");
                if (cardMedia) {
                  cardMedia.innerHTML = mediaHtml;
                }
              }
            })
            .catch((error) => {
              console.error("Error fetching or displaying thread post:", error);
              threadText.textContent = `Could not load Threads post: ${error.message}`;
            });
        } else {
          threadText.textContent = `No associated thread post found for this location.`;
        }
      });
      // --- End of Marker Click Handler ---
    }); // End of forEach location
  })
  .catch((error) => {
    console.error("Error fetching initial locations:", error);
    alert(
      `Could not load location data: ${error.message}. Please try refreshing the page.`
    );
  });
