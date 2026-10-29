# Pinnacle Home Solutions

A simple, static residential contracting website. Open `index.html` in a browser to preview it. The site uses HTML, CSS, and a small amount of JavaScript and can be hosted on GitHub Pages without a build step.

## Set up the contact form

GitHub Pages serves static files and cannot send email by itself. The contact form uses [EmailJS](https://www.emailjs.com/) to send messages directly from the browser, without opening the visitor's email app.

1. Create an EmailJS account and connect an email service.
2. Create an email template. Set its **To Email** to Josue's email address and its **Reply To** to `{{email}}`. For example, use `New home project inquiry from {{name}}` as the subject and the following as the message:

   ```text
   Name: {{name}}
   Email: {{email}}
   Phone: {{phone}}

   Project details:
   {{details}}
   ```

3. Copy your service ID, template ID, and **public key** from EmailJS into the corresponding fields in `emailConfig` at the top of `contact.js`. Do not add a private key to this public website.
4. Publish the site and send a test message to confirm it arrives and that replies go to the visitor. Until the three values are set, the form displays a setup message and cannot send.

EmailJS may have usage limits and spam protection settings; review those in your account. Restrict allowed origins to your GitHub Pages domain in EmailJS when configuring the account.

## Before publishing

- Replace the illustrative stock image URLs with real project photos when available. Photos and Google Fonts currently require an internet connection.
- Check the service descriptions and copy against the work Josue offers.

## Publish with GitHub Pages

Push these files to the repository, then in GitHub go to **Settings → Pages**, choose **Deploy from a branch**, and select the branch and `/ (root)` folder containing the files. Save and use the URL GitHub provides. All internal links are relative, so the site also works under a repository subpath.
