import React from 'react';
import { Container } from 'react-bootstrap';

const About = () => (
  <Container>
    <p>This is the frontend of the Useless token project. </p>
    <p>
      Any person can mint or burn an arbitrary amount of tokens. This property
      of course makes these tokens completely useless from an economic point of
      view. That's why they are called Useless.
    </p>
    <p>
      There is also one peculiarity of transfers. If a person transfers exactly
      5 Useless tokens, then this amount is not only transferred to the
      recipient, but also remains on the original account. This feature was
      added from the fairy tale of the unchangeable dime.
    </p>
    <p>
      The project only supports Metamask and only works on the Ropsten testnet.
      This is a pet project after all.
    </p>
  </Container>
);

export default About;
