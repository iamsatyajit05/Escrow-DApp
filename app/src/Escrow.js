export default function Escrow({
  address,
  arbiter,
  beneficiary,
  value,
  handleApprove,
}) {

  return (
    <div className="existing-contract">
      <ul className="fields text-white">
        <p className="mt-1"><b>Arbiter:</b> {arbiter.slice(0, 6)}...{arbiter.slice(-4)}</p>
        <p className="mt-1"><b>Beneficiary:</b> {beneficiary.slice(0, 6)}...{beneficiary.slice(-4)}</p>
        <p className="mt-1"><b>Value:</b> {value / 1000000000000000000} ETH</p>
        <div
          className="w-full bg-[#5aa75ae8] hover:bg-[#5aa75a] text-white text-center font-bold uppercase mt-5 px-6 py-2 rounded-md cursor-pointer transition-all duration-200"
          id={address}
          onClick={(e) => {
            e.preventDefault();

            handleApprove();
          }}
        >
          Approve
        </div>
      </ul>
    </div>
  );
}
