window.addEventListener("load", () => {
    document.body.classList.add("loaded");
});

const loginStatus = document.getElementById("login-status");
const loginLink = document.getElementById("login-link");
const sidebar = document.getElementById("account-sidebar");
const closeSidebar = document.getElementById("close-sidebar");
const logoutBtn = document.getElementById("logout-btn");
const sidebarUsername = document.getElementById("sidebar-username");
const sidebarEmail = document.getElementById("sidebar-email");
const sidebarPassword = document.getElementById("sidebar-password");

function setLoginState(isLoggedIn) {
    if (isLoggedIn) {
        loginStatus.textContent = "Account";
        loginLink.onclick = function(event) {
            event.preventDefault();
            sidebarUsername.textContent = "Username: " + (localStorage.getItem('username') || '');
            sidebarEmail.textContent = "Email: " + (localStorage.getItem('email') || '');
            sidebar.classList.add("open");
        };
    } else {
        loginStatus.textContent = "Log in";
        loginLink.onclick = function(event) {
            event.preventDefault();
            window.location.href = "login.html";
        };
    }
}

if (closeSidebar) {
    closeSidebar.onclick = function() {
        sidebar.classList.remove("open");
    };
}

if (logoutBtn) {
    logoutBtn.onclick = function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('email');
        sidebar.classList.remove("open");
        alert("You have been logged out.");
        setLoginState(false);
    };
}

// Initialize login on page load
setLoginState(localStorage.getItem('isLoggedIn') === 'true');
//logo switch
document.getElementById('wissel-icoon').onclick = function() {
    var img = document.getElementById('wissel-img');
    if (img.src.includes('Logo-white.png')) {
        img.src = '../Foto/Logo-black.png';
    } else {
        img.src = '../Foto/Logo-white.png';
    }
};