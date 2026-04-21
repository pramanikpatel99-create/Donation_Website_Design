// Wait until the full HTML page is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Select the donation/wastage dropdown
  const donationSelect = document.getElementById("donationType");

  // Select the wallet box that contains Connect Wallet and Donate buttons
  const fundWalletBox = document.getElementById("fundWalletBox");

  // Select all gallery images
  const images = document.querySelectorAll(".image-container .image img");

  // Select popup image container
  const popImage = document.querySelector(".pop-image");

  // Select image inside popup
  const popImgTag = document.querySelector(".pop-image img");

  // Select close button inside popup
  const closeBtn = document.querySelector(".pop-image span");

  // ===== Show wallet box only when "Fund" is selected =====
  if (donationSelect && fundWalletBox) {
    // Hide the wallet box when page first loads
    fundWalletBox.style.display = "none";

    // Listen for dropdown value change
    donationSelect.addEventListener("change", function () {
      // Show wallet box only for fund
      if (donationSelect.value === "fund") {
        fundWalletBox.style.display = "block";
      } else {
        fundWalletBox.style.display = "none";
      }
    });
  }

  // ===== Gallery image popup logic =====
  if (images.length > 0 && popImage && popImgTag && closeBtn) {
    // Loop through all gallery images
    images.forEach((image) => {
      image.addEventListener("click", function () {
        // Display popup when image is clicked
        popImage.style.display = "flex";

        // Set popup image source same as clicked image
        popImgTag.src = this.getAttribute("src");
      });
    });

    // Close popup when X is clicked
    closeBtn.addEventListener("click", function () {
      popImage.style.display = "none";
    });

    // Optional: close popup when clicking outside image
    popImage.addEventListener("click", function (e) {
      if (e.target === popImage) {
        popImage.style.display = "none";
      }
    });
  }
});