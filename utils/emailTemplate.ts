type VerificationEmailInput = {
  name: string;
  verificationCode: string;
};

const escapeHtml = (value: string): string => {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
};

export const buildVerificationEmail = ({
  name,
  verificationCode,
}: VerificationEmailInput) => {
  const safeName = escapeHtml(name);

  return {
    subject: "Verify your email",

    text: `
Hi ${name},

Your verification code is:

${verificationCode}

This code will expire in 10 minutes.

If you did not request this registration, you can ignore this email.
    `.trim(),

    html: `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Email Verification</title>
  </head>

  <body
    style="
      margin:0;
      padding:0;
      background-color:#f4f4f4;
      font-family:Arial, Helvetica, sans-serif;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      border="0"
      style="padding:40px 16px;"
    >
      <tr>
        <td align="center">
          <table
            width="100%"
            cellpadding="0"
            cellspacing="0"
            border="0"
            style="
              max-width:600px;
              background-color:#ffffff;
              border-radius:8px;
            "
          >
            <tr>
              <td style="padding:40px;">
                <h1
                  style="
                    margin:0 0 24px;
                    font-size:24px;
                    color:#111111;
                  "
                >
                  Verify your email
                </h1>

                <p
                  style="
                    margin:0 0 16px;
                    font-size:16px;
                    line-height:1.6;
                    color:#555555;
                  "
                >
                  Hi ${safeName},
                </p>

                <p
                  style="
                    margin:0 0 24px;
                    font-size:16px;
                    line-height:1.6;
                    color:#555555;
                  "
                >
                  Use the verification code below to complete your registration.
                </p>

                <div
                  style="
                    margin:0 0 24px;
                    padding:20px;
                    text-align:center;
                    background-color:#f7f7f7;
                    border-radius:6px;
                    font-size:32px;
                    font-weight:bold;
                    letter-spacing:8px;
                    color:#111111;
                  "
                >
                  ${verificationCode}
                </div>

                <p
                  style="
                    margin:0 0 10px;
                    font-size:14px;
                    line-height:1.6;
                    color:#777777;
                  "
                >
                  This code will expire in 10 minutes.
                </p>

                <p
                  style="
                    margin:0;
                    font-size:14px;
                    line-height:1.6;
                    color:#777777;
                  "
                >
                  If you did not request this registration, you can safely ignore this
                  email.
                </p>
              </td>
            </tr>
          </table>

          <p
            style="
              margin-top:20px;
              font-size:12px;
              color:#999999;
            "
          >
            © 2026
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
    `.trim(),
  };
};
