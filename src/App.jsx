import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield, FileText, Zap, CheckCircle, XCircle, ArrowRight,
  Lock, Clock, TrendingUp, Users, AlertTriangle,
  Phone, Mail, User, Award, Building2,
  BadgeCheck, Scale, ChevronRight, Sun, Moon, Check
} from "lucide-react";
import { getThemesForVariant, ThemeCtx, useT } from "./theme.js";
import { LANDING_VARIANTS } from "./landingVariants.js";
import {
  CookieConsentProvider,
  CookieBanner,
  CookiePreferencesModal,
  CookieFooterButton,
} from "./consent/index.js";
import structureDarkImg from "./assets/images/structure_dark.png";
import structureLightImg from "./assets/images/structure_light.png";
import structureWithTextDarkImg from "./assets/images/structure_with_text_dark.png";
import structureWithTextLightImg from "./assets/images/structure_with_text_light.png";
import shieldDarkImg from "./assets/images/shield_dark.png";
import shieldLightImg from "./assets/images/shield_light.png";
import { heroStructureDescriptions } from "./content/heroStructureDescriptions.js";

function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// eslint-disable-next-line no-unused-vars -- reserved for future use
function ContractCard() {
  const T = useT();
  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 420, margin: "0 auto", border: `2px solid ${T.cardOuterBorder}`, borderRadius: 24, padding: 10, background: T.cardOuterBg }}>
      <div style={{ position: "absolute", top: -30, right: -30, width: 260, height: 260, background: `radial-gradient(ellipse,${T.meshGreen} 0%,transparent 70%)`, borderRadius: "50%", filter: "blur(10px)", zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: -20, left: -20, width: 200, height: 200, background: `radial-gradient(ellipse,${T.meshBlue} 0%,transparent 70%)`, borderRadius: "50%", filter: "blur(10px)", zIndex: 0 }} />
      <div style={{ background: T.cardBg, border: `1px solid ${T.cardBorder}`, borderRadius: 20, padding: 28, backdropFilter: "blur(16px)", boxShadow: T.cardShadow, position: "relative", zIndex: 1, minWidth: 0, overflow: "hidden" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 20 }}>
          <div style={{ background: T.cardIconBg, borderRadius: 10, padding: 8, display: "flex", flexShrink: 0 }}>
            <FileText size={18} color="rgba(255,255,255,0.85)" />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: "#FFFFFF", fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Umowa Najmu Okazjonalnego</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <div style={{ color: "rgba(255,255,255,0.55)", fontSize: 11 }}>Wersja cyfrowa · eIDAS</div>
              <div style={{ background: "rgba(14,124,102,0.35)", border: "1px solid rgba(14,124,102,0.9)", borderRadius: 20, padding: "2px 8px", display: "flex", alignItems: "center", gap: 4 }}>
                <BadgeCheck size={11} color="#2dd4aa" />
                <span style={{ color: "#2dd4aa", fontSize: 10, fontWeight: 700 }}>ZWERYFIKOWANO</span>
              </div>
            </div>
          </div>
        </div>
        {[
          { text: "Strona wynajmująca: Jan Kowalski", dot: T.cta },
          { text: "Strona najemcy: Anna Nowak", dot: T.cta },
          { text: "Okres: 12 miesięcy", dot: "rgba(255,255,255,0.35)" },
          { text: "Kaucja: 3 000 PLN", dot: "rgba(255,255,255,0.35)" },
        ].map((line, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: line.dot }} />
            <span style={{ color: i < 2 ? "#FFFFFF" : "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: i < 2 ? 600 : 400 }}>{line.text}</span>
          </div>
        ))}
        <div style={{ marginTop: 18, display: "flex", gap: 10 }}>
          {[
            { label: "PODPIS WYNAJMUJĄCY", sig: "Jan K.", color: "#2dd4aa", rgb: T.sigRgbGreen },
            { label: "PODPIS NAJEMCY", sig: "Anna N.", color: "#FFFFFF", rgb: "255,255,255" },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ color: "rgba(255,255,255,0.45)", fontSize: 10, marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontFamily: "cursive", color: s.color, fontSize: 18, lineHeight: 1 }}>{s.sig}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 14, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <Lock size={13} color="rgba(255,255,255,0.6)" />
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600 }}>Zabezpieczono · 256-bit SSL · RODO</span>
        </div>
      </div>
    </div>
  );
}

