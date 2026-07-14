import { config } from "dotenv";
config(); // Load environment variables
import { auth } from "../src/lib/auth";
import { db } from "../src/lib/db";

async function main() {
  console.log("Seeding database...");
  try {
    const email = "admin@artisun.com";
    
    // Check if admin already exists
    const existingAdmin = await db.user.findUnique({
      where: { email }
    });

    if (existingAdmin) {
      console.log("Admin already exists!");
      return;
    }

    console.log("Creating admin user...");
    const res = await auth.api.signUpEmail({
      body: {
        email: email,
        password: "adminpassword",
        name: "Admin User",
      },
    });
    
    if (res?.user?.id) {
       // Elevate role to admin
       await db.user.update({
         where: { id: res.user.id },
         data: { role: "admin" }
       });
       
       // Explicitly verify their email so they can log in without checking inbox
       await db.user.update({
         where: { id: res.user.id },
         data: { emailVerified: true }
       });

       console.log("Admin generated successfully!");
       console.log("Email: admin@artisun.com");
       console.log("Password: adminpassword");
    }
  } catch (err) {
    console.error("Seed error:", err);
  }
}

main().catch(console.error);
