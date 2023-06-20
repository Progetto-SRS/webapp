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

const imgCont = document.getElementById("img-sp-cont")
imgCont.addEventListener("click",togglePasswordVisibility);

const passwordInput = document.getElementById('passwordInput');
const confPasswordInput = document.getElementById('confPasswordInput');
var requirementsList = document.getElementById("requirementsList");


var requirements = [
  {
    text: "Password must contain at least 8 characters.",
    check: function(password) {
      return password.length >= 8;
    }
  },
  {
    text: "Password must contain at least one letter.",
    check: function(password) {
      return /[a-zA-Z]/.test(password);
    }
  },
  {
    text: "Password must contain at least one digit.",
    check: function(password) {
      return /[0-9]/.test(password);
    }
  },
  {
    text: "Password must contain at least one special character (!@#$%^&(){}:;<>,.?_+\-=|)",
    check: function(password) {
      return /[!@#$%^&(){}:;<>,.?_+\-=|]/.test(password);
    }
  },
  {
    text: "The two password must be the same",
    check: function(password) {
      return password === confPasswordInput.value; ;
    }
  }
];
  requirements.forEach(function(requirement) {
    var li = document.createElement("li");
    li.textContent = requirement.text;
    requirementsList.appendChild(li);
  });
  confPasswordInput.addEventListener("input", updateRequirements);
  passwordInput.addEventListener("input",updateRequirements);
   function updateRequirements() {
    var password = passwordInput.value;

    // Controlla i requisiti della password e aggiorna lo stile dei punti elenco
    requirements.forEach(function(requirement, index) {
      var li = requirementsList.children[index];

      if (requirement.check(password)) {
        li.classList.remove("red");
        li.classList.add("green");
      } else {
        li.classList.remove("green");
        li.classList.add("red");
      }
    });
  };

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const usernameInput = document.getElementById('usernameInput');
  const emailInput = document.getElementById('emailInput');
  const phoneInput = document.getElementById('phoneInput');
  


  const username = usernameInput.value;
  const email = emailInput.value;
  const phone = phoneInput.value;
  const password = passwordInput.value;
  const confPassword = confPasswordInput.value;


  const emailRegex = /^\w+(?:[\.-]?\w+)*@(?:\w+[\.-]?\w+)*\.\w{2,3}$/;

  const passwordRegex = /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&(){}:;<>,.?_+\-=|]).{8,}/

  
  // Controllo sul formato dell'email

  if (!email.match(emailRegex)) {
    // Mostra un messaggio di errore
    alert.classList.remove('hidden');
    alert.innerHTML = "Please, insert a valid email address";
    return;
  }

  // Controllo sulla password
  if (!password.match(passwordRegex)) {
    passwordInput.style.border = "1px solid red"
    confPasswordInput.style.border = "1px solid red"
    return;
  }
  if(password != confPassword){
    passwordInput.style.border = "1px solid red"
    confPasswordInput.style.border = "1px solid red"
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





