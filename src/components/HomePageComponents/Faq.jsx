import React from 'react'
import PageLoader from '@/components/PageLoader'
import CustomAccordion from '@/components/CustomAccordion';
import { useTranslation } from "next-i18next";

const Faq = ({ data, isLoading }) => {
    const {t} = useTranslation('translation');

    return (
        <>
            {isLoading && <PageLoader />}
            <section className="section faq">
                <div className="container">
                    <div className='faq-main'>
                        <h2 className="faq__title section-title">
                            {t("faq")}
                        </h2>
                        <CustomAccordion items={data?.data}/>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Faq;
