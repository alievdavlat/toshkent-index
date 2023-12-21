'use client'

import React from 'react'
import Image from 'next/image'
import ProductImg from '../img/product/1.jpg'
import BagImg from '../img/icons/bag.svg'
import CarImg from '../img/icons/car.svg'
import ShopImg from "../img/icons/shop.svg"
import UserImg from "../img/icons/user.svg"
import { usePathname } from "next/navigation";
import { useDispatch } from 'react-redux'
import Link from 'next/link'
import { ContainerAll } from '@/modules/container'
import { logoutModalVisibleHandler } from '@/store/features/system'
import { useTranslation } from "next-i18next";
import i18n from '@/services/i18n'

const Sidebar = () => {
	const pathname = usePathname()
	const dispatch = useDispatch()
	const {t} = useTranslation('translation');

    const menuItems = [
        {	id: 1, title_uz: 'Mening elonlarim', title_ru: 'Мои объявления', link: '/profile', icon: BagImg },
        {	id: 2, title_uz: 'Avtomobil qo’shish', title_ru: 'Добавить автомобиль', link: '/profile/cars', icon: CarImg },
        {	id: 3, title_uz: 'Do’kon qo’shish', title_ru: 'Добавить магазин', link: '/profile/store', icon: ShopImg },
        {	id: 4, title_uz: 'Profilimni o’zgartirish', title_ru: 'Изменить мой профиль', link: '/profile/settings', icon: UserImg },
    ]
	const menuItems2 = [
        {	id: 1, title_uz: 'Mening elonlarim', title_ru: 'Мои объявления', link: '/profile', icon: BagImg },
        {	id: 2, title_uz: 'Avtomobil qo’shish', title_ru: 'Добавить автомобиль', link: '/profile/cars', icon: CarImg },
        {	id: 4, title_uz: 'Profilimni o’zgartirish', title_ru: 'Изменить мой профиль', link: '/profile/settings', icon: UserImg },
    ]
	
	return (
        	<ContainerAll
				url={'/users/info/'}
				name='/users/info/'
				auth={true}
			>
            {({items}) => {
				return (
					<>
						<div className="account-side__info">
							<div className="account-side__img">
								<Image width={142} height={96} src={items?.image|| '/userIcon.jpg'} alt="user" />
							</div>
							<div className="account-side__text">
								<div>{items?.phone_number}</div>
								<p>{items?.lastname}</p>
							</div>
						</div>
						<ul className="account-side__menu">
							{
								items?.is_juridical ? menuItems.map((menu, idx) => (
									<li key={idx}>
										<Link href={menu.link} className={pathname === menu.link ? "current" : ''}>
											<Image width={24} height={24} src={menu.icon} alt="ico"/>
											<span>{i18n.language == 'uz' ? menu.title_uz : menu.title_ru}</span>
										</Link>
									</li>						
								)) : menuItems2.map((menu, idx) => (
									<li key={idx}>
										<Link href={menu.link} className={pathname === menu.link ? "current" : ''}>
											<Image width={24} height={24} src={menu.icon} alt="ico"/>
											<span>{i18n.language == 'uz' ? menu.title_uz : menu.title_ru}</span>
										</Link>
									</li>						
								))
							}
							<li onClick={() => dispatch(logoutModalVisibleHandler(true))}>
								<a style={{cursor: 'pointer'}}>
									<Image width={24} height={24} src={'/logout2.svg'} alt="ico"/>
									<span suppressHydrationWarning={true}>{t('logout')}</span>
								</a>
							</li>
						</ul>
					</>
        		)
			}}
        </ContainerAll>
  	);
}

export default Sidebar;