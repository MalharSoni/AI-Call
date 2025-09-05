import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  const { websiteUrl, bookingUrl, staffPhone } = req.body;
  
  if (!websiteUrl) {
    return res.status(400).json({ error: 'Website URL is required' });
  }
  
  try {
    // Trigger ingestion pipeline
    const ingestResponse = await fetch(`${process.env.INGEST_SERVICE_URL}/crawl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: websiteUrl })
    });
    
    if (!ingestResponse.ok) {
      throw new Error('Ingestion failed');
    }
    
    // Store business configuration
    // This would connect to Supabase in production
    const businessConfig = {
      websiteUrl,
      bookingUrl,
      staffPhone,
      twilioNumber: process.env.TWILIO_VOICE_NUMBER,
      createdAt: new Date().toISOString()
    };
    
    console.log('Business configured:', businessConfig);
    
    res.status(200).json({ 
      success: true,
      message: 'AI Receptionist configured successfully'
    });
  } catch (error) {
    console.error('Setup error:', error);
    res.status(500).json({ error: 'Setup failed' });
  }
}