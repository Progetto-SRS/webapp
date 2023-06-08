const registerForm = document.getElementById('registerForm');

const alert = document.getElementById('alert');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const usernameInput = document.getElementById('usernameInput');
  const emailInput = document.getElementById('emailInput');
  const phoneInput = document.getElementById('phoneInput');
  const passwordInput = document.getElementById('passwordInput');
  const confPasswordInput = document.getElementById('confPasswordInput');

  const username = usernameInput.value;
  const email = emailInput.value;
  const phone = phoneInput.value;
  const password = passwordInput.value;
  const confPassword = confPasswordInput.value;

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&(){}:;<>,.?_+-=|*]).{8,}$/;


  //Controllo campi vuoti
  if(username.length == 0 || email.length== 0 || phone.length == 0 || password.length == 0 || confPassword.length == 0){
    alert.classList.remove('hidden');
    alert.innerHTML = "Please, fill out all the empty fields";
    return;
  }

  // Controllo sul formato dell'email
  
  if (!email.match(emailRegex)) {
    // Mostra un messaggio di errore
    alert.classList.remove('hidden');
    alert.innerHTML = "Please, insert a valid email address";
    return;
  }

  // Controllo sulla password
  
  if (!password.match(passwordRegex)) {
    alert.classList.remove('hidden');
    alert.innerHTML = "Password must contain at least 8 characters, one letter, one number and one symbol";
    return;
  }
  if(password != confPassword){
    alert.classList.remove('hidden');
    alert.innerHTML = "Password are not the same";
    return;
  }

    try {
        alert.classList.add('hidden');
        alert.innerHTML = "";
        const registerSuccess = await registerUser(username, email,phone, password);
        

        if (registerSuccess) {
          setTimeout(async () => {
            const loginSuccess = await loginUser(username, password);
            if (loginSuccess) {
              window.location.href = '/user_env';
            }
          }, 1000); 
        }
    } catch (error) {
      console.error(error);
    }
        
});

function registerUser(username, email,phone, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: username, email, phone, password })
      });

      const data = await response.json();
      if (data.message === 'User added succesfully') {
        resolve(true);
      } else {
        reject(new Error('Registration error'));
      }
    } catch (error) {
      reject(error);
    }
  });
}

function loginUser(username, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch('api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data)
        if (data.message === 'login succesfully') {
          const token = data.token;
          const refreshToken = data.refreshToken;

          document.cookie = `token=${token}; secure; SameSite=Strict`;
          document.cookie = `refreshToken=${refreshToken}; secure; SameSite=Strict`;

          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        reject(new Error('Login request failed'));
      }
    } catch (error) {
      reject(error);
    }
  });
}





