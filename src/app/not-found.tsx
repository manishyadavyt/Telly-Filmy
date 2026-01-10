import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center gap-4">
      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Go Back Home
      </Link>
    </div>
  );
}
