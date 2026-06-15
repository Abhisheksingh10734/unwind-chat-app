import React from 'react';
import { HomeTopbar } from "../components/HomeTopbar";
import { HomeSearchbar } from "../components/HomeSearchbar";
import { HomeNav } from "../components/HomeNav";
import { HomeChats } from "../components/HomeChats";
import { HomeFooter } from "../components/HomeFooter";


export const Home = () => {

    return (
        <div className='flex flex-col gap-4 px-4 py-2 pb-24 bg-[#0D0B1E] min-h-screen'>
            <HomeTopbar />
            <HomeSearchbar />
            <HomeNav />
            <HomeChats />
            <HomeFooter />
        </div>
    );
};