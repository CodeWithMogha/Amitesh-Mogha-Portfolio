import React, { useState } from 'react';
import './ContactSection.css';

// ─────────────────────────────────────────────────────────
// Replace this with your Formspree endpoint.
// Sign up free at https://formspree.io, create a form, copy the URL.
// Example: 'https://formspree.io/f/xabcdefg'
// ─────────────────────────────────────────────────────────
const FORMSPREE_ENDPOINT = process.env.REACT_APP_FORMSPREE_ENDPOINT || '';

type Status = 'idle' | 'sending' | 'sent' | 'error';

interface FormState {
  name: string;
  email: string;
  message: string;
}

const ContactSection: React.FC = () => {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = (): string => {
    if (!form.name.trim()) return 'Please enter your name.';
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return 'Please enter a valid email address.';
    if (!form.message.trim()) return 'Please enter a message.';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validate();
    if (validationError) {
      setErrorMsg(validationError);
      setStatus('error');
      return;
    }

    if (!FORMSPREE_ENDPOINT) {
      console.error('Formspree endpoint is missing. Set REACT_APP_FORMSPREE_ENDPOINT in .env');
      setErrorMsg('Contact form is not configured yet. Please try again later.');
      setStatus('error');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('sent');
        setForm({ name: '', email: '', message: '' });
      } else {
        const msg = data?.errors?.map((err: any) => err.message).join(', ') || 'Submission failed.';
        console.error('Formspree error:', data);
        setErrorMsg(msg);
        setStatus('error');
      }
    } catch (err) {
      console.error('Network error submitting form:', err);
      setErrorMsg('Network error. Please check your connection and try again.');
      setStatus('error');
    }
  };

  return (
    <section className="contact-section" id="contact-me">
      {/* Red accent line at top */}
      <div className="contact-divider" />

      <div className="contact-inner">
        {/* ── Left: heading ── */}
        <div className="contact-left">
          <span className="contact-eyebrow">Let's talk</span>
          <h2 className="contact-heading">Contact<br />Me.</h2>
          <p className="contact-sub">
            Got an opportunity, a project, or just want to say hi?
            Drop a message — I read every one.
          </p>
        </div>

        {/* ── Right: form ── */}
        <div className="contact-right">
          {status === 'sent' ? (
            <div className="contact-success">
              <div className="contact-success-icon">✓</div>
              <h3>Message Sent!</h3>
              <p>Thanks for reaching out. I'll get back to you soon.</p>
              <button
                className="contact-btn"
                onClick={() => setStatus('idle')}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form" noValidate>
              <div className="contact-row">
                <div className="contact-field">
                  <label htmlFor="contact-name">Your Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    value={form.name}
                    onChange={handleChange}
                    disabled={status === 'sending'}
                    required
                  />
                </div>
                <div className="contact-field">
                  <label htmlFor="contact-email">Your Email</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={form.email}
                    onChange={handleChange}
                    disabled={status === 'sending'}
                    required
                  />
                </div>
              </div>

              <div className="contact-field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={6}
                  placeholder="Hey Amitesh, I'd love to connect about..."
                  value={form.message}
                  onChange={handleChange}
                  disabled={status === 'sending'}
                  required
                />
              </div>

              <button
                type="submit"
                className={`contact-btn ${status}`}
                disabled={status === 'sending'}
              >
                {status === 'idle' && 'Send Message ✉'}
                {status === 'sending' && 'Sending…'}
                {status === 'error' && 'Try Again →'}
              </button>

              {status === 'error' && errorMsg && (
                <p className="contact-error-msg">{errorMsg}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
