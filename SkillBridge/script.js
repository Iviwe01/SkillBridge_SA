import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-database.js";
import emailjs from 'https://cdn.emailjs.com/dist/email.min.js';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAdwz7u5BJ0-pWBN_ha9l-b-ARX3uRu5c0",
    authDomain: "linkyouup-3686d.firebaseapp.com",
    databaseURL: "https://linkyouup-3686d-default-rtdb.firebaseio.com",
    projectId: "linkyouup-3686d",
    storageBucket: "linkyouup-3686d.appspot.com",
    messagingSenderId: "236924478082",
    appId: "1:236924478082:android:b66e5e102c2b2a18734a9b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore(app);
const rtdb = getDatabase(app); // Real-Time Database

// Handle Sign Up
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            await setDoc(doc(db, "users", user.uid), {
                name: name,
                email: email
            });
            alert('Sign up successful! You can now log in.');
            window.location.href = "login.html";
        } catch (error) {
            console.error('Error signing up:', error);
            alert('Error signing up. Please try again.');
        }
    });
}

// Handle Login
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert('Login successful! Redirecting...');
            window.location.href = "index.html";
        } catch (error) {
            console.error('Error logging in:', error);
            alert('Invalid login credentials. Please try again.');
        }
    });
}

// Fetch job titles from GitHub
async function fetchJobTitles() {
    try {
        const response = await fetch('https://raw.githubusercontent.com/jneidel/job-titles/master/job-titles.json');
        const jobTitles = await response.json();
        return jobTitles;
    } catch (error) {
        console.error('Failed to fetch job titles:', error);
        return [];
    }
}

// Handle job search
const jobSearchButton = document.getElementById('job-search-button');
if (jobSearchButton) {
    jobSearchButton.addEventListener('click', async () => {
        const searchQuery = document.getElementById('job-search').value.toLowerCase();
        const jobTitles = await fetchJobTitles();
        const filteredJobs = jobTitles.filter(job => job.toLowerCase().includes(searchQuery));

        const jobResultsContainer = document.getElementById('job-results');
        jobResultsContainer.innerHTML = '';

        if (filteredJobs.length > 0) {
            filteredJobs.forEach(job => {
                const jobItem = document.createElement('div');
                jobItem.className = 'job-item';
                jobItem.textContent = job;
                jobResultsContainer.appendChild(jobItem);
            });
        } else {
            jobResultsContainer.innerHTML = '<p>No jobs found for the specified category.</p>';
        }
    });
}

// Strengths Test Functionality
const strengthsForm = document.getElementById('strengths-form');
if (strengthsForm) {
    strengthsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const results = "Based on your responses, we recommend the following courses: Web Development, Data Science.";
        document.getElementById('strengths-results').innerHTML = `<p>${results}</p>`;
    });
}

// Email Functionality
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;

        emailjs.init('YOUR_PUBLIC_KEY');
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
            from_name: name,
            from_email: email,
            message: message
        }).then((response) => {
            alert('Email successfully sent to andyrosecpt.gmail.com!');
        }, (error) => {
            console.error('Failed to send email:', error);
            alert('Failed to send email. Please try again.');
        });

        contactForm.reset();
    });
}

// Chatbot functionality
const chatbot = document.getElementById('chatbot');
const closeChatbot = document.getElementById('close-chatbot');
const chatbotBody = document.getElementById('chatbot-body');

closeChatbot.addEventListener('click', () => {
    chatbot.style.display = 'none';
});

document.querySelectorAll('#chatbot-body ul li a').forEach(item => {
    item.addEventListener('click', event => {
        const question = event.target.textContent;
        let response;

        switch (question) {
            case 'What is SkillBridge?':
                response = 'SkillBridge is an online learning platform offering a variety of courses to help you advance in your career.';
                break;
            case 'How do I sign up for a course?':
                response = 'You can sign up by visiting our courses section, selecting a course, and clicking the "Start Now" button.';
                break;
            case 'What are the payment options?':
                response = 'We accept credit/debit cards, PayPal, and other major payment methods.';
                break;
            case 'How do I reset my password?':
                response = 'To reset your password, go to the login page, click "Forgot Password", and follow the instructions.';
                break;
            default:
                response = 'I\'m here to help! Please ask any questions you may have.';
        }

        alert(response);
    });
});
