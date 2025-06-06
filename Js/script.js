window.addEventListener("load", () => {
    document.body.classList.add("loaded");
    updateLogo();
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
function updateLogo() {
    var img = document.getElementById('wissel-img');
    if (document.body.classList.contains('light')) {
        img.src = '../Foto/Logo-black.png';
    } else {
        img.src = '../Foto/Logo-white.png';
    }
}
//add-to-cart-button
document.querySelectorAll('.buy-button').forEach(function(button) {
    button.addEventListener('click', function() {
        // Verwijder eerst de class als hij er al op zit (voor snel dubbelklikken)
        button.classList.remove('clicked');
        // Force reflow zodat de animatie opnieuw kan starten
        void button.offsetWidth;
        // Voeg de class toe voor de animatie
        button.classList.add('clicked');
        // Verwijder de class na de animatie (1.5s, gelijk aan je keyframes)
        setTimeout(function() {
            button.classList.remove('clicked');
        }, 2200);
    });
});
//specs menu
document.querySelectorAll('.specs-menu').forEach(function(menu) {
    const toggle = menu.querySelector('.specs-toggle');
    if (toggle) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
        });
    }
});
//nav underline
document.addEventListener('DOMContentLoaded', function() {
    const activeLink = document.querySelector('.nav-links .nav-link.active');
    if (activeLink) {
        activeLink.classList.remove('active');
        void activeLink.offsetWidth; // force reflow
        setTimeout(() => {
            activeLink.classList.add('active');
        }, 50);
    }
});
