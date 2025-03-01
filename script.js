const API_KEY = "af94f44d597a45a39383e9160fd96ae1";
const base_url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => {
    const username = localStorage.getItem("username");
    if (!username) {
        document.getElementById("auth-popup").style.display = "flex";
    } else {
        fetchNews("Technology");
        displayBookmarkedArticles(username);
    }
});

let curSelectedNav = null;
function onNavItemclick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    if (!query) return;
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});

// Sign up form submission
document.getElementById("auth-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("error-msg");

    if (!username || !password) {
        errorMsg.textContent = "Username and Password are required.";
        return;
    }

    // Sign Up - store the user credentials in localStorage
    if (document.getElementById("auth-form").classList.contains("signup")) {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);

        // Show login form after successful sign up
        errorMsg.textContent = "";
        alert("Sign up successful! Please log in to continue.");
        
        // Switch to login form
        document.getElementById("signup-link").textContent = "Don't have an account? Sign up here";
        document.getElementById("auth-form").innerHTML = `
            <input type="text" id="username" placeholder="Username" required><br>
            <input type="password" id="password" placeholder="Password" required><br>
            <button type="submit">Login</button>
            <p id="error-msg" style="color: red;"></p>
        `;
        document.getElementById("auth-form").classList.remove("signup");
    } else {
        // Login - check stored credentials
        const storedUsername = localStorage.getItem("username");
        const storedPassword = localStorage.getItem("password");

        if (username === storedUsername && password === storedPassword) {
            closePopup();
            fetchNews("Technology");
            displayBookmarkedArticles(username);
        } else {
            errorMsg.textContent = "Incorrect username or password.";
        }
    }
});

function closePopup() {
    const popup = document.getElementById("auth-popup");
    popup.style.display = "none";
}

async function fetchNews(query) {
    try {
        const response = await fetch(`${base_url}${query}&apiKey=${API_KEY}`);
        const data = await response.json();

        if (data.status === "ok") {
            displayNews(data.articles);
        }
    } catch (error) {
        console.log("Error fetching news:", error);
    }
}

function displayNews(articles) {
    const template = document.getElementById("template-news-card");
    const cardContainer = document.getElementById("card-container");

    cardContainer.innerHTML = "";

    articles.forEach((article, index) => {
        const clone = template.content.cloneNode(true);

        clone.getElementById("news-title").textContent = article.title;
        clone.getElementById("news-desc").textContent = article.description;
        clone.getElementById("news-source").textContent = article.source.name;
        clone.getElementById("news-img").src = article.urlToImage;

        const bookmarkBtn = clone.querySelector(".bookmark-btn");
        bookmarkBtn.addEventListener("click", function(event) {
            event.stopPropagation();  // Prevents the news card click event
            toggleBookmark(bookmarkBtn, index);
        });

        // Check if the article is already bookmarked
        const username = localStorage.getItem("username");
        const bookmarkedArticles = JSON.parse(localStorage.getItem(`bookmarkedArticles-${username}`)) || [];

        if (bookmarkedArticles.includes(index)) {
            bookmarkBtn.textContent = "Bookmarked";
            bookmarkBtn.style.backgroundColor = "#d3ffd3"; // Highlight bookmarked articles
        }

        // Add click event to open the article in a new tab
        clone.firstElementChild.addEventListener("click", () => {
            window.open(article.url, "_blank");
        });

        cardContainer.appendChild(clone);
    });
}

function toggleBookmark(button, index) {
    const username = localStorage.getItem("username");
    let bookmarkedArticles = JSON.parse(localStorage.getItem(`bookmarkedArticles-${username}`)) || [];

    if (bookmarkedArticles.includes(index)) {
        // Remove bookmark
        bookmarkedArticles = bookmarkedArticles.filter((item) => item !== index);
        button.textContent = "Bookmark";
        button.style.backgroundColor = "#28a745"; // Normal button color
    } else {
        // Add bookmark
        bookmarkedArticles.push(index);
        button.textContent = "Bookmarked";
        button.style.backgroundColor = "#d3ffd3"; // Highlight bookmarked articles
    }

    localStorage.setItem(`bookmarkedArticles-${username}`, JSON.stringify(bookmarkedArticles));
    displayBookmarkedArticles(username);
}

function displayBookmarkedArticles(username) {
    const bookmarkedArticles = JSON.parse(localStorage.getItem(`bookmarkedArticles-${username}`)) || [];
    const bookmarkedCardContainer = document.getElementById("bookmarked-card-container");

    bookmarkedCardContainer .innerHTML = "";

    bookmarkedArticles.forEach((index) => {
        const article = data.articles[index];
        const clone = template.content.cloneNode(true);

        clone.getElementById("news-title").textContent = article.title;
        clone.getElementById("news-desc").textContent = article.description;
        clone.getElementById("news-source").textContent = article.source.name;
        clone.getElementById("news-img").src = article.urlToImage;

        bookmarkedCardContainer.appendChild(clone);
    });
}

function onNavItemclick(query) {
    fetchNews(query);
}

// Toggle between Login and Sign Up views
document.getElementById("signup-link").addEventListener("click", () => {
    const form = document.getElementById("auth-form");
    const signupLink = document.getElementById("signup-link");
    const isSignupForm = form.classList.contains("signup");

    if (!isSignupForm) {
        signupLink.textContent = "Already have an account? Login here";
        form.innerHTML = `
            <input type="text" id="username" placeholder="Username" required><br>
            <input type="password" id="password" placeholder="Password" required><br>
            <input type="email" id="email" placeholder="Email" required><br>
            <button type="submit">Sign Up</button>
            <p id="error-msg" style="color: red;"></p>
        `;
        form.classList.add("signup");
    } else {
        signupLink.textContent = "Don't have an account? Sign up here";
        form.innerHTML = `
            <input type="text" id="username" placeholder="Username" required><br>
            <input type="password" id="password" placeholder="Password" required><br>
            <button type="submit">Login</button>
            <p id="error-msg" style="color: red;"></p>
        `;
        form.classList.remove("signup");
    }
});