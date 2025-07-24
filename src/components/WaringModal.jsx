import Image from 'next/image';

const WaringModal = ({ isOpen, onRequestClose, onOk }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 top-0 left-0 z-50 flex items-center justify-center h-screen bg-center bg-no-repeat bg-cover outline-none min-w-screen animated fadeIn faster focus:outline-none" id="modal-id">
      <div className="absolute bg-[#00000080] opacity-80 inset-0 z-0"></div>

      <div className=" w-[308px] p-[5px] relative mx-auto my-auto rounded-md shadow-lg  bg-white ">

        <section className='border-[1px] flex justify-between items-center border-[#979797] p-1 rounded-md bg-custom-gradient'>
          <h3 className='text-[#222222] text-[16px] italic font-bold pl-3'>Warning</h3>
          <div className="w-[20px] h-[21px] rounded-[2px] border-[1px] border-[#979797] bg-[#EFEFEF]"></div>
        </section>

        <section className='flex flex-col gap-[20px] py-[5px] px-[15px]'>
          <section className='flex flex-col items-center justify-center text-center'>
            <div className='flex items-center gap-1'>
              <Image src={"/images/war.png"} width={20} height={20} alt='..' />
              <h3 className='text-[#222222] text-[16px] font-normal'>NEVER forward the email</h3>
            </div>
            <h3 className='text-[#222222] text-[16px] font-normal'>you received with the PIN code!</h3>
          </section>


          <section className='text-[#222222] text-[16px] font-normal text-center'>Scammers will pretend to be MegaPersonals and ask to send the PIN code in SMS or email.</section>

          <section>
            <h3 className='text-[#222222] text-[18px] font-normal text-center'>DO NOT FALL FOR IT!</h3>
            <h3 className='text-[#222222] text-[16px] font-normal text-center'>This is how they hack your account.</h3>
          </section>

          <section className='flex justify-center pb-[20px]'>
            <button onClick={onOk} className='bg-[#177CEA] border border-[#101010] w-[38px] h-[29px] text-white rounded-[4px]'>OK</button>
          </section>
        </section>





      </div>
    </div>
  );
};

export default WaringModal;