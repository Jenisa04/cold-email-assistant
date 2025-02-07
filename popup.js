document.addEventListener('DOMContentLoaded', async function () {
  const templateDropdown = document.getElementById('emailtemplate');
  const sendButton = document.getElementById('sendtmail');
  const saveTemplateButton = document.getElementById('savetemplate');

  // Load saved templates
  async function loadTemplates() {
    templateDropdown.innerHTML = '';
    const templatesSnapshot = await db.collection('templates').get();
    templatesSnapshot.forEach((doc) => {
      const option = document.createElement('option');
      option.value = doc.data().content;
      option.textContent = doc.data().content.substring(0, 20) + '...';
      templateDropdown.appendChild(option);
    });
  }

  saveTemplateButton.addEventListener('click', async () => {
    const newTemplate = document.getElementById('newtemplate').value;
    if (newTemplate.trim()) {
      await db.collection('templates').add({ content: newTemplate });
      alert('Template saved!');
      loadTemplates();
    }
  });

  sendButton.addEventListener('click', () => {
    const receiverName = document.getElementById('receivername').value;
    const receiverEmail = document.getElementById('receiveremail').value;
    const subject = document.getElementById('emailsubject').value;
    const template = templateDropdown.value;

    if (receiverEmail && template) {
      chrome.runtime.sendMessage({
        action: 'sendemail',
        email: {
          to: receiverEmail,
          subject: subject,
          body: template.replace('{name}', receiverName),
        },
      });
    }
  });

  loadTemplates();
});
