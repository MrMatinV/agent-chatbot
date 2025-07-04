const chatInput = document.getElementById('chatInput');
const sendButton = document.getElementById('sendButton');
const chatWindow = document.getElementById('chatWindow');

// **مهم: URL Webhook خود را اینجا قرار دهید.**
// مثال URL شما: https://jalvanaghagent.app.n8n.cloud/webhook-test/5358801a-fe87-4fd6-a1bb-5a40c298b554
const WEBHOOK_URL = 'https://jalvanaghagent.app.n8n.cloud/webhook-test/5358801a-fe87-4fd6-a1bb-5a40c298b554'; 

// اگر در n8n برای Webhook احراز هویت (Basic Auth) فعال کرده‌اید، 
// این دو خط رو فعال کرده و نام کاربری و رمز عبور رو جایگزین کنید:
// const USERNAME = 'your_username';
// const PASSWORD = 'your_password';


function sendMessage() {
    const messageText = chatInput.value.trim();
    if (messageText === '') return;

    appendMessage(messageText, 'user-message');
    chatInput.value = '';

    fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Basic ' + btoa(USERNAME + ':' + PASSWORD) // اگر Basic Auth دارید
        },
        body: JSON.stringify({
            message: messageText
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data && data.response) {
            appendMessage(data.response, 'ai-message'); 
        } else {
            appendMessage('پاسخ نامشخصی از مشاور دریافت شد.', 'ai-message');
        }
        chatWindow.scrollTop = chatWindow.scrollHeight;
    })
    .catch(error => {
        console.error('Error sending message to webhook or processing response:', error);
        appendMessage('متاسفانه در حال حاضر ارتباط برقرار نیست. لطفا بعدا تلاش کنید یا با دفتر تماس بگیرید.', 'ai-message');
        chatWindow.scrollTop = chatWindow.scrollHeight;
    });

    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function appendMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = text;
    chatWindow.appendChild(messageDiv);
}

sendButton.addEventListener('click', sendMessage);

chatInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});
