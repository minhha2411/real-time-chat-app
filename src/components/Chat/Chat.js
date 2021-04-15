import React, {useState, useEffect} from 'react';
import queryString from 'querystring';
import io from 'socket.io-client';
import TextContainer from '../TextContainer/TextContainer';
import Messages from '../Messages/Messages';
import InfoBar from '../InfoBar/InfoBar';
import Input from '../Input/Input';

import './Chat.css';

let socket; 
function Chat({location}) {
    const [name, setName] = useState('');
    const [room, setRoom] = useState('');
    const [users, setUsers] = useState('');
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const ENDPOINT = 'https://real-time-chat-app-minhha.herokuapp.com/';
    let newLocation = location.search.slice(1);
 
    useEffect(() => {
        const {name, room} = queryString.parse(newLocation);
        socket = io(ENDPOINT);
        
        setName(name);
        setRoom(room);
        socket.emit('join' , {name, room}, (error)=>{
            if(error) {
                alert(error);
              }

        });

    },[ENDPOINT, location.search]);

    useEffect(() => {
          socket.on('message', (message) => {
              setMessages([...messages, message]);
          }); 
          socket.on("roomData", ({ users }) => {
            setUsers(users);
          });
          console.log("this is running");
    },[messages]);

    const sendMessage = (event) => {
        event.preventDefault();
        if(message){
            socket.emit('sendMessage', message, ()=> {
                setMessage('');
            })
        }
    }



    console.log(messages);
    console.log(users);
    
    
    return (
        <div className='outerContainer'>
            <div className='container'>

                 <InfoBar room={room} />
          <Messages messages={messages} name={name} />
          <Input message={message} setMessage={setMessage} sendMessage={sendMessage} />
                
            </div>
            <TextContainer users={users}/>
        </div>
    )
}

export default Chat
