'use client';
import {useEffect} from 'react';
export default function OfflineReady(){useEffect(()=>{if(!('serviceWorker'in navigator))return;let reloaded=false;navigator.serviceWorker.register('/service-worker.js').then(()=>{navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!reloaded){reloaded=true;location.reload()}})}).catch(()=>{})},[]);return null}
