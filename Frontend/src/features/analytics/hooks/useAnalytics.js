import {useEffect} from "react";
import {useAnalyticsStore} from "../store/analyticsStore";

export const useAnalytics = () => {
    const {data, isLoading, error, days, setDays, fetchAnalytics, refreshAnalytics} = useAnalyticsStore();

    useEffect(() => {
        fetchAnalytics();
    }, [fetchAnalytics]);

    return {
        data,
        isLoading,
        error,
        days,
        setDays,
        refreshAnalytics,
    };
};
