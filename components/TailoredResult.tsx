// components/TailoredResult.tsx
export default function TailoredResult({ result }: { result: string }) {
  return (
    <div className="bg-white p-6 rounded shadow max-w-4xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">🎉 Tailored Resume</h2>
      <pre className="whitespace-pre-wrap text-gray-800">{result}</pre>
    </div>
  )
}
