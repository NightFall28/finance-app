"use client"

import { useGetSummary } from "@/features/summary/api/use-get-summary";
import { Chart, ChartLoading } from "./chart";
import { SpendingPie, SpendingPieLoading } from "./spending-pie";


export const DataCharts = () => {
    const {data, isLoading} = useGetSummary()

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
                <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                    <ChartLoading />
                </div>
                <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                    <SpendingPieLoading />
                </div>
            </div>
        )
    }

    // console.log("Fetched data:", data);
    // console.log("Fetched data categories:", data?.categories);

    return ( 
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
            <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                <Chart data={data?.days} />
            </div>
            <div className="col-span-1 lg:col-span-3 xl:col-span-4">
                <SpendingPie data={data?.categories} />
            </div>
        </div>
    );
}