document.addEventListener("click", evt => {
  if(!evt.target.classList.contains("searchResult")) {
    document.querySelectorAll(".searchResult").forEach(searchResult => {searchBox.removeChild(searchResult);});
  }  
});
document.addEventListener("DOMContentLoaded", () => {
  const userForm = document.querySelector("#userForm");
  const searchBox = document.querySelector("#searchBox");

  userForm?.addEventListener("submit", evt => {
    evt.preventDefault();
    const username = userForm["username"].value;

    const url = `http://localhost:4000/api/users/${username}`;
    fetch(url)
    .then(response => response.json())
    .then(user => {
      document.querySelectorAll(".searchResult").forEach(searchResult => {searchBox.removeChild(searchResult);});
      if(user.error) { return; }
      const searchResult = document.createElement("a");
      searchResult.href = `/profile/${user.username}`;
      searchResult.classList.add("searchResult");
      searchResult.innerHTML = `
        <img class="searchResult__picture" src="${user.profilePic}">
        <span class="searchResult__content">${user.username}</span>
      `;
      searchBox.appendChild(searchResult);
    })
    .catch(error => {console.log(error);});
  });
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
