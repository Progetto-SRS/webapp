const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailLoginInput = document.getElementById('emailLoginInput');
    const passwordLoginInput = document.getElementById('passwordLoginInput');
  
    const loginUsername = emailLoginInput.value;
    const loginPassword = passwordLoginInput.value;
  
    try {
      const response = await fetch('api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
  
      const data = await response.json();
      if (data.message == 'login succesfully'){
        const token = data.token;
        const refreshToken = data.refreshToken;

        document.cookie = `token=${token}; secure; SameSite=Strict`;
        document.cookie = `refreshToken=${refreshToken}; secure; SameSite=Strict`;
        console.log(data); // Gestisci la risposta dal backend come preferisci
        window.location.href='/user_env'
      }
      else {
        const loginAlert = document.getElementById("login-alert")
        loginAlert.classList.remove('hidden')
        emailLoginInput.style.border = "2px solid red"
        passwordLoginInput.style.border = "2px solid red"
      }
    } catch (error) {
      console.error(error);
    }
  });