<template>
  <transition name="popup">
    <div v-if="showPopup" id="marketing-popup">
      <div class="marketing-content">
        <button class="btn-close" @click="closePopup">×</button>
        <h2>GET VOUCHER</h2>
        <p>Subscribe to our valued customer's list and claim your coupon to get a voucher for your first order.</p>
        <input
            type="email"
            v-model="email"
            placeholder="Enter your email"
            @input="validateEmail"
            class="input-email"
        />
        <p v-if="emailError" class="message-error">{{ emailError }}</p>
        <button
            class="get-btn"
            @click="submitEmail"
        >Get it now
        </button>
        <p
            class="text-close"
            @click="closePopup"
        >No, thank you. I prefer to pay the entire price.</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import {ref, onMounted} from 'vue';

// Dữ liệu reactive
const showPopup = ref(false);
const email = ref('');
const emailError = ref('');
const scriptType = ref('');

// Các phương thức
const closePopup = () => {
  const currentTime = new Date().getTime();
  localStorage.setItem('popupClosedTime', currentTime);
  showPopup.value = false;
};

const submitEmail = async () => {
  validateEmail();
  if (!emailError.value) {
    await sendSubscription();
  }
};

const validateEmail = () => {
  if (!email.value) {
    emailError.value = 'Email is required!';
  } else if (!isValidEmail(email.value)) {
    emailError.value = 'Please enter a valid email!';
  } else {
    emailError.value = '';
  }
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const sendSubscription = async () => {
  const domain = window.location.hostname;
  const payload = {
    email: email.value,
    domain: domain,
    type: scriptType.value
  };

  try {
    const response = await fetch('http://127.0.0.1:8000/api/subscribers/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      closePopup();
    } else {
      const errorData = await response.json();
      emailError.value = errorData.message || 'Failed to subscribe. Please try again.';
    }
  } catch (error) {
    console.error('Error:', error);
    emailError.value = 'An error occurred. Please try again later.';
  }
};

const getScriptType = () => {
  const scripts = document.getElementsByTagName('script');
  for (let script of scripts) {
    if (script.src.includes('email-marketing.js')) {
      const type = script.getAttribute('data-type') || script.getAttribute('type') || 'wp';
      return type;
    }
  }
  return '';
};

const shouldShowPopup = () => {
  const closedTime = localStorage.getItem('popupClosedTime');
  if (!closedTime) return true;

  const currentTime = new Date().getTime();
  const timeDiff = currentTime - parseInt(closedTime);
  const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;

  return timeDiff > threeDaysInMs;
};

// Lifecycle hook
onMounted(() => {
  showPopup.value = shouldShowPopup();
  scriptType.value = getScriptType();
});
</script>

<style scoped>
.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

.popup-enter-to,
.popup-leave-from {
  opacity: 1;
  transform: scale(1);
}

#marketing-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 6969;
}

.marketing-content {
  background: linear-gradient(135deg, #1a1a1a 0%, #000000 100%);
  padding: 30px;
  border-radius: 15px;
  text-align: center;
  color: #fff;
  position: relative;
  width: 90%;
  max-width: 600px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.btn-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: none;
  border: none;
  font-size: 28px;
  color: #fff;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.btn-close:hover {
  transform: rotate(90deg);
}

h2 {
  color: #ff3333;
  margin-bottom: 15px;
  font-size: 28px;
  font-weight: 700;
  letter-spacing: 1px;
}

p {
  margin: 15px 0;
  font-size: 16px;
  line-height: 1.5;
  color: #e0e0e0;
}

.message-error {
  color: #ff6666;
  font-size: 13px;
  margin-top: 5px;
  text-align: center;
  width: 85%;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.4;
}


.input-email {
  width: 85%;
  padding: 12px;
  margin: 15px auto;
  border: 1px solid #333;
  border-radius: 8px;
  color: #333;
  font-size: 16px;
  background: #fff;
  transition: border-color 0.3s ease;
  display: block;
}

.input-email:focus {
  border-color: #ff3333;
  outline: none;
}

.get-btn {
  background: linear-gradient(90deg, #ff3333, #ff6666);
  color: #fff;
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.get-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 51, 51, 0.4);
}

.text-close {
  color: #bbb;
  cursor: pointer;
  font-size: 13px;
  text-decoration: none;
  transition: color 0.3s ease;
}

.text-close:hover {
  color: #fff;
  text-decoration: underline;
}
</style>