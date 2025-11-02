// ===== LOAN TABS FUNCTIONALITY =====
const loanTabs = document.querySelectorAll('.loan-tab');
const tabPanels = document.querySelectorAll('.tab-panel');

loanTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const tabName = tab.getAttribute('data-tab');
    
    // Remove active class from all tabs and panels
    loanTabs.forEach(t => t.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding panel
    tab.classList.add('active');
    document.getElementById(`${tabName}-panel`).classList.add('active');
    
    // Smooth scroll to loan section
    const loanSection = document.querySelector('.loan-types');
    const headerHeight = document.querySelector('.header').offsetHeight;
    const sectionTop = loanSection.offsetTop - headerHeight - 20;
    
    window.scrollTo({
      top: sectionTop,
      behavior: 'smooth'
    });
  });
});

// Mobile Menu Toggle
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
  });

  // Close mobile menu when clicking on a link
  const mobileLinks = document.querySelectorAll('.mobile-menu a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('active');
      const icon = mobileMenuBtn.querySelector('i');
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    });
  });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      const headerHeight = document.querySelector('.header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight - 20;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;
  
  if (currentScroll > 100) {
    header.style.boxShadow = '0 4px 20px rgba(74, 144, 164, 0.15)';
  } else {
    header.style.boxShadow = '0 2px 8px rgba(74, 144, 164, 0.08)';
  }
  
  lastScroll = currentScroll;
});

// ===== CALCULATOR FUNCTIONALITY =====

const modal = document.getElementById('calculatorModal');
const closeBtn = document.querySelector('.close');
let activeCalculator = null;

// Open calculator modal
function openCalculator(type) {
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  
  // Hide all calculator panels
  document.querySelectorAll('.calc-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  
  // Show the selected calculator
  if (type === 'borrowing') {
    document.getElementById('borrowingCalc').classList.add('active');
    activeCalculator = 'borrowing';
  } else if (type === 'repayment') {
    document.getElementById('repaymentCalc').classList.add('active');
    activeCalculator = 'repayment';
  } else if (type === 'stamp') {
    document.getElementById('stampCalc').classList.add('active');
    activeCalculator = 'stamp';
  }
}

// Close calculator modal
if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset all results
    document.querySelectorAll('.calc-result').forEach(result => {
      result.classList.remove('show');
      result.innerHTML = '';
    });
  });
}

// Close modal when clicking outside
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Reset all results
    document.querySelectorAll('.calc-result').forEach(result => {
      result.classList.remove('show');
      result.innerHTML = '';
    });
  }
});

// Borrowing Power Calculator
function calculateBorrowing() {
  const income = parseFloat(document.getElementById('annualIncome').value);
  const expenses = parseFloat(document.getElementById('monthlyExpenses').value);
  const term = parseInt(document.getElementById('loanTerm').value);
  const rate = parseFloat(document.getElementById('interestRate').value);
  
  if (!income || !expenses || !term || !rate) {
    alert('Please fill in all fields');
    return;
  }
  
  // Simplified borrowing power calculation
  // Annual disposable income
  const annualDisposable = income - (expenses * 12);
  
  // Apply serviceability buffer (typically 3%)
  const bufferRate = rate + 3;
  
  // Calculate monthly payment capacity (typically 30-35% of gross income)
  const monthlyCapacity = (income / 12) * 0.35;
  
  // Calculate maximum loan amount using loan formula
  const monthlyRate = (bufferRate / 100) / 12;
  const numPayments = term * 12;
  
  let maxLoan;
  if (monthlyRate > 0) {
    maxLoan = monthlyCapacity * ((Math.pow(1 + monthlyRate, numPayments) - 1) / (monthlyRate * Math.pow(1 + monthlyRate, numPayments)));
  } else {
    maxLoan = monthlyCapacity * numPayments;
  }
  
  // Apply conservative factor
  maxLoan = maxLoan * 0.85;
  
  // Display result
  const resultDiv = document.getElementById('borrowingResult');
  resultDiv.classList.add('show');
  resultDiv.innerHTML = `
    <h3>Estimated Borrowing Power</h3>
    <div class="result-amount">$${Math.round(maxLoan).toLocaleString()}</div>
    <p>Based on your income of <strong>$${income.toLocaleString()}</strong> and monthly expenses of <strong>$${expenses.toLocaleString()}</strong>, you could potentially borrow up to this amount.</p>
    <p style="margin-top: 12px; font-size: 13px; opacity: 0.8;"><em>This is an estimate only. Actual borrowing capacity depends on various factors including credit history, employment status, and lender criteria. Contact us for a comprehensive assessment.</em></p>
  `;
}

