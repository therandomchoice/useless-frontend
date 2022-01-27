import { ethers } from 'ethers';

const { ethereum } = window;
const ropstenContractAddress = '0xd9548b9da25ec3d7b168f0693231489b49ec6e8d';

const isMetamask = () => ethereum !== undefined && ethereum.isMetaMask === true;

const initialState = {
  isMetamask: isMetamask(),
  address: '',
  chainId: '',
  balance: null,
  useless: null,
  hash: null,
  error: null,
};

const getEtherBalance = async (address) => {
  if (!ethereum || !address) {
    return { balance: null, error: null };
  }
  try {
    const balance = await ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });
    return { balance: ethers.utils.formatEther(balance), error: null };
  } catch (error) {
    console.log(error);
    return { balance: null, error };
  }
};

const getContract = () => {
  const abi = [
    'function balanceOf(address account) view returns (uint256)',
    'function transfer(address recipient, uint256 amount) returns (bool)',
    'function mint(uint256 amount)',
    'function burn(uint256 amount)',
  ];
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(ropstenContractAddress, abi, signer);
  return contract;
};

const getUselessBalance = async (address) => {
  if (!ethereum || !address) {
    return { useless: null, error: null };
  }
  try {
    const contract = getContract();
    const useless = await contract.balanceOf(address);
    return { useless: ethers.utils.formatEther(useless), error: null };
  } catch (error) {
    return { useless: null, error };
  }
};

export const connectWallet = () => async (dispatch) => {
  console.log('connectWallet');
  try {
    const accounts = await ethereum.request({
      method: 'eth_requestAccounts',
    });
    const balance = await getEtherBalance(accounts[0]);
    const useless = await getUselessBalance(accounts[0]);
    dispatch({
      type: 'update_web3',
      payload: {
        address: accounts[0],
        chainId: ethereum.chainId,
        balance: balance.balance,
        useless: useless.useless,
        error: balance.error || useless.error,
      },
    });
  } catch (error) {
    dispatch({ type: 'update_web3', payload: { ...initialState, error } });
    console.log(error);
  }
};

export const registerToken = () => {
  try {
    ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: ropstenContractAddress,
          symbol: 'USELESS',
          decimals: 18,
          image:
            'https://gateway.pinata.cloud/ipfs/QmY3bEVuYtwNBrbmTKDtKVkHbLWUEta77yxu3Y4jbhvWJ4',
        },
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const mint = (amount) => async (dispatch, getState) => {
  console.log('mint', amount);
  const contract = getContract();
  const value = ethers.utils.parseEther(amount.toString());
  try {
    const tx = await contract.mint(value);
    dispatch({ type: 'update_web3', payload: { hash: tx.hash } });
    await tx.wait();
    const address = getState().web3.address;
    const useless = await contract.balanceOf(address);
    dispatch({
      type: 'update_web3',
      payload: { useless: ethers.utils.formatEther(useless) },
    });
  } catch (error) {
    dispatch({ type: 'update_web3', payload: { error } });
    console.log(error);
  }
};

export const burn = (amount) => async (dispatch, getState) => {
  console.log('burn', amount);
  const contract = getContract();
  const value = ethers.utils.parseEther(amount.toString());
  try {
    const tx = await contract.burn(value);
    dispatch({ type: 'update_web3', payload: { hash: tx.hash } });
    await tx.wait();
    const address = getState().web3.address;
    const useless = await contract.balanceOf(address);
    dispatch({
      type: 'update_web3',
      payload: { useless: ethers.utils.formatEther(useless) },
    });
  } catch (error) {
    dispatch({ type: 'update_web3', payload: { error } });
    console.log(error);
  }
};

export const resetEthError = () => {
  return { type: 'update_web3', payload: { error: null } };
};

export const resetHash = () => {
  return { type: 'update_web3', payload: { hash: null } };
};

const accountsChanged = async (dispatch, accounts) => {
  console.log('account changed', accounts);
  const balance = await getEtherBalance(accounts[0]);
  const useless = await getUselessBalance(accounts[0]);
  dispatch({
    type: 'update_web3',
    payload: {
      address: accounts[0],
      balance: balance.balance,
      useless: useless.useless,
      error: balance.error || useless.error,
    },
  });
};

const chainChanged = async (dispatch, getState, chainId) => {
  console.log('chain changed', chainId);
  const address = getState().web3.address;
  const balance = await getEtherBalance(address);
  const useless = await getUselessBalance(address);
  dispatch({
    type: 'update_web3',
    payload: {
      chainId,
      balance: balance.balance,
      useless: useless.useless,
      error: balance.error || useless.error,
    },
  });
};

export const subscribe = (dispatch, getState) => {
  if (ethereum) {
    ethereum.on('accountsChanged', accountsChanged.bind(undefined, dispatch));
    ethereum.on(
      'chainChanged',
      chainChanged.bind(undefined, dispatch, getState)
    );
  }
};

const Web3Reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'update_web3':
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default Web3Reducer;
