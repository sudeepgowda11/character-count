/**
 * Character Count Web Application - JavaScript
 * UI Enhancements: Live character counter, button animations, copy functionality
 * All text analysis is done in Python (Flask backend)
 */

// ============================================================
// DOCUMENT READY - Initialize when DOM is loaded
// ============================================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize live character counter on dashboard page
    initializeLiveCounter();
    
    // Initialize copy results button on results page
    initializeCopyResults();
    
    // Initialize form validation
    initializeFormValidation();
    
    // Initialize button animations
    initializeButtonAnimations();
});

// ============================================================
// LIVE CHARACTER COUNTER
// ============================================================

/**
 * Initialize live character counter that updates as user types
 * Updates both character and word counts in real-time
 */
function initializeLiveCounter() {
    const textarea = document.getElementById('text_input');
    const charCountDisplay = document.getElementById('live-count');
    const wordCountDisplay = document.getElementById('live-words');
    
    // Only initialize if elements exist (on dashboard page)
    if (!textarea || !charCountDisplay || !wordCountDisplay) {
        return;
    }
    
    /**
     * Update character and word counts based on textarea content
     */
    function updateCounts() {
        const text = textarea.value;
        
        // Update character count
        const characterCount = text.length;
        charCountDisplay.textContent = characterCount;
        
        // Update word count (split by whitespace)
        const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        wordCountDisplay.textContent = wordCount;
        
        // Add visual feedback if text is entered
        if (characterCount > 0) {
            charCountDisplay.parentElement.style.color = '#8A2BE2';
            wordCountDisplay.parentElement.style.color = '#8A2BE2';
        } else {
            charCountDisplay.parentElement.style.color = '#666666';
            wordCountDisplay.parentElement.style.color = '#666666';
        }
    }
    
    // Update on input event (fires as user types)
    textarea.addEventListener('input', updateCounts);
    
    // Update on change event (fires when value changes programmatically)
    textarea.addEventListener('change', updateCounts);
    
    // Update on paste event (for pasted content)
    textarea.addEventListener('paste', function() {
        // Delay to ensure paste is complete
        setTimeout(updateCounts, 10);
    });
    
    // Update on drop event (for drag-drop content)
    textarea.addEventListener('drop', function() {
        setTimeout(updateCounts, 10);
    });
    
    // Initial count on page load
    updateCounts();
}

// ============================================================
// FORM VALIDATION
// ============================================================

/**
 * Initialize form validation to ensure text is not empty
 */
function initializeFormValidation() {
    const form = document.querySelector('.analysis-form');
    const textarea = document.getElementById('text_input');
    const analyzeBtn = document.getElementById('analyze-btn');
    
    // Only initialize if form exists
    if (!form || !textarea) {
        return;
    }
    
    /**
     * Handle form submission
     */
    form.addEventListener('submit', function(event) {
        // Validate that text is not empty
        if (textarea.value.trim() === '') {
            event.preventDefault();
            
            // Show error message
            showErrorMessage('Please enter some text to analyze.');
            
            // Focus textarea for better UX
            textarea.focus();
            
            // Add visual shake effect to textarea
            textarea.classList.add('shake');
            setTimeout(() => textarea.classList.remove('shake'), 500);
            
            return false;
        }
        
        // Show loading state on button
        if (analyzeBtn) {
            showLoadingState(analyzeBtn);
        }
    });
    
    // Reset button functionality
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            // Clear textarea
            textarea.value = '';
            
            // Update live counter
            const charCountDisplay = document.getElementById('live-count');
            const wordCountDisplay = document.getElementById('live-words');
            if (charCountDisplay) charCountDisplay.textContent = '0';
            if (wordCountDisplay) wordCountDisplay.textContent = '0';
            
            // Remove any error messages
            removeErrorMessage();
            
            // Focus textarea
            textarea.focus();
        });
    }
}

/**
 * Show error message on form
 * @param {string} message - Error message to display
 */
function showErrorMessage(message) {
    // Remove existing error message if any
    removeErrorMessage();
    
    // Create error element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.innerHTML = `
        <span class="error-icon">⚠️</span>
        <p>${message}</p>
    `;
    
    // Insert before form
    const form = document.querySelector('.analysis-form');
    form.parentElement.insertBefore(errorDiv, form);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'fadeOut 300ms ease-out forwards';
        setTimeout(() => errorDiv.remove(), 300);
    }, 5000);
}

/**
 * Remove error message from form
 */
function removeErrorMessage() {
    const errorMessage = document.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

// ============================================================
// BUTTON ANIMATIONS & LOADING STATE
// ============================================================

/**
 * Initialize button animations
 */
function initializeButtonAnimations() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        // Add click animation
        button.addEventListener('click', function(e) {
            // Skip if button is disabled
            if (this.disabled) return;
            
            // Create ripple effect
            createRippleEffect(e, this);
        });
        
        // Add hover feedback
        button.addEventListener('mouseenter', function() {
            if (!this.disabled) {
                this.style.transform = 'translateY(-2px)';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

/**
 * Create ripple effect on button click
 * @param {Event} event - Click event
 * @param {HTMLElement} button - Button element
 */
function createRippleEffect(event, button) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Add ripple CSS if not exists
    if (!document.querySelector('style[data-ripple]')) {
        const style = document.createElement('style');
        style.setAttribute('data-ripple', 'true');
        style.innerHTML = `
            .btn {
                position: relative;
                overflow: hidden;
            }
            
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.5);
                transform: scale(0);
                animation: ripple-animation 0.6s ease-out;
                pointer-events: none;
            }
            
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
}

