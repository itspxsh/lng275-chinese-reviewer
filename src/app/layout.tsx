import type { Metadata } from 'next';
import './globals.css';
import OfflineReady from '@/components/OfflineReady';
export const metadata:Metadata={title:'LNG275 · ทบทวนภาษาจีน',description:'ทบทวนคำศัพท์และเนื้อหาภาษาจีน บทที่ 1–8'};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="th"><body><OfflineReady/>{children}</body></html>}
