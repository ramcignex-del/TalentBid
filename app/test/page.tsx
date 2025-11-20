export default function TestPage() {
  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', color: 'green' }}>✅ APPLICATION IS WORKING!</h1>
      <p style={{ fontSize: '24px', marginTop: '20px' }}>
        If you can see this page, the server is running correctly.
      </p>
      <div style={{ marginTop: '40px', fontSize: '18px' }}>
        <a href="/auth/signup" style={{ marginRight: '20px', color: 'blue' }}>Go to Signup</a>
        <a href="/auth/login" style={{ marginRight: '20px', color: 'blue' }}>Go to Login</a>
        <a href="/" style={{ color: 'blue' }}>Go to Home</a>
      </div>
    </div>
  );
}
