(function () {
  const n = 30;
  const container = document.getElementById("days-container");

  let htmlContent = "";

  // Starting date (1st December 2024)
  const startDate = new Date("2024-12-01");

  for (let i = 0; i < n; i++) {
    // Calculate the date for each day
    const currentDate = new Date(startDate);
    currentDate.setDate(startDate.getDate() + i); // Increment the day by 'i'

    // Format the date as dd.mm.yyyy
    const day = String(currentDate.getDate()).padStart(2, "0"); // Add leading zero if needed
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
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
