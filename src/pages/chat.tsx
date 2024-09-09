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

  useEffect(() => {
    socketInitializer();
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  async function socketInitializer() {
    await fetch("/api/socket");
    socket = io();

    socket.on("receive-message", (data: any) => {
      setAllMessages((prevMessages) => [...prevMessages, data]);
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
    <div className="h-screen flex flex-col bg-[#313131]">
      <nav className="bg-gray-900 border-gray-200">
        <div className="max-w-screen flex flex-wrap items-center justify-between p-4">
          <a
            href="https://flowbite.com/"
            className="flex items-center space-x-3 rtl:space-x-reverse">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              ChatFlow
            </span>
          </a>
          <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <div className="chat-image avatar bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold mr-3">
              {name[0]}
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-grow">
        <aside className="w-1/5 bg-gray-800 p-4 overflow-auto">
          <h2 className="text-white text-lg mb-4">Recentes</h2>
          <ul className="space-y-2">
            <li className="py-4 px-4 rounded bg-gray-900">
              <div className="flex items-start space-x-4">
                <div className="flex flex-between flex-grow ">
                  <div className="flex-shrink-0">
                    {/* <img
                      className="w-8 h-8 rounded-full"
                      src="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
                      alt="Neil image"
                    /> */}
                  </div>
                  <div className="flex-1 max-w-56 ms-4">
                    <p className="text-sm font-semibold text-gray-900 truncate dark:text-white">
                      Jarder Silva
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {allMessages[allMessages.length - 1]?.message}
                    </p>
                  </div>
                </div>

                <div className="inline-flex items-center text-sm font-semibold text-gray-900 dark:text-white">
                  12:00
                </div>
              </div>
            </li>
          </ul>
        </aside>

        <main className="flex-1 flex flex-col bg-gray-700 p-3 overflow-auto">
          <div className="flex-1 overflow-auto">
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
            className="flex items-center gap-2 py-2 px-3 bg-gray-50 dark:bg-gray-700 w-full"
            onSubmit={handleSubmit}>
            <button
              type="button"
              className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600">
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <input
              name="message"
              placeholder="Escreva sua mensagem aqui..."
              className="input input-bordered w-full p-3 rounded-lg bg-gray-700 text-white"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              autoComplete={"off"}
              required
            />
            <button
              type="submit"
              className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600">
              <svg
                className="w-6 h-6 rotate-90"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </form>
        </main>
      </div>
    </div>
  );
}
