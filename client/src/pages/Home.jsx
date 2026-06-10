import React from 'react'
import {HomeTopbar} from "../components/HomeTopbar"
import {HomeSearchbar} from "../components/HomeSearchbar"
import {HomeNav} from "../components/HomeNav"
import {HomeChats} from "../components/HomeChats"
import {HomeFooter} from "../components/HomeFooter"

export const Home = () => {
    return (
        <div className='flex flex-col gap-4'>

            <HomeTopbar />

            <HomeSearchbar />

            <HomeNav />

            <HomeChats />

            <HomeFooter />

        </div>
    )
}
