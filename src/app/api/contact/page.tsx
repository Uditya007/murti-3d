'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, User, MessageSquare, ArrowLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleUpdate = (key: string, val: string) =>
    setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })

    const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setStatus('');

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });

    const text = await res.text();
    console.log('Raw response:', text);

    if (!text) {
      setStatus('❌ No response from server.');
      setLoading(false);
      return;
    }

    const data = JSON.parse(text);

    if (data.error) {
      setStatus('❌ ' + data.error);
    } else {
      setStatus('✅ Message sent! We will get back to you soon.');
      setForm({ name: '', email: '', subject: '', message: '' });
    }
  } catch (err) {
    console.error(err);
    setStatus('❌ Something went wrong.');
  }

  setLoading(false);
};
    setLoading(false)

    if (data.error) {
      setMessage('❌ Something went wrong. Please try again.')
    } else {
      setMessage('✅ Message sent! We will get back to you soon.')
      setForm({ name: '', email: '', phone: '', message: '' })
    }
  }

  const inputClass = "w-full bg-black/40 border border-gold/20 rounded-xl py-3.5 pl-11 pr-4 text-sm text-white placeholder-white/40 focus:outline-none focus:border-gold/60 transition-colors"

  return (
    <div className="min-h-screen pt-32 pb-24 flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-divine-radial opacity-10 pointer-events-none" />

      <div className="max-w-2xl w-full px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 text-center"
        >
          <Link href="/" className="inline-flex items-center gap-2 text-muted text-xs tracking-widest hover:text-gold transition-colors mb-6">
            <ArrowLeft size={13} /> BACK TO HOME
          </Link>
          <div className="text-5xl mb-4">🙏</div>
          <h1 className="font-display text-4xl text-divine">Get In Touch</h1>
          <p className="text-muted text-sm mt-3">
            Have a question about a murti? We'd love to hear from you.
          </p>
        </motion.div>

        {/* Contact Info */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {[
            { icon: Mail, label: 'Email', value: 'hello@yourdomain.com' },
            { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="glass rounded-2xl p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Icon size={16} className="text-gold" />
              </div>
              <div>
                <p className="text-[10px] tracking-widest text-muted">{label.toUpperCase()}</p>
                <p className="text-sm text-divine mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-3xl p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="text"
                  placeholder="Your Name"
                  required
                  value={form.name}
                  onChange={e => handleUpdate('name', e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
                <input
                  type="email"
                  placeholder="Email Address"
                  required
                  value={form.email}
                  onChange={e => handleUpdate('email', e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="relative">
              <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="tel"
                placeholder="Phone Number (optional)"
                value={form.phone}
                onChange={e => handleUpdate('phone', e.target.value)}
                className={inputClass}
              />
            </div>

            <div className="relative">
              <MessageSquare size={16} className="absolute left-4 top-5 text-muted" />
              <textarea
                placeholder="Your Message"
                required
                rows={5}
                value={form.message}
                onChange={e => handleUpdate('message', e.target.value)}
                className={inputClass + ' pl-11 py-3.5 resize-none'}
              />
            </div>

            {message && (
              <p className="text-center text-xs text-gold/80">{message}</p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-gold text-black font-medium py-3.5 rounded-full text-sm tracking-widest hover:bg-gold-light transition-all shadow-gold mt-2"
            >
              {loading ? 'SENDING...' : 'SEND MESSAGE'}
              {!loading && <ChevronRight size={14} />}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  )
}