import { loadEnv } from 'vite'
const env = loadEnv('development', process.cwd(), '')
let failures = 0
const missing = value => !value || /^(YOUR_|PASTE_|<)/i.test(value)
const report = (name, ok, advice) => { console.log(`${ok ? 'OK' : 'NEEDS SETUP'}: ${name}${ok ? '' : ' - ' + advice}`); if (!ok) failures++ }
let validUrl = false
try { const url = new URL(env.VITE_SUPABASE_URL); validUrl = url.protocol === 'https:' || (url.protocol === 'http:' && ['localhost','127.0.0.1'].includes(url.hostname)) } catch { /* Unset/invalid URL. */ }
report('Supabase project URL', validUrl, 'Paste the project URL into VITE_SUPABASE_URL in .env.local.')
const key = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY
let privateKey = key?.startsWith('sb_secret_') || false
if (key?.startsWith('eyJ')) { try { privateKey ||= JSON.parse(Buffer.from(key.split('.')[1], 'base64url').toString()).role === 'service_role' } catch { /* Checked below. */ } }
report('Supabase public key', !missing(key) && !privateKey, privateKey ? 'Use the publishable key, never a secret/service-role key.' : 'Paste the publishable key into VITE_SUPABASE_PUBLISHABLE_KEY.')
report('Mistral API key', !missing(env.MISTRAL_API_KEY), 'Create a Mistral Studio API key and paste it into MISTRAL_API_KEY.')
const origins = (env.ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(Boolean)
report('Allowed app origins', origins.length > 0 && origins.every(origin => {try {const url=new URL(origin);return url.origin === origin && ['http:','https:'].includes(url.protocol)} catch {return false}}), 'Use exact origins separated by commas, such as http://localhost:5173.')
const exposedSecrets = Object.keys(env).filter(key => key.startsWith('VITE_') && /MISTRAL|SERVICE_ROLE|SECRET/i.test(key) && env[key])
report('Server secrets excluded from browser settings', exposedSecrets.length === 0, 'Remove secret values from VITE_-prefixed variables.')
if (process.argv.includes('--live') && !failures) {
  for (const service of [
    { name: 'Supabase public API', url: env.VITE_SUPABASE_URL.replace(/\/$/,'')+'/auth/v1/settings', headers: {apikey:key} },
    { name: 'Mistral API key', url: 'https://api.mistral.ai/v1/models', headers: {Authorization:'Bearer '+env.MISTRAL_API_KEY} },
  ]) {
    try { const response = await fetch(service.url,{headers:service.headers,signal:AbortSignal.timeout(15000)});report(service.name,response.ok,'Request returned HTTP '+response.status+'. Check the corresponding key/account.') }
    catch { report(service.name,false,'Could not reach the service. Check network access and configuration.') }
  }
}
console.log('\nNo key values were printed. This check does not deploy functions, apply migrations, or verify social provider setup.')
if (!process.argv.includes('--live')) console.log('After filling the values, optional credential check: npm run setup:check -- --live (no AI generation).')
process.exitCode = failures ? 1 : 0
