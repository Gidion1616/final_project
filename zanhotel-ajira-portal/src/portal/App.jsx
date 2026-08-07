import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  FiArrowRight,
  FiBriefcase,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiFilter,
  FiHash,
  FiHome,
  FiImage,
  FiLock,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiMenu,
  FiPhone,
  FiSearch,
  FiSettings,
  FiShield,
  FiUser,
  FiUsers,
  FiX,
} from "react-icons/fi";
import { FaBirthdayCake, FaHotel, FaVenusMars } from "react-icons/fa";
import {
  FaFacebookF,
  FaGoogle,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { api, session } from "./api";

/*
 * MWONGOZO WA FUNCTION ZA FRONTEND
 * --------------------------------
 * useLoad: huchukua data kutoka API na kufuatilia loading pamoja na error.
 * Notice: huonyesha ujumbe wa mafanikio au hitilafu kwa mtumiaji.
 * Status: huonyesha badge ya pending, accepted, rejected, active au inactive.
 * Logo, Header, SocialLinks, Layout: nembo, navigation, mitandao na footer.
 * JobCard: kadi moja ya ajira yenye hoteli, eneo na kitufe cha kuomba.
 * Home: ukurasa wa mwanzo na ajira zilizowekwa ndani ya siku tano.
 * Jobs: ukurasa wa kutafuta na kuchuja ajira kwa category.
 * JobDetail: maelezo, ramani na kitendo cha kuomba ajira.
 * Register na field components: hukusanya taarifa na mafaili ya usajili.
 * Login: hutuma username/password na kuhifadhi session iliyopokelewa.
 * Protected: huzuia route ikiwa role ya mtumiaji hairuhusiwi.
 * DashLayout: sidebar na sehemu ya pamoja ya dashboard zote.
 * SeekerDash/Applications/Profile/JobBrowser: eneo la Job Seeker.
 * HotelDash/HotelJobs/EditJob/HotelApplications/Applicant: eneo la hoteli.
 * AdminDash/AdminList/AdminSettings: eneo la usimamizi wa Wizara.
 * Title, Panel, Stat, Empty, Loader: vipande vidogo vinavyotumika tena.
 * App: huunganisha kila URL na page yake na kulinda private routes.
 */

const categories = [
  "Reception",
  "Housekeeping",
  "Food & Beverage",
  "Kitchen",
  "Security",
  "Management",
  "Spa & Wellness",
  "Maintenance",
];
// Custom hook hii husoma endpoint na kusasisha data, loading na error.
function useLoad(path, deps = []) {
  const [state, set] = useState({ data: null, error: "", loading: true });
  useEffect(() => {
    let live = true;
    set((x) => ({ ...x, loading: true }));
    api(path)
      .then((data) => live && set({ data, error: "", loading: false }))
      .catch(
        (e) => live && set({ data: null, error: e.message, loading: false }),
      );
    return () => {
      live = false;
    };
  }, deps);
  return state;
}
// Component ndogo ya kuonyesha ujumbe wa kawaida au ujumbe wa hitilafu.
function Notice({ error, children }) {
  return error ? (
    <div className="notice error">{error}</div>
  ) : children ? (
    <div className="notice">{children}</div>
  ) : null;
}
// Hubadilisha thamani ya status kuwa badge yenye rangi inayofaa.
function Status({ value }) {
  return <span className={`status ${value}`}>{value}</span>;
}
// Huonyesha nembo; inverse hutumika kwenye background yenye rangi nzito.
function Logo({ inverse = false }) {
  return (
    <span className={`brand ${inverse ? "inverse" : ""}`}>
      <img src="/zanhotel-logo.jpeg" alt="ZanHotel Ajira Portal" />
      <div>
        ZANHOTEL<small>AJIRA PORTAL</small>
      </div>
    </span>
  );
}
// Link rasmi za utalii; target na rel hufungua tab mpya kwa usalama.
function SocialLinks() {
  const links = [
    [
      "YouTube",
      "https://www.youtube.com/channel/UCfMkz9xaQuN3JdmVGzaCEGg",
      FaYoutube,
    ],
    [
      "Facebook",
      "https://www.facebook.com/ZanzibarToursm?fref=ts",
      FaFacebookF,
    ],
    ["Twitter", "https://twitter.com/znzibartourism", FaTwitter],
    ["Google", "https://zct.co.tz/", FaGoogle],
    ["Instagram", "https://www.instagram.com/zanzibar_tourism", FaInstagram],
  ];
  return (
    <div className="social-links">
      {links.map(([label, url, Icon]) => (
        <a
          key={label}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
        >
          <Icon />
        </a>
      ))}
    </div>
  );
}
// Navigation ya juu hubadilika kulingana na session na ukubwa wa screen.
function Header() {
  const [open, setOpen] = useState(false);
  const s = session.get();
  const logout = () => {
    session.clear();
    location.href = "/";
  };
  return (
    <header>
      <Link to="/">
        <Logo />
      </Link>
      <button className="mobile" onClick={() => setOpen(!open)}>
        {open ? <FiX /> : <FiMenu />}
      </button>
      <nav className={open ? "open" : ""}>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/jobs">Find jobs</NavLink>
        <NavLink to="/about">About</NavLink>
        {s ? (
          <>
            <NavLink to={`/${s.user.role}/dashboard`}>Dashboard</NavLink>
            <button className="link" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login">Sign in</NavLink>
            <Link className="btn small" to="/register">
              Create account
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
// Layout huweka Header, content ya page na Footer kuzunguka page za umma.
function Layout({ children }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <footer>
        <Logo inverse />
        <div className="footer-message">
          <p>Connecting Zanzibar hospitality talent with trusted employers.</p>
          <SocialLinks />
        </div>
        <p>© {new Date().getFullYear()} Ministry of Tourism, Zanzibar</p>
      </footer>
    </>
  );
}
// Kadi hii hutafsiri object ya job kuwa muonekano unaoweza kubonyezwa.
function JobCard({ job }) {
  const s = session.get();
  const nav = useNavigate();
  const apply = () =>
    nav(
      s?.user?.role === "jobseeker"
        ? `/jobs/${job.id}`
        : s
          ? `/${s.user.role}/dashboard`
          : `/register?next=/jobs/${job.id}`,
    );
  return (
    <article className="job-card">
      <div className="hotel-pic">
        {job.hotel.image ? <img src={job.hotel.image} /> : <FiBriefcase />}
      </div>
      <div className="job-main">
        <div className="eyebrow">
          {job.category} · {new Date(job.created_at).toLocaleDateString()}
        </div>
        <h3>{job.title}</h3>
        <p className="company">{job.hotel.name}</p>
        <div className="meta">
          <span>
            <FiMapPin />
            {job.hotel.location}
          </span>
          <span>
            <FiBriefcase />
            {job.experience}
          </span>
          <span>
            <FiUsers />
            {job.gender}
          </span>
        </div>
      </div>
      <div className="job-action">
        <small>Apply by</small>
        <strong>{new Date(job.deadline).toLocaleDateString()}</strong>
        <button className="btn" onClick={apply}>
          View & apply <FiArrowRight />
        </button>
      </div>
    </article>
  );
}
/*
 * HOME PAGE RECENT JOBS / AJIRA MPYA ZA HOME
 * EN: Home requests /jobs/?recent=1, so it receives only newly posted jobs.
 * SW: Home huomba /jobs/?recent=1, hivyo hupokea ajira zilizowekwa karibuni pekee.
 * EN: Django applies a three-day created_at window; React does not delete any job.
 * SW: Django huchuja created_at ya siku tatu; React haifuti ajira yoyote.
 * EN: After day three the job disappears here but remains searchable on Jobs.
 * SW: Baada ya siku tatu ajira huondoka Home lakini huendelea kuonekana Jobs page.
 */
function Home() {
  const { data } = useLoad("/jobs/?recent=1");
  const { data: home } = useLoad("/site-content/");
  return (
    <Layout>
      <section className="hero">
        <div>
          <span className="pill">
            {home?.hero_eyebrow || "Zanzibar's hospitality careers platform"}
          </span>
          <h1>{home?.hero_title || "Your next opportunity starts here."}</h1>
          <p>
            {home?.hero_subtitle ||
              "Discover verified hotel vacancies across Zanzibar. Build your profile once, apply with confidence."}
          </p>
          <div className="hero-actions">
            <Link className="btn" to="/jobs">
              Explore vacancies <FiArrowRight />
            </Link>
            <Link className="btn ghost" to="/register">
              Create your profile
            </Link>
          </div>
          <div className="trust">
            <span>
              <FiCheckCircle /> Verified hotels
            </span>
            <span>
              <FiCheckCircle /> Ministry supported
            </span>
            <span>
              <FiCheckCircle /> Free for job seekers
            </span>
          </div>
        </div>
        <div className="hero-image">
          <img
            src={home?.hero_image || "/images/hotel-staff.png"}
            alt="Zanzibar hospitality careers"
          />
          <div className="floating">
            <FiBriefcase />
            <div>
              <strong>{data?.results?.length || 0} new roles</strong>
              <small>posted in the last 3 days</small>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="section-head">
          <div>
            <span className="eyebrow">Fresh opportunities</span>
            <h2>Recently posted jobs</h2>
          </div>
          <Link to="/jobs">
            View all jobs <FiArrowRight />
          </Link>
        </div>
        <div className="jobs">
          {data?.results?.slice(0, 5).map((j) => (
            <JobCard key={j.id} job={j} />
          ))}
          {data && !data.results.length && (
            <Empty text="No recent vacancies yet. Check the full jobs page." />
          )}
        </div>
      </section>
      <section className="how">
        <span className="eyebrow">Simple by design</span>
        <h2>From profile to placement</h2>
        <div className="steps">
          {[
            [
              "01",
              "Create your profile",
              "Add your details and verified documents once.",
            ],
            [
              "02",
              "Find the right role",
              "Search trusted vacancies by category and location.",
            ],
            [
              "03",
              "Apply and track",
              "Apply instantly and follow employer feedback.",
            ],
          ].map((x) => (
            <div key={x[0]}>
              <b>{x[0]}</b>
              <h3>{x[1]}</h3>
              <p>{x[2]}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
/*
 * ALL JOBS PAGE / UKURASA WA AJIRA ZOTE
 * EN: This page calls /jobs without recent=1, therefore it is not limited to 3 days.
 * SW: Page hii huita /jobs bila recent=1, hivyo haizuiliwi na muda wa siku 3.
 * EN: Search text and category are kept in React state and sent to Django as query data.
 * SW: Search na category huhifadhiwa kwenye state na kutumwa Django kama query data.
 * EN/SW: Active, unexpired jobs stay here / Ajira hai zenye deadline hubaki hapa.
 */
function Jobs() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const { data, loading, error } = useLoad(
    `/jobs/?q=${encodeURIComponent(q)}&category=${encodeURIComponent(cat)}`,
    [q, cat],
  );
  return (
    <Layout>
      <section className="page-title">
        <span className="eyebrow">Open opportunities</span>
        <h1>Find your place in hospitality</h1>
        <p>Search active vacancies from Ministry-approved hotels.</p>
      </section>
      <section className="section compact">
        <div className="search">
          <FiSearch />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title, hotel, or location…"
          />
          <FiFilter />
          <select value={cat} onChange={(e) => setCat(e.target.value)}>
            <option value="">All categories</option>
            {(data?.categories || categories).map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="tags">
          <button className={!cat ? "active" : ""} onClick={() => setCat("")}>
            All roles
          </button>
          {categories.map((c) => (
            <button
              className={cat === c ? "active" : ""}
              onClick={() => setCat(c)}
              key={c}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="result-count">
          {data?.results?.length || 0} vacancies found
        </p>
        <Notice error={error} />
        {loading ? (
          <Loader />
        ) : (
          <div className="jobs">
            {data?.results.map((j) => (
              <JobCard key={j.id} job={j} />
            ))}
            {!data?.results.length && (
              <Empty text="No jobs match your search." />
            )}
          </div>
        )}
      </section>
    </Layout>
  );
}
// JobDetail huonyesha taarifa kamili, ramani na kutuma ombi la kazi.
function JobDetail() {
  const { id } = useParams();
  const nav = useNavigate();
  const { data, error } = useLoad(`/jobs/${id}/`, [id]);
  const [msg, setMsg] = useState("");
  async function apply() {
    const s = session.get();
    if (!s) {
      nav(`/login?next=/jobs/${id}`);
      return;
    }
    if (s.user.role !== "jobseeker") {
      setMsg("Only Job Seeker accounts can apply.");
      return;
    }
    try {
      const r = await api(`/jobs/${id}/apply/`, { method: "POST" });
      setMsg(r.detail);
    } catch (e) {
      setMsg(e.message);
    }
  }
  if (!data)
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  return (
    <Layout>
      <section className="detail">
        <Link to="/jobs">← Back to jobs</Link>
        <div className="detail-grid">
          <article className="panel">
            <span className="pill">{data.category}</span>
            <h1>{data.title}</h1>
            <h3>{data.hotel.name}</h3>
            <div className="meta">
              <span>
                <FiMapPin />
                {data.hotel.location}
              </span>
              <span>
                <FiBriefcase />
                {data.experience}
              </span>
              <span>
                <FiUsers />
                {data.gender}
              </span>
            </div>
            <hr />
            <h2>About the role</h2>
            <p className="pre">{data.description}</p>
          </article>
          <aside className="panel apply-box">
            <h3>Interested in this role?</h3>
            <p>
              Your saved profile and documents will be submitted automatically.
            </p>
            <button className="btn full" onClick={apply}>
              Apply now <FiArrowRight />
            </button>
            <Notice error={error}>{msg}</Notice>
            <hr />
            <small>Application deadline</small>
            <strong>{new Date(data.deadline).toLocaleDateString()}</strong>
            {data.hotel.latitude && (
              <iframe
                title="Hotel location"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(data.hotel.longitude) - 0.02},${Number(data.hotel.latitude) - 0.02},${Number(data.hotel.longitude) + 0.02},${Number(data.hotel.latitude) + 0.02}&marker=${data.hotel.latitude},${data.hotel.longitude}`}
              />
            )}
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(data.hotel.location)}`}
            >
              View location on map
            </a>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
/*
 * REGISTRATION / USAJILI
 * EN: The user first chooses Job Seeker or Hotel, which changes the visible fields.
 * SW: Mtumiaji huchagua Job Seeker au Hotel na fields hubadilika kulingana na chaguo.
 * EN: FormData is used because photos, CVs, certificates and licenses are binary files.
 * SW: FormData hutumika kwa kuwa picha, CV, certificates na leseni ni mafaili.
 * EN: Django performs final validation; success redirects the person to Login.
 * SW: Django hufanya uhakiki wa mwisho; mafanikio humpeleka mtumiaji Login.
 */
function Register() {
  const [type, setType] = useState("jobseeker");
  const [msg, setMsg] = useState("");
  const nav = useNavigate();
  async function submit(e) {
    e.preventDefault();
    setMsg("");
    const f = new FormData(e.currentTarget);
    try {
      const r = await api(`/auth/register/${type}/`, {
        method: "POST",
        body: f,
      });
      setMsg(r.detail);
      setTimeout(() => nav("/login"), 1400);
    } catch (x) {
      setMsg(x.message);
    }
  }
  return (
    <Layout>
      <section className="auth wide">
        <div className="auth-intro">
          <span className="eyebrow">Join the platform</span>
          <h1>
            {type === "jobseeker"
              ? "Build a profile employers can trust."
              : "Register your hotel."}
          </h1>
          <p>
            {type === "jobseeker"
              ? "Upload your credentials once and use them for every application."
              : "Self-registered hotels remain inactive until the Ministry verifies and approves the account."}
          </p>
        </div>
        <form className="form panel" onSubmit={submit}>
          <div className="switch">
            <button
              type="button"
              className={type === "jobseeker" ? "active" : ""}
              onClick={() => setType("jobseeker")}
            >
              Job Seeker
            </button>
            <button
              type="button"
              className={type === "hotel" ? "active" : ""}
              onClick={() => setType("hotel")}
            >
              Hotel
            </button>
          </div>
          <h2>
            {type === "jobseeker"
              ? "Create job seeker account"
              : "Hotel registration"}
          </h2>
          {type === "jobseeker" ? <JobseekerFields /> : <HotelFields />}
          <label>
            <FieldTitle icon={FiUser}>Username</FieldTitle>
            <input name="username" required />
          </label>
          <div className="two">
            <label>
              <FieldTitle icon={FiLock}>Password</FieldTitle>
              <input type="password" name="password" minLength="8" required />
            </label>
            {type === "jobseeker" && (
              <label>
                <FieldTitle icon={FiLock}>Confirm password</FieldTitle>
                <input type="password" name="confirm_password" required />
              </label>
            )}
          </div>
          <button className="btn full">Submit registration</button>
          <Notice>{msg}</Notice>
          <p className="center">
            <Link to="/forgot-password">Forgot password?</Link>
          </p>
          <p className="center">
            Already registered? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </section>
    </Layout>
  );
}
// FieldTitle huunganisha icon na jina la field kwa muonekano unaofanana.
function FieldTitle({ icon: Icon, children }) {
  return (
    <span className="field-title">
      <Icon />
      {children}
    </span>
  );
}
// Fields zote binafsi na nyaraka zinazohitajika kwa Job Seeker.
function JobseekerFields() {
  return (
    <>
      <div className="two">
        <label>
          <FieldTitle icon={FiUser}>Full name</FieldTitle>
          <input name="full_name" required />
        </label>
        <label>
          <FieldTitle icon={FiMail}>Email address</FieldTitle>
          <input type="email" name="email" required />
        </label>
        <label>
          <FieldTitle icon={FiPhone}>Phone number</FieldTitle>
          <input name="phone" placeholder="+255…" required />
        </label>
        <label>
          <FieldTitle icon={FiMapPin}>Address</FieldTitle>
          <input name="address" required />
        </label>
        <label>
          <FieldTitle icon={FaBirthdayCake}>Date of birth</FieldTitle>
          <input type="date" name="date_of_birth" required />
        </label>
        <label>
          <FieldTitle icon={FaVenusMars}>Gender</FieldTitle>
          <select name="gender" required>
            <option value="">Select</option>
            <option>Female</option>
            <option>Male</option>
            <option>Other</option>
          </select>
        </label>
      </div>
      <div className="upload-grid">
        <File
          name="photo"
          text="Full-size photo"
          accept="image/*"
          icon={FiImage}
        />
        <File name="cv" text="CV (PDF)" />
        <File
          name="recommendation_letter"
          text="Ministry recommendation (PDF)"
        />
        <File name="academic_certificates" text="Academic certificates (PDF)" />
        <File
          name="other_certificates"
          text="Other certificates (optional)"
          optional
        />
      </div>
    </>
  );
}
// Fields za biashara, leseni na coordinate za ramani ya hoteli.
function HotelFields() {
  return (
    <>
      <div className="two">
        <label>
          <FieldTitle icon={FaHotel}>Hotel name</FieldTitle>
          <input name="name" required />
        </label>
        <label>
          <FieldTitle icon={FiMail}>Email address</FieldTitle>
          <input type="email" name="email" required />
        </label>
        <label>
          <FieldTitle icon={FiPhone}>Phone number</FieldTitle>
          <input name="phone" required />
        </label>
        <label>
          <FieldTitle icon={FiMapPin}>Address / location</FieldTitle>
          <input name="location" placeholder="e.g. Nungwi, Zanzibar" required />
        </label>
        <label>
          <FieldTitle icon={FiMapPin}>Latitude</FieldTitle>
          <input
            type="number"
            step="any"
            min="-90"
            max="90"
            name="latitude"
            placeholder="e.g. -5.7262"
            required
          />
        </label>
        <label>
          <FieldTitle icon={FiMapPin}>Longitude</FieldTitle>
          <input
            type="number"
            step="any"
            min="-180"
            max="180"
            name="longitude"
            placeholder="e.g. 39.2987"
            required
          />
        </label>
        <label>
          <FieldTitle icon={FiHash}>TIN number</FieldTitle>
          <input name="tin" required />
        </label>
        <label>
          <FieldTitle icon={FiShield}>Registration number</FieldTitle>
          <input name="registration_number" required />
        </label>
      </div>
      <p className="map-help">
        <FiMapPin /> Copy the hotel's exact latitude and longitude from Google
        Maps or OpenStreetMap.
      </p>
      <div className="upload-grid">
        <File name="image" text="Hotel image" accept="image/*" icon={FiImage} />
        <File name="business_license" text="Business license (PDF)" />
      </div>
    </>
  );
}
// File component hutengeneza sehemu moja ya kupakia picha au PDF.
function File({
  name,
  text,
  accept = "application/pdf",
  optional,
  icon: Icon = FiFileText,
}) {
  return (
    <label className="file">
      <FieldTitle icon={Icon}>{text}</FieldTitle>
      <input type="file" name={name} accept={accept} required={!optional} />
      <small>Choose file</small>
    </label>
  );
}
/*
 * LOGIN AND ROUTE SECURITY / KUINGIA NA ULINZI WA ROUTE
 * EN: Login posts credentials to Django and receives a token plus user profile.
 * SW: Login hutuma credentials Django na kupokea token pamoja na wasifu.
 * EN: The session helper stores them in localStorage so refresh does not log out.
 * SW: session helper huhifadhi localStorage ili refresh isiondoe login.
 * EN: Protected compares the required role before rendering a private dashboard.
 * SW: Protected hulinganisha role kabla ya kuonyesha dashboard ya siri.
 */
function Login() {
  const [msg, setMsg] = useState("");
  const nav = useNavigate();
  async function submit(e) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const r = await api("/auth/login/", {
        method: "POST",
        body: JSON.stringify(d),
      });
      session.set(r);
      nav(`/${r.user.role}/dashboard`);
    } catch (x) {
      setMsg(x.message);
    }
  }
  return (
    <Layout>
      <section className="auth login">
        <div className="auth-intro">
          <span className="eyebrow">Welcome back</span>
          <h1>Continue your journey.</h1>
          <p>
            One secure sign-in for job seekers, hotels, and Ministry
            administrators.
          </p>
        </div>
        <form className="form panel" onSubmit={submit}>
          <FiShield className="form-icon" />
          <h2>Sign in</h2>
          <label>
            <FieldTitle icon={FiUser}>Username</FieldTitle>
            <input name="username" autoFocus required />
          </label>
          <label>
            <FieldTitle icon={FiLock}>Password</FieldTitle>
            <input type="password" name="password" required />
          </label>
          <button className="btn full">
            Sign in <FiArrowRight />
          </button>
          <Notice>{msg}</Notice>
          <p className="center">
            No account? <Link to="/register">Register here</Link>
          </p>
        </form>
      </section>
    </Layout>
  );
}
/*
 * PASSWORD RESET / KUBADILI PASSWORD ILIYOSAHAULIKA
 * EN: The request page sends only an email and always shows a neutral response.
 * SW: Page ya kwanza hutuma email pekee na kuonyesha jibu lisilofichua akaunti.
 * EN: The email link carries Django's signed uid and expiring reset token.
 * SW: Link ya email ina uid na token salama ya Django yenye muda wa kuisha.
 * EN: The confirm page sends two matching new-password fields to Django.
 * SW: Page ya mwisho hutuma password mpya na uthibitisho wake kwenda Django.
 */
function ForgotPassword() {
  const [msg, setMsg] = useState("");
  async function submit(e) {
    e.preventDefault();
    try {
      const result = await api("/auth/password-reset/", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      setMsg(result.detail);
    } catch (error) {
      setMsg(error.message);
    }
  }
  return (
    <Layout>
      <section className="auth login">
        <div className="auth-intro">
          <span className="eyebrow">Account recovery</span>
          <h1>Reset your password.</h1>
          <p>Enter the email registered with your portal account.</p>
        </div>
        <form className="form panel" onSubmit={submit}>
          <FiMail className="form-icon" />
          <h2>Request secure link</h2>
          <label>
            <FieldTitle icon={FiMail}>Email address</FieldTitle>
            <input type="email" name="email" required />
          </label>
          <button className="btn full">Send reset link</button>
          <Notice>{msg}</Notice>
          <p className="center">
            <Link to="/login">Back to sign in</Link>
          </p>
        </form>
      </section>
    </Layout>
  );
}

function ResetPassword() {
  const { uid, token } = useParams();
  const [msg, setMsg] = useState("");
  async function submit(e) {
    e.preventDefault();
    try {
      const result = await api(`/auth/password-reset/${uid}/${token}/`, {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      setMsg(result.detail);
    } catch (error) {
      setMsg(error.message);
    }
  }
  return (
    <Layout>
      <section className="auth login">
        <div className="auth-intro">
          <h1>Create a new password.</h1>
        </div>
        <form className="form panel" onSubmit={submit}>
          <FiLock className="form-icon" />
          <h2>New password</h2>
          <label>
            <FieldTitle icon={FiLock}>Password</FieldTitle>
            <input type="password" name="password" minLength="8" required />
          </label>
          <label>
            <FieldTitle icon={FiLock}>Confirm password</FieldTitle>
            <input
              type="password"
              name="confirm_password"
              minLength="8"
              required
            />
          </label>
          <button className="btn full">Save new password</button>
          <Notice>{msg}</Notice>
          <p className="center">
            <Link to="/login">Go to sign in</Link>
          </p>
        </form>
      </section>
    </Layout>
  );
}
// Protected huzuia component kuonekana kama session/role si sahihi.
function Protected({ role, children }) {
  const s = session.get();
  return s && s.user.role === role ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}
// DashLayout huunda sidebar tofauti kwa Job Seeker, Hotel au Admin.
function DashLayout({ role, children }) {
  const nav = useNavigate();
  const s = session.get();
  const links =
    role === "jobseeker"
      ? [
          ["Overview", FiHome, ""],
          ["Find jobs", FiSearch, "jobs"],
          ["Applications", FiBriefcase, "applications"],
          ["My profile", FiUser, "profile"],
        ]
      : role === "hotel"
        ? [
            ["Overview", FiHome, ""],
            ["Manage jobs", FiBriefcase, "jobs"],
            ["Applications", FiUsers, "applications"],
            ["Hotel profile", FiUser, "profile"],
          ]
        : [
            ["Overview", FiHome, ""],
            ["Hotels", FiBriefcase, "hotels"],
            ["Job seekers", FiUsers, "users"],
            ["Jobs", FiSearch, "jobs"],
            ["Home content", FiHome, "home"],
            ["Send email", FiMail, "email"],
            ["Settings", FiSettings, "settings"],
          ];
  return (
    <div className="dashboard">
      <aside>
        <Link to="/">
          <Logo inverse />
        </Link>
        <div className="side-role">
          {role === "admin"
            ? "Ministry administration"
            : role === "hotel"
              ? "Hotel workspace"
              : "Job seeker portal"}
        </div>
        {links.map(([t, I, p]) => (
          <NavLink end key={t} to={`/${role}/dashboard${p ? "/" + p : ""}`}>
            <I />
            {t}
          </NavLink>
        ))}
        <button
          onClick={() => {
            session.clear();
            nav("/");
          }}
        >
          <FiLogOut /> Log out
        </button>
      </aside>
      <div className="dash-content">
        <div className="dash-top">
          <div>
            <small>Signed in as</small>
            <strong>{s?.user.full_name || s?.user.username}</strong>
          </div>
          <Link to="/">Public site ↗</Link>
        </div>
        {children}
      </div>
    </div>
  );
}
/*
 * JOB SEEKER WORKSPACE / ENEO LA JOB SEEKER
 * EN: These pages summarize applications, browse jobs and maintain the user profile.
 * SW: Pages hizi huonyesha maombi, ajira na kuruhusu kusimamia wasifu.
 * EN: Application filters run in React after Django returns the owner's records.
 * SW: Filter za maombi hufanyika React baada ya Django kurudisha data ya mwenyewe.
 * EN: Pending notes can be edited; individual or all applications can be deleted.
 * SW: Ujumbe wa pending unaweza kuhaririwa; ombi moja au yote yanaweza kufutwa.
 */
function SeekerDash() {
  const s = session.get();
  const { data } = useLoad("/applications/");
  return (
    <DashLayout role="jobseeker">
      <div className="dash-title">
        <div>
          <span className="eyebrow">Karibu</span>
          <h1>Hello, {s.user.full_name?.split(" ")[0] || s.user.username}</h1>
          <p>Track your search and discover your next opportunity.</p>
        </div>
        <Link className="btn" to="/jobs">
          Find a job
        </Link>
      </div>
      <div className="stats">
        <Stat
          icon={FiBriefcase}
          n={data?.results.length || 0}
          text="Applications"
        />
        <Stat
          icon={FiClock}
          n={data?.results.filter((x) => x.status === "pending").length || 0}
          text="Pending review"
        />
        <Stat
          icon={FiCheckCircle}
          n={data?.results.filter((x) => x.status === "accepted").length || 0}
          text="Accepted"
        />
      </div>
      <Panel title="Recent applications">
        <ApplicationTable rows={data?.results?.slice(0, 5) || []} />
      </Panel>
    </DashLayout>
  );
}
// Usimamizi wa maombi: filter, edit, delete na clear all.
function SeekerApplications() {
  const { data, error } = useLoad("/applications/");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState(null);
  const rows =
    data?.results.filter((x) => filter === "all" || x.status === filter) || [];
  async function remove(id) {
    if (!confirm("Delete this application permanently?")) return;
    await api(`/applications/${id}/`, { method: "DELETE" });
    location.reload();
  }
  async function clear() {
    if (
      !rows.length ||
      !confirm("Clear ALL of your applications? This cannot be undone.")
    )
      return;
    await api("/applications/clear/", { method: "DELETE" });
    location.reload();
  }
  return (
    <DashLayout role="jobseeker">
      <Title
        title="My applications"
        text="Edit pending applications, remove individual records, or clear your history."
      />
      <div className="filters">
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
        <button className="delete-action" onClick={clear}>
          Clear all
        </button>
      </div>
      <Notice error={error} />
      <Panel>
        <ApplicationTable
          rows={rows}
          detailed
          onEdit={setEditing}
          onDelete={remove}
        />
      </Panel>
      {editing && (
        <EditApplication application={editing} close={() => setEditing(null)} />
      )}
    </DashLayout>
  );
}
// Jedwali linalotumika kuonyesha maombi na actions zake kwa hiari.
function ApplicationTable({ rows, detailed, onEdit, onDelete }) {
  return rows.length ? (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Position</th>
            <th>Hotel</th>
            <th>Applied</th>
            <th>Status</th>
            {detailed && (
              <>
                <th>My note / Feedback</th>
                <th>Actions</th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((a) => (
            <tr key={a.id}>
              <td>
                <strong>{a.job.title}</strong>
                <small>{a.job.category}</small>
              </td>
              <td>{a.job.hotel.name}</td>
              <td>{new Date(a.created_at).toLocaleDateString()}</td>
              <td>
                <Status value={a.status} />
              </td>
              {detailed && (
                <>
                  <td className="application-note">
                    <strong>{a.applicant_note || "No applicant note"}</strong>
                    <small>{a.feedback || "No employer feedback yet"}</small>
                  </td>
                  <td>
                    <div className="table-actions">
                      {a.status === "pending" && (
                        <button onClick={() => onEdit(a)}>Edit</button>
                      )}
                      <button
                        className="delete-action"
                        onClick={() => onDelete(a.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  ) : (
    <Empty text="No applications to show." />
  );
}
// Job Seeker anaweza kubadili ujumbe wake wakati uamuzi wa hoteli bado ni pending.
function EditApplication({ application, close }) {
  const [note, setNote] = useState(application.applicant_note || "");
  const [msg, setMsg] = useState("");
  async function save(e) {
    e.preventDefault();
    try {
      await api(`/applications/${application.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ applicant_note: note }),
      });
      location.reload();
    } catch (x) {
      setMsg(x.message);
    }
  }
  return (
    <div className="modal">
      <form className="panel form" onSubmit={save}>
        <button type="button" className="modal-x" onClick={close}>
          <FiX />
        </button>
        <h2>Edit application</h2>
        <p>
          <strong>{application.job.title}</strong> at{" "}
          {application.job.hotel.name}
        </p>
        <label>
          Applicant note
          <textarea
            rows="7"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add information you want the hotel to consider…"
          />
        </label>
        <small>
          Your saved profile and documents remain attached automatically.
        </small>
        <button className="btn">Save application</button>
        <Notice>{msg}</Notice>
      </form>
    </div>
  );
}
// Profile husoma taarifa/nyaraka na kuruhusu taarifa binafsi kusahihishwa.
function Profile() {
  const { data } = useLoad("/auth/me/");
  const [msg, setMsg] = useState("");
  async function save(e) {
    e.preventDefault();
    try {
      const r = await api("/auth/me/", {
        method: "PATCH",
        body: new FormData(e.currentTarget),
      });
      setMsg("Profile updated.");
      const s = session.get();
      session.set({ ...s, user: r });
      setTimeout(() => location.reload(), 700);
    } catch (x) {
      setMsg(x.message);
    }
  }
  return (
    <DashLayout role="jobseeker">
      <Title
        title="My profile"
        text="This information is automatically attached to your applications."
      />
      {data && (
        <form className="panel form" onSubmit={save}>
          <div className="profile-head">
            {data.photo ? <img src={data.photo} /> : <FiUser />}
            <div>
              <h2>{data.full_name}</h2>
              <p>@{data.username}</p>
            </div>
          </div>
          <div className="two">
            <label>
              Username
              <input name="username" defaultValue={data.username} required />
            </label>
            <label>
              Full name
              <input name="full_name" defaultValue={data.full_name} />
            </label>
            <label>
              Email
              <input name="email" type="email" defaultValue={data.email} />
            </label>
            <label>
              Phone
              <input name="phone" defaultValue={data.phone} />
            </label>
            <label>
              Address
              <input name="address" defaultValue={data.address} />
            </label>
            <label>
              Gender
              <select name="gender" defaultValue={data.gender}>
                <option>Female</option>
                <option>Male</option>
                <option>Other</option>
              </select>
            </label>
          </div>
          <h3>Documents</h3>
          <div className="documents">
            {[
              ["CV", data.cv],
              ["Recommendation", data.recommendation_letter],
              ["Academic certificates", data.academic_certificates],
              ["Other certificates", data.other_certificates],
            ].map(([n, u]) => (
              <a
                className={!u ? "disabled" : ""}
                href={u || "#"}
                target="_blank"
                rel="noreferrer"
                key={n}
              >
                {n}
                <span>{u ? "View PDF" : "Not uploaded"}</span>
              </a>
            ))}
          </div>
          <h3>Replace profile files</h3>
          <p className="result-count">
            Select only files you want to change. Existing files remain if a
            field is empty.
          </p>
          <div className="upload-grid">
            <File
              name="photo"
              text="New profile photo (optional)"
              accept="image/*"
              optional
              icon={FiImage}
            />
            <File name="cv" text="New CV (PDF, optional)" optional />
            <File
              name="recommendation_letter"
              text="New recommendation (PDF, optional)"
              optional
            />
            <File
              name="academic_certificates"
              text="New academic certificates (PDF, optional)"
              optional
            />
            <File
              name="other_certificates"
              text="New other certificates (PDF, optional)"
              optional
            />
          </div>
          <button className="btn">Save changes</button>
          <Notice>{msg}</Notice>
        </form>
      )}
    </DashLayout>
  );
}
// Orodha ya ajira hai ndani ya dashboard ya Job Seeker.
function JobBrowser() {
  const { data } = useLoad("/jobs/");
  return (
    <DashLayout role="jobseeker">
      <Title
        title="Available jobs"
        text="All active vacancies from approved hotels."
      />
      <div className="jobs">
        {data?.results.map((j) => (
          <JobCard key={j.id} job={j} />
        ))}
      </div>
    </DashLayout>
  );
}
/*
 * HOTEL PROFILE / WASIFU WA HOTELI
 * EN: Hotel edits account credentials, contact information and business data.
 * SW: Hoteli hubadili username, password, mawasiliano na taarifa za biashara.
 * EN: Image/license fields are optional and preserve existing files when empty.
 * SW: Picha/leseni ni optional na mafaili ya zamani hubaki fields zikiwa tupu.
 * EN/SW: Ministry approval cannot be changed here / Idhini hubadilishwa na Admin pekee.
 */
function HotelProfile() {
  const { data } = useLoad("/auth/me/");
  const [msg, setMsg] = useState("");
  async function save(e) {
    e.preventDefault();
    try {
      const result = await api("/auth/me/", {
        method: "PATCH",
        body: new FormData(e.currentTarget),
      });
      const current = session.get();
      session.set({ ...current, user: result });
      setMsg("Hotel profile updated successfully.");
      setTimeout(() => location.reload(), 700);
    } catch (error) {
      setMsg(error.message);
    }
  }
  if (!data?.hotel)
    return (
      <DashLayout role="hotel">
        <Loader />
      </DashLayout>
    );
  const hotel = data.hotel;
  return (
    <DashLayout role="hotel">
      <Title
        title="Hotel profile"
        text="Update hotel details, account credentials and business files."
      />
      <form className="panel form" onSubmit={save}>
        <div className="profile-head">
          {hotel.image ? (
            <img src={hotel.image} alt={hotel.name} />
          ) : (
            <FaHotel />
          )}
          <div>
            <h2>{hotel.name}</h2>
            <Status value={hotel.approved ? "active" : "pending"} />
          </div>
        </div>
        <div className="two">
          <label>
            Hotel name
            <input name="hotel_name" defaultValue={hotel.name} required />
          </label>
          <label>
            Username
            <input name="username" defaultValue={data.username} required />
          </label>
          <label>
            Email
            <input
              type="email"
              name="email"
              defaultValue={data.email}
              required
            />
          </label>
          <label>
            Phone
            <input name="phone" defaultValue={data.phone} required />
          </label>
          <label>
            Location
            <input name="location" defaultValue={hotel.location} required />
          </label>
          <label>
            Latitude
            <input
              type="number"
              step="any"
              name="latitude"
              defaultValue={hotel.latitude || ""}
              required
            />
          </label>
          <label>
            Longitude
            <input
              type="number"
              step="any"
              name="longitude"
              defaultValue={hotel.longitude || ""}
              required
            />
          </label>
          <label>
            TIN
            <input name="tin" defaultValue={hotel.tin} required />
          </label>
          <label>
            Registration number
            <input
              name="registration_number"
              defaultValue={hotel.registration_number}
              required
            />
          </label>
        </div>
        <div className="upload-grid">
          <File
            name="hotel_image"
            text="Replace hotel image (optional)"
            accept="image/*"
            optional
            icon={FiImage}
          />
          <File
            name="business_license"
            text="Replace business license (PDF, optional)"
            optional
          />
        </div>
        <button className="btn">Save hotel profile</button>
        <Notice>{msg}</Notice>
      </form>
    </DashLayout>
  );
}
/*
 * HOTEL WORKSPACE / ENEO LA HOTELI
 * EN: The overview loads totals and highlights the job with most applications.
 * SW: Overview huleta jumla na kuonyesha ajira yenye maombi mengi kuliko nyingine.
 * EN: Manage Jobs provides create, edit and delete actions for vacancies.
 * SW: Manage Jobs huruhusu kutangaza, kuhariri na kufuta nafasi za kazi.
 * EN: Applications exposes applicant profiles/documents and employer decisions.
 * SW: Applications huonyesha wasifu/nyaraka na maamuzi ya mwajiri.
 */
function HotelDash() {
  const { data } = useLoad("/hotel/overview/");
  return (
    <DashLayout role="hotel">
      <Title
        title={data?.hotel?.name || "Hotel dashboard"}
        text="Manage vacancies and respond to candidates."
      />
      <div className="stats">
        <Stat icon={FiBriefcase} n={data?.total_jobs || 0} text="Posted jobs" />
        <Stat
          icon={FiUsers}
          n={data?.total_applications || 0}
          text="Total applications"
        />
        <Stat
          icon={FiCheckCircle}
          n={data?.jobs?.filter((x) => x.active).length || 0}
          text="Active vacancies"
        />
      </div>
      <Panel title="Application activity">
        <div className="job-bars">
          {data?.jobs.map((j) => (
            <div className={j.highest ? "top" : ""} key={j.id}>
              <span>
                {j.title}
                {j.highest && <b>Most applications</b>}
              </span>
              <strong>{j.application_count}</strong>
            </div>
          ))}
        </div>
      </Panel>
    </DashLayout>
  );
}
// HotelJobs hutangaza, kuhariri na kufuta nafasi za kazi za hoteli.
function HotelJobs() {
  const { data } = useLoad("/hotel/jobs/");
  const [edit, setEdit] = useState(null);
  const [msg, setMsg] = useState("");
  async function submit(e) {
    e.preventDefault();
    try {
      await api("/hotel/jobs/", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(new FormData(e.currentTarget))),
      });
      location.reload();
    } catch (x) {
      setMsg(x.message);
    }
  }
  async function remove(id) {
    if (!confirm("Delete this vacancy and its applications?")) return;
    await api(`/hotel/jobs/${id}/`, { method: "DELETE" });
    location.reload();
  }
  return (
    <DashLayout role="hotel">
      <Title
        title="Manage jobs"
        text="Post, edit, and close hotel vacancies."
      />
      <div className="split">
        <form className="panel form sticky" onSubmit={submit}>
          <h2>Post a job</h2>
          <label>
            Job title
            <input name="title" required />
          </label>
          <div className="two">
            <label>
              Position
              <input name="position" required />
            </label>
            <label>
              Category
              <select name="category">
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <label>
              Experience
              <input name="experience" placeholder="e.g. 2 years" required />
            </label>
            <label>
              Required gender
              <select name="gender">
                <option>Any</option>
                <option>Female</option>
                <option>Male</option>
              </select>
            </label>
          </div>
          <label>
            Application deadline
            <input type="date" name="deadline" required />
          </label>
          <label>
            Description
            <textarea name="description" rows="6" required />
          </label>
          <button className="btn full">Publish vacancy</button>
          <Notice>{msg}</Notice>
        </form>
        <div>
          <h2>Your vacancies</h2>
          {data?.results.map((j) => (
            <article className="manage-card" key={j.id}>
              <div>
                <Status value={j.active ? "active" : "closed"} />
                <h3>{j.title}</h3>
                <p>
                  {j.category} · Deadline{" "}
                  {new Date(j.deadline).toLocaleDateString()}
                </p>
                <strong>{j.application_count} applications</strong>
              </div>
              <div>
                <button onClick={() => setEdit(j)}>Edit</button>
                <button className="danger" onClick={() => remove(j.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
      {edit && <EditJob job={edit} close={() => setEdit(null)} />}
    </DashLayout>
  );
}
// Modal ya kuhariri title, description, deadline na active ya ajira.
function EditJob({ job, close }) {
  const [msg, setMsg] = useState("");
  async function save(e) {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.currentTarget));
    payload.active = e.currentTarget.elements.active.checked;
    try {
      await api(`/hotel/jobs/${job.id}/`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      location.reload();
    } catch (error) {
      setMsg(error.message);
    }
  }
  return (
    <div className="modal">
      <form className="panel form" onSubmit={save}>
        <button type="button" className="modal-x" onClick={close}>
          <FiX />
        </button>
        <h2>Edit vacancy</h2>
        <label>
          Title
          <input name="title" defaultValue={job.title} required />
        </label>
        <div className="two">
          <label>
            Position
            <input name="position" defaultValue={job.position} required />
          </label>
          <label>
            Category
            <select name="category" defaultValue={job.category}>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label>
            Experience
            <input name="experience" defaultValue={job.experience} required />
          </label>
          <label>
            Required gender
            <select name="gender" defaultValue={job.gender}>
              <option>Any</option>
              <option>Female</option>
              <option>Male</option>
            </select>
          </label>
        </div>
        <label>
          Description
          <textarea
            name="description"
            rows="6"
            defaultValue={job.description}
            required
          />
        </label>
        <label>
          Deadline
          <input
            name="deadline"
            type="date"
            defaultValue={job.deadline}
            required
          />
        </label>
        <label>
          <input type="checkbox" name="active" defaultChecked={job.active} />{" "}
          Vacancy is active
        </label>
        <button className="btn">Save changes</button>
        <Notice>{msg}</Notice>
      </form>
    </div>
  );
}
// Hoteli huchagua job na kupanga waombaji kwa tarehe au alfabeti.
function HotelApplications() {
  const overview = useLoad("/hotel/overview/");
  const [selected, setSelected] = useState(null);
  const [detail, setDetail] = useState(null);
  const [sort, setSort] = useState("date");
  async function choose(id) {
    setSelected(id);
    setDetail(await api(`/hotel/jobs/${id}/`));
  }
  let apps = detail?.applications || [];
  apps = [...apps].sort((a, b) =>
    sort === "alpha"
      ? a.applicant.full_name.localeCompare(b.applicant.full_name)
      : new Date(b.created_at) - new Date(a.created_at),
  );
  return (
    <DashLayout role="hotel">
      <Title
        title="Applications"
        text="Review complete applicant profiles and respond."
      />
      <div className="app-grid">
        <div className="panel job-select">
          <h3>Posted jobs</h3>
          {overview.data?.jobs.map((j) => (
            <button
              className={selected === j.id ? "active" : ""}
              onClick={() => choose(j.id)}
              key={j.id}
            >
              <span>
                {j.title}
                <small>{j.position}</small>
              </span>
              <b>{j.application_count}</b>
            </button>
          ))}
        </div>
        <div className="panel">
          <div className="panel-title">
            <h3>{detail?.job.title || "Select a job"}</h3>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="date">Newest first</option>
              <option value="alpha">A–Z</option>
            </select>
          </div>
          {apps.map((a) => (
            <Applicant key={a.id} a={a} />
          ))}
          {detail && !apps.length && (
            <Empty text="No applications for this job." />
          )}
        </div>
      </div>
    </DashLayout>
  );
}
// Applicant hufungua wasifu/nyaraka na kuhifadhi status pamoja na feedback.
function Applicant({ a }) {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState(a.status);
  const [feedback, setFeedback] = useState(a.feedback);
  async function save() {
    await api(`/hotel/applications/${a.id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status, feedback }),
    });
    setOpen(false);
  }
  return (
    <article className="applicant">
      <button onClick={() => setOpen(!open)}>
        <span className="avatar">{a.applicant.full_name[0]}</span>
        <span>
          <strong>{a.applicant.full_name}</strong>
          <small>
            {new Date(a.created_at).toLocaleDateString()} · {a.applicant.gender}
          </small>
        </span>
        <Status value={status} />
      </button>
      {open && (
        <div className="applicant-detail">
          <p>
            {a.applicant.email} · {a.applicant.phone} · {a.applicant.address}
          </p>
          <div className="notice">
            <strong>Applicant note:</strong>{" "}
            {a.applicant_note || "No note supplied."}
          </div>
          <div className="documents">
            {[
              ["CV", a.applicant.cv],
              ["Recommendation", a.applicant.recommendation_letter],
              ["Certificates", a.applicant.academic_certificates],
            ].map(([n, u]) => (
              <a href={u} target="_blank" rel="noreferrer" key={n}>
                {n}
                <span>Open</span>
              </a>
            ))}
          </div>
          <div className="two">
            <label>
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
            </label>
            <label>
              Employer feedback
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </label>
          </div>
          <button className="btn" onClick={save}>
            Save response
          </button>
        </div>
      )}
    </article>
  );
}
/*
 * ADMIN WORKSPACE / ENEO LA ADMIN
 * EN: The Ministry dashboard loads system totals and pending hotel approvals.
 * SW: Dashboard ya Wizara huleta takwimu na hoteli zinazosubiri idhini.
 * EN: Reusable AdminList changes behavior for hotels, users and jobs using type.
 * SW: AdminList hubadili kazi kwa hotels, users na jobs kwa kutumia type.
 * EN: Settings updates portal details and maintenance and triggers notifications.
 * SW: Settings hubadili taarifa za portal na maintenance na kutuma notifications.
 */
function AdminDash() {
  const { data } = useLoad("/admin/overview/");
  return (
    <DashLayout role="admin">
      <Title
        title="System overview"
        text="Ministry operations and portal performance at a glance."
      />
      <div className="stats admin-stats">
        <Stat
          icon={FiUsers}
          n={data?.stats.jobseekers || 0}
          text="Job seekers"
        />
        <Stat icon={FiBriefcase} n={data?.stats.hotels || 0} text="Hotels" />
        <Stat
          icon={FiClock}
          n={data?.stats.pending_hotels || 0}
          text="Awaiting approval"
        />
        <Stat icon={FiSearch} n={data?.stats.jobs || 0} text="Jobs" />
        <Stat
          icon={FiCheckCircle}
          n={data?.stats.applications || 0}
          text="Applications"
        />
      </div>
      <Panel title="Hotels awaiting Ministry approval">
        {data?.hotels
          .filter((h) => !h.approved)
          .map((h) => (
            <div className="approval" key={h.id}>
              <div>
                <strong>{h.name}</strong>
                <small>
                  {h.location} · TIN {h.tin}
                </small>
              </div>
              <button
                className="btn small"
                onClick={async () => {
                  await api(`/admin/hotels/${h.id}/approve/`, {
                    method: "POST",
                    body: "{}",
                  });
                  location.reload();
                }}
              >
                Approve hotel
              </button>
            </div>
          ))}
        {data && !data.hotels.some((h) => !h.approved) && (
          <Empty text="No approvals waiting." />
        )}
      </Panel>
    </DashLayout>
  );
}
// AdminList hutumia type moja kusimamia hotels, users au jobs.
function AdminList({ type }) {
  const { data } = useLoad("/admin/overview/");
  const rows = data?.[type] || [];
  async function action(row) {
    if (type === "hotels")
      await api(`/admin/hotels/${row.id}/approve/`, {
        method: "POST",
        body: JSON.stringify({ approved: !row.approved }),
      });
    if (type === "users")
      await api(`/admin/users/${row.id}/toggle/`, { method: "POST" });
    if (type === "jobs")
      await api(`/admin/jobs/${row.id}/`, {
        method: "PATCH",
        body: JSON.stringify({ active: !row.active }),
      });
    location.reload();
  }
  return (
    <DashLayout role="admin">
      <Title
        title={`Manage ${type}`}
        text="Review records, access, and platform visibility."
      />
      <Panel>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Details</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.name || r.full_name || r.title}</strong>
                  </td>
                  <td>
                    {r.location || r.email || `${r.hotel.name} · ${r.category}`}
                  </td>
                  <td>
                    <Status
                      value={
                        (
                          type === "users"
                            ? r.is_active
                            : (r.approved ?? r.active)
                        )
                          ? "active"
                          : "inactive"
                      }
                    />
                  </td>
                  <td>
                    <button onClick={() => action(r)}>
                      {(
                        type === "users"
                          ? r.is_active
                          : (r.approved ?? r.active)
                      )
                        ? "Disable"
                        : "Enable / approve"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </DashLayout>
  );
}
/*
 * HOME CONTENT MANAGEMENT / USIMAMIZI WA HOME
 * EN: Admin edits hero text and optionally uploads a replacement image.
 * SW: Admin hubadili maandishi ya hero na anaweza kupakia picha mpya.
 * EN: FormData preserves binary image data when the PATCH request is sent.
 * SW: FormData huhifadhi data ya picha wakati PATCH inatumwa.
 * EN/SW: Empty image keeps the current file / Picha tupu huacha ya zamani.
 */
function AdminHome() {
  const { data } = useLoad("/site-content/");
  const [msg, setMsg] = useState("");
  async function save(e) {
    e.preventDefault();
    try {
      const result = await api("/site-content/", {
        method: "PATCH",
        body: new FormData(e.currentTarget),
      });
      setMsg(result.detail);
    } catch (error) {
      setMsg(error.message);
    }
  }
  return (
    <DashLayout role="admin">
      <Title
        title="Manage Home page"
        text="Change the main image and introductory text shown to visitors."
      />
      {data && (
        <form className="panel form settings" onSubmit={save}>
          {data.hero_image && (
            <img
              className="home-preview"
              src={data.hero_image}
              alt="Current Home hero"
            />
          )}
          <label>
            Small heading
            <input
              name="hero_eyebrow"
              defaultValue={data.hero_eyebrow}
              required
            />
          </label>
          <label>
            Main heading
            <input name="hero_title" defaultValue={data.hero_title} required />
          </label>
          <label>
            Introduction
            <textarea
              name="hero_subtitle"
              rows="5"
              defaultValue={data.hero_subtitle}
              required
            />
          </label>
          <File
            name="hero_image"
            text="Replace Home image (optional)"
            accept="image/*"
            optional
            icon={FiImage}
          />
          <button className="btn">Save Home page</button>
          <Notice>{msg}</Notice>
        </form>
      )}
    </DashLayout>
  );
}

// EN: AdminSettings changes portal contact details and maintenance mode.
// SW: AdminSettings hubadili mawasiliano ya portal na hali ya maintenance.
function AdminSettings() {
  const { data } = useLoad("/admin/settings/");
  const [msg, setMsg] = useState("");
  async function save(e) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget));
    d.maintenance_mode = !!d.maintenance_mode;
    try {
      await api("/admin/settings/", {
        method: "PATCH",
        body: JSON.stringify(d),
      });
      setMsg("Settings saved.");
    } catch (x) {
      setMsg(x.message);
    }
  }
  return (
    <DashLayout role="admin">
      <Title
        title="Portal settings"
        text="Control public configuration and operational defaults."
      />
      {data && (
        <form className="panel form settings" onSubmit={save}>
          <label>
            Portal name
            <input name="portal_name" defaultValue={data.portal_name} />
          </label>
          <label>
            Support email
            <input
              type="email"
              name="support_email"
              defaultValue={data.support_email}
            />
          </label>
          <label className="check">
            <input
              type="checkbox"
              name="maintenance_mode"
              defaultChecked={data.maintenance_mode}
            />{" "}
            Maintenance mode
          </label>
          <button className="btn">Save settings</button>
          <Notice>{msg}</Notice>
        </form>
      )}
    </DashLayout>
  );
}
/*
 * ADMIN EMAIL MANAGEMENT / USIMAMIZI WA EMAIL WA ADMIN
 * EN: Recipient choices come from Django and contain active users with email only.
 * SW: Orodha hutoka Django na ina watumiaji hai wenye email pekee.
 * EN: Individual mode sends to one selected person; group modes send privately.
 * SW: Individual hutuma kwa mtu mmoja; group hutuma kwa kila mtu kwa siri.
 * EN: Subject and message are required and delivery results are shown below the form.
 * SW: Subject na message ni lazima na matokeo ya utumaji huonyeshwa chini ya fomu.
 */
function AdminEmail() {
  const { data, error } = useLoad("/admin/email/");
  const [type, setType] = useState("individual");
  const [msg, setMsg] = useState("");
  async function submit(e) {
    e.preventDefault();
    const payload = Object.fromEntries(new FormData(e.currentTarget));
    payload.recipient_type = type;
    try {
      const result = await api("/admin/email/", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setMsg(result.detail);
      e.currentTarget.reset();
    } catch (requestError) {
      setMsg(requestError.message);
    }
  }
  return (
    <DashLayout role="admin">
      <Title
        title="Email management"
        text="Send private messages and announcements without opening Gmail."
      />
      <form className="panel form settings" onSubmit={submit}>
        <label>
          Recipient type
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="individual">Individual user</option>
            <option value="jobseekers">All Job Seekers</option>
            <option value="hotels">All Hotels</option>
            <option value="all">All Users</option>
          </select>
        </label>
        {type === "individual" && (
          <label>
            Recipient
            <select name="user_id" required>
              <option value="">Select registered user</option>
              {data?.recipients.map((recipient) => (
                <option value={recipient.id} key={recipient.id}>
                  {recipient.name} — {recipient.email} ({recipient.role})
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          Subject
          <input name="subject" required />
        </label>
        <label>
          Message
          <textarea name="message" rows="9" required />
        </label>
        <button className="btn">Send email</button>
        <Notice error={error}>{msg}</Notice>
      </form>
    </DashLayout>
  );
}
// About ni maelezo ya madhumuni na misingi ya portal.
function About() {
  return (
    <Layout>
      <section className="page-title">
        <span className="eyebrow">About the portal</span>
        <h1>Better hospitality careers for Zanzibar.</h1>
        <p>
          ZanHotel Ajira Portal connects qualified local talent with verified
          hotels through a transparent, Ministry-supported recruitment process.
        </p>
      </section>
      <section className="how">
        <div className="steps">
          <div>
            <FiShield />
            <h3>Trusted</h3>
            <p>Hotels are reviewed before they can recruit.</p>
          </div>
          <div>
            <FiUsers />
            <h3>Inclusive</h3>
            <p>Vacancies are visible to everyone, free of charge.</p>
          </div>
          <div>
            <FiCheckCircle />
            <h3>Transparent</h3>
            <p>Applicants can track decisions and feedback.</p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
// Components hizi nne ni vipande vya muonekano vinavyotumika pages nyingi.
function Title({ title, text }) {
  return (
    <div className="dash-title">
      <div>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
    </div>
  );
}
function Panel({ title, children }) {
  return (
    <section className="panel">
      {title && (
        <div className="panel-title">
          <h2>{title}</h2>
        </div>
      )}
      {children}
    </section>
  );
}
function Stat({ icon: I, n, text }) {
  return (
    <div className="stat">
      <I />
      <div>
        <strong>{n}</strong>
        <span>{text}</span>
      </div>
    </div>
  );
}
function Empty({ text }) {
  return (
    <div className="empty">
      <FiBriefcase />
      <p>{text}</p>
    </div>
  );
}
function Loader() {
  return (
    <div className="loader">
      <i />
    </div>
  );
}
// App ndiyo router kuu inayochagua page kulingana na URL ya browser.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/jobs" element={<Jobs />} />
      <Route path="/jobs/:id" element={<JobDetail />} />
      <Route path="/about" element={<About />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
      <Route
        path="/jobseeker/dashboard"
        element={
          <Protected role="jobseeker">
            <SeekerDash />
          </Protected>
        }
      />
      <Route
        path="/jobseeker/dashboard/jobs"
        element={
          <Protected role="jobseeker">
            <JobBrowser />
          </Protected>
        }
      />
      <Route
        path="/jobseeker/dashboard/applications"
        element={
          <Protected role="jobseeker">
            <SeekerApplications />
          </Protected>
        }
      />
      <Route
        path="/jobseeker/dashboard/profile"
        element={
          <Protected role="jobseeker">
            <Profile />
          </Protected>
        }
      />
      <Route
        path="/hotel/dashboard"
        element={
          <Protected role="hotel">
            <HotelDash />
          </Protected>
        }
      />
      <Route
        path="/hotel/dashboard/jobs"
        element={
          <Protected role="hotel">
            <HotelJobs />
          </Protected>
        }
      />
      <Route
        path="/hotel/dashboard/applications"
        element={
          <Protected role="hotel">
            <HotelApplications />
          </Protected>
        }
      />
      <Route
        path="/hotel/dashboard/profile"
        element={
          <Protected role="hotel">
            <HotelProfile />
          </Protected>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <Protected role="admin">
            <AdminDash />
          </Protected>
        }
      />
      <Route
        path="/admin/dashboard/hotels"
        element={
          <Protected role="admin">
            <AdminList type="hotels" />
          </Protected>
        }
      />
      <Route
        path="/admin/dashboard/users"
        element={
          <Protected role="admin">
            <AdminList type="users" />
          </Protected>
        }
      />
      <Route
        path="/admin/dashboard/jobs"
        element={
          <Protected role="admin">
            <AdminList type="jobs" />
          </Protected>
        }
      />
      <Route
        path="/admin/dashboard/home"
        element={
          <Protected role="admin">
            <AdminHome />
          </Protected>
        }
      />
      <Route
        path="/admin/dashboard/email"
        element={
          <Protected role="admin">
            <AdminEmail />
          </Protected>
        }
      />
      <Route
        path="/admin/dashboard/settings"
        element={
          <Protected role="admin">
            <AdminSettings />
          </Protected>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
