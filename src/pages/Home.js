import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { auth } from "../firebase";

export default function Home() {
  const navigate = useNavigate();
  const aboutRef = useRef(null);
  const howRef = useRef(null);
  const whyRef = useRef(null);
  const faqRef = useRef(null);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Logout handler
  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white text-gray-900 font-sans">
      {/* NAVIGATION BAR */}
      <nav className="fixed top-0 left-0 w-full bg-white/70 backdrop-blur-md shadow-sm z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
          <div
            className="text-2xl font-bold text-blue-600 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Resume Analyzer
          </div>
          <div className="space-x-6 hidden md:flex items-center">
            <button className="hover:text-blue-600" onClick={() => scrollTo(aboutRef)}>
              About
            </button>
            <button className="hover:text-blue-600" onClick={() => scrollTo(howRef)}>
              How It Works
            </button>
            <button className="hover:text-blue-600" onClick={() => scrollTo(whyRef)}>
              Why Resumes Matter
            </button>
            <button className="hover:text-blue-600" onClick={() => scrollTo(faqRef)}>
              FAQ
            </button>
            <button
              onClick={() => navigate("/analyze")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Analyze Now
            </button>
            <button
              onClick={() => navigate("/history")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              View History
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden pt-24">
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-300 to-indigo-200"></div>
        <motion.h1
          className="text-5xl md:text-6xl font-extrabold text-gray-900"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Perfect Your Resume with <span className="text-blue-700">AI</span>
        </motion.h1>
        <motion.p
          className="mt-4 max-w-xl text-lg text-gray-800"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          Tailor your resume to job descriptions, get AI-driven match scores,
          and actionable feedback to land interviews faster.
        </motion.p>
        <motion.div
          className="mt-6 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 1 }}
        >
          <button
            onClick={() => navigate("/analyze")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            Start Analyzing
          </button>
          <button
            onClick={() => navigate("/history")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg hover:bg-blue-700 transition"
          >
            View History
          </button>
        </motion.div>
      </section>

      {/* ABOUT */}
      <section ref={aboutRef} className="py-20 px-6 bg-white text-center">
        <motion.h2
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          What is Resume Analyzer?
        </motion.h2>
        <motion.p
          className="max-w-3xl mx-auto text-gray-700 text-lg"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          Resume Analyzer is your personal career assistant, helping you
          optimize your resume for each job you apply to. We use AI to analyze
          your resume and job descriptions, giving you a clear match score,
          highlighting missing keywords, and suggesting improvements.
        </motion.p>
      </section>

      {/* HOW IT WORKS */}
      <section ref={howRef} className="py-20 px-6 bg-gray-50">
        <motion.h2
          className="text-3xl font-bold text-center mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          How It Works
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-center">
          <Step
            number="1"
            title="Upload Your Resume"
            desc="Simply upload your resume in PDF, DOCX, or image format along with the job description."
          />
          <Step
            number="2"
            title="AI-Powered Analysis"
            desc="Our AI compares your resume against the job description and calculates a match score."
          />
          <Step
            number="3"
            title="Get Feedback"
            desc="Receive a detailed breakdown of missing keywords and recommendations to improve your resume."
          />
        </div>
      </section>

      {/* WHY RESUMES MATTER */}
      <section ref={whyRef} className="py-20 px-6 bg-white">
        <motion.h2
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          Why Resumes Matter
        </motion.h2>
        <motion.div
          className="max-w-3xl mx-auto text-gray-700 space-y-4 text-lg text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
        >
          <p>
            Your resume is the first impression you make on recruiters. With
            applicant tracking systems (ATS) filtering most resumes, optimizing
            your resume is crucial.
          </p>
          <p>
            Our tool helps ensure your resume highlights the right skills and
            keywords to get past ATS and impress hiring managers.
          </p>
        </motion.div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} className="py-20 px-6 bg-gray-50">
        <motion.h2
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          Frequently Asked Questions
        </motion.h2>
        <div className="max-w-3xl mx-auto space-y-4">
          <FAQ
            question="How accurate is the match score?"
            answer="We use AI trained on thousands of job descriptions and resumes to generate a score based on keyword matching, structure, and skill alignment."
          />
          <FAQ
            question="What file types are supported?"
            answer="We currently support PDF, DOCX, and image files (PNG, JPG, JPEG)."
          />
          <FAQ
            question="Can I analyze multiple resumes at once?"
            answer="Yes, our bulk analysis lets you upload up to 10 resumes and ranks them based on job match."
          />
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-20 px-6 bg-blue-600 text-white text-center">
        <motion.h2
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        >
          Ready to Land Your Dream Job?
        </motion.h2>
        <p className="max-w-2xl mx-auto text-blue-100 mb-6">
          Analyze your resume now and get instant feedback to improve your
          chances of getting hired.
        </p>
        <button
          onClick={() => navigate("/analyze")}
          className="px-6 py-3 bg-white text-blue-700 rounded-lg font-semibold hover:bg-blue-100 transition"
        >
          Start Now
        </button>
      </section>

      {/* FOOTER */}
      <footer className="py-8 text-center text-gray-500 text-sm bg-gray-100">
        © {new Date().getFullYear()} Resume Analyzer. All rights reserved.
      </footer>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <motion.div
      className="p-6 bg-white rounded-lg shadow hover:shadow-md transition"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="text-blue-600 text-3xl font-bold mb-2">{number}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </motion.div>
  );
}

function FAQ({ question, answer }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="border rounded-lg p-4 text-left">
      <button
        className="w-full text-left font-semibold text-gray-800"
        onClick={() => setOpen(!open)}
      >
        {question}
      </button>
      {open && <p className="mt-2 text-gray-600">{answer}</p>}
    </div>
  );
}
