// Servidor WebSocket (socket.io)

import { Server } from "socket.io";

export default function SocketHandler(req: any, res: any) {
  // Verifica se o servidor WebSocket já foi configurado
  if (res.socket.server.io) {
    // Se sim, a função termina
    res.end();
    return;
  }
  // Se não, é criada uma nova instância
  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  // Dispara quando um novo cliente se conecta
  io.on("connection", (socket) => {
    // Quando envia uma mensagem, essa mensagem vai para todos os clientes conectados
    socket.on("send-message", (obj) => {
      socket.broadcast.emit("receive-message", obj);
    });
  });

  res.end();
}
