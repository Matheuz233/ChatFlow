import LogoutButton from "@/components/LogoutButton";
import { getSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import { supabase } from "../../lib/supabase";

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

let socket: any;

export default function Chat({ session }: any) {
  const [message, setMessage] = useState<string>("");
  const [allMessages, setAllMessages] = useState<any[]>([]);
  const [id, setId] = useState<number>(0);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("login")
        .select("*")
        .eq("user_id", session?.user?.id);

      if (data) {
        setName(data[0].name);
      }
    };
    fetchData();
  }, [session?.user?.id]);

  socketInitializer();

  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  async function socketInitializer() {
    // Faz a solicitação no servidor
    await fetch("/api/socket");
    // Criando uma conexão com um servidor
    socket = io();

    // Ouvinte de eventos para o evento de enviar a mensagem
    socket.on("receive-message", (data: any) => {
      // setAllMessages((prevMessages) => [...prevMessages, data]);
      setAllMessages([...allMessages, data]);
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const idMenssagem = id + 1;

    socket.emit("send-message", {
      idMenssagem,
      name,
      message,
    });

    setId(idMenssagem);
    setMessage("");
  }

  return (
    <div className="h-screen flex flex-col bg-gray-800 p-6">
      <h1 className="text-3xl font-bold text-slate-50 mb-6 text-center">
        Bate-Papo
      </h1>

      <div className="flex justify-between items-center pb-2">
        <div className="flex flex-col">
          <label>Seja Bem-Vindo(a) {name}</label>
        </div>

        <LogoutButton />
      </div>

      <div className="flex flex-col flex-grow  overflow-auto mb-6 p-3 bg-gray-700 rounded-lg">
        {allMessages.map(({ username, message }, id) => (
          <div key={id} className="flex items-start mb-4">
            <div className="chat-image avatar bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold mr-3">
              {name[0]}
            </div>
            <div className="chat-content">
              <div className="chat-header text-white font-semibold">
                {username}
              </div>
              <div className="chat chat-start bg-gray-600 text-white p-3 rounded-lg mt-1">
                {message}
              </div>
            </div>
          </div>
        ))}
      </div>

      <form
        className="flex flex-col w-full place-items-end"
        onSubmit={handleSubmit}>
        <input
          name="message"
          placeholder="Escreva sua mensagem aqui..."
          className="input input-bordered w-full p-3 rounded-lg bg-gray-600 text-white"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          autoComplete={"off"}
        />
        <div className="mt-2">
          Pressione <kbd className="kbd kbd-sm">Enter</kbd> para enviar a
          mensagem.
        </div>
      </form>
    </div>
  );
}
