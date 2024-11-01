const form = document.querySelector('form');
const emailErrorDiv = document.querySelector('#email-error');
const passwordErrorDiv = document.querySelector('#pass-error');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    emailErrorDiv.textContent = '';
    passwordErrorDiv.textContent = '';

    const email = document.querySelector('#email').value;
    const pass = document.querySelector('#pass').value;
    const confirmPass = document.querySelector('#c-pass').value;

    if (pass !== confirmPass) {
        alert('Passwords do not match!');
    }
    else {
        try {
            const res = await fetch('/signup', {
                method: 'POST',
                body: JSON.stringify({ email: email, password: pass }),
                headers: { 'Content-type': 'application/json' }
            });

            const data = await res.json();

            console.log(data);

            if (data.errors) {
                emailErrorDiv.textContent = data.errors.email;
                passwordErrorDiv.textContent = data.errors.password;
            }

            if (data.user) {
                location.assign('/')
            }
            
        }
        catch(err) {
            console.log(err);
        }
    }
});