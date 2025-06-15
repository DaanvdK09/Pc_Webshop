window.addEventListener("load", () => {
    document.body.classList.add("loaded");
    updateLogo();
    updateHomepageImage();
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
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('email');
        sidebar.classList.remove("open");
        alert("You have been logged out.");
        setLoginState(false);
    };
}

function loadSavedBuilds() {
    const username = sessionStorage.getItem('username');
    const buildsList = document.getElementById('saved-builds-list');
    if (!username || !buildsList) return;
    fetch(`http://localhost:5000/api/builds/${username}`)
        .then(res => res.json())
        .then(builds => {
            buildsList.innerHTML = '';
            if (builds.length === 0) {
                buildsList.innerHTML = '<li>No builds saved.</li>';
                return;
            }
            builds.forEach(build => {
                const li = document.createElement('li');
                li.textContent = build.name;
                li.style.cursor = 'pointer';
                li.onclick = () => {
                    // Load build into builder
                    sessionStorage.setItem('selectedParts', build.data);
                    window.location.href = 'pc-builder.html';
                };
                buildsList.appendChild(li);
            });
        });
}

// Call loadSavedBuilds when opening the sidebar
document.getElementById('login-link').addEventListener('click', function() {
    loadSavedBuilds();
});

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

//homepage img switch
function updateHomepageImage() {
    var img = document.getElementById('homepage-img');
    if (document.body.classList.contains('light')) {
        img.src = '../Foto/HomepageCSTBuilderPNGDark.png';
    } else {
        img.src = '../Foto/HomepageCSTBuilderPNG.png';
    }
}

//add-to-cart-button
document.querySelectorAll('.buy-button').forEach(function(button) {
    button.addEventListener('click', function() {
        
        button.classList.remove('clicked');
       
        void button.offsetWidth;
        
        button.classList.add('clicked');
        
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

// Toggle between grid and list view for prebuilt pc's
document.addEventListener('DOMContentLoaded', function() {
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    const prebuiltList = document.querySelector('.prebuilt-list');

    // look which list style is selected by user earlier
    const savedView = localStorage.getItem('prebuiltView') || 'grid';
    if (savedView === 'list') {
        prebuiltList.classList.add('list-view');
        prebuiltList.classList.remove('grid-view');
        listBtn.classList.add('activeviewbutton');
        gridBtn.classList.remove('activeviewbutton');
    } else {
        prebuiltList.classList.add('grid-view');
        prebuiltList.classList.remove('list-view');
        gridBtn.classList.add('activeviewbutton');
        listBtn.classList.remove('activeviewbutton');
    }

    gridBtn.addEventListener('click', function() {
        prebuiltList.classList.add('grid-view');
        prebuiltList.classList.remove('list-view');
        gridBtn.classList.add('activeviewbutton');
        listBtn.classList.remove('activeviewbutton');
        localStorage.setItem('prebuiltView', 'grid');
    });

    listBtn.addEventListener('click', function() {
        prebuiltList.classList.add('list-view');
        prebuiltList.classList.remove('grid-view');
        listBtn.classList.add('activeviewbutton');
        gridBtn.classList.remove('activeviewbutton');
        localStorage.setItem('prebuiltView', 'list');
    });
});
function forceGridViewOnSmallScreen() {
    const gridBtn = document.getElementById('grid-view-btn');
    const listBtn = document.getElementById('list-view-btn');
    const prebuiltList = document.querySelector('.prebuilt-list');
    if (!gridBtn || !listBtn || !prebuiltList) return;

    if (window.innerWidth < 1280) {
        prebuiltList.classList.add('grid-view');
        prebuiltList.classList.remove('list-view');
        gridBtn.classList.add('activeviewbutton');
        listBtn.classList.remove('activeviewbutton');
        localStorage.setItem('prebuiltView', 'grid');
    }
}
// to run the forceGridViewOnSmallScreen
window.addEventListener('DOMContentLoaded', forceGridViewOnSmallScreen);
window.addEventListener('resize', forceGridViewOnSmallScreen);