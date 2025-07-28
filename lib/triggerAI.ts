export async function triggerTailorAI(resume: string, jobDesc: string) {
  const N8N_URL = process.env.N8N_WEBHOOK_URL;
  if (!N8N_URL) {
    throw new Error('N8N_WEBHOOK_URL is not defined in environment variables');
  }

  try {
    const response = await fetch(N8N_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resume, jobDesc }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('n8n webhook response error:', response.status, errorText);
      throw new Error(`n8n webhook failed: ${errorText}`);
    }

    const data = await response.json();

    console.log('[triggerTailorAI] Response:', data)

    if (!data.tailoredResume) {
      throw new Error('Missing tailoredResume in response from AI.');
    }

    return data;
  } catch (err: any) {
    console.error('[triggerTailorAI Error]', err.message);
    throw new Error('AI tailoring failed. Using fallback.');
  }
}
