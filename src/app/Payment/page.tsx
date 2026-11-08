"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./payment.module.scss";
import { useSession } from "next-auth/react";
import { Trash2, X, AlertTriangle } from "lucide-react"; // আইকন যোগ করা হয়েছে

interface OrderItem {
    name: string;
    price: number;
    _id: string;
    image: string;
    quantity: number;
}

interface Payment {
    _id: string;
    userEmail: string;
    userImage: string;
    items: OrderItem[];
    totalAmount: number;
    paymentStatus: string;
    transactionId: string;
}

const PaymentPage = () => {
    const { data: session, status } = useSession();
    const [paymentData, SetPaymentData] = useState<Payment[]>([]);
    const [loading, SetLoading] = useState<boolean>(true);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const userEmail = session?.user?.email;
    const userImage = session?.user?.image;

    const fetchPaymentData = async () => {
        if (status === "loading" || !userEmail) return;

        SetLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/paymentData`);
            if (!response.ok) throw new Error("Network response was not ok");

            const result = await response.json();
            const data = result.data || result;

            if (Array.isArray(data)) {
                const myPaymentData = data.filter((item: Payment) => item.userEmail === userEmail);
                SetPaymentData(myPaymentData);
            }
        } catch (error) {
            console.error("Fetch error:", error);
        } finally {
            SetLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentData();
    }, [userEmail, status]);

    // ডিলিট ফাংশন
    const handleDelete = async (id: string) => {
        setDeleteLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/delete/${id}`, {
                method: "DELETE",
                credentials: "include"
            });
            if (res.ok) {
                SetPaymentData(prev => prev.filter(item => item._id !== id));
                setIsDeleteModalOpen(null);
            }
        } catch (err) {
            console.error("Delete error:", err);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (status === "loading" || loading) {
        return (
            <section className="bg-[#DEDEDE] min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-[#f25623]/20 border-t-[#f25623] rounded-full animate-spin"></div>
                    <p className="font-bebas text-[#f25623] tracking-[0.4em] uppercase text-xs">Syncing_Arsenal...</p>
                </div>
            </section>
        );
    }

    if (status === "unauthenticated") {
        return (
            <section className="bg-[#DEDEDE] min-h-screen flex items-center justify-center p-6">
                <div className="max-w-md w-full flex flex-col items-center justify-center p-12 border border-[#4D4D4D]/15 rounded-[40px] bg-[#EAEAEA] backdrop-blur-3xl text-center shadow-lg">
                    <h2 className="text-4xl font-bebas tracking-widest text-[#4D4D4D] mb-4 italic">Access_Denied</h2>
                    <p className="text-[#4D4D4D]/60 mb-10 font-mono text-[10px] uppercase tracking-[0.3em]">Identify yourself to access the log</p>
                    <Link href="/login" className="w-full py-4 bg-[#f25623] text-white font-black uppercase tracking-widest rounded-2xl hover:bg-[#d94514] transition-all duration-500">
                        Authorize Now
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="bg-[#DEDEDE] text-[#4D4D4D] min-h-screen font-inter flex items-center justify-center py-32 relative overflow-hidden">
                <div className="max-w-4xl w-full px-6 relative z-10 flex flex-col items-center">

                    {/* User Profile */}
                    <div className="flex flex-col items-center mb-20 space-y-6">
                        <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-[#f25623] shadow-[0_0_40px_rgba(242,86,35,0.25)]">
                            {userImage ? (
                                <Image src={userImage} alt="User" fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full bg-[#EAEAEA] flex items-center justify-center text-4xl font-bebas text-[#f25623]">
                                    {session?.user?.name?.[0] || "S"}
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl font-bebas italic tracking-widest uppercase mb-2 text-[#4D4D4D]">{session?.user?.name}</h1>
                            <p className="text-[#f25623] text-[10px] font-mono uppercase tracking-[0.4em] px-4 py-1.5 border border-[#f25623]/30 rounded-full bg-[#f25623]/10 font-bold">{userEmail}</p>
                        </div>
                    </div>

                    <h2 className="text-7xl md:text-9xl font-bebas italic mb-16 tracking-tighter text-center uppercase leading-none text-[#4D4D4D]">
                        PAYMENT <span className="text-[#f25623]">DATA</span>
                    </h2>

                    {paymentData.length > 0 ? (
                        <div className="w-full space-y-10">
                            {paymentData.map((item: Payment) => (
                                <div
                                    key={item._id}
                                    className="relative group w-full bg-[#EAEAEA] border border-[#4D4D4D]/15 p-12 flex flex-col items-center text-center rounded-[50px] hover:border-[#f25623]/40 transition-all duration-700 overflow-hidden shadow-sm"
                                >
                                    <div className="absolute top-10 right-10">
                                        <button
                                            onClick={() => setIsDeleteModalOpen(item._id)}
                                            className="p-4 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-500/20 hover:border-red-500"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>

                                    <div className="mb-8">
                                        <h3 className="text-[10px] uppercase tracking-[0.5em] text-[#4D4D4D]/50 mb-4 font-black">Record_Reference</h3>
                                        <p className="font-mono text-xs text-[#4D4D4D] bg-[#DEDEDE] px-6 py-2.5 rounded-xl border border-[#4D4D4D]/15">
                                            {item.transactionId}
                                        </p>
                                    </div>

                                    <div className="mb-10">
                                        <p className="text-7xl md:text-8xl font-bebas font-black tracking-tighter text-[#f25623] leading-none mb-6">
                                            ${item.totalAmount.toFixed(2)}
                                        </p>
                                        <span className={`inline-block text-[11px] uppercase font-black tracking-[0.4em] px-10 py-3 rounded-full border-2 ${item.paymentStatus === 'pending'
                                            ? 'border-yellow-500/30 text-yellow-600 bg-yellow-500/10'
                                            : 'border-[#f25623]/30 text-[#f25623] bg-[#f25623]/10'
                                            }`}>
                                            {item.paymentStatus}
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap justify-center gap-3 transition-all duration-500">
                                        {item.items.map((orderItem, i) => (
                                            <div key={i} className="text-[10px] font-bold border border-[#4D4D4D]/15 px-5 py-2 rounded-xl uppercase tracking-widest bg-[#DEDEDE] text-[#4D4D4D]">
                                                {orderItem.name} <span className="text-[#f25623] ml-2 font-bold">x{orderItem.quantity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full border-2 border-dashed border-[#4D4D4D]/20 p-32 flex flex-col items-center justify-center rounded-[60px] bg-[#EAEAEA]">
                            <p className="text-[#4D4D4D]/30 font-bebas text-6xl tracking-widest uppercase italic mb-8">Log_Empty</p>
                            <Link href="/Store" className="px-12 py-4 bg-[#f25623] text-white text-[10px] font-black uppercase tracking-[0.4em] rounded-2xl hover:bg-[#d94514] transition-all duration-500">
                                Return_To_Store
                            </Link>
                        </div>
                    )}
                </div>

                {/* Watermark */}
                <div className="fixed bottom-[-2vw] right-[-2vw] opacity-[0.04] font-bebas text-[25vw] italic pointer-events-none select-none text-[#4D4D4D] leading-none -rotate-12">
                    SINNERS
                </div>
            </section>

            {/* --- DELETE CONFIRMATION MODAL --- */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-[500] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
                    <div className="bg-zinc-950 border border-red-500/20 w-full max-w-md p-14 rounded-[50px] text-center shadow-[0_0_100px_rgba(239,68,68,0.1)]">
                        <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-8">
                            <AlertTriangle className="text-red-500" size={40} />
                        </div>
                        <h3 className="text-4xl font-bebas text-red-500 italic mb-6 uppercase tracking-wider">Confirm_Erase</h3>
                        <p className="text-[11px] text-white/30 uppercase tracking-[0.3em] mb-12 leading-relaxed font-mono">
                            Warning: This action will permanently remove this record from the archive.
                        </p>
                        <div className="flex gap-6">
                            <button
                                onClick={() => setIsDeleteModalOpen(null)}
                                className="flex-1 py-5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white/5 transition-all"
                            >
                                Abort
                            </button>
                            <button
                                onClick={() => handleDelete(isDeleteModalOpen)}
                                disabled={deleteLoading}
                                className="flex-1 py-5 bg-red-500 text-white rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-red-600 shadow-xl shadow-red-500/20 transition-all disabled:opacity-50"
                            >
                                {deleteLoading ? "Erasing..." : "Proceed"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default PaymentPage;