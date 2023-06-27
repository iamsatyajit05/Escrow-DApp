import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import deploy from './deploy';
import Escrow from './Escrow';

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  const approveTxn = await escrowContract.connect(signer).approve();
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send('eth_requestAccounts', []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById('beneficiary').value;
    const arbiter = document.getElementById('arbiter').value;
    const eth = document.getElementById('eth').value.toString();
    const wei = ethers.utils.parseUnits(eth, "ether");
    const value = ethers.BigNumber.from(wei);
    const escrowContract = await deploy(signer, arbiter, beneficiary, value);


    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: value.toString(),
      handleApprove: async () => {
        escrowContract.on('Approved', () => {
          document.getElementById(escrowContract.address).onclick = "";
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <div className='bg-slate-950 min-h-screen w-screen'>
      <div className='max-w-[425px] m-auto'>
        <nav className='text-white text-2xl font-bold text-center py-4'>Escrow DApp</nav>

        <div className="bg-slate-950 rounded-md mt-5 p-6 border-[1px] border-slate-400">
          <h1 className='text-white text-center uppercase'>New Contract</h1>
          <label className='flex flex-col text-white my-5'>
            Arbiter Address
            <input type="text" id="arbiter" className='bg-slate-950 rounded-md border-[1px] border-slate-400 mt-1 p-2' />
          </label>

          <label className='flex flex-col text-white my-5'>
            Beneficiary Address
            <input type="text" id="beneficiary" className='bg-slate-950 rounded-md border-[1px] border-slate-400 mt-1 p-2' />
          </label>

          <label className='flex flex-col text-white my-5'>
            Deposit Amount (in Eth)
            <input type="text" id="eth" className='bg-slate-950 rounded-md border-[1px] border-slate-400 mt-1 p-2' />
          </label>

          <div
            className="w-full bg-[#f58427ee] hover:bg-[#f58427] text-white text-center font-bold uppercase mt-5 px-6 py-2 rounded-md cursor-pointer transition-all duration-200"
            id="deploy"
            onClick={(e) => {
              e.preventDefault();

              newContract();
            }}
          >
            Deploy
          </div>
        </div>

        <div className="existing-contracts max-w-[425px] mt-10 p-6 bg-slate-950 rounded-md border-[1px] border-slate-400">
          <h1 className='text-white text-center mb-5'>Existing Contracts</h1>

          <div id="container">
            {escrows.map((escrow) => {
              return <Escrow key={escrow.address} {...escrow} />;
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
