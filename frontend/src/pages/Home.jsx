
import { useState } from "react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: "📚",
    title: "Course Management",
    description:
      "Professors can create and manage courses while students can easily access their enrolled courses.",
  },
  {
    icon: "📝",
    title: "Assignment Management",
    description:
      "Create assignments, set deadlines and share important resources through OneDrive links.",
  },
  {
    icon: "👥",
    title: "Group Collaboration",
    description:
      "Create or join groups, manage members and collaborate with your classmates.",
  },
  {
    icon: "📊",
    title: "Submission Tracking",
    description:
      "Track assignment acknowledgements and monitor submission progress in one place.",
  },
];

function Home() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-gray-800">
      
{/* Navbar */}
<nav className="sticky top-0 z-50 border-b bg-white/95 backdrop-blur">
  <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

    {/* Logo */}
    <Link to="/" className="text-2xl font-bold text-indigo-600">
      Joineazy<span className="text-gray-800">.</span>
    </Link>

    {/* Desktop Navigation */}
    <div className="hidden items-center gap-8 md:flex">
      <a href="#home" className="hover:text-indigo-600">Home</a>
      <a href="#features" className="hover:text-indigo-600">Features</a>
      <a href="#how-it-works" className="hover:text-indigo-600">How It Works</a>
      <a href="#about" className="hover:text-indigo-600">About</a>
    </div>

    {/* Desktop Auth Buttons */}
    <div className="hidden items-center gap-3 md:flex">
      <Link
        to="/login"
        className="rounded-lg px-4 py-2 font-medium text-indigo-600 hover:bg-indigo-50"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700"
      >
        Get Started
      </Link>
    </div>

    {/* Mobile Hamburger Button */}
    <button
      onClick={() => setIsMenuOpen(!isMenuOpen)}
      className="text-3xl text-gray-800 md:hidden cursor-pointer"
      aria-label={isMenuOpen ? "Close menu" : "Open menu"}
      aria-expanded={isMenuOpen}
    >
      {isMenuOpen ? "✕" : "☰"}
    </button>
  </div>

  {/* Mobile Menu */}
  {isMenuOpen && (
    <div className="fixed w-full bg-white border-t  px-6 py-5 md:hidden">
      <div className="flex flex-col gap-5">

        <a href="#home" onClick={() => setIsMenuOpen(false)}>
          Home
        </a>

        <a href="#features" onClick={() => setIsMenuOpen(false)}>
          Features
        </a>

        <a href="#how-it-works" onClick={() => setIsMenuOpen(false)}>
          How It Works
        </a>

        <a href="#about" onClick={() => setIsMenuOpen(false)}>
          About
        </a>

        <div className="flex flex-col gap-3  pt-4">
          <Link
            to="/login"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg border border-indigo-600  py-2 text-center text-indigo-600"
          >
            Login
          </Link>

          <Link
            to="/register"
            onClick={() => setIsMenuOpen(false)}
            className="rounded-lg bg-indigo-600 py-2 text-center text-white"
          >
            Get Started
          </Link>
        </div>

      </div>
    </div>
  )}
