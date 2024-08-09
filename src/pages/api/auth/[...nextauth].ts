import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://lznvwvpkygwodiqvmyqy.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6bnZ3dnBreWd3b2RpcXZteXF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMwNDE3MjcsImV4cCI6MjAzODYxNzcyN30.NZKqkjC1T7_4blHJdvDF_-UMt5U-pPCLCiuiiwYB3KM";
const supabase = createClient(supabaseUrl, supabaseKey);

export default NextAuth({
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        if (!credentials) {
          return null;
        }

        const { data, error } = await supabase
          .from("login")
          .select("name, email, password");

        if (error) {
          console.error("Erro ao buscar dados:", error);
          return null;
        }

        const user = data.find(
          (item: any) =>
            item.email === credentials.email &&
            item.password === credentials.password
        );

        if (user) {
          console.log(user)
          return  user ;
        }

        return null;
      },
    }),
  ],
});
