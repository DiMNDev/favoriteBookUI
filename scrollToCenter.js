const scrollToCenter = () => {
  const body = document.querySelector(".mainContainer");
  const viceContainer = document.querySelector(".viceContainer");
  console.log("vice", viceContainer.clientWidth / 2);
  const centerX = body.scrollWidth / 2 - viceContainer.clientWidth / 2;
  const centerY = body.scrollHeight / 2;
  console.log("x", centerX);
  console.log("y", centerY);
  window.scrollTo({ top: centerY, left: centerX, behavior: "smooth" });
};
scrollToCenter();
