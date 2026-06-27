"""
Character Count Web Application - Flask Backend
A modern web app to analyze text and provide detailed character statistics.
Author: Web Development Project
"""

from flask import Flask, render_template, request, redirect, url_for
import re

# Initialize Flask application
app = Flask(__name__)


# ==================== TEXT ANALYSIS FUNCTIONS ====================

def analyze_text(text):
    """
    Analyze the given text and return detailed character statistics.
    
    Args:
        text (str): The text to analyze
        
    Returns:
        dict: Dictionary containing all analysis results
    """
    
    # Total Characters (everything including spaces and punctuation)
    total_characters = len(text)
    
    # Alphabet Count (letters only, a-z and A-Z)
    alphabet_count = sum(1 for char in text if char.isalpha())
    
    # Number Count (digits 0-9)
    number_count = sum(1 for char in text if char.isdigit())
    
    # Space Count (all whitespace)
    space_count = sum(1 for char in text if char.isspace())
    
    # Special Character Count (everything that's not letter, digit, or space)
    special_count = total_characters - alphabet_count - number_count - space_count
    
    # Word Count (split by whitespace)
    word_count = len(text.split()) if text.strip() else 0
    
    # Sentence Count (split by . ! ?)
    sentences = re.split(r'[.!?]+', text)
    sentence_count = sum(1 for s in sentences if s.strip())
    
    # Vowel Count (a, e, i, o, u - case insensitive)
    vowel_count = sum(1 for char in text if char.lower() in 'aeiou')
    
    # Consonant Count (letters that are not vowels)
    consonant_count = alphabet_count - vowel_count
    
    # Average word length
    avg_word_length = round(alphabet_count / word_count, 2) if word_count > 0 else 0
    
    # Average sentence length
    avg_sentence_length = round(word_count / sentence_count, 2) if sentence_count > 0 else 0
    
    return {
        'total_characters': total_characters,
        'alphabet_count': alphabet_count,
        'number_count': number_count,
        'space_count': space_count,
        'special_count': special_count,
        'word_count': word_count,
        'sentence_count': sentence_count,
        'vowel_count': vowel_count,
        'consonant_count': consonant_count,
        'avg_word_length': avg_word_length,
        'avg_sentence_length': avg_sentence_length,
        'input_text': text  # Store original text to display on result page
    }


# ==================== FLASK ROUTES ====================

@app.route('/', methods=['GET', 'POST'])
def dashboard():
    """
    Dashboard route - Home page with textarea input form.
    GET: Displays the dashboard form
    POST: Processes the form and redirects to results
    """
    if request.method == 'POST':
        # Get text from form
        user_text = request.form.get('text_input', '')
        
        # Validate that text is not empty
        if not user_text.strip():
            # Return dashboard with error message if empty
            return render_template('dashboard.html', error='Please enter some text to analyze.')
        
        # Analyze the text
        analysis_results = analyze_text(user_text)
        
        # Store results in session-like manner (using redirect with data)
        # We'll use a temporary storage approach by passing via session or storing in route
        # For simplicity without database, we'll use Flask's session or just pass via render
        
        # Render result page with analysis data
        return render_template('result.html', results=analysis_results)
    
    # GET request - display empty dashboard
    return render_template('dashboard.html')


@app.route('/reset', methods=['GET'])
def reset():
    """
    Reset route - Clears the form and redirects to dashboard.
    """
    return redirect(url_for('dashboard'))


# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def page_not_found(error):
    """Handle 404 Page Not Found errors."""
    return render_template('dashboard.html', error='Page not found. Please try again.'), 404


@app.errorhandler(500)
def internal_error(error):
    """Handle 500 Internal Server errors."""
    return render_template('dashboard.html', error='An error occurred. Please try again.'), 500


# ==================== APPLICATION ENTRY POINT ====================

if __name__ == '__main__':
    # Run Flask development server
    # Debug mode enabled for development (disable in production)
    app.run(debug=True, host='localhost', port=5000)