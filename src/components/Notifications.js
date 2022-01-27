import React from 'react';
import { Alert, Container } from 'react-bootstrap';

const Notifications = (props) => (
  <Container>
    {props.value.map((message, i) => (
      <Alert variant={props.type} key={i}>
        {message}
      </Alert>
    ))}
  </Container>
);

export default Notifications;
