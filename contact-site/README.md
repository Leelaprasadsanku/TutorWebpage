# Contact Page Example

This is a small example contact page inspired by the layout on https://www.thesciencetutor.co.uk/contact. It's a static HTML/CSS/JS front-end plus a very small, zero-dependency Node server for local testing.

Files:
- `index.html` — the contact page
- `styles.css` — page styles
- `script.js` — client-side form handling
- `server.js` — Node static server + `/api/contact` endpoint
- `submissions.log` — created when form posts are received

Getting started (Windows PowerShell):

1. Open PowerShell and change to this folder:

```powershell
cd "c:\Users\lsanku\Desktop\YashProject\contact-site"
```

2. Start the server:

```powershell
npm start
```

3. Open your browser to http://localhost:3000/

4. Submit the contact form — submissions are logged to `submissions.log` and the server prints a short message to the terminal.

Notes & next steps:
- This example logs submissions to a local file. For production you should send emails or insert into a real backend (and add spam protection, rate-limiting, validation, TLS, and environment-based configuration).
- To embed a live map, replace the map placeholder in `index.html` with a Google Maps or OpenStreetMap embed iframe.
- If you want I can add server-side email sending (e.g., via SMTP or a transactional email API) and recaptcha/spam protection.
