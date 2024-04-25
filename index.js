const BASE_URL = "http://localhost:3005";

// Java Script Code for signup page(index.html)

document.addEventListener('DOMContentLoaded', function(){
    var button = document.getElementById('Signupbtn');
    button.addEventListener("click", function(){
        var Username = document.getElementById('signupUser').value;
        var Email = document.getElementById('signupEmail').value;
        var Password = document.getElementById('signupPassword').value;

        // Simple Email Validation
        if(!validateEmail(Email)){
            alert("Enter valid email address");
            return;
        }

        // simple user validation
        if(!Username.trim()){
            alert("enter username");
            return;
        }

        // simple user password
        if(!Password.trim()){
            alert("Enter Password");
            return;
        }

        var obj={
            Myusername: Username,
            Myemail: Email,
            Mypassword: Password
        };

        fetch(`${BASE_URL}/contact`,{
            method: "POST",
            headers:{
                "content-type": "application/json"
            },
            body: JSON.stringify(obj)
        })

        .then(response => {
            if (response.ok) {
                // Signup successful
                alert("Signup successful");
            } else if (response.status === 400) {
                // Email already registered
                alert("Email is already used");
            } else {
                // Handle other errors
                alert("An error occurred during signup");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("An error occurred during signup");
        });
    });
});

function validateEmail(email){
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Java Script code for loginpage(index1.html)

document.addEventListener('DOMContentLoaded', function () {
    var button = document.getElementById('Loginbtn');
    button.addEventListener("click", function () {
        var Email = document.getElementById('loginEmail').value;
        var Password = document.getElementById('loginPassword').value;

        var obj = {
            Myemail: Email,
            Mypassword: Password
        };

        fetch(`${BASE_URL}/contact1`, {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(obj)
        })


            .then(response => {
                if (response.ok) {
                    // Login successful
                    return response.json();
                } else {
                    // Failed login
                    alert("Invalid email or password");
                }
            })

            .then(data => {
                // Store token in local storage
                localStorage.setItem('token', data.token);
                // Redirect to protected route
                window.location.href = 'protected.html'; // Redirect to protected.html instead of directly accessing the protected route
            })

            .catch(error => {
                console.error('Error:', error);
                alert("An error occurred during login");
            });

    });
});

// java Script code for protected route

document.addEventListener('DOMContentLoaded', function () {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login page if not logged in
        window.location.href = 'index1.html';
    } else {
        // Fetch data if logged in
        fetchData();
    }

    // Function to fetch data from the backend
    async function fetchData() {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BASE_URL}/protected`, {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });
            const data = await response.json();
            // Display the data
            document.getElementById('dataContainer').innerText = JSON.stringify(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }
});

//  java scrip code for new_protected route

// Function to fetch data from the backend
async function fetchData() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/new_protected`, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        });
        const data = await response.json();
        // Display the data
        document.getElementById('dataContainer').innerText = JSON.stringify(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Check if the user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        // Redirect to login page if not logged in
        window.location.href = 'index1.html';
    } else {
        // Fetch data if logged in
        fetchData();
    }
});