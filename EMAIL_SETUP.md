# Email Setup Instructions

To enable email functionality for sending login credentials, you need to configure email settings.

## Option 1: Gmail (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"
   - Copy the 16-character password

3. **Update server/.env file**:
   ```
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_16_character_app_password
   EMAIL_FROM=noreply@dayflow.com
   ```

## Option 2: Other Email Services

### Outlook/Hotmail
```
EMAIL_HOST=smtp-mail.outlook.com
EMAIL_PORT=587
EMAIL_USER=your_email@outlook.com
EMAIL_PASS=your_password
EMAIL_FROM=noreply@dayflow.com
```

### SendGrid (for production)
```
EMAIL_HOST=smtp.sendgrid.net
EMAIL_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=YOUR_SENDGRID_API_KEY
EMAIL_FROM=noreply@yourdomain.com
```

## Testing

After configuring email:
1. Restart the server
2. Try signing up a new user
3. Check the email inbox for credentials

## Troubleshooting

- **Gmail "Less secure apps" error**: Use App Password instead of regular password
- **Authentication failed**: Double-check email and password
- **Connection timeout**: Check firewall and SMTP settings
- **No email received**: Check spam/junk folder

## Security Notes

- Never commit email credentials to version control
- Use environment variables for all sensitive data
- Consider using email services like SendGrid for production
- App passwords are more secure than regular passwords
