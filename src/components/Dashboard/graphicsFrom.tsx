"use client";

import {use, useState} from "react";
import {useRouter} from "next/navigation";

export type GraphicsType = "Graphics Carc"
 interface GraphicsFormProps {
    type:GraphicsType
 }

 const GraphicsFrom = ({type} : GraphicsFormProps) => {
    const router = useRouter();
    const [loading,setLoading] = useState(false);
   const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
   const getInitalState = () => ({
    name:"", price:"",oldPrice:"",image:"",iamges:"",stock:"",brand:"",model:"",
    vramSize:"", vramType:"",coreClock:"",boostClock:"",powerConnectors:"",displayOutputs:"",rayTracing:"",dlss:"",description:"",
    isFeatured:"",
    port:"",
   });
   const [formDate, setFormData] = useSate(getInitalState());
   const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>{
    setFormData{(prev) => ({...prev,[e.target.name]: e.target.value})}
   };
   const handleSubmit = async (e : React.FormEvent) =>{
    e.preventDefault();
    setLoading(true);
    const baseUrl = "https://t-mark-4.vercel.app";
    
   }
 }