document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".authError__closer").forEach(authErrorCloser => {
    authErrorCloser.onclick = function(evt) {
      const authErrorCloser = evt.target;
      authErrorCloser.parentNode.parentNode.removeChild(authErrorCloser.parentNode);
    }
  });
  document.querySelectorAll("img").forEach(picture => {
    picture.onerror = function () {
      picture.src = "/img/fallback.png";
    }
  });
});
