const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const emailLoginInput = document.getElementById('emailLoginInput');
    const passwordLoginInput = document.getElementById('passwordLoginInput');
  
    const loginUsername = emailLoginInput.value;
    const loginPassword = passwordLoginInput.value;

    document.addEventListener('DOMContentLoaded', function() {
      var loginForm = document.getElementById('loginForm');
      var rememberMe = document.getElementById('rememberMe');
      
      // Quando la pagina viene caricata, controlla se il token di autenticazione è presente
      if (localStorage.getItem('authToken')) {
        var storedToken = localStorage.getItem('authToken');
        var decodedToken = decodeAuthToken(storedToken);
        
        if (decodedToken && decodedToken.exp > Date.now()) {
          document.getElementById('username').value = decodedToken.username;
          rememberMe.checked = true;
        }
      }
      
      loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        var username = document.getElementById('username').value;
        var password = document.getElementById('password').value;
        
        // Simulazione dell'hashing delle password
        var hashedPassword = hashPassword(password);
        
        if (rememberMe.checked) {
          var authToken = generateAuthToken(username);
          localStorage.setItem('authToken', authToken);
        } else {
          localStorage.removeItem('authToken');
        }
        
        // Effettua l'accesso o esegui altre azioni necessarie
        console.log('Accesso effettuato');
      });
    });
    
    // Funzione per generare un token di autenticazione
    function generateAuthToken(username) {
      var token = {
        username: username,
        exp: Date.now() + 30 * 24 * 60 * 60 * 1000 // Scade dopo 30 giorni
      };
      
      var encodedToken = btoa(JSON.stringify(token)); // Codifica il token in Base64
      
      return encodedToken;
    }
    
    // Funzione per decodificare un token di autenticazione
    function decodeAuthToken(authToken) {
      try {
        var decodedToken = JSON.parse(atob(authToken)); // Decodifica il token da Base64
        
        return decodedToken;
      } catch (error) {
        return null;
      }
    }
    
    // Funzione per l'hashing delle password (Esempio: Utilizza l'algoritmo SHA-256)
    function hashPassword(password) {
      // Codice di hashing delle password
      // Esempio: Utilizza l'algoritmo SHA-256 per ottenere l'hash della password
      var hashedPassword = sha256(password);
      
      return hashedPassword;
    }
  
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