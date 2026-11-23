
export const template = (
  otp: string,
  username: string,
  subject: string
): string => `<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    }
    .email-container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border: 1px solid #dddddd;
      border-radius: 8px;
      overflow: hidden;
    }
    .email-header {
      background-color: #007BFF;
      color: #ffffff;
      padding: 20px;
      text-align: center;
    }
    .email-body {
      padding: 24px;
      color: #333333;
      line-height: 1.6;
    }
    .activation-button {
      display: inline-block;
      margin: 16px 0;
      padding: 12px 24px;
      background-color: #007BFF;
      color: #ffffff;
      border-radius: 6px;
      letter-spacing: 3px;
      text-align: center;
    }
    .email-footer {
      background-color: #f9f9f9;
      padding: 16px;
      text-align: center;
      font-size: 12px;
      color: #777777;
      border-top: 1px solid #eeeeee;
    }
    .email-footer a {
      color: #007BFF;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="email-header">
      <h1>${subject}</h1>
    </div>
    <div class="email-body">
      <h2>Hello ${username},</h2>
      <p>Thank you for signing up with Route Academy. To complete your registration and start using your account, please use the code below to activate your account:</p>
      <h2 class="activation-button">${otp}</h2>
      <p>If you did not sign up for this account, please ignore this email.</p>
      <p>Best regards,<br>social media Application Team</p>
    </div>
    <div class="email-footer">
      <p>&copy; 2024 Route Academy. All rights reserved.</p>
      <p><a href="[SupportLink]">Contact Support</a> | <a href="[UnsubscribeLink]">Unsubscribe</a></p>
    </div>
  </div>
</body>
</html>`;