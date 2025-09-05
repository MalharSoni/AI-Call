# 🚀 Deploy AI-Call Online - Step by Step Guide

Your code is now on GitHub and ready for deployment! Follow these steps to get your AI receptionist live online.

## 🎯 Quick Deploy (5 minutes)

### Step 1: Deploy Main Server to Railway

1. **Go to [railway.app](https://railway.app)** and sign up/login
2. **Connect GitHub** and authorize Railway
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select:** `MalharSoni/AI-Call`
5. Railway will automatically detect your Node.js app and start building

**Add Environment Variables:**
Once deployed, go to your project → Variables tab and add your API keys from the setup process:

```bash
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token  
TWILIO_VOICE_NUMBER=your_twilio_phone_number
OPENAI_API_KEY=your_openai_api_key
ELEVENLABS_API_KEY=your_elevenlabs_api_key
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key
COHERE_API_KEY=your_cohere_api_key
PORT=3000
```

**Your Railway server URL will be:** `https://your-app-name.up.railway.app`

### Step 2: Deploy Web UI to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign up/login
2. **Click "New Project"** → **"Import Git Repository"**
3. **Select:** `MalharSoni/AI-Call`
4. **IMPORTANT:** Set **Root Directory** to: `apps/web`
5. **Add the same environment variables as above**
6. **Click Deploy**

**Your Vercel web UI URL will be:** `https://your-app-name.vercel.app`

### Step 3: Configure Twilio Webhooks

1. **Go to [Twilio Console](https://console.twilio.com)**
2. **Navigate to:** Phone Numbers → Manage → Active Numbers
3. **Click on your Twilio phone number**
4. **Set Voice Webhook URL to:** `https://your-railway-url.up.railway.app/voice/incoming`
5. **Set Method to:** HTTP POST
6. **Save Configuration**

### Step 4: Test Your Live System!

1. **Visit your Vercel URL** to access the web interface
2. **Enter a business website URL** to create an Agent Card
3. **Call your Twilio number** 
4. **Your AI receptionist should answer!**

## 🎊 You're Live!

Your AI-Call receptionist is now deployed and accessible worldwide:

- **📞 Phone Number:** Your Twilio number (handles AI calls)
- **🌐 Web Interface:** https://your-app.vercel.app
- **🚀 Server API:** https://your-app.up.railway.app
- **💾 Database:** Already configured with Supabase

## 🔧 Alternative Deployment Options

### Option B: Use Render (Instead of Railway)

1. Go to [render.com](https://render.com)
2. Connect GitHub → Select `MalharSoni/AI-Call`
3. Choose "Web Service"
4. Set Build Command: `npm run build`
5. Set Start Command: `npm run start`
6. Add all environment variables
7. Deploy!

### Option C: Use Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Run: `fly launch` in your project directory
3. Follow prompts to configure
4. Add environment variables with: `fly secrets set KEY=VALUE`
5. Deploy with: `fly deploy`

## 🎯 Success Checklist

- ✅ Railway/Render server is running
- ✅ Vercel web UI is accessible
- ✅ Environment variables configured
- ✅ Twilio webhook pointing to your server
- ✅ Supabase database schema set up
- ✅ Test call works end-to-end

**Your AI receptionist is now live and ready to handle calls 24/7!** 🎉

## 📞 How It Works Live

1. **Caller dials:** Your Twilio number
2. **Twilio routes to:** Your Railway server
3. **AI processes:** Speech using OpenAI Whisper
4. **AI responds:** Using GPT-4 with your business knowledge
5. **AI speaks:** Using ElevenLabs natural voice
6. **Actions:** Can send SMS booking links or transfer to staff

**Congratulations - you have a production AI receptionist system!** 🚀

## 💡 Pro Tips

- **Monitor your deployments** through Railway and Vercel dashboards
- **Check logs** if something isn't working
- **Scale automatically** - both platforms handle traffic spikes
- **Custom domains** - Add your own domain for a professional look
- **Analytics** - Both platforms provide usage analytics

Your AI receptionist is ready to handle real business calls!