
document.addEventListener('DOMContentLoaded', () => {
    const homeLink = document.createElement('a');
    homeLink.className = 'home-link';
    homeLink.href = './index.html';
    homeLink.setAttribute('aria-label', 'Home');
    homeLink.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 11.5L12 4L20 11.5V20C20 20.5523 19.5523 21 19 21H15C14.4477 21 14 20.5523 14 20V15C14 14.4477 13.5523 14 13 14H11C10.4477 14 10 14.4477 10 15V20C10 20.5523 9.55228 21 9 21H5C4.44772 21 4 20.5523 4 20V11.5Z" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
    document.body.appendChild(homeLink);
});
