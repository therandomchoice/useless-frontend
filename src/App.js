import React, { useEffect } from 'react';
import { Container, Button } from 'react-bootstrap';
import Notifications from './components/Notifications';
import About from './components/About';
import MintBurnForm from './components/MintBurnForm';
import { useDispatch, useSelector } from 'react-redux';
import {
  connectWallet,
  mint,
  burn,
  registerToken,
  resetEthError,
  resetHash,
} from './reducers/Web3Reducer';
import { setWarning, addTimedInfo } from './reducers/InfoReducer';

function App() {
  const dispatch = useDispatch();
  const web3 = useSelector((state) => state.web3);
  const warnings = useSelector((state) => state.warnings);

  useEffect(() => {
    if (!web3.isMetamask) {
      dispatch(setWarning('Plese install Metamask to do something useless'));
      return;
    }
    if (!web3.address) {
      dispatch(
        setWarning('Please connect your account to do something useless')
      );
      return;
    }
    if (web3.chainId && web3.chainId !== '0x3') {
      dispatch(
        setWarning(
          'Switch the network to Ropsten testnet, ' +
            'there is no point in wasting real ether on something so useless'
        )
      );
      return;
    }
    if (web3.balance && Number(web3.balance) === 0) {
      const faucet = 'https://faucet.dimensions.network';
      dispatch(
        setWarning(
          <>
            You don't have ether, use the {}
            <a href={faucet} target='_blank' rel='noreferrer'>
              Ropsten Faucet
            </a>
            {} to get some
          </>
        )
      );
      return;
    }
    if (web3.error) {
      if (web3.error.code === 4001) {
        dispatch(setWarning('Do not reject useless actions'));
        setTimeout(() => dispatch(resetEthError()), 10000);
      }
      return;
    }
    dispatch(setWarning(null));
    if (web3.hash) {
      const link = 'https://ropsten.etherscan.io/tx/' + web3.hash;
      dispatch(
        addTimedInfo(
          10,
          <>
            Check transaction at{' '}
            <a href={link} target='_blank' rel='noreferrer'>
              {link}
            </a>
          </>
        )
      );
      dispatch(resetHash());
    }
  }, [web3, dispatch]);

  return (
    <Container className='my-3'>
      <Container className='d-flex justify-content-end'>
        <Button
          variant='primary'
          size='lg'
          onClick={() => dispatch(connectWallet())}
        >
          connect
        </Button>
      </Container>
      <About />
      <MintBurnForm
        web3={web3}
        mint={(value) => dispatch(mint(value))}
        burn={(value) => dispatch(burn(value))}
        register={registerToken}
      />
      <Notifications type='warning' value={warnings.warnings} />
      <Notifications type='info' value={warnings.infos} />
    </Container>
  );
}

export default App;
