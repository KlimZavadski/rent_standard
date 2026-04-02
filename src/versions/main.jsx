import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Shield, ShieldCheck, CheckCircle, ArrowRight, Lock,
  Phone, Mail, User, Home, X,
  Scale, ChevronRight, Sun, Moon, Check,
  FileText, Handshake, Award, Users
} from "lucide-react";
import { getThemesForVariant, ThemeCtx, useT } from "../theme.js";
import { LANDING_VARIANTS } from "../landingVariants.js";
import {
  CookieConsentProvider,
  CookieBanner,
  CookiePreferencesModal,
  CookieFooterButton,
  identifySmartlookLead,
  trackSmartlookEvent,
  trackGaUiClick,
} from "../consent/index.js";
import shieldDarkImg from "../assets/images/shield_dark.png";
import shieldLightImg from "../assets/images/shield_light.png";

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

function ProblemCloud() {
  const T = useT();
  const [hovered, setHovered] = useState(null);
  const ALL_PROBLEMS = [
    "Po najemcy musisz robić remont za własne pieniądze?",
    "Najemca nie płaci, a Ty nic nie możesz zrobić?",
    "Umowa jest, ale eksmisja w praktyce niemożliwa?",
    "Konflikt = sąd, koszty i miesiące czekania?",
    "Szkody są, ale trudno je udowodnić?",
    "Kaucja nie pokrywa realnych strat?",
    "Wynajem mieszkania zamienia się w drugą pracę?",
    "Umowa z internetu nie chroni Cię przed stratami?",
  ];
  const [items] = useState(() => {
    const a = [...ALL_PROBLEMS];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  });
  const getPush = (idx, hovIdx) => {
    const diff = idx - hovIdx;
    const xSign = diff % 2 === 0 ? -1 : 1;
    const ySign = diff > 0 ? 1 : -1;
    const dist = Math.max(8, 18 - Math.abs(diff) * 2);
    return { x: xSign * dist, y: ySign * (dist * 0.7) };
  };
  return (
    <div className="tag-cloud">
      {items.map((text, i) => {
        const isActive = hovered === i;
        const isOther = hovered !== null && !isActive;
        const push = isOther ? getPush(i, hovered) : null;
        return (
          <div key={text} className={`tag-drift-${i % 3}`} style={{ animationPlayState: hovered !== null ? "paused" : "running" }}>
            <div
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              className="problem-pill"
              style={{
                background: T.warnBg,
                border: `1.5px solid ${isActive ? T.warn : T.warnBorder}`,
                color: T.warn,
                transform: isActive ? "scale(1.08)" : push ? `translate(${push.x}px,${push.y}px) scale(0.96)` : "scale(1)",
                opacity: isOther ? 0.4 : 1,
                boxShadow: isActive ? `0 8px 28px ${T.warnBorder}` : "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <X size={14} strokeWidth={2.5} style={{ flexShrink: 0 }} />
              {text}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FadeIn({ children, delay = 0 }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: `opacity 0.7s ease ${delay}s,transform 0.7s ease ${delay}s` }}>{children}</div>
  );
}

export default function ShortVariant({ variantId = "short_variant" }) {
  const location = useLocation();
  const [isDark, setIsDark] = useState(false);
  const themes = getThemesForVariant(variantId);
  const T = isDark ? themes.DARK : themes.LIGHT;
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [emailError, setEmailError] = useState(null);
  const [rodoChecked, setRodoChecked] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const formRef = useRef(null);
  const layoutRootRef = useRef(null);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const root = layoutRootRef.current;
    if (!root) return;
    const selector = 'button, a[href], [role="button"], [role="switch"]';
    const onClickCapture = (e) => {
      const raw = e.target;
      if (!(raw instanceof Element)) return;
      const node = raw.closest(selector);
      if (!node || !root.contains(node)) return;

      if (node.matches("a[href]")) {
        const href = node.getAttribute("href") || "";
        const elementText = (node.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120);
        trackGaUiClick({
          variant_id: variantId,
          click_type: "link",
          element_text: elementText,
          link_url: href,
        });
        return;
      }

      const elementText = (node.textContent || "").trim().replace(/\s+/g, " ").slice(0, 120);
      trackGaUiClick({
        variant_id: variantId,
        click_type: "button",
        element_text: elementText,
      });
    };
    root.addEventListener("click", onClickCapture, true);
    return () => root.removeEventListener("click", onClickCapture, true);
  }, [variantId]);

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
    input{background:${T.inputBg};border:1px solid ${T.inputBorder};border-radius:12px;color:${T.inputColor};font-family:Manrope,sans-serif;font-size:15px;padding:14px 16px;width:100%;transition:border-color 0.2s,background 0.2s;outline:none;}
    input:focus{border-color:${T.info};background:${T.inputFocusBg};}
    input::placeholder{color:${T.inputPlaceholder};}
    .tag-info{display:inline-flex;align-items:center;gap:6px;background:${T.tagInfoBg};border:1px solid ${T.tagInfoBorder};border-radius:99px;padding:4px 12px;color:${T.tagInfoColor};font-size:12px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;}
    .short-cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:20px;}
    .hero-heading-wrap{text-align:center;margin-bottom:40px;}
    @media(max-width:850px){.hero-heading-wrap{margin-bottom:20px;}}
    .value-section-heading{text-align:center;margin-bottom:48px;}
    @media(max-width:850px){.value-section-heading{margin-bottom:28px;}}
    .hero-columns{display:flex;gap:clamp(24px,3vw,40px);max-width:1100px;margin:0 auto 40px;align-items:flex-start;}
    .hero-col-left{flex:1 1 55%;min-width:0;}
    .hero-col-right{flex:1 1 40%;min-width:0;display:flex;flex-direction:column;gap:12px;}
    .hero-problems{display:flex;flex-direction:column;gap:12px;}
    .hero-problem-card{display:flex;align-items:center;gap:10px;background:${T.warnBg};border:1px solid ${T.warnBorder};border-radius:14px;padding:14px 20px;color:${T.warn};font-size:15px;font-weight:400;line-height:1.35;}
    .tag-cloud{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;padding:10px 0;}
    .tag-drift-0{animation:drift0 6s ease-in-out infinite;}
    .tag-drift-1{animation:drift1 7.2s ease-in-out infinite;}
    .tag-drift-2{animation:drift2 5.5s ease-in-out infinite;}
    @keyframes drift0{0%,100%{transform:translate(0,0) rotate(0deg);}33%{transform:translate(5px,-6px) rotate(0.7deg);}66%{transform:translate(-3px,4px) rotate(-0.4deg);}}
    @keyframes drift1{0%,100%{transform:translate(0,0) rotate(0deg);}33%{transform:translate(-5px,4px) rotate(-0.5deg);}66%{transform:translate(4px,-4px) rotate(0.3deg);}}
    @keyframes drift2{0%,100%{transform:translate(0,0) rotate(0deg);}33%{transform:translate(3px,5px) rotate(0.4deg);}66%{transform:translate(-4px,-3px) rotate(-0.6deg);}}
    .problem-pill{display:inline-flex;align-items:center;gap:8px;border-radius:99px;padding:10px 18px;font-size:13.5px;font-weight:500;line-height:1.3;cursor:default;user-select:none;transition:transform 0.5s cubic-bezier(.4,0,.2,1),opacity 0.4s ease,box-shadow 0.35s ease,border-color 0.3s ease;}
    .hero-levels{display:flex;flex-direction:column;gap:0;position:relative;padding-left:0;}
    .hero-levels::before{content:'';position:absolute;left:33px;top:28px;bottom:28px;width:2px;background:${T.ctaBorder};z-index:0;}
    .hero-level-item{position:relative;display:flex;align-items:center;gap:14px;padding:8px 14px;border-radius:14px;cursor:default;transition:background 0.25s,transform 0.25s,box-shadow 0.25s;z-index:1;min-height:calc(22px * 1.3 * 2 + 16px);}
    .hero-level-item:hover{background:${T.bentoCtaBg};transform:translateX(4px);box-shadow:0 8px 24px rgba(0,0,0,0.08);z-index:2;}
    .hero-level-num{position:relative;z-index:1;width:40px;height:40px;border-radius:99px;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:800;flex-shrink:0;color:${T.cta};background:color-mix(in srgb,${T.cta} 14%,${T.bg});border:1.5px solid ${T.ctaBorder};transition:all 0.25s;}
    .hero-level-item:hover .hero-level-num{background:${T.cta};color:#fff;border-color:${T.cta};}
    .hero-level-label{font-size:22px;font-weight:700;color:${T.textPrimary};line-height:1.3;}
    .hero-level-tooltip{position:absolute;right:0;top:calc(100% + 4px);transform:translateY(-4px);opacity:0;pointer-events:none;transition:opacity 0.22s,transform 0.22s;background:${T.bg};border:1px solid ${T.bentoNoneBorder};border-radius:12px;padding:12px 16px;font-size:13px;line-height:1.5;color:${T.textSecondary};width:50%;box-shadow:0 12px 32px rgba(0,0,0,0.14);z-index:20;text-align:left;font-weight:400;}
    .hero-level-item:hover .hero-level-tooltip{opacity:1;transform:translateY(0);pointer-events:auto;}
    @media(max-width:850px){.short-cards{grid-template-columns:1fr!important;}.hero-columns{flex-direction:column;}}
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

  const scrollToForm = (placement) => {
    trackSmartlookEvent("cta_click", { placement, variant_id: variantId });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };
  const isValidEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((s || "").trim());
  const validateEmail = () => {
    if (!formData.email) { setEmailError("Podaj adres e-mail."); return false; }
    if (!isValidEmail(formData.email)) { setEmailError("Nieprawidłowy format adresu e-mail."); return false; }
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
    if (!LEADS_ENDPOINT) { setSubmitError("Brak konfiguracji wysyłki."); return; }

    trackSmartlookEvent("cta_click", { placement: "form_submit", variant_id: variantId });

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
        data: JSON.stringify({ pageUrl: window.location.href, consent: true }),
      };
      const res = await fetch(LEADS_ENDPOINT, {
        method: "POST",
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
      identifySmartlookLead({
        email: payload.email,
        name: payload.name,
        phone: payload.phone,
      });
      setSubmitted(true);
    } catch (e) {
      const msg = (e && typeof e === "object" && "message" in e) ? e.message : String(e || "");
      setSubmitError(`Nie udało się wysłać formularza. ${msg}`.trim());
    } finally {
      setIsSubmitting(false);
    }
  };

  const VALUE_CARDS = [
    {
      icon: <FileText size={26} />, badge: "01", accent: "cta", iC: T.cta,
      title: "Umowa najmu",
      desc: "Nasza umowa najmu to nie zwykły szablon, lecz realne narzędzie ochrony, bez niejasnych i ogólnych zapisów. Została opracowana na podstawie rzeczywistych sporów i zabezpiecza kluczowe ryzyka, zanim jeszcze się pojawią. Jeśli warunki umowy zostaną naruszone, istnieją konkretne mechanizmy ich egzekwowania, w tym mediacja i procedury sądowe.\nJasne sankcje. Przejrzysty tryb powiadomień. Dokumentowanie naruszeń.",
      features: ["Klauzule chroniące kaucję i własność", "Podpis elektroniczny eIDAS", "Weryfikacja tożsamości najemcy", "Archiwum dokumentów 10 lat"],
    },
    {
      icon: <ShieldCheck size={26} />, badge: "02", accent: "info", iC: T.info,
      title: "Ubezpieczenie",
      desc: "Specjalna polisa ubezpieczeniowa chroni Twoje mienie i ogranicza straty finansowe związane z najmem. Ochrona obejmuje:\n - uszkodzenie mienia\n - straty wynikające z zaległości w płatnościach",
      features: ["Ochrona mienia właściciela", "Pokrycie strat z tytułu zaległości", "Polisa dopasowana do umowy"],
    },
    {
      icon: <Home size={26} />, badge: "03", accent: "cta", iC: T.cta,
      title: "Najem okazjonalny online",
      desc: "Adres do najmu okazjonalnego z gwarancją.\nZadbaj o większe bezpieczeństwo wynajmu okazjonalnego i chroń się przed sytuacją, w której lokator odmawia opuszczenia mieszkania.",
      features: ["Tryb okazjonalny (art. 19a)", "Oświadczenie najemcy online", "Komplet dokumentów w jednym miejscu"],
    },
    {
      icon: <Handshake size={26} />, badge: "04", accent: "info", iC: T.info,
      title: "Mediacja sporów",
      desc: "Profesjonalny mediator pomaga rozwiązać konflikt z najemcą bez sądu — szybko, poufnie i ze skutkiem prawnym. Ugoda jest wiążąca dla obu stron.",
      features: ["Certyfikowany mediator", "Rozwiązanie sporu w 14 dni", "Ugoda z mocą wyroku sądowego"],
    },
    {
      icon: <Scale size={26} />, badge: "05", accent: "cta", iC: T.cta,
      title: "Wsparcie prawne",
      desc: "Wsparcie prawne. Nasi doświadczeni prawnicy w możliwie najkrótszym czasie przeprowadzą procedury sądowe dotyczące dochodzenia odszkodowania, windykacji należności oraz eksmisji z lokalu, na specjalnych i korzystnych warunkach.",
      features: ["Partner prawny na wypadek eksmisji", "Prowadzenie sprawy sądowej", "Doradztwo na każdym etapie najmu"],
    },
  ];

  const FAQ_ITEMS = [
    {
      q: "Jakie poziomy ochrony najmu obejmuje usługa RentStandard?",
      a: `Oferujemy 5 poziomów ochrony:

· Ubezpieczenie – specjalne polisy dla najmu na korzystnych warunkach.
· Najem okazjonalny – szybkie przygotowanie dokumentów, które pozwalają przyspieszyć eksmisję nierzetelnych najemców.
· Mediacja – profesjonalni mediatorzy pomagają rozwiązać konflikt bez udziału sądu.
· Wsparcie prawne – prowadzimy niezbędne procedury sądowe w możliwie najkrótszym czasie.
· Kompleksowa obsługa na wszystkich etapach najmu (piąty poziom dostępny po aktywacji usługi).`,
    },
    {
      q: "Czym jest najem okazjonalny i dlaczego warto go stosować?",
      a: "Najem okazjonalny to szczególna forma najmu zgodna z polskim prawem. Jej główną zaletą jest możliwość eksmisji nierzetelnego najemcy w uproszczonym trybie, bez długotrwałego procesu sądowego. RentStandard pomaga szybko przygotować wszystkie wymagane dokumenty oraz zapewnia adresy niezbędne do zawarcia takiej umowy.",
    },
    {
      q: "Czy oferujecie pomoc prawną, jeśli konflikt z najemcą trafił już do sądu?",
      a: "Tak. Zapewniamy pełne wsparcie prawne w postępowaniu sądowym. Nasi specjaliści prowadzą wszystkie niezbędne procedury, aby skutecznie zabezpieczyć prawa właściciela w możliwie najkrótszym czasie.",
    },
    {
      q: "Czy mogę skorzystać z mediacji przed skierowaniem sprawy do sądu?",
      a: "Tak. Mediacja stanowi osobny poziom ochrony. W przypadku konfliktu nasi profesjonalni mediatorzy pomagają wypracować rozwiązanie bez udziału sądu, szybko i efektywnie, co pozwala oszczędzić czas, nerwy i koszty.",
    },
    {
      q: "Czy moje dane są bezpieczne i jak wygląda testowy etap działania usługi?",
      a: "Tak. Gwarantujemy wysoki poziom bezpieczeństwa danych, pełną zgodność z wymaganiami eIDAS (elektroniczne potwierdzenie podpisów i dokumentów) oraz RODO.\n\nObecnie usługa działa w trybie testowym – stopniowo wdrażamy pierwszych użytkowników, kładąc szczególny nacisk na ochronę danych osobowych oraz transparentność ich przetwarzania.",
    },
  ];

  return (
    <ThemeCtx.Provider value={T}>
      <CookieConsentProvider>
      <div ref={layoutRootRef} style={{ background: T.bg, minHeight: "100vh", fontFamily: "Manrope,system-ui,sans-serif", color: T.textPrimary, transition: "background 0.4s,color 0.4s" }}>
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
                    const isActive =
                      location.pathname === path
                      || (path !== "/" && location.pathname.startsWith(`${path}/`));
                    return (
                      <Link key={id} to={path} style={{
                        padding: "4px 4px", borderRadius: 8, fontSize: 14,
                        fontWeight: isActive ? 700 : 600,
                        color: isActive ? T.cta : T.textSecondary,
                        textDecoration: "none",
                        background: isActive ? T.ctaDim : "transparent",
                        border: `1px solid ${isActive ? T.ctaBorder : "transparent"}`,
                        transition: "color 0.2s, background 0.2s",
                      }}>{label}</Link>
                    );
                  })}
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button onClick={() => { const next = !isDark; setIsDark(next); trackSmartlookEvent("theme_change", { theme: next ? "dark" : "light", variant_id: variantId }); }} style={{ background: T.toggleBg, border: `1px solid ${T.toggleBorder}`, borderRadius: 99, padding: "7px 10px", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: T.textSecondary, fontSize: 13, fontWeight: 600, fontFamily: "Manrope,sans-serif", transition: "all 0.25s", flexShrink: 0 }}>
                {isDark ? <><Sun size={15} color="#f59e0b" /><span className="toggle-label" style={{ color: "#f59e0b" }}>Jasny</span></> : <><Moon size={15} color={T.info} /><span className="toggle-label" style={{ color: T.info }}>Ciemny</span></>}
              </button>
              <button onClick={() => scrollToForm("nav")} className="cta-btn" style={{ padding: "10px 20px", fontSize: 15 }}>
                <span className="nav-cta-text">Dołącz do pilotażu</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </nav>

        <main style={{ overflowX: "hidden" }}>
          {/* HERO */}
            <section style={{ position: "relative", zIndex: 1, padding: "clamp(15px,2.78vw,40px) clamp(16px,4vw,48px) clamp(40px,5vw,64px)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <div className="hero-heading-wrap">
                  {/* <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: T.tagInfoBg, border: `1px solid ${T.tagInfoBorder}`, borderRadius: 99, padding: "8px 20px", marginBottom: 18, fontSize: 13, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", color: T.tagInfoColor }}>
                  <Home size={16} strokeWidth={2.2} />
                  Platforma dla ubezpieczenia wynajmującego
                </div> */}
                <h1 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(36px,5.5vw,64px)", lineHeight: 1.05, letterSpacing: "-0.04em", marginBottom: 16, color: T.textPrimary }}>
                    <span style={{ color: T.info }}>Serwis</span> ochrony najmu mieszkań
                </h1>
                  <p style={{ color: T.textSecondary, fontSize: "clamp(15px,2vw,20px)", lineHeight: 1.55, maxWidth: 700, marginLeft: "auto", marginRight: "auto" }}>
                    Zyskaj dostęp do ekspercką umowę najmu z RentStandard i dołącz sie do 5 poziomów ochrony najmu na korzystnych warunkach
                </p>
              </div>

                <div className="hero-columns">
                  {/* Left — 5 levels */}
                  <div className="hero-col-left">
                    <div style={{ marginBottom: 20, paddingLeft: 68 }}>
                      <div className="tag-info" style={{ display: "inline-flex", fontSize: 18, padding: "8px 18px", gap: 10 }}>
                        <Shield size={20} /> 5 poziomów ochrony wynajmującego
                      </div>
                    </div>
                    <div className="hero-levels">
                    {[
                        { title: "Ekspercka i wykonalna umowa najmu oraz podpis elektroniczny", desc: "Zweryfikowana w praktyce sądowej, opracowana przez prawników z 11-letnim doświadczeniem w najmie. Podpis elektroniczny." },
                        { title: "Ubezpieczenie", desc: "Specjalne polisy ubezpieczeniowe dla najmu na korzystnych warunkach — ochrona przed szkodami i brakiem płatności." },
                        { title: "Najem okazjonalny", desc: "Szybkie przygotowanie dokumentów do zawarcia najmu okazjonalnego online — uproszczona eksmisja nierzetelnego najemcy." },
                        { title: "Mediacja", desc: "Profesjonalni mediatorzy pomogą polubownie rozwiązać spór bez sądu, w możliwie najkrótszym czasie." },
                        { title: "Wsparcie prawne", desc: "Doświadczeni prawnicy przeprowadzą niezbędne procedury sądowe, chroniąc Twoje interesy." },
                    ].map((item, i) => (
                      <div key={i} className="hero-level-item">
                        <div className="hero-level-num">{i + 1}</div>
                        <div className="hero-level-label">{item.title}</div>
                        <div className="hero-level-tooltip">{item.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>

                  {/* Right — problem cloud */}
                  <div className="hero-col-right">
                    <ProblemCloud />
                </div>
              </div>

              <div style={{ textAlign: "center" }}>
                <button onClick={() => scrollToForm("hero")} className="cta-btn pulse-btn" style={{ padding: "18px 32px", fontSize: 18 }}>
                  Dołącz do pilotażu <ArrowRight size={18} />
                </button>

                {/* Trust badges */}
                <div style={{ marginTop: 28, display: "flex", flexDirection: "column", gap: 12, alignItems: "center" }} className="hero-trust-wrap">
                  <div style={{ display: "flex", alignItems: "center", gap: 10, background: T.ctaDim, border: `1px solid ${T.ctaBorder}`, borderRadius: 99, padding: "8px 20px" }}>
                    <Users size={18} color={T.cta} />
                    <span style={{ fontSize: 20, fontWeight: 800, color: T.cta, fontFamily: "Inter Tight,sans-serif" }}>2 400+</span>
                    <span style={{ fontSize: 14, color: T.textSecondary }}>chronionych właścicieli</span>
                  </div>
                  <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", color: T.badgesColor, fontSize: 12 }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Award size={12} /> Zgodność z eIDAS</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}><Scale size={12} /> RODO 100%</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* VALUE CARDS */}
          <section style={{ position: "relative", zIndex: 1, padding: "clamp(32px,4.8vw,64px) clamp(16px,4vw,48px)", paddingTop: "clamp(26px,3.8vw,52px)" }}>
            <div style={{ maxWidth: 1200, margin: "0 auto" }}>
              <FadeIn>
                <div className="value-section-heading">
                  <div className="tag-info" style={{ marginBottom: 14, display: "inline-flex" }}>Jak to działa</div>
                  <h2 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.1, letterSpacing: "-0.03em", color: T.textPrimary }}>Pięć poziomów Twojej ochrony</h2>
                </div>
              </FadeIn>
              <div className="short-cards">
                {VALUE_CARDS.map((card, i) => (
                  <FadeIn key={i} delay={i * 0.12}>
                    <BentoCard accent={card.accent} style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                        <div style={{ background: `${card.iC}18`, border: `1px solid ${card.iC}40`, borderRadius: 14, padding: 12, display: "flex" }}>
                          <span style={{ color: card.iC }}>{card.icon}</span>
                        </div>
                        <span style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 40, color: `${card.iC}20`, fontWeight: 700, lineHeight: 1 }}>{card.badge}</span>
                      </div>
                      <h3 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: 24, marginBottom: 12, color: T.textPrimary, lineHeight: 1.25 }}>{card.title}</h3>
                      <p style={{ color: T.pillarDesc, fontSize: 15, lineHeight: 1.7, marginBottom: 20, whiteSpace: "pre-line" }}>{card.desc}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {card.features.map((f, j) => (
                          <div key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <CheckCircle size={14} color={card.iC} />
                            <span style={{ fontSize: 14, color: T.pillarFeat, lineHeight: 1.6 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </BentoCard>
                  </FadeIn>
                ))}
              </div>
            </div>
          </section>

          {/* LEAD FORM */}
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
                              alt="Ikona tarczy symbolizująca ochronę najmu"
                              style={{ width: 80, height: "auto", maxWidth: "100%", objectFit: "contain" }}
                              className="form-shield-img"
                            />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <h2 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(28px,4vw,36px)", letterSpacing: "-0.03em", marginBottom: 8, color: T.textPrimary }}>
                              Zabezpiecz swój najem
                            </h2>
                            <p className="form-sub-desktop" style={{ color: T.textSecondary, fontSize: 15, lineHeight: 1.6 }}>
                              Uruchomienie serwisu planowane jest na <strong style={{ color: T.cta }}>2026</strong> rok.{" "}
                              <strong style={{ color: T.cta }}>Pierwsi użytkownicy</strong> zyskają specjalne warunki i realny wpływ na jego rozwój
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
                                width: 20, height: 20, borderRadius: 6, flexShrink: 0,
                                background: rodoChecked ? T.cta : "transparent",
                                border: `2px solid ${rodoChecked ? T.cta : T.checkboxBorder}`,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                marginTop: 2, transition: "all 0.2s", cursor: "pointer",
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
                              padding: "18px 28px", fontSize: 18, justifyContent: "center", marginTop: 8,
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

          {/* MINI FAQ */}
          <section style={{ position: "relative", zIndex: 1, padding: "clamp(40px,6vw,80px) clamp(16px,4vw,48px)" }}>
            <div style={{ width: 120, height: 3, margin: "0 auto 48px", background: `linear-gradient(90deg,${T.cta},${T.info})`, borderRadius: 99 }} />
            <div style={{ maxWidth: 800, margin: "0 auto" }}>
              <FadeIn>
                <div className="value-section-heading">
                  <div className="tag-info" style={{ marginBottom: 14, display: "inline-flex" }}>FAQ</div>
                  <h2 style={{ fontFamily: "Inter Tight,sans-serif", fontSize: "clamp(28px,4vw,44px)", lineHeight: 1.1, letterSpacing: "-0.03em", color: T.textPrimary }}>Najczęstsze pytania</h2>
                </div>
              </FadeIn>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {FAQ_ITEMS.map((item, i) => {
                  const isOpen = openFaq === i;
                  return (
                    <FadeIn key={i} delay={i * 0.08}>
                      <div style={{
                        background: T.bentoNoneBg,
                        border: `1px solid ${isOpen ? T.cta : T.bentoNoneBorder}`,
                        borderRadius: 20, overflow: "hidden", backdropFilter: "blur(12px)",
                        boxShadow: isOpen ? `0 8px 32px ${T.bentoGlow}` : "0 2px 12px rgba(0,0,0,0.04)",
                        transition: "all 0.35s cubic-bezier(.4,0,.2,1)",
                      }}>
                        <button
                          onClick={() => {
                            if (!isOpen) {
                              trackSmartlookEvent("faq_open", { variant_id: variantId, faq_index: i });
                            }
                            setOpenFaq(isOpen ? null : i);
                          }}
                          style={{
                            width: "100%", padding: "22px 28px", background: "none",
                            border: "none", cursor: "pointer", display: "flex",
                            alignItems: "center", gap: 18, textAlign: "left",
                          }}
                        >
                          <span style={{
                            flexShrink: 0, width: 36, height: 36, borderRadius: 10,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: isOpen ? `${T.cta}18` : `${T.info}12`,
                            border: `1px solid ${isOpen ? `${T.cta}40` : `${T.info}25`}`,
                            fontFamily: "Inter Tight,sans-serif", fontSize: 14, fontWeight: 800,
                            color: isOpen ? T.cta : T.textMuted, transition: "all 0.3s ease",
                          }}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span style={{ flex: 1, fontSize: "clamp(15px,2vw,17px)", fontWeight: 600, color: T.textPrimary, lineHeight: 1.4, fontFamily: "Inter Tight,sans-serif" }}>
                            {item.q}
                          </span>
                          <ChevronRight
                            size={18}
                            color={isOpen ? T.cta : T.textMuted}
                            style={{ flexShrink: 0, transform: isOpen ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.3s ease, color 0.3s ease" }}
                          />
                        </button>
                        <div style={{
                          maxHeight: isOpen ? 2000 : 0, opacity: isOpen ? 1 : 0,
                          overflow: "hidden", transition: "max-height 0.4s cubic-bezier(.4,0,.2,1), opacity 0.3s ease",
                        }}>
                          <div style={{ padding: "0 28px 24px 82px" }}>
                            <div style={{ width: 40, height: 2, background: `linear-gradient(90deg,${T.cta},transparent)`, borderRadius: 99, marginBottom: 14 }} />
                            <p style={{ margin: 0, color: T.textSecondary, fontSize: 15, lineHeight: 1.75, whiteSpace: "pre-line" }}>{item.a}</p>
                          </div>
                        </div>
                      </div>
                    </FadeIn>
                  );
                })}
              </div>
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
