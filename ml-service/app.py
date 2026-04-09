import streamlit as st
import requests
from PIL import Image
import io
import base64
import time
from datetime import datetime
import uuid

# ══════════════════════════════════════════════════════════════════════════════
# CONFIGURATION
# ══════════════════════════════════════════════════════════════════════════════

try:
    from config import API_BASE_URL, MOCK_MODE, API_TIMEOUT
except ImportError:
    # Default configuration if config.py doesn't exist
    API_BASE_URL = "http://localhost:8000"
    MOCK_MODE = False
    API_TIMEOUT = 60

# ══════════════════════════════════════════════════════════════════════════════
# PAGE CONFIGURATION
# ══════════════════════════════════════════════════════════════════════════════

st.set_page_config(
    page_title="SkinShield - AI Dermatology Screening",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# ══════════════════════════════════════════════════════════════════════════════
# CUSTOM CSS
# ══════════════════════════════════════════════════════════════════════════════

st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        font-weight: 700;
        color: #1e3a8a;
        text-align: center;
        margin-bottom: 1rem;
    }
    .sub-header {
        font-size: 1.2rem;
        color: #64748b;
        text-align: center;
        margin-bottom: 2rem;
    }
    .question-card {
        background-color: #f8fafc;
        padding: 1.5rem;
        border-radius: 10px;
        border-left: 4px solid #3b82f6;
        margin-bottom: 1rem;
    }
    .stButton>button {
        width: 100%;
        background-color: #3b82f6;
        color: white;
        font-weight: 600;
        padding: 0.75rem;
        border-radius: 8px;
        border: none;
        font-size: 1.1rem;
    }
    .stButton>button:hover {
        background-color: #2563eb;
    }
    .report-section {
        background-color: #fff;
        padding: 2rem;
        border-radius: 10px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin-top: 2rem;
    }
    .diagnosis-box {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 10px;
        margin: 1rem 0;
    }
    .confidence-meter {
        background-color: #e2e8f0;
        border-radius: 10px;
        padding: 1rem;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# ══════════════════════════════════════════════════════════════════════════════
# SESSION STATE INITIALIZATION
# ══════════════════════════════════════════════════════════════════════════════

if 'screen_state' not in st.session_state:
    st.session_state.screen_state = 'welcome'  # welcome, questionnaire, upload, analyzing, report

if 'current_question' not in st.session_state:
    st.session_state.current_question = 0

if 'answers' not in st.session_state:
    st.session_state.answers = {}

if 'uploaded_image' not in st.session_state:
    st.session_state.uploaded_image = None

if 'scan_id' not in st.session_state:
    st.session_state.scan_id = str(uuid.uuid4())

if 'report_data' not in st.session_state:
    st.session_state.report_data = None

# ══════════════════════════════════════════════════════════════════════════════
# QUESTIONNAIRE DEFINITION
# ══════════════════════════════════════════════════════════════════════════════

QUESTIONS = [
    {
        "id": "age",
        "question": "What is your age?",
        "type": "number",
        "min": 1,
        "max": 120,
        "help": "Enter your age in years"
    },
    {
        "id": "durationDays",
        "question": "How long have you had this skin condition?",
        "type": "number",
        "min": 0,
        "max": 3650,
        "help": "Enter duration in days (e.g., 7 for one week)"
    },
    {
        "id": "evolution",
        "question": "Has the condition changed over time?",
        "type": "select",
        "options": ["No change", "Getting worse", "Getting better", "Fluctuating"],
        "help": "Select how the condition has evolved"
    },
    {
        "id": "itchingLevel",
        "question": "What is the itching level?",
        "type": "select",
        "options": ["None", "Mild", "Moderate", "Severe"],
        "help": "Rate the intensity of itching"
    },
    {
        "id": "physicalSymptoms",
        "question": "What physical symptoms do you experience?",
        "type": "multiselect",
        "options": ["Redness", "Swelling", "Pain", "Burning sensation", "Dry skin", "Blisters", "Scaling", "None"],
        "help": "Select all symptoms that apply"
    },
    {
        "id": "sunExposure",
        "question": "How much sun exposure do you typically have?",
        "type": "select",
        "options": ["Minimal (mostly indoors)", "Moderate (occasional outdoor activities)", "High (frequent outdoor work/activities)", "Very high (work outdoors daily)"],
        "help": "Estimate your average daily sun exposure"
    },
    {
        "id": "familyHistory",
        "question": "Do you have a family history of skin diseases?",
        "type": "radio",
        "options": ["Yes", "No", "Unknown"],
        "help": "Consider conditions like eczema, psoriasis, skin cancer, etc."
    }
]

# ══════════════════════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ══════════════════════════════════════════════════════════════════════════════

def upload_to_cloudinary(image_bytes):
    """
    Upload image to Cloudinary and return URL.
    Note: You need to implement actual Cloudinary integration or use a mock URL.
    """
    # TODO: Implement actual Cloudinary upload
    # For now, we'll save locally and create a mock URL
    import tempfile
    import os
    
    # Create temp file
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.jpg')
    temp_file.write(image_bytes)
    temp_file.close()
    
    # For demo purposes, return the local path
    # In production, upload to Cloudinary and return the URL
    return f"file://{temp_file.name}"


def prepare_symptoms_data():
    """Convert answers to the format expected by the API."""
    symptoms = {}
    for q in QUESTIONS:
        answer = st.session_state.answers.get(q['id'])
        if q['type'] == 'multiselect' and answer:
            symptoms[q['id']] = ", ".join(answer)
        else:
            symptoms[q['id']] = answer or "N/A"
    return symptoms


def call_analyze_api(image_url, symptoms, scan_id):
    """Call the FastAPI /analyze endpoint."""
    
    # Mock mode for testing without API
    if MOCK_MODE:
        time.sleep(2)  # Simulate processing time
        return {
            "success": True,
            "disease": "Eczema (Atopic Dermatitis)",
            "confidence": 87.5,
            "report": """
# DERMATOLOGY ANALYSIS REPORT

## PATIENT INFORMATION
- **Age**: {age} years
- **Scan ID**: {scan_id}
- **Analysis Date**: {date}

## PRIMARY DIAGNOSIS
**Eczema (Atopic Dermatitis)**
Confidence Level: 87.5%

## CLINICAL FINDINGS

### Image Analysis
The AI classifier has identified characteristic features consistent with eczema:
- Erythematous (red) patches visible
- Dry, scaly skin texture
- Pattern distribution typical of atopic dermatitis

### Symptom Assessment
Based on your questionnaire responses:
- Duration: {duration} days
- Evolution: {evolution}
- Itching Level: {itching}
- Physical Symptoms: {symptoms}
- Sun Exposure: {sun}
- Family History: {history}

## CONDITION OVERVIEW

Eczema (Atopic Dermatitis) is a chronic inflammatory skin condition characterized by:
- Intense itching
- Red, inflamed skin
- Dry, scaly patches
- Possible weeping or crusting in acute phases

## RECOMMENDED NEXT STEPS

1. **Consult a Dermatologist**: Schedule an appointment for professional confirmation and treatment plan
2. **Moisturize Regularly**: Use fragrance-free, hypoallergenic moisturizers 2-3 times daily
3. **Avoid Triggers**: Identify and avoid potential irritants (harsh soaps, certain fabrics, stress)
4. **Monitor Symptoms**: Track any changes or worsening of the condition

## TREATMENT OPTIONS (Require Medical Consultation)
- Topical corticosteroids
- Topical calcineurin inhibitors
- Moisturizing therapy
- Antihistamines for itching
- Phototherapy (in severe cases)

## IMPORTANT DISCLAIMER
This analysis is generated by an AI system and is intended for informational purposes only. 
It does NOT replace professional medical diagnosis or treatment. Please consult with a 
board-certified dermatologist for accurate diagnosis and appropriate treatment plan.

---
*Report generated by SkinShield AI v1.0*
            """.format(
                age=symptoms.get('age', 'N/A'),
                scan_id=scan_id[:8],
                date=datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                duration=symptoms.get('durationDays', 'N/A'),
                evolution=symptoms.get('evolution', 'N/A'),
                itching=symptoms.get('itchingLevel', 'N/A'),
                symptoms=symptoms.get('physicalSymptoms', 'N/A'),
                sun=symptoms.get('sunExposure', 'N/A'),
                history=symptoms.get('familyHistory', 'N/A')
            )
        }
    
    # Real API call
    try:
        payload = {
            "imageUrl": image_url,
            "symptoms": symptoms,
            "scanId": scan_id
        }
        
        response = requests.post(
            f"{API_BASE_URL}/analyze",
            json=payload,
            timeout=API_TIMEOUT
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            st.error(f"API Error: {response.status_code} - {response.text}")
            return None
            
    except requests.exceptions.RequestException as e:
        st.error(f"Failed to connect to ML service: {str(e)}")
        return None


def reset_screening():
    """Reset all session state for a new screening."""
    st.session_state.screen_state = 'welcome'
    st.session_state.current_question = 0
    st.session_state.answers = {}
    st.session_state.uploaded_image = None
    st.session_state.scan_id = str(uuid.uuid4())
    st.session_state.report_data = None


# ══════════════════════════════════════════════════════════════════════════════
# SCREEN COMPONENTS
# ══════════════════════════════════════════════════════════════════════════════

def render_welcome_screen():
    """Render the welcome/landing screen."""
    col1, col2, col3 = st.columns([1, 2, 1])
    
    with col2:
        st.markdown('<div class="main-header">🔬 SkinShield</div>', unsafe_allow_html=True)
        st.markdown('<div class="sub-header">AI-Powered Dermatology Screening</div>', unsafe_allow_html=True)
        
        st.markdown("---")
        
        st.markdown("""
        ### Welcome to SkinShield
        
        Our AI-powered system helps you understand your skin condition by:
        
        ✅ **Analyzing your skin image** using advanced machine learning  
        ✅ **Evaluating your symptoms** through a comprehensive questionnaire  
        ✅ **Generating detailed reports** with AI-driven insights  
        
        #### What to expect:
        1. Answer 7 quick questions about your condition
        2. Upload or capture an image of the affected area
        3. Receive an AI-generated dermatology report
        
        ⚠️ **Disclaimer:** This tool is for informational purposes only and does not replace professional medical advice. 
        Always consult a healthcare provider for diagnosis and treatment.
        """)
        
        st.markdown("---")
        
        if st.button("🚀 Start Screening", key="start_btn"):
            st.session_state.screen_state = 'questionnaire'
            st.rerun()


def render_questionnaire():
    """Render the questionnaire screen."""
    st.markdown('<div class="main-header">📋 Health Questionnaire</div>', unsafe_allow_html=True)
    
    # Progress bar
    progress = (st.session_state.current_question + 1) / len(QUESTIONS)
    st.progress(progress)
    st.markdown(f"**Question {st.session_state.current_question + 1} of {len(QUESTIONS)}**")
    
    st.markdown("---")
    
    # Current question
    question = QUESTIONS[st.session_state.current_question]
    
    st.markdown(f'<div class="question-card">', unsafe_allow_html=True)
    st.markdown(f"### {question['question']}")
    st.markdown(f"*{question['help']}*")
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Answer input based on type
    answer_key = f"answer_{question['id']}"
    
    if question['type'] == 'number':
        answer = st.number_input(
            "Your answer:",
            min_value=question['min'],
            max_value=question['max'],
            value=st.session_state.answers.get(question['id'], question['min']),
            key=answer_key
        )
        
    elif question['type'] == 'select':
        answer = st.selectbox(
            "Select an option:",
            options=question['options'],
            index=question['options'].index(st.session_state.answers.get(question['id'], question['options'][0])) if st.session_state.answers.get(question['id']) else 0,
            key=answer_key
        )
        
    elif question['type'] == 'multiselect':
        answer = st.multiselect(
            "Select all that apply:",
            options=question['options'],
            default=st.session_state.answers.get(question['id'], []),
            key=answer_key
        )
        
    elif question['type'] == 'radio':
        answer = st.radio(
            "Choose one:",
            options=question['options'],
            index=question['options'].index(st.session_state.answers.get(question['id'], question['options'][0])) if st.session_state.answers.get(question['id']) else 0,
            key=answer_key,
            horizontal=True
        )
    
    # Store answer
    st.session_state.answers[question['id']] = answer
    
    st.markdown("---")
    
    # Navigation buttons
    col1, col2, col3 = st.columns([1, 1, 1])
    
    with col1:
        if st.session_state.current_question > 0:
            if st.button("⬅️ Previous", key="prev_btn"):
                st.session_state.current_question -= 1
                st.rerun()
    
    with col3:
        if st.session_state.current_question < len(QUESTIONS) - 1:
            if st.button("Next ➡️", key="next_btn"):
                st.session_state.current_question += 1
                st.rerun()
        else:
            if st.button("Continue to Image Upload 📸", key="upload_btn"):
                st.session_state.screen_state = 'upload'
                st.rerun()


def render_upload_screen():
    """Render the image upload screen."""
    st.markdown('<div class="main-header">📸 Upload Skin Image</div>', unsafe_allow_html=True)
    st.markdown('<div class="sub-header">Provide a clear image of the affected area</div>', unsafe_allow_html=True)
    
    st.markdown("---")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("### 📁 Upload from Device")
        uploaded_file = st.file_uploader(
            "Choose an image file",
            type=[
                'jpg',
                'jpeg',
                'png',
                'webp',
                'bmp',
                'tiff',
                'tif',
                'heic',
                'heif'
            ],
            help="Upload a clear image of the affected skin area"
        )
        
        if uploaded_file is not None:
            st.session_state.uploaded_image = uploaded_file.read()
            st.success("✅ Image uploaded successfully!")
    
    with col2:
        st.markdown("### 📷 Capture from Camera")
        camera_image = st.camera_input("Take a picture")
        
        if camera_image is not None:
            st.session_state.uploaded_image = camera_image.read()
            st.success("✅ Image captured successfully!")
    
    st.markdown("---")
    
    # Display preview if image is uploaded
    if st.session_state.uploaded_image:
        st.markdown("### 🖼️ Image Preview")
        image = Image.open(io.BytesIO(st.session_state.uploaded_image))

        if image.mode != "RGB":
            image = image.convert("RGB")
        st.image(image, caption="Uploaded Image", use_container_width=True)
        
        st.markdown("---")
        
        col1, col2, col3 = st.columns([1, 1, 1])
        
        with col1:
            if st.button("⬅️ Back to Questions", key="back_to_q"):
                st.session_state.screen_state = 'questionnaire'
                st.rerun()
        
        with col3:
            if st.button("🔬 Analyze Now", key="analyze_btn"):
                st.session_state.screen_state = 'analyzing'
                st.rerun()
    else:
        col1, col2, col3 = st.columns([1, 1, 1])
        with col1:
            if st.button("⬅️ Back to Questions", key="back_to_q2"):
                st.session_state.screen_state = 'questionnaire'
                st.rerun()


def render_analyzing_screen():
    """Render the analyzing/loading screen and perform analysis."""
    st.markdown('<div class="main-header">🔬 Analyzing Your Skin Condition</div>', unsafe_allow_html=True)
    
    # Progress indicator
    progress_bar = st.progress(0)
    status_text = st.empty()
    
    # Simulate analysis steps
    steps = [
        "Uploading image...",
        "Running AI classification...",
        "Analyzing symptoms...",
        "Generating report...",
        "Finalizing results..."
    ]
    
    for i, step in enumerate(steps):
        status_text.markdown(f"**{step}**")
        progress_bar.progress((i + 1) / len(steps))
        time.sleep(0.5)  # Simulate processing time
    
    # Upload image to Cloudinary (or mock)
    try:
        image_url = upload_to_cloudinary(st.session_state.uploaded_image)
        
        # Prepare symptoms data
        symptoms = prepare_symptoms_data()
        
        # Call ML API
        result = call_analyze_api(image_url, symptoms, st.session_state.scan_id)
        
        if result and result.get('success'):
            st.session_state.report_data = result
            st.session_state.screen_state = 'report'
            st.success("✅ Analysis complete!")
            time.sleep(1)
            st.rerun()
        else:
            st.error("❌ Analysis failed. Please try again.")
            if st.button("Try Again"):
                st.session_state.screen_state = 'upload'
                st.rerun()
                
    except Exception as e:
        st.error(f"❌ Error during analysis: {str(e)}")
        if st.button("Try Again"):
            st.session_state.screen_state = 'upload'
            st.rerun()


def render_report_screen():
    """Render the final report screen."""
    report = st.session_state.report_data
    
    if not report:
        st.error("No report data available")
        return
    
    st.markdown('<div class="main-header">📊 Your Dermatology Report</div>', unsafe_allow_html=True)
    st.markdown(f"<div class='sub-header'>Report ID: {st.session_state.scan_id}</div>", unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Display diagnosis
    st.markdown('<div class="diagnosis-box">', unsafe_allow_html=True)
    st.markdown(f"### 🎯 Primary Diagnosis")
    st.markdown(f"# {report.get('disease', 'Unknown')}")
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Confidence meter
    confidence = report.get('confidence', 0)
    st.markdown('<div class="confidence-meter">', unsafe_allow_html=True)
    st.markdown(f"**Confidence Level: {confidence:.1f}%**")
    st.progress(confidence / 100)
    st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Display uploaded image
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("### 🖼️ Analyzed Image")
        if st.session_state.uploaded_image:
            image = Image.open(io.BytesIO(st.session_state.uploaded_image))
            st.image(image, use_container_width=True)
    
    with col2:
        st.markdown("### 📋 Your Symptoms")
        for key, value in st.session_state.answers.items():
            question_obj = next((q for q in QUESTIONS if q['id'] == key), None)
            if question_obj:
                if isinstance(value, list):
                    value = ", ".join(value)
                st.markdown(f"**{question_obj['question']}**  \n{value}")
    
    st.markdown("---")
    
    # Full report
    st.markdown('<div class="report-section">', unsafe_allow_html=True)
    st.markdown("### 📄 Detailed Analysis Report")
    st.markdown(report.get('report', 'No report available'))
    st.markdown('</div>', unsafe_allow_html=True)
    
    st.markdown("---")
    
    # Disclaimer
    st.warning("""
    ⚠️ **Important Medical Disclaimer**
    
    This report is generated by an AI system and is intended for informational purposes only. 
    It does NOT constitute medical advice, diagnosis, or treatment. Always consult with a qualified 
    healthcare professional for proper medical evaluation and treatment decisions.
    """)
    
    st.markdown("---")
    
    # Action buttons
    col1, col2, col3 = st.columns(3)
    
    with col1:
        if st.button("🔄 New Screening", key="new_screening"):
            reset_screening()
            st.rerun()
    
    with col2:
        # Download report as text
        report_text = f"""
SKINSHIELD DERMATOLOGY REPORT
Report ID: {st.session_state.scan_id}
Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}

PRIMARY DIAGNOSIS: {report.get('disease', 'Unknown')}
CONFIDENCE: {report.get('confidence', 0):.1f}%

{report.get('report', '')}

---
DISCLAIMER: This report is AI-generated for informational purposes only.
Consult a healthcare professional for medical advice.
"""
        st.download_button(
            label="📥 Download Report",
            data=report_text,
            file_name=f"skinshield_report_{st.session_state.scan_id}.txt",
            mime="text/plain"
        )
    
    with col3:
        if st.button("💬 Chat with AI", key="chat_btn"):
            st.info("Chat feature coming soon!")


# ══════════════════════════════════════════════════════════════════════════════
# MAIN APP LOGIC
# ══════════════════════════════════════════════════════════════════════════════

def main():
    """Main application logic."""
    
    # Sidebar
    with st.sidebar:
        st.markdown("### 🔬 SkinShield")
        st.markdown("AI Dermatology Screening")
        st.markdown("---")
        
        # Show mode
        if MOCK_MODE:
            st.warning("🧪 **MOCK MODE**  \nUsing simulated data")
        else:
            st.success("🔌 **LIVE MODE**  \nConnected to API")
        
        st.markdown("---")
        
        st.markdown("**Current Status:**")
        status_map = {
            'welcome': '🏠 Welcome',
            'questionnaire': '📋 Questionnaire',
            'upload': '📸 Image Upload',
            'analyzing': '🔬 Analyzing',
            'report': '📊 Report Ready'
        }
        st.info(status_map.get(st.session_state.screen_state, 'Unknown'))
        
        if st.session_state.screen_state != 'welcome':
            st.markdown(f"**Session ID:**  \n`{st.session_state.scan_id[:8]}...`")
        
        st.markdown("---")
        
        st.markdown("### ℹ️ About")
        st.markdown("""
        SkinShield uses advanced AI to analyze skin conditions and provide 
        preliminary insights. This tool combines:
        
        - MobileNetV3 image classification
        - Google Gemini AI analysis
        - Comprehensive symptom evaluation
        """)
        
        st.markdown("---")
        
        if st.button("🔄 Reset", key="sidebar_reset"):
            reset_screening()
            st.rerun()
    
    # Render appropriate screen based on state
    if st.session_state.screen_state == 'welcome':
        render_welcome_screen()
    
    elif st.session_state.screen_state == 'questionnaire':
        render_questionnaire()
    
    elif st.session_state.screen_state == 'upload':
        render_upload_screen()
    
    elif st.session_state.screen_state == 'analyzing':
        render_analyzing_screen()
    
    elif st.session_state.screen_state == 'report':
        render_report_screen()


# ══════════════════════════════════════════════════════════════════════════════
# RUN APP
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    main()