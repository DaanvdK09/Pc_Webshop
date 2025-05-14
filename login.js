// Togle between login and sign-up
function toggleForms() {
            const loginForm = document.getElementById("loginForm");
            const signupForm = document.getElementById("signupForm");
            const formTitle = document.getElementById("form-title");
            const toggleLink = document.getElementById("toggle-link");

            if (loginForm.style.display === "none") {
                loginForm.style.display = "block";
                signupForm.style.display = "none";
                formTitle.textContent = "Login";
                toggleLink.innerHTML = `Don't have an account? <a href="#" onclick="toggleForms()">Sign up</a>`;
            } else {
                loginForm.style.display = "none";
                signupForm.style.display = "block";
                formTitle.textContent = "Sign Up";
                toggleLink.innerHTML = `Already have an account? <a href="#" onclick="toggleForms()">Login</a>`;
            }
        }

// Handle login form submission
document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    // Basic validation
    if (username === "123" && password === "123") {
        // Redirect to the home page
        window.location.href = "home.html";
        alert("Successfully Signed In!");
    } else {
        alert("Invalid username or password. Please try again.");
    }
});