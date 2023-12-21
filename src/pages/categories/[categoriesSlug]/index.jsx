import React, {useState} from 'react';
import {get} from 'lodash';
import Link from 'next/link';
import Image from 'next/image';
import i18n from '@/services/i18n';
import { useGetAll } from '@/hooks/crud';
import { useRouter } from 'next/navigation';
import NoDataUI from '@/components/NoDataUI';
import { useTranslation } from "next-i18next";
import Close from '@/../../img/icons/close.svg';
import Plus from '@../../../img/icons/plus.svg';
import PageLoader from '@/components/PageLoader';
import Search from '@/../../img/icons/search.svg';
import { useSearchParams } from 'next/navigation';
import Filter from '@/../../img/icons/filter.svg';
import Detail from '@/../../img/icons/detail.svg';
import { ContainerAll } from '@/modules/container';
import { withLayout } from '../../../../layout/Layout'

const CategoriesSlug = () => {

    const lang = i18n.language;
    const router = useRouter();
    const searchParams = useSearchParams();
    const CategoryId = searchParams.get('id');
    const [activeCategory, setActiveCategory] = useState(null);
    const [active, setActive] = useState(+searchParams.get('id'));
    const {t} = useTranslation('translation');

    const activeHandler = (val) => {
        setActive(val)
    }

    const { data, isLoading } = useGetAll({
        url: '/eav/category/list/',
        name: '/eav/category/list/',
        onSuccess: data => {
            const selected = (data?.data?.items || []).find(menu => menu?.id === Number(CategoryId));
            activeHandler(selected?.id);
        }
    })

    return (
        <section className="shop">
            <div className='container'>
                <div className='shop-content'>
                    <div className='shop-side filter'>
                        <div className='info-popup__close'>
                            <Image src={Close} width={20} height={20} alt='icon'/>
                            <span suppressHydrationWarning={true}>{t("close")}</span>
                        </div>
                        <div className="shop-side__search">
                            <Image src={Search} width={20} height={20} alt='icon'/>
                            <input type="text" placeholder={i18n.language === 'uz' ? 'Qidirmoq...' : 'Поиск...'} />
                        </div>
                        <>
                            {data?.data?.items?.length <= 0 && !isLoading ? <NoDataUI /> : ""}
                            {isLoading && <PageLoader />}
                            {data?.data?.items?.length > 0 && (
                                <ul className="shop-side__list">
                                    {(data?.data?.items || []).map((item, idx) => {
                                        return (
                                            <li className={`shop-side__item ${get(item, 'id') === active ? 'active' : ''}`} key={idx} onClick={() => activeHandler(item?.id)}>
                                                <div className="shop-side__head">
                                                    <Image src={get(item, 'icon')} width={20} height={20} alt='icon' />
                                                    <span>{get(item, `title.title_${lang}`)}</span>
                                                </div>
                                                {item?.children?.length > 0 && (
                                                    <ul className="shop-side__dropdown">
                                                        {(item.children || []).map((childItem, childIdx) => (
                                                            <li key={childIdx} onClick={() => setActiveCategory(childItem)}>
                                                                <a href={null} style={{cursor: 'pointer'}} className={item.id === get(activeCategory, 'id') ? 'category-active' : ''}>
                                                                    {get(childItem, `title.title_${lang}`)}
                                                                </a>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}
                                            </li>
                                        )
                                    })}
                                </ul>                    
                            )}
                        </>
                    </div>
                    <div className='shop-main'>
                        <div className="section-head">
                            <h2 className="section-title">
                                Avtomobil do’konlari
                            </h2>
                            <div className="section-wrap">
                                <button className="filter-open">
                                    <Image src={Filter} width={20} height={20} alt='icon'/>
                                </button>
                                <Link href="#" className="section-btn">
                                    <Image src={Plus} width={20} height={20} alt='icon'/>
                                    <span>Do’kon qo’shish</span>
                                </Link>
                            </div>
                        </div>
                        <ContainerAll
                            url={'/market/list/'}
                            name='/market/list/'
                            params={{
                                extra: {
                                    category_id: get(activeCategory, 'id')
                                }
                            }}
                        >
                            {({items, isLoading}) => {
                                const _filtered = get(activeCategory, 'id') ? (items || []).filter(allItems => allItems.status === 4): items;

                                return (
                                    <>
                                        {items?.length <= 0 && !isLoading ? <NoDataUI /> : ""}
                                        {isLoading && <PageLoader />}
                                        {items?.length > 0 && (
                                            <ul className='shop-list'>
                                                {(_filtered || []).map((category, categoryIdx) =>(
                                                    <li className="shop-item" key={categoryIdx}>
                                                        <div className="shop-item__img" style={{cursor: 'pointer'}} onClick={() => router.push(`/shop/${category?.id}?id=${category?.id}`)}>
                                                            <a href={null}>
                                                                <Image src={get(category, 'logo')} width={260} height={140} alt="shop"/>
                                                            </a>
                                                        </div>
                                                        <div className="shop-item__wrap">
                                                            <div className="shop-item__name">
                                                                <a href={null} style={{cursor: 'pointer'}} onClick={() => router.push(`/shop/${category?.id}?id=${category?.id}`)}>
                                                                    {get(category, 'title')}
                                                                </a>
                                                            </div>
                                                            <div className="shop-item__text">
                                                                {get(category, 'sub_title')}
                                                            </div>
                                                            <div className="shop-item__bot">
                                                                <button>
                                                                    <Image src={Detail} width={20} height={20} alt="shop"/>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </>
                                )
                            }}
                        </ContainerAll> 
                    </div>
                </div>
            </div>
        </section>
    )
}

export default withLayout(CategoriesSlug);
