const sendRequestWithUserData = async () => {
  let username = document.getElementById("usernameField").value;
  let password = document.getElementById("passwordField").value;

  const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  const resultUsernameCheck = format.test(username);
  if (resultUsernameCheck) {
    alert("Username cannot contain special characters");
    return;
  }

  const result = await fetch("http://localhost:8000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const { error, token } = await result.json();
  if (error) {
    alert(error);
    return;
  }
  localStorage.setItem("token", token);
  if (localStorage.getItem("token")) {
    document.location = "http://localhost:8000/chat";
  }
};
