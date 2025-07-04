// دسترسی به عناصر HTML از طریق ID
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatWindow = document.getElementById('chatWindow');

// **مهم: URL Webhook خود را اینجا قرار دهید.**
// این همان لینکی است که از نود Webhook در n8n کپی کرده‌اید.
// مثال: 'https://jalvanaghagent.app.n8n.cloud/webhook-test/5358801a-fe87-4fd6-a1bb-5a40c298b554'
const WEBHOOK_URL = 'https://jalvanaghagent.app.n8n.cloud/webhook-test/a6fe9bf9-3c16-4972-a55c-9484e817ed0b'; 

// اگر در n8n برای Webhook خود احراز هویت (Basic Auth) فعال کرده‌اید، 
// خطوط زیر را از حالت کامنت خارج کرده و نام کاربری و رمز عبور را جایگزین کنید:
// const USERNAME = 'your_username';
// const PASSWORD = 'your_password';


/**
 * این تابع پیام کاربر را دریافت کرده، آن را در چت‌باکس نمایش می‌دهد،
 * و سپس به Webhook در n8n ارسال می‌کند تا پاسخ AI را دریافت کند.
 */
async function sendMessage() {
    const messageText = chatInput.value.trim();
    if (messageText === '') return; // اگر پیام خالی بود، کاری نکن

    // 1. نمایش پیام کاربر در چت‌باکس
    appendMessage(messageText, 'user-message');
    chatInput.value = ''; // فیلد ورودی را خالی کن
    chatWindow.scrollTop = chatWindow.scrollHeight; // اسکرول به پایین چت‌باکس

    // 2. ارسال پیام به Webhook در n8n
    try {
        const fetchOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: messageText }) // پیام کاربر را در یک شیء JSON با کلید 'message' ارسال کن
        };

        // اگر Basic Auth فعال بود، هدر Authorization را اضافه کن
        // if (USERNAME && PASSWORD) {
        //     fetchOptions.headers['Authorization'] = 'Basic ' + btoa(USERNAME + ':' + PASSWORD);
        // }

        const response = await fetch(WEBHOOK_URL, fetchOptions);

        // بررسی اینکه آیا پاسخ HTTP موفقیت‌آمیز بوده است (کد وضعیت 200-299)
        if (!response.ok) {
            // اگر خطایی در سمت سرور (n8n) رخ داده باشد
            const errorText = await response.text(); // سعی کن متن خطا را بگیری
            console.error('HTTP error from n8n Webhook:', response.status, errorText);
            throw new Error(`مشکلی در ارتباط با سرور رخ داد: ${response.status}`);
        }

        const data = await response.json(); // پاسخ JSON از n8n را دریافت کن

        // 3. نمایش پاسخ AI در چت‌باکس
        // انتظار داریم n8n پاسخ AI
