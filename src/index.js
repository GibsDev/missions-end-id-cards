import QRCode from 'qrcode';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';
import background_url from './background.jpg';
import './style.css';

const background = document.createElement('img');
background.src = background_url;
background.id = 'background';

const canvas = document.createElement('canvas');
canvas.className = 'id_canvas';

const url = 'https://drive.google.com/file/d/1Dv5nTCgs6Gu0z4EzTKKMSrStQStQyKvv/view?usp=sharing';

(async () => {
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

    await QRCode.toCanvas(qr_canvas, url, {
        errorCorrectionLevel: 'H',
        color: {
            light: '#0000'
        },
        scale: 7,
        margin: 0
    });

    // Add html to doc
    document.body.appendChild(html_div);

    // TODO create image
    const dataUrl = await toPng(html_div);
    const asdf = new Image();
    asdf.src = dataUrl;
    document.body.appendChild(asdf);

    console.log('Done.');
})();

// TODO render things in HTML for text and layout then inject them into the canvas after
