window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

const loginStatus = document.getElementById("login-status");
const loginLink = document.querySelector(".login a");

function setLoginState(isLoggedIn) {
    if (isLoggedIn) {
        loginStatus.textContent = "Log out";
        loginLink.onclick = function(event) {
            event.preventDefault();
            localStorage.removeItem('isLoggedIn');
            alert("You have been logged out.");
            setLoginState(false);
        };
    } else {
        loginStatus.textContent = "Log in";
        loginLink.onclick = function(event) {
            window.location.href = "login.html";
        };
    }
}

// Initialize login on page load
setLoginState(localStorage.getItem('isLoggedIn') === 'true');