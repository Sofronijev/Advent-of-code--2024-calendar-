(function () {
  const n = 25;
  const container = document.getElementById("days-container");

  let htmlContent = "";

  const startDate = new Date("2024-12-01");

  for (let i = 0; i < n; i++) {
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i);

    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");
    const year = currentDate.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    htmlContent += `
<div class="day-container day${i + 1}">
  <p class="day-box">${formattedDate}</p>
  <div class="answers"></div>
</div>
`;
  }

  container.innerHTML = htmlContent;
})();
