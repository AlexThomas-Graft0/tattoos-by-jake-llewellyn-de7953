'use client';

import { useEffect, useState } from 'react';

export function CookieBanner() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    try { if (!localStorage.getItem('cookie_consent')) setShow(true); } catch {}
  }, []);
  const choose = (v: string) => {
    try { localStorage.setItem('cookie_consent', v); } catch {}
    setShow(false);
  };
  if (!show) return null;
  return (
    <div style={{ position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 50, background: 'rgba(20,20,20,0.95)', color: '#fff', padding: '16px', backdropFilter: 'blur(4px)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}>
        <p style={{ margin: 0, fontSize: 14 }}>
          We use cookies to make this site work and to understand how it&apos;s used.{' '}
          <a href="/cookies" style={{ color: '#fff', textDecoration: 'underline' }}>Learn more</a>.
        </p>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          <button onClick={() => choose('declined')} style={{ border: '1px solid rgba(255,255,255,0.4)', background: 'transparent', color: '#fff', borderRadius: 999, padding: '8px 16px', fontSize: 14, cursor: 'pointer' }}>Decline</button>
          <button onClick={() => choose('accepted')} style={{ border: 'none', background: '#fff', color: '#111', borderRadius: 999, padding: '8px 16px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Accept</button>
        </div>
      </div>
    </div>
  );
}