function ComparisonBars({ inView }) {
  const T = useT();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {[
        { label: "Eksmisja sądowa", value: 95, display: "1–3 lata", bad: true },
        { label: "Mediacja Rent Standard", value: 14, display: "14 dni", bad: false },
      ].map((item, i) => (
        <div key={i}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ color: item.bad ? T.textMuted : T.cta, fontSize: 13, fontWeight: 600 }}>{item.label}</span>
            <span style={{ color: item.bad ? T.textMuted : T.cta, fontSize: 13, fontWeight: 700 }}>{item.display}</span>
          </div>
          <div style={{ background: T.barBg, borderRadius: 99, height: 10, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, background: item.bad ? T.barBadBg : "linear-gradient(90deg,#0E7C66,#4dd4a8)", width: inView ? `${item.value}%` : "0%", transition: `width 1.2s cubic-bezier(.4,0,.2,1) ${i * 0.25}s` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function BentoCard({ children, style = {}, accent = "none" }) {
  const T = useT();
  const [hovered, setHovered] = useState(false);
  const map = {
    cta: { border: T.bentoCtaBorder, bg: T.bentoCtaBg, glow: T.bentoGlow },
    info: { border: T.bentoInfoBorder, bg: T.bentoInfoBg, glow: "transparent" },
    none: { border: T.bentoNoneBorder, bg: T.bentoNoneBg, glow: "transparent" },
  };
  const t = map[accent] || map.none;
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} style={{
      background: t.bg, border: `1px solid ${t.border}`, borderRadius: 20, padding: 28, backdropFilter: "blur(12px)",
      boxShadow: hovered ? `0 20px 60px rgba(0,0,0,0.12),0 0 0 1px ${t.glow}` : "0 4px 24px rgba(0,0,0,0.06)",
      transform: hovered ? "translateY(-4px) scale(1.01)" : "translateY(0) scale(1)",
      transition: "all 0.35s cubic-bezier(.4,0,.2,1)", ...style
    }}>{children}</div>
  );
}

function FadeIn({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}s,transform 0.7s ease ${delay}s` }}>{children}</div>
  );
}

export default function App({ variantId = "main" }) {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false); // false = Light default
  const themes = getThemesForVariant(variantId);
  const T = isDark ? themes.DARK : themes.LIGHT;
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [emailError, setEmailError] = useState(null);
  const [rodoChecked, setRodoChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [painRef, painInView] = useInView();
  const formRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const css = `
    *{box-sizing:border-box;margin:0;}
    html,body{min-height:100%;background:${T.bg};color:${T.textPrimary};}
    ::selection{background:rgba(28,187,131,0.25);}
    ::-webkit-scrollbar{width:4px;}
    ::-webkit-scrollbar-track{background:${T.scrollbarTrack};}
    ::-webkit-scrollbar-thumb{background:${T.scrollbarThumb};border-radius:4px;}
    .pulse-btn{animation:pulse-glow 2.8s ease-in-out infinite;}
    @keyframes pulse-glow{0%,100%{box-shadow:0 0 0 0 ${T.ctaGlow},0 8px 28px ${T.ctaGlow};}50%{box-shadow:0 0 0 12px rgba(28,187,131,0),0 8px 36px ${T.ctaGlow};}}
    .cta-btn{background:linear-gradient(135deg,${T.cta},${T.ctaHover});color:#fff;border:none;cursor:pointer;font-family:Manrope,sans-serif;font-weight:800;border-radius:12px;transition:all 0.25s;display:inline-flex;align-items:center;gap:8px;letter-spacing:-0.01em;}
    .cta-btn:hover{transform:translateY(-2px);box-shadow:0 12px 32px ${T.ctaGlow};}
    .cta-btn:active{transform:translateY(0);}
    .sec-btn{background:transparent;color:${T.secBtnColor};border:1px solid ${T.secBtnBorder};cursor:pointer;font-family:Manrope,sans-serif;font-weight:600;border-radius:12px;transition:all 0.25s;display:inline-flex;align-items:center;gap:8px;}
    .sec-btn:hover{border-color:${T.ctaBorder};color:${T.textPrimary};}
    input{background:${T.inputBg};border:1px solid ${T.inputBorder};border-radius:12px;color:${T.inputColor};font-family:Manrope,sans-serif;font-size:15px;padding:14px 16px;width:100%;transition:border-color 0.2s,background 0.2s;outline:none;}
    input:focus{border-color:${T.info};background:${T.inputFocusBg};}
    input::placeholder{color:${T.inputPlaceholder};}
    .tag-cta{display:inline-flex;align-items:center;gap:6px;background:${T.ctaDim};border:1px solid ${T.ctaBorder};border-radius:99px;padding:4px 12px;color:${T.cta};font-size:12px;font-weight:700;letter-spacing:.05em;text-transform:uppercase;}
    .tag-info{display:inline-flex;align-items:center;gap:6px;background:${T.tagInfoBg};border:1px solid ${T.tagInfoBorder};border-radius:99px;padding:4px 12px;color:${T.tagInfoColor};font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;}
    .hero-list-item{padding:8px 12px;margin:0 -12px 14px -12px;border-radius:10px;transition:background .2s ease;}
    .hero-list-item:hover{background:rgba(14,124,102,0.09);}
    .hero-structure-desktop,.hero-structure-mobile{width:100%;height:auto;border-radius:12px;}
    .hero-structure-desktop{display:block;}
    .hero-structure-mobile{display:none;}
    .hero-grid>.hero-structure-col{align-self:flex-start;}
    @media(max-width:850px){.hero-structure-desktop{display:none;}.hero-structure-mobile{display:block;}.hero-structure-badge{display:none;}.hero-grid{flex-direction:column!important;gap:28px!important;}.hero-grid>:first-child{order:1}.hero-grid>:last-child{order:-1}.bento-3{grid-template-columns:1fr!important;}.proof-grid{flex-direction:column!important;}.compare-table td,.compare-table th{padding:10px 8px!important;font-size:13px!important;}.partner-logos{flex-wrap:wrap!important;justify-content:center!important;}}
    @media(max-width:500px){.nav-cta-text{display:none;}.toggle-label{display:none;}.hero-trust-wrap{flex-direction:column;}}
    .form-shield-img{flex-shrink:0;}
    .form-header-row{gap:40px;}
    .form-fields{display:flex;flex-direction:column;gap:16px;}
    .form-sub-desktop{display:block;}
    .form-sub-mobile{display:none;}
    @media(max-width:850px){
      .form-row{flex-direction:column;align-items:center;}
      .form-shield-col{justify-content:center!important;padding-right:0!important;}
      .form-shield-img{width:120px!important;max-width:120px!important;}
      .form-spacer{display:none;}
      .form-header-row{gap:20px;}
      .form-fields{gap:14px;}
      .form-sub-desktop{display:none;}
      .form-sub-mobile{display:block;}
    }
  `;

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || "").trim());
  const validateEmail = () => {
    if (!formData.email) {
      setEmailError("Podaj adres e-mail.");
      return false;
    }
    if (!isValidEmail(formData.email)) {
      setEmailError("Nieprawidłowy format adresu e-mail.");
      return false;
    }
    setEmailError(null);
    return true;
  };

  const formatPhone = (raw) => {
    const digits = (raw || "").replace(/\D/g, "").slice(0, 9);
    const groups = digits.match(/.{1,3}/g) || [];
    return groups.join(" ");
  };

  const LEADS_ENDPOINT = (import.meta.env.VITE_LEADS_ENDPOINT || "").trim();

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!rodoChecked || !formData.name) return;
    if (!validateEmail()) return;
    if (!LEADS_ENDPOINT) {
      setSubmitError("Brak konfiguracji wysyłki.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const params = new URLSearchParams(window.location.search || "");
      const utm = Object.fromEntries(
        [...params.entries()].filter(([k]) => k.toLowerCase().startsWith("utm_"))
      );

      const payload = {
        name: (formData.name || "").trim(),
        email: (formData.email || "").trim(),
        phone: (formData.phone || "").replace(/\D/g, ""),
        variant_id: variantId,
        utm,
        userAgent: navigator.userAgent,
        data: JSON.stringify({
          pageUrl: window.location.href,
          consent: true,
        }),
      };

      const res = await fetch(LEADS_ENDPOINT, {
        method: "POST",
        // Apps Script web apps can be picky about CORS preflight. Using text/plain avoids OPTIONS.
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(payload),
      });

      const raw = await res.text();
      let json = null;
      try { json = JSON.parse(raw); } catch { /* ignore */ }

      if (!res.ok) {
        const hint = json?.error || raw?.slice?.(0, 140) || "";
        throw new Error(`HTTP ${res.status}${hint ? `: ${hint}` : ""}`);
      }
      if (!json?.ok) {
        const hint = json?.error || raw?.slice?.(0, 140) || "Submit failed";
        throw new Error(hint);
      }

      setSubmitted(true);
    } catch (e) {
      const msg = (e && typeof e === "object" && "message" in e) ? e.message : String(e || "");
      setSubmitError(`Nie udało się wysłać formularza. ${msg}`.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ThemeCtx.Provider value={T}>
      <CookieConsentProvider>
      <div style={{ background: T.bg, minHeight: "100vh", fontFamily: "Manrope,system-ui,sans-serif", color: T.textPrimary, transition: "background 0.4s,color 0.4s" }}>
        <style dangerouslySetInnerHTML={{ __html: css }} />

        {/* BG mesh */}
        <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: -180, right: -180, width: 680, height: 680, background: `radial-gradient(ellipse,${T.meshGreen} 0%,transparent 65%)`, borderRadius: "50%" }} />
          <div style={{ position: "absolute", bottom: -120, left: -120, width: 620, height: 620, background: `radial-gradient(ellipse,${T.meshBlue} 0%,transparent 65%)`, borderRadius: "50%" }} />
          <div style={{ position: "absolute", top: "45%", left: "40%", width: 460, height: 460, background: `radial-gradient(ellipse,${T.meshGreenMid} 0%,transparent 60%)`, borderRadius: "50%" }} />
        </div>

        {/* NAV */}
        <nav style={{ position: "sticky", top: 0, zIndex: 100, background: T.navBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${T.surfBorder}`, padding: "0 clamp(16px,4vw,48px)", transition: "background 0.3s ease,box-shadow 0.3s ease", boxShadow: scrolled ? "0 10px 30px rgba(0,0,0,0.35)" : "none" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 68 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", color: "inherit" }}>
                <div style={{ background: `linear-gradient(135deg,${T.info},${T.ctaHover})`, borderRadius: 10, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 4px 16px ${T.ctaGlow}` }}>
                  <Shield size={18} color="#fff" strokeWidth={2.5} />
                </div>
                <span style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 20, fontWeight: 700, letterSpacing: "-0.03em", color: T.textPrimary }}>Rent Standard</span>
              </Link>
              {LANDING_VARIANTS.length > 1 && (
                <div style={{ display: "flex", alignItems: "center", gap: 0, marginLeft: 0 }}>
                  {LANDING_VARIANTS.map(({ path, label, variantId: id }) => {
                    const isActive = location.pathname === path || (path !== "/" && location.pathname.startsWith(path));
                    return (
                      <Link
                        key={id}
                        to={path}
                        style={{
                          padding: "4px 4px",
                          borderRadius: 8,
                          fontSize: 14,
                          fontWeight: isActive ? 700 : 600,
                          color: isActive ? T.cta : T.textSecondary,
                          textDecoration: "none",
                          background: isActive ? T.ctaDim : "transparent",
                          border: `1px solid ${isActive ? T.ctaBorder : "transparent"}`,
                          transition: "color 0.2s, background 0.2s",
                        }}
                      >
                        {label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Theme toggle */}
              <button onClick={() => setIsDark(!isDark)} style={{ background: T.toggleBg, border: `1px solid ${T.toggleBorder}`, borderRadius: 99, padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: T.textSecondary, fontSize: 13, fontWeight: 600, fontFamily: "Manrope,sans-serif", transition: "all 0.25s", flexShrink: 0 }}>
                {isDark ? <><Sun size={15} color="#f59e0b" /><span className="toggle-label" style={{ color: "#f59e0b" }}>Jasny</span></> : <><Moon size={15} color={T.info} /><span className="toggle-label" style={{ color: T.info }}>Ciemny</span></>}
              </button>
              <button onClick={scrollToForm} className="cta-btn" style={{ padding: "10px 20px", fontSize: 15 }}>
                <span className="nav-cta-text">Zabezpiecz najem</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </nav>

        <main style={{ overflowX: "hidden" }}>
        {/* HERO */}
        <section style={{ position: "relative", zIndex: 1, padding: "clamp(45px,7.5vw,92px) clamp(16px,4vw,48px) clamp(45px,6vw,76px)", overflow: "hidden" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <h1 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(36px,5vw,64px)", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 12, color: T.textPrimary, width: "100%", textAlign: "center" }}>
              <span style={{ color: T.info }}>Umowa ekspercka</span> - najem bez ryzyka
            </h1>
            <p style={{ width: "100%", textAlign: "center", color: T.textSecondary, fontSize: "clamp(16px,2vw,19px)", lineHeight: 1.5, marginBottom: 40, maxWidth: 560, marginLeft: "auto", marginRight: "auto" }}>
              Ochrona najmu od umowy po mediację — stworzona przez prawników.
            </p>
            <div className="hero-grid" style={{ display: "flex", alignItems: "center", gap: "clamp(16px,2.5vw,30px)" }}>
              <div style={{ flex: "0.7 1 336px" }}>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", maxWidth: 520 }}>
                  {(() => {
                    const items = heroStructureDescriptions.slice(1);
                    const primary = items.filter(it => it.primary);
                    const secondary = items.filter(it => !it.primary);
                    let num = 0;
                    return [
                      ...primary.map((item, i) => {
                        num += 1;
                        const displayNum = num;
                        const title = item.title.replace(/^\d+\.\s*/, "");
                        return (
                          <li key={`p-${i}`} className="hero-list-item">
                            <strong style={{ display: "block", color: T.textPrimary, fontSize: 18, marginBottom: 2 }}>{`${displayNum}. ${title}`}</strong>
                            <span style={{ color: T.textSecondary, fontSize: 16, lineHeight: 1.5 }}>{item.description}</span>
                          </li>
                        );
                      }),
                      secondary.length > 0 && (
                        <li key="sec-label" style={{ listStyle: "none", marginTop: 8, marginBottom: 4 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: ".04em", textTransform: "uppercase" }}>Dodatkowe zabezpieczenia</span>
                        </li>
                      ),
                      ...secondary.map((item, i) => {
                        num += 1;
                        const displayNum = num;
                        const title = item.title.replace(/^\d+\.\s*/, "");
                        return (
                          <li key={`s-${i}`} className="hero-list-item" style={{ marginBottom: 4 }}>
                            <strong style={{ display: "block", color: T.textSecondary, fontSize: 14, marginBottom: 2 }}>{`${displayNum}. ${title}`}</strong>
                            <span style={{ color: T.textSecondary, fontSize: 14, lineHeight: 1.5, opacity: 0.9 }}>{item.description}</span>
                          </li>
                        );
                      }),
                    ];
                  })()}
                </ul>
                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <button onClick={scrollToForm} className="cta-btn pulse-btn" style={{ padding: "16px 28px", fontSize: 18 }}>
                    Chcę wynajmować bez ryzyka <ArrowRight size={18} />
                  </button>
                  <button className="sec-btn" style={{ padding: "16px 24px", fontSize: 15 }}>Dowiedz się więcej</button>
                </div>
                <div style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12, alignItems: "flex-start" }} className="hero-trust-wrap">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.ctaDim, border: `1px solid ${T.ctaBorder}`, borderRadius: 99, padding: "8px 20px" }}>
                    <Users size={20} color={T.cta} />
                    <span style={{ fontSize: 22, fontWeight: 800, color: T.cta, fontFamily: "Inter Tight,sans-serif" }}>2 400+</span>
                    <span style={{ fontSize: 15, color: T.textSecondary }}>chronionych najemców</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", color: T.badgesColor, fontSize: 12 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Award size={12} /> Zgodność z eIDAS</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Scale size={12} /> RODO 100%</span>
                  </div>
                </div>
              </div>
              <div className="hero-structure-col" style={{ flex: "1 1 280px", minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <img src={isDark ? structureDarkImg : structureLightImg} alt="Protected Lease Agreement — umowa ekspercka, weryfikacja i podpis, mediacja, wsparcie prawne, ubezpieczenie, najem okazjonalny" className="hero-structure-desktop" style={{ width: "100%", height: "auto", borderRadius: 12 }} />
                  <img
                    src={isDark ? structureWithTextDarkImg : structureWithTextLightImg}
                    alt="Protected Lease Agreement — 6 poziomów ochrony: umowa ekspercka, weryfikacja i podpis, mediacja, wsparcie prawne, ubezpieczenie, najem okazjonalny"
                    className="hero-structure-mobile"
                    style={{ width: "100%", height: "auto", borderRadius: 12 }}
                  />
                  <div className="tag-cta hero-structure-badge" style={{ marginTop: 16, background: isDark ? "rgba(14,124,102,0.18)" : "rgba(14,124,102,0.10)", border: isDark ? "1px solid rgba(14,124,102,0.55)" : "1px solid rgba(14,124,102,0.45)", color: isDark ? "#2dd4aa" : "#0B6653" }}>
                  <BadgeCheck size={12} />Certyfikowana ochrona najmu w Polsce
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAIN BLOCK */}
        <section style={{ position: "relative", zIndex: 1, padding: "clamp(32px,4.8vw,64px) clamp(16px,4vw,48px)" }} aria-labelledby="pain-heading">
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <div className="tag-info" style={{ marginBottom: 14, display: "inline-flex" }}>Skala problemu</div>
                <h2 id="pain-heading" style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(28px,4vw,48px)", lineHeight: 1.1, letterSpacing: "-0.03em", color: T.textPrimary }}>Dlaczego musisz się zabezpieczyć</h2>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 20 }}>
                <BentoCard accent="none">
                  <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
                    <div style={{ background: T.warnBg, borderRadius: 12, padding: 10, display: "flex" }}>
                      <AlertTriangle size={22} color={T.warn} />
                    </div>
                    <div>
                      <div style={{ fontSize: 13, color: T.statLabelColor, marginBottom: 2 }}>SKALA PROBLEMU</div>
                      <h3 style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary }}>Ryzyko najmu w Polsce</h3>
                    </div>
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <span style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(42px,6vw,64px)", fontWeight: 700, lineHeight: 1, background: "linear-gradient(135deg,#ef4444,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>7/10</span>
                    <p style={{ color: T.textSecondary, fontSize: 15, marginTop: 6 }}>wynajmujących napotyka poważne problemy z najemcami</p>
                  </div>
                  <div style={{ background: T.warnBg, border: `1px solid ${T.warnBorder}`, borderRadius: 12, padding: "12px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ color: T.textSecondary, fontSize: 14 }}>Średnia strata finansowa</span>
                    <span style={{ color: T.warn, fontWeight: 800, fontSize: 20, fontFamily: "Inter Tight,sans-serif" }}>8 983 PLN</span>
                  </div>
                </BentoCard>

                <BentoCard accent="none">
                  <div style={{ marginBottom: 20 }}>
                    <div style={{ fontSize: 13, color: T.statLabelColor, marginBottom: 4 }}>CZAS ROZWIĄZANIA SPORU</div>
                    <h3 style={{ fontSize: 18, fontWeight: 700, color: T.textPrimary }}>Sąd vs. Mediacja</h3>
                  </div>
                  <div ref={painRef}><ComparisonBars inView={painInView} /></div>
                  <p style={{ marginTop: 18, fontSize: 13, color: T.statNote, fontStyle: "italic" }}>* Dane na podstawie statystyk Ministerstwa Sprawiedliwości 2024</p>
                </BentoCard>

                <BentoCard>
                  <div style={{ fontSize: 13, color: T.statLabelColor, marginBottom: 14 }}>DLACZEGO WARTO DZIAŁAĆ TERAZ</div>
                  {[
                    { icon: <TrendingUp size={16} />, text: "Ceny wynajmu wzrosły o 18% w 2024 r.", color: T.cta },
                    { icon: <Building2 size={16} />, text: "1,2 mln mieszkań na rynku najmu prywatnego", color: T.info },
                    { icon: <Clock size={16} />, text: "Eksmisja sądowa: średnio 19 miesięcy", color: T.cta },
                    { icon: <AlertTriangle size={16} />, text: "68% sporów najmu dotyczy zwrotu kaucji", color: T.info },
                  ].map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "10px 14px", marginBottom: 8, background: T.factRowBg, borderRadius: 10, border: `1px solid ${T.factRowBorder}` }}>
                      <span style={{ color: f.color, flexShrink: 0 }}>{f.icon}</span>
                      <span style={{ color: T.textSecondary, fontSize: 14 }}>{f.text}</span>
                    </div>
                  ))}
                </BentoCard>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* THREE PILLARS */}
        <section style={{ position: "relative", zIndex: 1, padding: "clamp(32px,4.8vw,64px) clamp(16px,4vw,48px)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: 48 }}>
                <div className="tag-info" style={{ marginBottom: 14, display: "inline-flex" }}>Jak działamy</div>
                <h2 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(28px,4vw,48px)", lineHeight: 1.1, letterSpacing: "-0.03em", color: T.textPrimary }}>Trzy filary Twojego spokoju</h2>
                <p style={{ marginTop: 10, whiteSpace: "nowrap", fontSize: "clamp(11px,1.6vw,21px)", color: T.info }}>
                  Umowa + <span style={{ color: T.cta }}>podpis</span> + mediacja
                </p>
              </div>
            </FadeIn>
            <div className="bento-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 20 }}>
              {[
                { icon: <Shield size={26} />, badge: "01", accent: "cta", iC: T.cta, title: "Pancerna Umowa", sub: "Najem okazjonalny bez stresu", desc: "Klauzule chroniące kaucję i Twoją własność. Umowa przygotowana przez radcę prawnego, dostosowana do polskiego prawa.", features: ["Tryb okazjonalny (art. 692¹ KC)", "Klauzule kaucji", "Ochrona własności", "Audyt prawny"] },
                { icon: <Zap size={26} />, badge: "02", accent: "info", iC: T.info, title: "Cyfrowe Podpisanie", sub: "Weryfikacja tożsamości i e-podpis", desc: "eIDAS — bezpiecznie i zdalnie w 5 minut. Pełna weryfikacja tożsamości obu stron przed podpisaniem.", features: ["Kwalifikowany e-podpis", "Weryfikacja BIK", "100% zdalnie", "Archiwum 10 lat"] },
                { icon: <Scale size={26} />, badge: "03", accent: "cta", iC: T.cta, title: "Szybka Mediacja", sub: "Rozwiązujemy spory bez sądu", desc: "Profesjonalny mediator na straży Twojego spokoju. Decyzja wiążąca dla obu stron — bez kosztów sądowych.", features: ["14-dniowy tryb", "Certyfik. mediator", "Bez sądu", "Wykonalna ugoda"] },
              ].map((card, i) => (
                <FadeIn key={i} delay={i * 0.12}>
                  <BentoCard accent={card.accent} style={{ height: "100%" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                      <div style={{ background: `${card.iC}18`, border: `1px solid ${card.iC}40`, borderRadius: 14, padding: 12, display: "flex" }}>
                        <span style={{ color: card.iC }}>{card.icon}</span>
                      </div>
                      <span style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 40, color: `${card.iC}20`, fontWeight: 700, lineHeight: 1 }}>{card.badge}</span>
                    </div>
                    <h3 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 22, marginBottom: 4, color: T.textPrimary }}>{card.title}</h3>
                    <p style={{ color: card.iC, fontSize: 13, fontWeight: 600, marginBottom: 14 }}>{card.sub}</p>
                    <p style={{ color: T.pillarDesc, fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>{card.desc}</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {card.features.map((f, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <CheckCircle size={14} color={card.iC} />
                          <span style={{ fontSize: 13, color: T.pillarFeat, lineHeight: 1.6 }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </BentoCard>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>


        {/* LEAD CAPTURE */}
        <section ref={formRef} style={{ position: "relative", zIndex: 1, padding: "clamp(40px,6vw,80px) clamp(16px,4vw,48px)" }}>
          <div style={{ width: 120, height: 3, margin: "0 auto 48px", background: `linear-gradient(90deg,${T.cta},${T.info})`, borderRadius: 99 }} />
          <div className="form-row" style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "flex-start", justifyContent: "center", gap: 0 }}>
            <div style={{ flex: "0 0 auto", width: "100%", maxWidth: 700 }}>
            <FadeIn>
              <div style={{ background: T.formCardBg, border: `1px solid ${T.formCardBorder}`, borderRadius: 24, padding: "clamp(28px,5vw,52px)", backdropFilter: "blur(20px)", boxShadow: T.formCardShadow }}>
                {!submitted ? (
                  <>
                        <div className="form-header-row" style={{ display: "flex", alignItems: "flex-start", marginBottom: 32, flexWrap: "wrap" }}>
                      <div style={{ flexShrink: 0, borderRadius: 18, background: T.formIconBg, border: `1px solid ${T.formIconBorder}`, padding: 14 }}>
                        <img
                          src={isDark ? shieldDarkImg : shieldLightImg}
                          alt=""
                          style={{ width: 80, height: "auto", maxWidth: "100%", objectFit: "contain" }}
                          className="form-shield-img"
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                            <h2 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(28px,4vw,36px)", letterSpacing: "-0.03em", marginBottom: 8, color: T.textPrimary }}>
                              Zabezpiecz swój najem
                        </h2>
                            <p className="form-sub-desktop" style={{ color: T.textSecondary, fontSize: 15, lineHeight: 1.6 }}>
                              <strong style={{ color: T.info }}>Dołącz</strong> do pilotażowej wersji serwisu, który pomaga właścicielom mieszkań{" "}
                              <strong style={{ color: T.cta }}>chronić się przed problemami z najemcami</strong>
                            </p>
                            <p className="form-sub-mobile" style={{ color: T.textSecondary, fontSize: 15, lineHeight: 1.6 }}>
                              <strong style={{ color: T.info }}>Dołącz</strong> do pilotażu serwisu{" "}
                              <strong style={{ color: T.cta }}>ochrony najmu</strong>
                        </p>
                      </div>
                    </div>
                    <div className="form-fields" style={{ display: "flex", flexDirection: "column" }}>
                      <div>
                            <label style={{ display: "block", color: T.textSecondary, fontSize: 13, fontWeight: 600, marginBottom: 6, letterSpacing: ".03em" }}>
                              IMIĘ <span style={{ color: T.cta }}>*</span>
                            </label>
                        <div style={{ position: "relative" }}>
                          <User size={16} color={T.inputPlaceholder} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                              <input type="text" placeholder="Twoje imię" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} style={{ paddingLeft: 40 }} />
                            </div>
                            <div style={{ minHeight: 14, marginTop: 4 }}>
                              <p style={{ margin: 0, fontSize: 12, color: "transparent" }}> </p>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "block", color: T.textSecondary, fontSize: 13, fontWeight: 600, marginBottom: 6, letterSpacing: ".03em" }}>
                          E-MAIL <span style={{ color: T.cta }}>*</span>
                        </label>
                        <div style={{ position: "relative" }}>
                              <Mail size={16} color={emailError ? T.warn : T.inputPlaceholder} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                              <input
                                type="email"
                                placeholder="twoj@email.pl"
                                required
                                value={formData.email}
                                onChange={e => { setFormData({ ...formData, email: e.target.value }); if (emailError) setEmailError(null); }}
                                onBlur={validateEmail}
                                style={{ paddingLeft: 40, borderColor: emailError ? T.warn : undefined }}
                              />
                            </div>
                            <div style={{ minHeight: 14, marginTop: 4 }}>
                              <p style={{ margin: 0, fontSize: 12, color: T.warn, opacity: emailError ? 1 : 0 }}>
                                {emailError || " "}
                              </p>
                        </div>
                      </div>
                      <div>
                        <label style={{ display: "flex", alignItems: "center", gap: 8, color: T.textSecondary, fontSize: 13, fontWeight: 600, marginBottom: 6, letterSpacing: ".03em" }}>
                              NUMER TELEFONU
                        </label>
                        <div style={{ position: "relative" }}>
                          <Phone size={16} color={T.inputPlaceholder} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                          <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9 ]*"
                            placeholder="516 123 456"
                            value={formData.phone}
                            onChange={e => setFormData({ ...formData, phone: formatPhone(e.target.value) })}
                            style={{ paddingLeft: 40 }}
                          />
                        </div>
                            <div style={{ minHeight: 14, marginTop: 4 }}>
                              <p style={{ margin: 0, fontSize: 12, color: "transparent" }}> </p>
                            </div>
                      </div>
                      <label style={{ display: "flex", alignItems: "flex-start", gap: 12, cursor: "pointer", marginTop: 4 }}>
                            <div
                              onClick={() => setRodoChecked(!rodoChecked)}
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 6,
                                flexShrink: 0,
                                background: rodoChecked ? T.cta : "transparent",
                                border: `2px solid ${rodoChecked ? T.cta : T.checkboxBorder}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginTop: 2,
                                transition: "all 0.2s",
                                cursor: "pointer",
                              }}
                            >
                              {rodoChecked && <Check size={14} color="#fff" strokeWidth={3} />}
                        </div>
                        <span style={{ color: T.consentText, fontSize: 13, lineHeight: 1.5 }}>
                                Wyrażam zgodę na przetwarzanie moich danych osobowych przez Klim Zavadski, prowadzący działalność gospodarczą pod firmą KZ, w celu kontaktu handlowego zgodnie z{" "}
                          <a href={`${import.meta.env.BASE_URL}polityka_prywatnosci.pdf`} target="_blank" rel="noopener noreferrer" style={{ color: T.info, fontWeight: 600 }}>Polityką prywatności</a>. Mogę cofnąć zgodę w każdej chwili.
                        </span>
                      </label>
                          <button
                            onClick={handleSubmit}
                            className="cta-btn"
                            disabled={isSubmitting || !rodoChecked || !formData.email || !formData.name || !!emailError}
                            style={{
                              padding: "18px 28px",
                              fontSize: 18,
                              justifyContent: "center",
                              marginTop: 8,
                              opacity: isSubmitting || !rodoChecked || !formData.email || !formData.name || !!emailError ? 0.45 : 1,
                              cursor: isSubmitting || !rodoChecked || !formData.email || !formData.name || !!emailError ? "not-allowed" : "pointer"
                            }}
                          >
                            {isSubmitting ? "Wysyłanie..." : <>Dołącz do pilotażu <ArrowRight size={18} /></>}
                          </button>
                          <div style={{ minHeight: 18, marginTop: 8 }}>
                            <p style={{ margin: 0, fontSize: 12, color: T.warn, opacity: submitError ? 1 : 0 }}>
                              {submitError || " "}
                            </p>
                          </div>
                      <p style={{ textAlign: "center", fontSize: 12, color: T.formPrivacy, lineHeight: 1.5 }}>
                        <Lock size={11} style={{ verticalAlign: "middle", marginRight: 4 }} />
                              Administratorem Twoich danych jest Klim Zavadski (KZ), NIP 6751776885, REGON 524256395. <br /> Szczegóły w{" "}
                        <a href={`${import.meta.env.BASE_URL}polityka_prywatnosci.pdf`} target="_blank" rel="noopener noreferrer" style={{ color: T.info, fontWeight: 600 }}>Polityce prywatności</a> i{" "}
                        <a href={`${import.meta.env.BASE_URL}regulamin_serwisu.pdf`} target="_blank" rel="noopener noreferrer" style={{ color: T.info, fontWeight: 600 }}>Regulaminie</a>.
                      </p>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "20px 0" }}>
                    <div style={{ width: 80, height: 80, borderRadius: "50%", background: `linear-gradient(135deg,${T.cta},${T.ctaHover})`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", boxShadow: `0 0 0 20px ${T.ctaDim}` }}>
                      <CheckCircle size={36} color="#fff" />
                    </div>
                    <h3 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 28, marginBottom: 12, color: T.textPrimary }}>Gotowe! Twoje dane zostały wysłane.</h3>
                    <p style={{ color: T.textSecondary, fontSize: 16 }}>
                      Skontaktujemy się z Tobą w najbliższym czasie.
                    </p>
                  </div>
                )}
              </div>
            </FadeIn>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section style={{ position: "relative", zIndex: 1, padding: "clamp(40px,6vw,80px) clamp(16px,4vw,48px)" }}>
          <div style={{ width: 120, height: 3, margin: "0 auto 48px", background: `linear-gradient(90deg,${T.cta},${T.info})`, borderRadius: 99 }} />
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <h2 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(26px,4vw,44px)", letterSpacing: "-0.03em", marginBottom: 12, color: T.textPrimary }}>Rent Standard vs. Tradycyjny najem</h2>
                <p style={{ color: T.textSecondary, fontSize: 16 }}>Sprawdź, co zyskujesz wybierając mądrzejsze rozwiązanie</p>
              </div>
              <div style={{ background: T.tableOuterBg, border: `1px solid ${T.tableOuterBorder}`, borderRadius: 20, overflow: "hidden" }}>
                <table className="compare-table" style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ background: T.tableHeadBg }}>
                      <th style={{ padding: "16px 20px", textAlign: "left", color: T.textMuted, fontSize: 13, fontWeight: 600, letterSpacing: ".06em", textTransform: "uppercase", borderBottom: `1px solid ${T.tableHeadBorder}` }}>Aspekt</th>
                      <th style={{ padding: "16px 20px", textAlign: "center", borderBottom: `1px solid ${T.tableHeadBorder}` }}>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                          <Shield size={15} color={T.cta} />
                          <span style={{ color: T.cta, fontWeight: 700, fontSize: 15 }}>Rent Standard</span>
                        </div>
                      </th>
                      <th style={{ padding: "16px 20px", textAlign: "center", borderBottom: `1px solid ${T.tableHeadBorder}`, color: T.textSecondary, fontSize: 15, fontWeight: 600 }}>Tradycyjny Najem</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Ochrona prawna umowy", "Profesjonalna, na miarę", "Generyczny wzór online"],
                      ["Weryfikacja tożsamości", "BIK + eIDAS, real-time", "Brak lub papierowa"],
                      ["Rozwiązywanie sporów", "Mediacja w 14 dni", "Sąd: 1–3 lata"],
                      ["Podpisanie umowy", "E-podpis zdalnie, 5 min", "Spotkanie osobiste"],
                      ["Archiwum dokumentów", "Bezpieczne, 10 lat", "Własna szuflada"],
                      ["Wsparcie 24/7", "Tak — czat + telefon", "Brak"],
                    ].map(([aspect, good, bad], i) => (
                      <tr key={i} style={{ borderBottom: `1px solid ${T.tableRowBorder}`, background: i % 2 === 0 ? "transparent" : T.tableRowAlt }}>
                        <td style={{ padding: "14px 20px", fontSize: 14, color: T.tableAspect, fontWeight: 500 }}>{aspect}</td>
                        <td style={{ padding: "14px 20px", textAlign: "center" }}>
                          <div
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 6,
                              background: T.ctaDim,
                              borderRadius: 999,
                              padding: "5px 12px",
                              border: `1px solid ${T.ctaBorder}`,
                              boxShadow: `0 0 0 1px ${T.ctaGlow}`,
                            }}
                          >
                            <CheckCircle size={14} color={isDark ? "#bbf7d0" : T.cta} />
                            <span
                              style={{
                                fontSize: 13,
                                color: isDark ? "#e0f2f1" : T.cta,
                                fontWeight: 700,
                                letterSpacing: 0.01,
                              }}
                            >
                              {good}
                            </span>
                          </div>
                        </td>
                        <td style={{ padding: "14px 20px", textAlign: "center" }}>
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: T.tableBadBg, borderRadius: 8, padding: "4px 10px" }}>
                            <XCircle size={14} color={T.tableBadIcon} />
                            <span style={{ fontSize: 13, color: T.tableBadColor }}>{bad}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </FadeIn>
          </div>
        </section>

          {/* SOCIAL PROOF (temporarily hidden) */}
          {/* <section style={{ position: "relative", zIndex: 1, padding: "clamp(40px,6vw,80px) clamp(16px,4vw,48px)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>
            <FadeIn>
              <div style={{ textAlign: "center", marginBottom: 40 }}>
                <h2 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(24px,4vw,42px)", letterSpacing: "-0.03em", color: T.textPrimary }}>Zaufali nam właściciele z całej Polski</h2>
              </div>
              <div className="proof-grid" style={{ display: "flex", gap: 20, marginBottom: 48 }}>
                {[
                  { quote: "Dzięki mediacji odzyskałem klucze w 10 dni. Byłem sceptyczny, ale profesjonalizm Rent Standard mnie zaskoczył.", name: "Marek", city: "Poznań", role: "Właściciel 2 mieszkań", stars: 5, accent: "cta", avF: T.cta, avT: T.ctaHover },
                  { quote: "Umowa okazjonalna bez wizyty u notariusza? Nie wierzyłam — a jednak. Polecam wszystkim wynajmującym.", name: "Anna", city: "Warszawa", role: "Prywatna wynajmująca", stars: 5, accent: "info", avF: T.info, avT: "#5A9AB8" },
                  { quote: "Mój najemca nie płacił 3 miesiące. Mediator rozwiązał sprawę bez sądu w dwa tygodnie. Genialne.", name: "Tomasz", city: "Kraków", role: "Portfel 5 nieruchomości", stars: 5, accent: "cta", avF: T.cta, avT: T.ctaHover },
                ].map((t, i) => (
                  <FadeIn key={i} delay={i * 0.1}>
                    <BentoCard accent={t.accent} style={{ flex: 1 }}>
                      <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                        {Array(t.stars).fill(0).map((_, j) => <Star key={j} size={14} color="#f59e0b" fill="#f59e0b" />)}
                      </div>
                      <p style={{ color: T.reviewQuote, fontSize: 15, lineHeight: 1.65, fontStyle: "italic", marginBottom: 18 }}>„{t.quote}"</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg,${t.avF},${t.avT})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: "#fff" }}>{t.name[0]}</div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 14, color: T.textPrimary }}>{t.name}, {t.city}</div>
                          <div style={{ color: T.reviewSubRole, fontSize: 12 }}>{t.role}</div>
                        </div>
                      </div>
                    </BentoCard>
                  </FadeIn>
                ))}
              </div>
              <div style={{ border: `1px solid ${T.partnerBorder}`, borderRadius: 16, padding: "24px 32px", background: T.partnerBg }}>
                <p style={{ textAlign: "center", color: T.partnerLabel, fontSize: 12, fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 20 }}>Certyfikacje i partnerzy</p>
                <div className="partner-logos" style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 40 }}>
                  {[
                    { name: "eIDAS", sub: "E-Podpis", color: T.cta },
                    { name: "PZU", sub: "Asystent", color: T.partnerSub },
                    { name: "BIK", sub: "Weryfikacja", color: T.partnerSub },
                    { name: "ISO 27001", sub: "Bezpieczeństwo", color: T.partnerSub },
                    { name: "RODO", sub: "Compliance", color: T.partnerSub },
                  ].map((p, i) => (
                    <div key={i} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 18, fontWeight: 700, color: p.color, letterSpacing: "-0.03em", opacity: 0.8 }}>{p.name}</div>
                      <div style={{ color: T.partnerSub, fontSize: 11 }}>{p.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section> */}

        {/* FINAL CTA */}
        <section style={{ position: "relative", zIndex: 1, padding: "clamp(40px,6vw,80px) clamp(16px,4vw,48px)" }}>
          <div style={{ maxWidth: 900, margin: "0 auto", textAlign: "center" }}>
            <FadeIn>
              <div style={{ width: 120, height: 3, margin: "0 auto 32px", background: `linear-gradient(90deg,${T.cta},${T.info})`, borderRadius: 99 }} />
              <h2 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(26px,4vw,50px)", letterSpacing: "-0.03em", marginBottom: 16, color: T.textPrimary }}>Zacznij wynajmować z gwarancją pewności</h2>
              <p style={{ color: T.finalSubtext, fontSize: "clamp(15px,2vw,18px)", maxWidth: 560, margin: "0 auto 36px" }}>
                Dołącz do 2 400+ właścicieli, którzy śpią spokojnie dzięki Rent Standard Polska.
              </p>
              <button onClick={scrollToForm} className="cta-btn pulse-btn" style={{ padding: "18px 36px", fontSize: 19, margin: "0 auto" }}>
                Chcę ochrony — zaczynam teraz <ArrowRight size={20} />
              </button>
            </FadeIn>
          </div>
        </section>

        {/* FOOTER */}
        <footer style={{ position: "relative", zIndex: 1, borderTop: `1px solid ${T.footerBorder}`, padding: "32px clamp(16px,4vw,48px)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ background: `linear-gradient(135deg,${T.info},${T.ctaHover})`, borderRadius: 8, width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={14} color="#fff" />
              </div>
              <span style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 16, fontWeight: 700, color: T.textPrimary }}>Rent Standard</span>
            </div>
            <p style={{ color: T.footerText, fontSize: 13 }}>© 2026 Klim Zavadski, firma KZ · info@rentstandard.pl</p>
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", alignItems: "center" }}>
              {[
                { label: "Regulamin", href: `${import.meta.env.BASE_URL}regulamin_serwisu.pdf`, external: true },
                { label: "Polityka prywatności", href: `${import.meta.env.BASE_URL}polityka_prywatnosci.pdf`, external: true },
                { label: "Kontakt", href: "mailto:info@rentstandard.pl", external: false },
              ].map(({ label, href, external }) => (
                <a key={label} href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} style={{ color: T.footerLink, fontSize: 13, textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => e.target.style.color = T.cta}
                  onMouseLeave={e => e.target.style.color = T.footerLink}
                >{label}</a>
              ))}
              <CookieFooterButton />
            </div>
          </div>
        </footer>
        </main>
        <CookieBanner />
        <CookiePreferencesModal />
      </div>
      </CookieConsentProvider>
    </ThemeCtx.Provider>
  );
}
