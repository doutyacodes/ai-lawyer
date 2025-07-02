'use client';

import { useEffect } from 'react';
import { redirect } from 'next/navigation';

const Page = () => {
  useEffect(()=>{
      redirect("/home")
  },[])

};

export default Page;
