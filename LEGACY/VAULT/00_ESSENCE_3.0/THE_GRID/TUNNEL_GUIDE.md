# 🌐 ESSENCE DESIGNS — Mobile Command Bridge Tunneling & Security Guide

This guide details how to securely expose the local Mobile Command Server (running on port `3000`) to your smartphone. By using **Cloudflare Tunnels** or **ngrok** with authentication, you can safely monitor your workspace and execute builds on the go without exposing open ports to the raw internet.

---

## 🔒 SECURITY FIRST
Never expose raw HTTP ports (`3000`) directly to the public web. To maintain absolute control, you must place an authentication layer in front of the tunnel origin so that only you (via Google OAuth, GitHub, or a secure password) can access the dashboard.

---

## ⚡ OPTION 1: ngrok Tunnel (Fastest & Easiest)
ngrok allows you to route port 3000 over a secure HTTPS URL with built-in OAuth or basic credential protection in a single terminal command.

### Method A: Google OAuth Protection (Recommended)
Expose the server and only allow access if logged in with your specific Google Account.
```bash
# Replace 'drew@example.com' with your actual Google email address
ngrok http 3000 --oauth=google --oauth-allow-email=drew@example.com
```

### Method B: Basic Authentication Password Protection
Expose the server behind a traditional secure username/password prompt.
```bash
# Replace username and password with secure values
ngrok http 3000 --basic-auth="drew_admin:your_super_secure_pass_123!"
```

Once executed, copy the generated HTTPS link (e.g., `https://xxxx-xx-xx.ngrok-free.app`) and open it on your smartphone!

---

## 🛡️ OPTION 2: Cloudflare Tunnels (Enterprise Zero Trust - Free)
Cloudflare Tunnels (`cloudflared`) connect your local port directly to Cloudflare's edge network via an outbound connection. You can map it to a custom domain (e.g., `bridge.essencedesigns.com`) and protect it with **Cloudflare Zero Trust Access**.

### Step 1: Install cloudflared
Download the `cloudflared` CLI for Windows or your active platform:
- [Cloudflare Downloads](https://github.com/cloudflare/cloudflared/releases)

### Step 2: Authenticate and Login
```bash
cloudflared tunnel login
```
This opens a browser window. Select your Cloudflare site domain to authorize.

### Step 3: Create the Tunnel
```bash
cloudflared tunnel create essence-bridge
```
This generates a Tunnel ID and a credentials JSON file in your `.cloudflared` directory.

### Step 4: Configure the Tunnel
Create a configuration file `config.yml` in your `.cloudflared` folder (usually `C:\Users\Andrew\.cloudflared\config.yml`):
```yaml
tunnel: <TUNNEL_ID_OR_NAME>
credentials-file: C:\Users\Andrew\.cloudflared\<TUNNEL_ID>.json

ingress:
  - hostname: bridge.yourdomain.com
    service: http://localhost:3000
  - service: http_status:404
```

### Step 5: Route the Tunnel Domain
```bash
cloudflared tunnel route dns essence-bridge bridge.yourdomain.com
```

### Step 6: Set up Cloudflare Access (The Credential Layer)
1. Go to your **Cloudflare Zero Trust Dashboard** (one.dash.cloudflare.com).
2. Navigate to **Access** -> **Applications** -> **Add an Application**.
3. Select **Self-Hosted**.
4. Set the Application Domain to: `bridge.yourdomain.com`.
5. Under **Policies**, create an Allow Policy:
   - **Action**: Allow
   - **Rules**: Include -> Emails -> Add your personal email (e.g., `drew@yourdomain.com`).
6. Save the application.

Now, whenever you navigate to `https://bridge.yourdomain.com` on your mobile phone, Cloudflare will first demand a One-Time PIN sent to your email or a Google/GitHub login before forwarding you to your local command server!

### Step 7: Launch the Tunnel
Keep the tunnel running on your workstation:
```bash
cloudflared tunnel run essence-bridge
```

---

## 🚀 BOOTING THE INFRASTRUCTURE

To run your complete mobile system, follow these simple steps on your workstation:

1. **Start the Local Server**:
   Navigate to your INFRA folder and run the start script:
   ```bash
   cd C:\Users\Andrew\Projects\ESSENCE_DESIGNS\00_ESSENCE_CORE\INFRA
   npm start
   ```
2. **Launch your Tunnel**:
   Open a separate command line and boot ngrok or cloudflared using your chosen authentication method.
3. **Open on Mobile**:
   Navigate to the secure HTTPS URL on your phone, authenticate, and take full control of your studio on the go!
