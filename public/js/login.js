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
      console.log(data); // Gestisci la risposta dal backend come preferisci
    } catch (error) {
      console.error(error);
    }
  });