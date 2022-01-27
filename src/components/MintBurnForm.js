import React, { useState } from 'react';
import { Form, Button, InputGroup, Row, Col } from 'react-bootstrap';

const MintBurnForm = (props) => {
  const [value, setValue] = useState(1);

  if (
    props.web3.address === '' ||
    props.web3.chainId !== '0x3' ||
    Number(props.web3.balance) === 0
  )
    return null;

  return (
    <Form>
      <Row className='m-3'>
        {props.web3.useless ? (
          <>You have {props.web3.useless} USELESS tokens</>
        ) : null}
      </Row>
      <Row className='m-3'>
        <InputGroup>
          <InputGroup.Text>Enter amount</InputGroup.Text>
          <Form.Control
            type='number'
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <Button onClick={() => setValue(props.web3.useless)}>max</Button>
        </InputGroup>
      </Row>
      <Row className='m-3'>
        <Col className='d-grid'>
          <Button size='lg' onClick={() => props.mint(value)}>
            mint
          </Button>
        </Col>
        <Col className='d-grid'>
          <Button size='lg' onClick={() => props.burn(value)}>
            burn
          </Button>
        </Col>
        <Col className='d-grid'>
          <Button onClick={props.register}>add token to Metamask</Button>
        </Col>
      </Row>
    </Form>
  );
};

export default MintBurnForm;
