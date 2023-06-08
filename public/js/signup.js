const registerForm = document.getElementById('registerForm');

const alert = document.getElementById('alert');

function togglePasswordVisibility() {
  var passwordInput = document.getElementById("passwordInput");
  if (passwordInput.type === "text") {
    passwordInput.type = "password";
  } else {
    passwordInput.type = "text";
  }
}


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

  // Controllo sul formato dell'email

  if (!email.match(emailRegex)) {
    // Mostra un messaggio di errore
    alert.classList.remove('hidden');
    alert.innerHTML = "Please, insert a valid email address";
    return;
  }

  // Controllo sulla password
  
  if(password != confPassword){
    alert.classList.remove('hidden');
    alert.innerHTML = "Password are not the same";
    return;
  }

    try {
        alert.classList.add('hidden');
        alert.innerHTML = "";
        const response = await fetch('api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: username, email, phone, password })
        });

        const data = await response.json();
        console.log(data); // Gestisci la risposta dal backend come preferisci
    } catch (error) {
        console.error(error);
    }
});


