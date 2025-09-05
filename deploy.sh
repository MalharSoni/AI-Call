#!/bin/bash

echo "🚀 Deploying AI-Call to Production..."

# 1. Commit and push latest changes
echo "📦 Pushing to GitHub..."
git add .
git commit -m "Add production deployment configs

- Add Railway deployment configuration
- Add Vercel config for web UI
- Add Dockerfile for containerized deployment
- Configure environment variables for production

🚀 Ready for deployment"

git push origin main

echo "✅ Pushed to GitHub!"

# 2. Instructions for manual deployment
echo ""
echo "🔧 Next Steps for Deployment:"
echo ""
echo "=== DEPLOY MAIN SERVER TO RAILWAY ==="
echo "1. Go to https://railway.app"
echo "2. Sign up/login and connect your GitHub account"
echo "3. Click 'New Project' → 'Deploy from GitHub repo'"
echo "4. Select: MalharSoni/AI-Call"
echo "5. Railway will auto-detect the Node.js app"
echo "6. Add these environment variables:"
echo "   - TWILIO_ACCOUNT_SID=$TWILIO_ACCOUNT_SID"
echo "   - TWILIO_AUTH_TOKEN=$TWILIO_AUTH_TOKEN"
echo "   - TWILIO_VOICE_NUMBER=$TWILIO_VOICE_NUMBER"
echo "   - OPENAI_API_KEY=$OPENAI_API_KEY"
echo "   - ELEVENLABS_API_KEY=$ELEVENLABS_API_KEY"
echo "   - SUPABASE_URL=$SUPABASE_URL"
echo "   - SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY"
echo "   - SUPABASE_SERVICE_ROLE=$SUPABASE_SERVICE_ROLE"
echo "   - COHERE_API_KEY=$COHERE_API_KEY"
echo "   - PORT=3000"
echo ""
echo "=== DEPLOY WEB UI TO VERCEL ==="
echo "1. Go to https://vercel.com"
echo "2. Sign up/login and connect GitHub"
echo "3. Click 'Import Project' → Select MalharSoni/AI-Call"
echo "4. Set Root Directory to: apps/web"
echo "5. Add environment variables (same as above)"
echo "6. Deploy!"
echo ""
echo "=== UPDATE TWILIO WEBHOOKS ==="
echo "1. Go to Twilio Console → Phone Numbers"
echo "2. Click on +16475592113"
echo "3. Set Voice Webhook URL to: [YOUR-RAILWAY-URL]/voice/incoming"
echo "4. Save configuration"
echo ""
echo "🎉 Your AI receptionist will be live!"