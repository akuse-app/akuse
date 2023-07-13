const loginButton = document.getElementById("login")

loginButton.addEventListener("click", () => {
    window.electronAPI.openLoginPage()
})