"use client"

import { useState } from 'react';
import Image from 'next/image'
import { url, headers } from '@/utils/api';
import { signIn } from 'next-auth/react';
import axios from "axios";
import Link from 'next/link';
import { PublicRoute } from '@/utils/auth';
import { LoadingSpin } from '@/utils/LoadingSpin';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function Home() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { data: session } = useSession();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const emailCheck = await axios.get(`${url}/api/findByEmail/${email}`, { headers });
    if (Array.isArray(emailCheck.data) && emailCheck.data.length > 0) {
      const response = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false,
      });
      setLoading(false)
      response.ok && router.push(`${url}AuthenticateAccount`)
      response.error && alert("Failed to Login! Please check the email or password.")
    } else {
      alert("You don't have account yet!")
      setLoading(false)
    }
  };

  if (session) {
    router.push(`${url}AuthenticateAccount`)
  }

  return (
    <main >
      <PublicRoute>
        <div className="text-green-700 w-screen h-screen flex justify-center items-center">
          <div className="mx-8 md:p-10 md:border md:rounded-xl md:h-96 md:w-96">
            <div className="flex my-4 justify-center w-full items-center">
              <div className='w-1/4 flex justify-center'>
                <Image height={100} width={100} src={"/logo.png"} alt='logo' />
              </div>
              <h4 className="w-3/4 text-center">Talangan Integrated National High School</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4 text-sm">
                <input
                  type="email"
                  className="w-full text-xs px-3 py-2 border border-black"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>
              <div className="mb-4">
                <input
                  type="password"
                  className="w-full text-xs px-3 py-2 border border-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
              <button
                type="submit"
                className={`w-full py-2 my-4 bg-green-700 rounded-full text-white px-4 `}
                disabled={loading}
              >
                {loading ? <LoadingSpin loading={loading} /> : "Log In"}
              </button>
              <Link href={`${url}RegisterAccount`}>Register</Link>
            </form>
          </div>
        </div>
      </PublicRoute>
    </main>
  )
}
