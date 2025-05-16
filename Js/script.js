window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

// Check login state and update text
const loginStatus = document.getElementById("login-status");
const loginLink = document.querySelector(".login a");

if (localStorage.getItem('isLoggedIn') === 'true') {
    loginStatus.textContent = "Log out";

    // Log out
    loginLink.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent navigation
        localStorage.removeItem('isLoggedIn'); // Clear login state
        alert("You have been logged out.");
        loginStatus.textContent = "Log in";
    });
}

else {
    loginStatus.textContent = "Log in";

    //  navigate to the login page
    loginLink.addEventListener("click", () => {
        window.location.href = "login.html";
    });
}