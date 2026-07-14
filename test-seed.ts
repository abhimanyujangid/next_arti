import { auth } from "./src/lib/auth";

async function main() {
  try {
    const res = await auth.api.signUpEmail({
      body: {
        email: "admin@artisun.com",
        password: "adminpassword123",
        name: "Admin User",
      }
    });
    console.log("Success:", res);
  } catch (error) {
    console.error("Failed:", error);
  }
}
main();