/**
 * Show loading state on button
 * @param {HTMLElement} button - Button element
 */
function showLoadingState(button) {
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    if (btnText && btnLoader) {
        button.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-flex';
    }
}

/**
 * Hide loading state on button
 * @param {HTMLElement} button - Button element
 */
function hideLoadingState(button) {
    const btnText = button.querySelector('.btn-text');
    const btnLoader = button.querySelector('.btn-loader');
    
    if (btnText && btnLoader) {
        button.disabled = false;
        btnText.style.display = 'inline';
        btnLoader.style.display = 'none';
    }
}

// ============================================================
// COPY RESULTS FUNCTIONALITY
// ============================================================

/**
 * Initialize copy results button on results page
 */
function initializeCopyResults() {
    const copyBtn = document.getElementById('copy-results-btn');
    
    // Only initialize if button exists (on results page)
    if (!copyBtn) {
        return;
    }
    
    copyBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Collect all result data
        const resultCards = document.querySelectorAll('.result-card');
        let resultsText = 'CHARACTER COUNT ANALYSIS RESULTS\n';
        resultsText += '================================\n\n';
        
        // Add text preview
        const previewText = document.getElementById('preview-text');
        if (previewText) {
            resultsText += 'ANALYZED TEXT:\n';
            resultsText += previewText.textContent + '\n\n';
        }
        
        // Collect card data
        resultCards.forEach(card => {
            const title = card.querySelector('.card-title')?.textContent || '';
            const value = card.querySelector('.card-value')?.textContent || '';
            const description = card.querySelector('.card-description')?.textContent || '';
            
            if (title && value) {
                resultsText += `${title}: ${value} (${description})\n`;
            }
        });
        
        // Copy to clipboard
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(resultsText)
                .then(() => {
                    showCopyNotification();
                })
                .catch(() => {
                    // Fallback for older browsers
                    copyToClipboardFallback(resultsText);
                });
        } else {
            // Fallback for browsers without clipboard API
            copyToClipboardFallback(resultsText);
        }
    });
}

/**
 * Show notification when results are copied
 */
function showCopyNotification() {
    const notification = document.getElementById('copy-notification');
    
    if (notification) {
        notification.style.display = 'flex';
        notification.style.animation = 'slideInUp 250ms ease-out forwards';
        
        // Auto-hide after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutDown 250ms ease-out forwards';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 250);
        }, 3000);
    }
}

/**
 * Fallback copy to clipboard function for older browsers
 * @param {string} text - Text to copy
 */
function copyToClipboardFallback(text) {
    // Create temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    
    document.body.appendChild(textarea);
    textarea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification();
    } catch (err) {
        console.error('Failed to copy:', err);
        alert('Failed to copy results. Please try again.');
    }
    
    document.body.removeChild(textarea);
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Smooth scroll to element
 * @param {string} selector - Element selector
 */
function smoothScroll(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

/**
 * Debounce function for performance optimization
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// ============================================================
// ACCESSIBILITY ENHANCEMENTS
// ============================================================

// Add keyboard navigation support
document.addEventListener('keydown', function(event) {
    // Tab navigation - enhanced
    if (event.key === 'Tab') {
        // Add visible focus indicator
        const focused = document.activeElement;
        if (focused && focused.classList.contains('btn')) {
            focused.style.outline = '2px solid #8A2BE2';
            focused.style.outlineOffset = '2px';
        }
    }
    
    // Enter key to submit form
    if (event.key === 'Enter' && event.ctrlKey) {
        const form = document.querySelector('.analysis-form');
        if (form) {
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.disabled) {
                form.submit();
            }
        }
    }
});

// Remove outline on mouse click (for better UX)
document.addEventListener('mousedown', function() {
    const focused = document.activeElement;
    if (focused) {
        focused.style.outline = 'none';
    }
});

// ============================================================
// PERFORMANCE MONITORING
// ============================================================

/**
 * Log page load performance metrics
 */
window.addEventListener('load', function() {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    
    // Log to console for debugging (optional)
    if (process.env.NODE_ENV === 'development') {
        console.log('Page load time:', pageLoadTime, 'ms');
    }
});

// ============================================================
// END OF SCRIPT
// ============================================================