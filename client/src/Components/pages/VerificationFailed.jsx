import React from 'react';

const VerificationFailed = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#eaeaf1]">
      <h1 className="text-[96px] font-bold text-[#c78094] text-center leading-none">
        VERIFICATION <br /> FAILED
      </h1>
      <p className="mt-4 text-xl text-center text-black">
        Sorry, We could not verify your identity. Please try again.
      </p>
      <button className="mt-8 px-6 py-2 text-xl font-semibold text-white bg-[#c78094] rounded-full hover:bg-[#b56b80]">
        TRY AGAIN
      </button>
    </div>
  );
};

export default VerificationFailed;