// Repayment Calculator
function calculateRepayment() {
  const loanAmount = parseFloat(document.getElementById('loanAmount').value);
  const term = parseInt(document.getElementById('repayLoanTerm').value);
  const rate = parseFloat(document.getElementById('repayInterestRate').value);
  
  if (!loanAmount || !term || !rate) {
    alert('Please fill in all fields');
    return;
  }
  
  // Calculate monthly payment using loan formula
  const monthlyRate = (rate / 100) / 12;
  const numPayments = term * 12;
  
  let monthlyPayment;
  if (monthlyRate > 0) {
    monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  } else {
    monthlyPayment = loanAmount / numPayments;
  }
  
  const totalPayment = monthlyPayment * numPayments;
  const totalInterest = totalPayment - loanAmount;
  
  // Display result
  const resultDiv = document.getElementById('repaymentResult');
  resultDiv.classList.add('show');
  resultDiv.innerHTML = `
    <h3>Estimated Loan Repayments</h3>
    <div class="result-amount">$${Math.round(monthlyPayment).toLocaleString()}<span style="font-size: 18px; font-weight: 400;"> / month</span></div>
    <p style="margin-bottom: 16px;">For a loan of <strong>$${loanAmount.toLocaleString()}</strong> over <strong>${term} years</strong> at <strong>${rate}%</strong> interest rate.</p>
    <div style="padding: 16px; background: rgba(255,255,255,0.5); border-radius: 8px; margin-top: 16px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span>Total repayment:</span>
        <strong>$${Math.round(totalPayment).toLocaleString()}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Total interest:</span>
        <strong>$${Math.round(totalInterest).toLocaleString()}</strong>
      </div>
    </div>
    <p style="margin-top: 12px; font-size: 13px; opacity: 0.8;"><em>This calculation is for principal and interest repayments only. Actual repayments may vary based on fees and charges.</em></p>
  `;
}

// Stamp Duty Calculator (NSW rates as example)
function calculateStamp() {
  const propertyValue = parseFloat(document.getElementById('propertyValue').value);
  const state = document.getElementById('state').value;
  const firstHomeBuyer = document.getElementById('firstHomeBuyer').checked;
  
  if (!propertyValue) {
    alert('Please enter a property value');
    return;
  }
  
  let stampDuty = 0;
  let stateInfo = '';
  
  // Simplified stamp duty calculation (NSW rates as base)
  // Actual rates vary by state and are more complex
  if (state === 'NSW') {
    stateInfo = 'New South Wales';
    if (propertyValue <= 14000) {
      stampDuty = propertyValue * 0.0125;
    } else if (propertyValue <= 32000) {
      stampDuty = 175 + (propertyValue - 14000) * 0.015;
    } else if (propertyValue <= 85000) {
      stampDuty = 445 + (propertyValue - 32000) * 0.0175;
    } else if (propertyValue <= 319000) {
      stampDuty = 1372.50 + (propertyValue - 85000) * 0.035;
    } else if (propertyValue <= 1064000) {
      stampDuty = 9562.50 + (propertyValue - 319000) * 0.045;
    } else {
      stampDuty = 43087.50 + (propertyValue - 1064000) * 0.055;
    }
  } else if (state === 'VIC') {
    stateInfo = 'Victoria';
    if (propertyValue <= 25000) {
      stampDuty = propertyValue * 0.014;
    } else if (propertyValue <= 130000) {
      stampDuty = 350 + (propertyValue - 25000) * 0.024;
    } else if (propertyValue <= 960000) {
      stampDuty = 2870 + (propertyValue - 130000) * 0.05;
    } else {
      stampDuty = 44370 + (propertyValue - 960000) * 0.065;
    }
  } else {
    // Generic calculation for other states (approximately 4-5%)
    stampDuty = propertyValue * 0.045;
    stateInfo = state;
  }
  
  // First home buyer concession (simplified)
  if (firstHomeBuyer && propertyValue <= 600000) {
    const discount = Math.min(stampDuty, stampDuty * 0.5);
    stampDuty -= discount;
  }
  
  // Display result
  const resultDiv = document.getElementById('stampResult');
  resultDiv.classList.add('show');
  resultDiv.innerHTML = `
    <h3>Estimated Stamp Duty</h3>
    <div class="result-amount">$${Math.round(stampDuty).toLocaleString()}</div>
    <p>For a property valued at <strong>$${propertyValue.toLocaleString()}</strong> in <strong>${stateInfo}</strong>${firstHomeBuyer ? ' (First Home Buyer concession applied)' : ''}.</p>
    <div style="padding: 16px; background: rgba(255,255,255,0.5); border-radius: 8px; margin-top: 16px;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
        <span>Property value:</span>
        <strong>$${propertyValue.toLocaleString()}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Stamp duty rate:</span>
        <strong>~${((stampDuty / propertyValue) * 100).toFixed(2)}%</strong>
      </div>
    </div>
    <p style="margin-top: 12px; font-size: 13px; opacity: 0.8;"><em>This is an estimate only. Actual stamp duty may vary based on specific circumstances, property type, and state regulations. Please consult with a conveyancer or solicitor for accurate calculations.</em></p>
  `;
}

