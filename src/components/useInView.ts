'use client';
import { useEffect,useState,type RefObject } from 'react';
export function useInView(ref:RefObject<Element|null>){const [visible,setVisible]=useState(false);useEffect(()=>{const el=ref.current;if(!el)return;const ob=new IntersectionObserver(es=>{if(es.some(e=>e.isIntersecting)){setVisible(true);ob.disconnect()}},{rootMargin:'100px'});ob.observe(el);return()=>ob.disconnect()},[ref]);return visible}
