console.log("UrduDub is alive on this video.");

let lastCaption = "";
let overlay = null;

function createOverlay() {
    const existing = document.getElementById('urdu-dub-overlay');
    if (existing) existing.remove();

    overlay = document.createElement('div');
    overlay.id = 'urdu-dub-overlay';
    overlay.style.cssText = `
        position: fixed !important;
        bottom: 150px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        background: rgba(0,0,0,0.75) !important;
        color: #ffffff !important;
        font-size: 18px !important;
        font-family: Arial, sans-serif !important;
        direction: rtl !important;
        text-align: center !important;
        padding: 6px 14px !important;
        border-radius: 4px !important;
        max-width: 60% !important;
        z-index: 2147483647 !important;
        pointer-events: none !important;
    `;
    overlay.textContent = "UrduDub لوڈ ہو رہا ہے...";

    const targets = [
        document.getElementById('movie_player'),
        document.getElementById('player'),
        document.querySelector('.html5-video-player'),
        document.body
    ];

    for (let target of targets) {
        if (target) {
            target.appendChild(overlay);
            console.log("UrduDub - Overlay attached to:", target.id || target.tagName);
            break;
        }
    }

    setTimeout(() => { overlay.textContent = ""; }, 3000);
}
async function translateToUrdu(text) {
    try {
        console.log("UrduDub - Translating:", text.substring(0, 50));
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ur&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();
        const translated = data[0].map(item => item[0]).join('');
        console.log("UrduDub - Urdu:", translated);
        return translated;
    } catch(e) {
        console.log("UrduDub - Error:", e.message);
        return null;
    }
}

function watchCaptions() {
    if (!overlay) return;
    const elements = document.querySelectorAll('.ytp-caption-segment');
    if (elements.length > 0) {
        let text = Array.from(elements).map(el => el.textContent).join(' ').trim();
        if (text && text !== lastCaption && text.length > 5) {
            lastCaption = text;
            console.log("UrduDub - Detected:", text);
            translateToUrdu(text).then(urdu => {
                if (urdu && overlay) {
                    overlay.textContent = urdu;
                    console.log("UrduDub - Urdu:", urdu);
                    speakUrdu(urdu, text);
                }
            });
        }
    }
}

setTimeout(createOverlay, 2000);
setInterval(watchCaptions, 500);
console.log("UrduDub - Started.");