// Make functions globally accessible
window.openCalculator = openCalculator;
window.calculateBorrowing = calculateBorrowing;
window.calculateRepayment = calculateRepayment;
window.calculateStamp = calculateStamp;

// Add enter key support for calculator inputs
document.addEventListener('DOMContentLoaded', () => {
  // Borrowing calculator
  const borrowingInputs = ['annualIncome', 'monthlyExpenses', 'loanTerm', 'interestRate'];
  borrowingInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          calculateBorrowing();
        }
      });
    }
  });
  
  // Repayment calculator
  const repaymentInputs = ['loanAmount', 'repayLoanTerm', 'repayInterestRate'];
  repaymentInputs.forEach(id => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          calculateRepayment();
        }
      });
    }
  });
  
  // Stamp duty calculator
  const stampInput = document.getElementById('propertyValue');
  if (stampInput) {
    stampInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        calculateStamp();
      }
    });
  }
});

// Animate elements on scroll
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe sections for fade-in animation
document.addEventListener('DOMContentLoaded', () => {
  const sections = document.querySelectorAll('.loan-card, .why-item, .calculator-card, .testimonial-card');
  
  sections.forEach((section, index) => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    section.style.transitionDelay = `${index * 0.1}s`;
    observer.observe(section);
  });
});

// Phone number formatting for better UX
const formatPhoneNumber = (str) => {
  const cleaned = ('' + str).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})$/);
  if (match) {
    return match[1] + ' ' + match[2] + ' ' + match[3];
  }
  return str;
};

// Add analytics tracking for button clicks (placeholder)
document.querySelectorAll('.btn').forEach(button => {
  button.addEventListener('click', function(e) {
    const btnText = this.textContent.trim();
    const btnHref = this.getAttribute('href');
    
    // This is where you'd integrate with Google Analytics or other tracking
    console.log('Button clicked:', btnText, btnHref);
    
    // Example: gtag('event', 'button_click', { 'button_text': btnText, 'button_link': btnHref });
  });
});

// Lazy load images for better performance
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      }
    });
  });
  
  document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
  });
}

// Add loading states for form submissions
const addLoadingState = (button, loading = true) => {
  if (loading) {
    button.dataset.originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';
    button.disabled = true;
  } else {
    button.textContent = button.dataset.originalText;
    button.disabled = false;
  }
};

// Keyboard navigation for accessibility
document.addEventListener('keydown', (e) => {
  // ESC key to close modal
  if (e.key === 'Escape' && modal.style.display === 'block') {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

// Prevent scroll when modal is open
const preventScroll = (e) => {
  if (modal.style.display === 'block') {
    e.preventDefault();
  }
};

// Add print styles trigger
const printPage = () => {
  window.print();
};

// Toast notification system (for future use)
const showToast = (message, type = 'info') => {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#52B788' : '#4A90A4'};
    color: white;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    z-index: 10000;
    animation: slideIn 0.3s ease;
  `;
  
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => {
      toast.remove();
    }, 300);
  }, 3000);
};

// Add CSS for toast animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

console.log('Brighten website initialized successfully ✨');
