# Gmail SMTP for Psykie

Supabase Auth can use Gmail SMTP for signup confirmation and password-reset emails. Configure it in Supabase, not in frontend code.

1. Turn on Google 2-Step Verification and create an App Password for Psykie: https://myaccount.google.com/apppasswords . Some managed/Advanced Protection accounts do not offer app passwords.
2. Open your Supabase project's Authentication > Email / SMTP settings and enable custom SMTP.
3. Use the settings below. Keep the App Password out of Git, chat, and `VITE_` variables.

| Setting | Value |
| --- | --- |
| Sender name | Psykie |
| Sender email | Your Gmail address |
| SMTP host | smtp.gmail.com |
| Port | 587 |
| Encryption | TLS / STARTTLS |
| Username | Your full Gmail address |
| Password | The Google App Password |

4. In Authentication > URL Configuration, set Site URL to `https://psykie.vercel.app`. Add `https://psykie.vercel.app/auth/callback` and `https://psykie.vercel.app/reset-password` to allowed redirects. Add the equivalent localhost URLs only for development.
5. Use Forgot password in Psykie with your own account to test delivery and the reset form. No email is sent automatically by the development tests.

Gmail SMTP is an account-email connection. It does not create scheduled study email jobs. The notification bell and optional browser alerts use real due cards, today's events, and recent activity while the app is open. Browser permission is requested only from the Enable browser alerts button.

References: [Supabase custom SMTP](https://supabase.com/docs/guides/auth/auth-smtp), [Google App Passwords](https://support.google.com/accounts/answer/185833), [Google SMTP settings](https://support.google.com/mail/answer/7104828).
