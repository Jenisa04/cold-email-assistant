document.addEventListener('DOMContentLoaded', function () {
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = 'login.html'; // Redirect if not logged in
    } else {
      loadTemplates(user.uid);
    }
  });

  async function loadTemplates(userId) {
    const templateList = document.getElementById('templatelist');
    templateList.innerHTML = '';

    const templatesSnapshot = await db
      .collection('templates')
      .where('userId', '==', userId)
      .get();
    templatesSnapshot.forEach((doc) => {
      const li = document.createElement('li');
      li.textContent = doc.data().content.substring(0, 50) + '...'; // Show preview
      templateList.appendChild(li);
    });
  }

  document
    .getElementById('savetemplate')
    .addEventListener('click', async () => {
      const user = auth.currentUser;
      if (!user) return;

      const newTemplate = document.getElementById('newtemplate').value.trim();
      if (newTemplate) {
        await db
          .collection('templates')
          .add({ userId: user.uid, content: newTemplate });
        alert('Template saved!');
        loadTemplates(user.uid);
      }
    });

  document.getElementById('logout').addEventListener('click', () => {
    auth.signOut().then(() => {
      localStorage.removeItem('userEmail');
      window.location.href = 'login.html';
    });
  });
});