</nav>


      {/* Hero Section */}
      <section id="home" className="bg-linear-to-br from-indigo-50 via-white to-blue-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-24 md:grid-cols-2">
          <div>
            <span className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
              One Platform. Better Collaboration.
            </span>

            <h1 className="mt-7 text-4xl font-extrabold leading-tight text-gray-900 md:text-6xl">
              Manage Courses & Assignments
              <span className="text-indigo-600"> Smarter.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Joineazy brings students and professors together to manage
              courses, assignments, groups and submissions — all in one place.
            </p>

            <div className="mt-9 flex gap-8 md:gap-4">
              <Link
                to="/register"
                className="rounded-lg bg-indigo-600 px-2 py-3 md:px-7 md:py-3 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-1 hover:bg-indigo-700"
              >
                Get Started →
              </Link>

              <a
                href="#features"
                className="rounded-lg border border-gray-300 px-4 py-4 md:px-7 md:py-3 font-semibold text-gray-700 transition hover:border-indigo-600 hover:text-indigo-600"
              >
                Explore Features
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-indigo-100 bg-white p-6 shadow-2xl shadow-indigo-100">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Welcome to</p>
                <h2 className="text-2xl font-bold text-indigo-600">Joineazy</h2>
              </div>
              <span className="rounded-xl bg-indigo-100 p-3 text-2xl">🎓</span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-indigo-50 p-5">
                <span className="text-3xl">📚</span>
                <h3 className="mt-3 font-bold">Courses</h3>
                <p className="mt-1 text-sm text-gray-500">Organize learning</p>
              </div>
              <div className="rounded-2xl bg-blue-50 p-5">
                <span className="text-3xl">📝</span>
                <h3 className="mt-3 font-bold">Assignments</h3>
                <p className="mt-1 text-sm text-gray-500">Manage deadlines</p>
              </div>
              <div className="rounded-2xl bg-purple-50 p-5">
                <span className="text-3xl">👥</span>
                <h3 className="mt-3 font-bold">Groups</h3>
                <p className="mt-1 text-sm text-gray-500">Work together</p>
              </div>
              <div className="rounded-2xl bg-green-50 p-5">
                <span className="text-3xl">📊</span>
                <h3 className="mt-3 font-bold">Progress</h3>
                <p className="mt-1 text-sm text-gray-500">Track submissions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <p className=" font-semibold text-indigo-600">FEATURES</p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Everything You Need in One Place
            </h2>
            <p className="mt-4 text-gray-600">
              Simplify academic management with tools designed for students
              and professors.
            </p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-2xl border border-gray-100 bg-white p-7 shadow-sm transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="text-4xl">{feature.icon}</div>
                <h3 className="mt-5 text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <p className="font-semibold text-indigo-600">HOW IT WORKS</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
              Get Started in Three Simple Steps
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                number: "01",
                title: "Create Your Account",
                description: "Register as a student or professor to get started.",
              },
              {
                number: "02",
                title: "Join or Manage Courses",
                description: "Students enroll in courses while professors create and manage them.",
              },
              {
                number: "03",
                title: "Manage Assignments",
                description: "Collaborate in groups, acknowledge submissions and track progress.",
              },
            ].map((step) => (
              <div key={step.number} className="rounded-2xl bg-white p-8 shadow-sm">
                <span className="text-4xl font-extrabold text-indigo-200">
                  {step.number}
                </span>
                <h3 className="mt-5 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 leading-7 text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <p className="font-semibold text-indigo-600">ABOUT JOINEAZY</p>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">
            Bringing Students and Professors Together
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Joineazy is a course and assignment management platform designed
            to make academic collaboration simpler. It helps professors
            organize coursework and monitor progress while giving students
            a convenient way to access assignments and collaborate in groups.
          </p>
          <Link
            to="/register"
            className="mt-8 inline-block rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700"
          >
            Join Joineazy Today →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 px-6 py-12 text-gray-300 rounded-t-4xl">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row">
          <div>
            <h2 className="text-2xl font-bold text-white">Joineazy.</h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">
              Making course and assignment management simpler for everyone.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-white text-center">Quick Links</h3>
            <div className="mt-4 flex  gap-3 text-sm">
              <a href="#home" className=" hover:underline hover:text-amber-400 duration-75 delay-100">Home</a>
              <a href="#features" className="hover:underline hover:text-amber-400 duration-75 delay-100">Features</a>
              <a href="#how-it-works" className="hover:underline hover:text-amber-400 duration-75 delay-100">How It Works</a>
              <Link to="/login" className="hover:underline hover:text-amber-400 duration-75 delay-100">Login</Link>
              <Link to="/register" className="hover:underline hover:text-amber-400 duration-75 delay-100">Register</Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Joineazy. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
