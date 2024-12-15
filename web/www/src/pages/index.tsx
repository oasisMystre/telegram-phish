import { Link } from "react-router";

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center space-y-4 text-center px-4">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-extrabold">Human Verification</h1>
        <p className="text-base font-bold">Verify below to be granted entry</p>
      </div>
      <Link
        to="/auth"
        className="min-w-sm p-3 font-mono text-base rounded bg-gradient-to-r from-primary via-secondary to-tetiary hover:bg-gradient-to-br shadow-lg shadow-black/50 underline dark:shadow-lg dark:shadow-black/80"
      >
        Click here
      </Link>
    </main>
  );
}
