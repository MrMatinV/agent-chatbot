// دسترسی به عناصر HTML از طریق ID
const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatWindow = document.getElementById('chatWindow');

// **URL Webhook n8n شما (به‌روز شده برای تست)**
// از این URL استفاده کنید اگر ورک‌فلوی n8n شما در حالت تست است و "Listen for test event" را فعال کرده‌اید.
// وقتی ورک‌فلو را برای استفاده دائمی "Active" می‌کنید، باید از URL بدون "-test" استفاده کنید.
const WEBHOOK_URL = 'https://jalvanaghagent.app.n8n.cloud/webhook-test/5721d2a3-68d0-4626-9678-e50aafba3eca'; 

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
        // انتظار داریم n8n پاسخ AI را در یک کلید به نام 'response' در JSON برگرداند
        if (data && data.response) {
            appendMessage(data.response, 'ai-message');
        } else {
            // اگر پاسخ از n8n فرمت مورد انتظار را نداشت
            appendMessage('مشاور پاسخ نامشخصی داد. لطفاً دوباره تلاش کنید.', 'ai-message');
        }

    } catch (error) {
        console.error('خطا در ارسال پیام یا دریافت پاسخ:', error);
        // نمایش پیام خطا به کاربر
        appendMessage('متاسفانه در حال حاضر ارتباط برقرار نیست. لطفاً بعداً تلاش کنید یا با دفتر تماس بگیرید.', 'ai-message error');
    } finally {
        // اطمینان از اینکه اسکرول همیشه به پایین می‌رود
        chatWindow.scrollTop = chatWindow.scrollHeight; 
    }
}

/**
 * این تابع یک پیام جدید را به پنجره چت اضافه می‌کند.
 * @param {string} text - متن پیام.
 * @param {string} type - نوع پیام ('user-message' برای کاربر، 'ai-message' برای ربات).
 */
function appendMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = text;
    chatWindow.appendChild(messageDiv);
}

// گوش دادن به رویداد کلیک روی دکمه ارسال
sendButton.addEventListener('click', sendMessage);

// گوش دادن به رویداد فشردن کلید (برای ارسال پیام با Enter)
chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
