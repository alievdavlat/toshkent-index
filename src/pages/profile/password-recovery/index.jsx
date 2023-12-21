import React, { useState, useEffect } from 'react'
import PageLoader from '@/components/PageLoader'
import PassswordRecoveryForm from './Form';

const Index = () => {
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        let secondsToGo = 3;

        const timer = setInterval(() => {
            secondsToGo -= 1;
        }, 1000);

        setTimeout(() => {
            setLoader(false);
            clearInterval(timer);
          }, secondsToGo * 1000);
    }, [])

    return (
        <>
            {loader && <PageLoader />}
            <PassswordRecoveryForm formid="passwordRecoveryForm"/>
        </>
    )
}

export default Index;
