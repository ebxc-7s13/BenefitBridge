import Link from "next/link";

export default function Home() {
  return (
    <main>
      <h1>Find help you may already qualify for.</h1>
      <p className="lead">
        Answer a few questions to see which food, health, energy and phone programs fit your household. It takes about
        3 minutes.
      </p>
      <p>
        <Link className="button" href="/screener">
          Check what I qualify for
        </Link>
      </p>

      <div className="card">
        <h2 style={{ marginTop: 0 }}>Your answers stay on your phone</h2>
        <p style={{ marginBottom: 0 }}>
          No account. No name. No Social Security number. Nothing you enter is sent anywhere.
        </p>
      </div>

      <p className="notice">
        BenefitBridge is not a government website. Results are estimates. The agency that runs each program makes the
        final decision. For free help from a person, call or text <strong>211</strong>.
      </p>
    </main>
  );
}
