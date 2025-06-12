
import './App.css';
import io from 'socket.io-client';
import { useState } from 'react';
import Chat from './Chat';
import { Container, CardContent, Card, Icon, FormField, Button, Form } from 'semantic-ui-react'

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", { username, room });
      setShowChat(true);
    }
  }

  return (
    <>
      <Container>
        {!showChat?
          <Card fluid>
          <CardContent header='Unirme al chat' />
          <CardContent>
            <Form>
              <FormField>
                <label>Username</label>
                <input type="text" placeholder='Ingresa tu nombre'
                  onChange={e => setUsername(e.target.value)} />
              </FormField>
              <FormField>
                <label>Room</label>
                <input type="text" placeholder='ID Sala:'
                  onChange={e => setRoom(e.target.value)} />
              </FormField>
              <Button onClick={joinRoom}>Unirme</Button>
            </Form>
          </CardContent>
          <CardContent extra>
            <Icon name='user' />4 Friends
          </CardContent>
        </Card>
        :
        <Chat socket={socket} username={username} room={room}></Chat>}
      </Container>
    </>
  )
}

export default App
