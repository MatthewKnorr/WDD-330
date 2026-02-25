import { getJson } from './externalServices.mjs';
import { getJson } from './productData.mjs';
import { getLocalStorage, setLocalStorage } from './utils.mjs';

const mainEl = document.querySelector('main');

export async function displayAlerts() {
    const alerts = await getJson('alerts');
    if (!alerts) {
        return;
    }    
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

export function displayCallToAction() {
    const alreadyVisited = getLocalStorage('visited');
    const dialog = document.createElement('dialog');
    dialog.className = 'register';
    dialog.innerHTML = registerTemplate();
    if (!alreadyVisited || alreadyVisited.length === 0) {
        mainEl.prepend(dialog);
        dialog.showModal();

        document.querySelector('#closeRegister').addEventListener('click', () => {
            dialog.close();
        })

        setLocalStorage('visited', true);
    }
}

function registerTemplate() {
    return `
    <h1>Hello new user!</h1>
    <p>We see that you've never visited our site before. You should register today!</p>
    <p>If you register today, your name will be entered into a drawing for a giveaway! We have some exciting prizes, such as giftcards, products, and more, so be sure to enter!</p>
    <button id="closeRegister">Close Popup</button>
    `;
}