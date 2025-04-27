const map = L.map("map").setView([21.0285, 105.8542], 14); // lat, lng, zoom

// Tile layer
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 20,
  minZoom: 12,
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
  iconUrl: "icon_2.svg",
  iconSize: [28, 28], // width, height in pixels
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
      // .bindTooltip(loc.title, {
      //   permanent: true,
      //   direction: "right",
      //   offset: [4, -18],
      //   className: "marker-label",
      // });
      marker.on("click ", function () {
        const card = document.getElementById("card");
        card.style.display = "flex"; // Show the card
        card.innerHTML = `
              <div class="card-media">
                <img src="sample.jpg" />
              </div>
              <div class="card-content">
                <p id="title">${loc.title}</p>
                <p id="thread-text">Loading content...</p>
                <div class="card-buttons">
                  <a id="read-more" href="#" target="_blank">
                    Đọc thêm
                    <img src="threads_logo.svg" alt="threads_logo" />
                  </a>
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

              // Update thread text
              if (threadData.text.length > 80) {
                threadText.textContent = threadData.text.slice(0, 80) + "...";
              } else {
                threadText.textContent = threadData.text;
              }

              // Update media content
              const cardMedia = document.querySelector(".card-media");
              if (mediaHtml) {
                const cardMedia = document.querySelector(".card-media");
                if (cardMedia) {
                  cardMedia.innerHTML = mediaHtml;
                }
              }

              // Create and append the "Đọc thêm" button
              const cardButtons = document.querySelector(".card-buttons");
              if (cardButtons) {
                cardButtons.innerHTML = `
                  <a id="read-more" href="${threadData.permalink}" target="_blank">
                    Đọc thêm
                    <img src="threads_logo.svg" alt="threads_logo" />
                  </a>`;
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
