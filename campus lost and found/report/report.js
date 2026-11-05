const reportForm = document.getElementById("reportForm");
const message = document.getElementById("message");
const itemDate = document.getElementById("itemDate");

// Check that the form elements exist.
if (!reportForm || !message || !itemDate) {
  console.error("Report form elements could not be found.");
} else {

  // Prevent students from selecting a future date.
  itemDate.max = new Date().toLocaleDateString("en-CA");

  reportForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const reportType = document.getElementById("reportType").value;
    const itemName = document.getElementById("itemName").value.trim();
    const imageFile = document.getElementById("itemImage").files[0];

    if (!reportType || !itemName) {
      message.textContent = "Please complete the required fields.";
      message.style.color = "red";
      return;
    }

    // Save the report and its selected picture.
    function saveReport(imageData) {
      try {
        const report = {
          id: Date.now(),
          name: itemName,
          category: document.getElementById("category").value,
          status: reportType,
          description: document.getElementById("description").value.trim(),
          location: document.getElementById("location").value.trim(),
          date: itemDate.value,
          email: document.getElementById("studentEmail").value.trim(),
          phone: document.getElementById("phone").value.trim(),
          image: imageData
        };

        const reports = JSON.parse(
          localStorage.getItem("campusFindReports") || "[]"
        );

        reports.unshift(report);

        localStorage.setItem(
          "campusFindReports",
          JSON.stringify(reports)
        );

        message.textContent =
          "Your " + reportType.toLowerCase() +
          " item has been submitted successfully!";

        message.style.color = "#2457c5";

        reportForm.reset();

        // Restore the maximum date after resetting the form.
        itemDate.max = new Date().toLocaleDateString("en-CA");

      } catch (error) {
        console.error("Report saving error:", error);

        message.textContent =
          "Could not save the report. Try choosing a smaller picture.";

        message.style.color = "red";
      }
    }

    // Read the picture selected by the student.
    if (imageFile) {
      const reader = new FileReader();

      reader.onload = function () {
        saveReport(reader.result);
      };

      reader.onerror = function () {
        message.textContent =
          "Could not read the picture. Please try another.";

        message.style.color = "red";
      };

      reader.readAsDataURL(imageFile);

    } else {
      // Allow submission without a picture.
      saveReport(
        "https://placehold.co/600x400/e7edf5/243b5a?text=Reported+Item"
      );
    }
  });
}