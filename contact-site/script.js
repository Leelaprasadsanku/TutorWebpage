// Simple client-side form handling
console.log('Script loaded');

const yearElement = document.getElementById('year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

console.log('Form found:', form);

// Add validation on blur for required fields
if (form) {
  const requiredFields = form.querySelectorAll('input[required], textarea[required]');
  console.log('Required fields found:', requiredFields.length);
  requiredFields.forEach(field => {
    field.addEventListener('blur', () => {
      console.log('Blur on', field.name, 'value:', field.value.trim());
      if (field.value.trim() === '') {
        field.classList.add('invalid');
        console.log('Added invalid class');
      }
    });
    field.addEventListener('input', () => {
      if (field.value.trim() !== '') {
        field.classList.remove('invalid');
        console.log('Removed invalid class on input');
      }
    });
  });

  form.addEventListener('submit', async (e)=>{
    // Validate required fields
    let isValid = true;
    requiredFields.forEach(field => {
      field.classList.remove('invalid');
      if (field.value.trim() === '') {
        field.classList.add('invalid');
        isValid = false;
      }
    });

    // Validate email format
    const emailField = form.email;
    const emailValue = emailField.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailValue !== '' && !emailRegex.test(emailValue)) {
      emailField.classList.add('invalid');
      isValid = false;
    }

    if (!isValid) {
      e.preventDefault();
      status.textContent = 'Please fill in all required fields and ensure email is valid.';
      status.style.color = 'red';
      return;
    }

    e.preventDefault();
    status.textContent = 'Sending...';

    const data = {
      name: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      message: form.message.value.trim(),
      timestamp: new Date().toISOString()
    };

    try{
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(data)
      });
      if(!res.ok) throw new Error('Network response was not ok');
      const json = await res.json();
      status.textContent = json.message || 'Message sent — thank you!';
      status.style.color = 'green'
      form.reset();
    }catch(err){
      console.error('Submit error', err);
      status.textContent = 'There was a problem sending your message. Please try again later.';
    }

    setTimeout(()=>{ status.textContent = ''; }, 6000);
  });
}

// Function to load and display GCSE results
async function loadResults() {
  try {
    const response = await fetch('/api/results');
    const data = await response.json();

    const resultsContainer = document.getElementById('results-data');
    resultsContainer.innerHTML = '';

    for (const [year, students] of Object.entries(data)) {
      const yearSection = document.createElement('div');
      yearSection.innerHTML = `
        <h3>GCSE RESULTS - ${year}:</h3>
        <table>
          <thead>
            <tr>
              <th>NAME</th>
              <th>CHEMISTRY</th>
              <th>BIOLOGY</th>
              <th>PHYSICS</th>
            </tr>
          </thead>
          <tbody>
            ${students.map(student => `
              <tr>
                <td>${student.name}</td>
                <td>${student.chemistry || ''}</td>
                <td>${student.biology || ''}</td>
                <td>${student.physics || ''}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      resultsContainer.appendChild(yearSection);
    }
  } catch (error) {
    console.error('Error loading results:', error);
    document.getElementById('results-data').innerHTML = '<p>Error loading results. Please try again later.</p>';
  }
}

// Load results when the page loads
if (document.getElementById('results-data')) {
  loadResults();
}

// Hamburger menu toggle
const hamburger = document.querySelector('.hamburger');
const nav = document.querySelector('nav');

if (hamburger && nav) {
  hamburger.addEventListener('click', () => {
    nav.classList.toggle('open');
    hamburger.classList.toggle('open');
    document.body.classList.toggle('menu-open');
  });
}

// Close menu when clicking outside or on a link
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !nav.contains(e.target)) {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
});

nav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    nav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
});

// Auto-select nav link that matches current path (keeps nav active on page load)
document.addEventListener('DOMContentLoaded', () => {
  const currentPath = (location.pathname || '/').replace(/\/$/, '') || '/';
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach((link) => {
    try {
      const href = link.getAttribute('href');
      if (!href) return;
      const url = new URL(href, location.origin);
      const linkPath = (url.pathname || '/').replace(/\/$/, '') || '/';

      // Special handling for root path: if currentPath is '/', match contact.html
      if (currentPath === '/' && href === 'contact.html') {
        link.classList.add('active');
      } else if (linkPath === currentPath || (linkPath !== '/' && currentPath.endsWith(linkPath))) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    } catch (err) {
      // malformed href — ignore
    }
  });
});
