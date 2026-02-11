import { getJson } from './productData.mjs';

export async function displayAlerts() {
    const alerts = await getJson('alerts');
    if (!alerts) {
        return;
    }
    const mainEl = document.querySelector('main');
    
    const section = document.createElement('section');
    section.className = 'alert-list';

    alerts.forEach(alert => {
        section.innerHTML += alertTemplate(alert);
    });

    section.innerHTML += `<button id='closeAlerts'>&#10007 Hide Alerts</button>`;

    mainEl.prepend(section);

    document.querySelector('#closeAlerts').addEventListener('click', () => {
    const alerts = document.querySelector('.alert-list');
    alerts.classList.add('hide');
})
}

function alertTemplate(alert) {
    return `
    <p style="
        background-color: ${alert.background};
        color: ${alert.color};
    ">${alert.message}</p>
    `;
}