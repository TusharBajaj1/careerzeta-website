export default function Navbar() {
  return (
    <nav className="w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-8">

        <h1 className="text-2xl font-bold">
          Career<span className="text-blue-600">Zeta</span>
        </h1>

        <div className="hidden gap-8 text-gray-700 md:flex">
          <a href="#">Home</a>
          <a href="#">Program</a>
          <a href="#">Resources</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </div>

        <button className="rounded-lg bg-slate-900 px-5 py-3 text-white hover:bg-blue-600 transition">
          Apply Now
        </button>

      </div>
    </nav>
  );
}