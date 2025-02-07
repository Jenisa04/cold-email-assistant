document.getElementById('login').addEventListener('click', function () {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth
    .signInWithPopup(provider)
    .then((result) => {
      console.log('User signed in:', result.user);
      localStorage.setItem('userEmail', result.user.email);
      window.location.href = 'popup.html'; // Redirect to main UI
    })
    .catch((error) => {
      console.error('Login error:', error);
    });
});
