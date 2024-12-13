require("dotenv").config();
const sendEmail = require("./mail");

const runTest = async () => {
  const testCases = [
    {
      to: "masimukkusaritha@gmail.com",
      subject: "Test Email 1",
      text: "This is a test email for Case 1.",
    },
    {
      to: "shaikshanwaz75@gmail.com",
      subject: "Test Email 2",
      text: "This is a test email for Case 2.",
    },
  ];

  for (let i = 0; i < testCases.length; i++) {
    const { to, subject, text } = testCases[i];
    console.log(`Sending email ${i + 1}...`);
    await sendEmail(to, subject, text);
  }

  console.log("All test cases executed.");
};

runTest().catch((error) => console.error("Test script error:", error.message));
