import { useState, useEffect } from 'react';
import { CardContent, Card, Container, FormField, Form, Input, MessageHeader, Message, Divider } from 'semantic-ui-react'
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, username, room }) => {
   const [currentMessage, setCurrentMessage] = useState("");
   const [messagesList, setMessagesList] = useState([]);

   const sendMessage = async () => {
      if (username && currentMessage) {
         const info = {
            message: currentMessage,
            room,
            author: username,
            time: new Date(Date.now()).getHours()
               + ":" +
               new Date(Date.now()).getMinutes()
         };

         await socket.emit("send_message", info);
         setMessagesList((list) => [...list, info]);
         setCurrentMessage("");
      }

   }

   useEffect(() => {
      const messageHandle = (data) => {
         setMessagesList((list) => [...list, data]);
      }
      socket.on("receive_message", messageHandle);

      return () => socket.off("receive_message", messageHandle);

   }, [socket]);


   return (
      <Container style={{}}>
         <Card fluid style={{ margin: "20px", padding: "10px" }}>
            <CardContent header={`Chat en vivo | sala: ${room}`} />
            <ScrollToBottom>
               <CardContent style={{ height: "400px" }}>
                  {messagesList.map(({ message, author, time }, index) => {
                     return (<span key={index}>
                        <Message style={{
                           textAlign:
                              username === author ? "right" : "left",
                        }}
                           success={username === author}
                           info={username !== author}
                        >
                           <MessageHeader>{message}</MessageHeader>
                           <p>Enviado por: {author} a las <i>{time}</i></p>
                        </Message>
                        <Divider />
                     </span>)
                  })}
               </CardContent>
            </ScrollToBottom>
            <CardContent extra >
               <Form>
                  <FormField>
                     <label>Username</label>
                     <Input
                        action={{
                           color: 'teal',
                           labelPosition: 'right',
                           icon: 'send',
                           content: 'Enviar',
                           onClick: sendMessage,
                        }}
                        type="text" placeholder='Mensaje...' value={currentMessage}
                        onChange={e => setCurrentMessage(e.target.value)} />
                  </FormField>
               </Form>
            </CardContent>
         </Card>
      </Container>
   )
}

export default Chat