'use client';
import {useEffect} from 'react';
export default function OfflineReady(){useEffect(()=>{if(!('serviceWorker'in navigator))return;let reloaded=false;const refresh=()=>{if(!reloaded){reloaded=true;location.reload()}};navigator.serviceWorker.addEventListener('controllerchange',refresh);navigator.serviceWorker.register('/service-worker.js',{updateViaCache:'none'}).then(registration=>registration.update()).catch(()=>{});return()=>navigator.serviceWorker.removeEventListener('controllerchange',refresh)},[]);return null}
