import QRCode from 'qrcode';
import { toPng } from 'html-to-image';
import background_url from './background.jpg';
import './style.css';
import moment from 'moment';

const background = document.createElement('img');
background.src = background_url;
background.id = 'background';

const canvas = document.createElement('canvas');
canvas.className = 'id_canvas';

async function createId(name, expiration, qr_url) {
    // Wait for image to load first
    await background.decode();

    const width = background.width;
    const height = background.height;

    // Set the canvas resolution to the background image size
    canvas.width = width;
    canvas.height = height;

    // Set the width and height of the template div
    const html_template = document.getElementById('html_template').children[0];
    html_template.style.width = width + 'px';
    html_template.style.height = height + 'px';

    // Get html from template and recreate html div
    const html_div = html_template.cloneNode(true);
    const qr_canvas = html_div.querySelector('.qr_canvas');
    html_div.style.backgroundImage = `url(${background_url})`;

    // Replace content from template
    const name_elem = html_div.querySelector('.info > h2');
    name_elem.innerHTML = name;
    const expritation_elem = html_div.querySelector('.info > h3');
    expritation_elem.innerHTML = expiration || 'LIFE MEMBER';

    // Generate QR Code
    await QRCode.toCanvas(qr_canvas, qr_url, {
        errorCorrectionLevel: 'H',
        color: {
            light: '#0000'
        },
        scale: 7,
        margin: 0
    });

    // Element needs to be in dom for it to be converted to image
    document.body.appendChild(html_div);

    // Create image
    const dataUrl = await toPng(html_div);
    const output = new Image();
    output.src = dataUrl;

    // Remove element from dom
    document.body.removeChild(html_div);

    return output;
}

// TODO create form to update id

const name_input = document.getElementById('name');
const date_input = document.getElementById('date');
const url_input = document.getElementById('url');

name_input.addEventListener('change', updateId);
date_input.addEventListener('change', updateId);
url_input.addEventListener('change', updateId);

const CARD_HTML_ID = 'generated_id_card';
const download = document.getElementById('download');

async function updateId() {

    // Check for existing image and remove it
    const existing = document.getElementById(CARD_HTML_ID);
    if (existing) document.body.removeChild(existing);

    let date_value = undefined;

    if (date_input.value) {
        date_value = moment(date_input.value).format('MM/DD/YYYY');
    }

    const id_card = await createId(name_input.value, date_value, url_input.value);
    id_card.className = 'generated';
    id_card.id = CARD_HTML_ID;

    document.body.appendChild(id_card);

    download.href = id_card.src;
    download.download = name_input.value.replace(' ', '_') + '-MEID.png';
}


/*
download.addEventListener('click', () => {
    const generated_card = document.getElementById(CARD_HTML_ID);
    var url = generated_card.src.replace(/^data:image\/[^;]+/, 'data:application/octet-stream');
    window.open(url);
});
*/