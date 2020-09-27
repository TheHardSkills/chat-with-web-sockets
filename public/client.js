
const sendRequestWithUserData = async () => {
    // document.location = "http://localhost:8000/chat";

    let username = document.getElementById("usernameField").value;
    let password = document.getElementById("passwordField").value;

    await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
    });
}
