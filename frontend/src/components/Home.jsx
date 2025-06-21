import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";
import UserCard from './UserCard';
import RatingBarChart from './RatingBarChart';
import RatingGraph from './RatingGraph';
import PieChartData from './PieChartData';
import HeatMap from './HeatMap';

const Home = ({user}) => {
    // const location = useLocation();
    // const user=location.state?.user;
    return (
        <div className="space-y-8">
            {user ? (
                <>
                    <UserCard user={user}/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <RatingBarChart handle={user.handle} />
                        <PieChartData handle={user.handle} />
                    </div>
                    <HeatMap handle={user.handle}/>
                    <RatingGraph handle={user.handle} />
                </>
            ) : (
                <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-700">
                        Please login to view your Codeforces Stats
                    </h2>
                </div>
            )}
        </div>
    )
}

export default Home;