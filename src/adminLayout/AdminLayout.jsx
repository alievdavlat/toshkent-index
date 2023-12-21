"use client"

import React from 'react'
import Header from '../../layout/Header'
import Sidebar from './Sidebar'
import dynamic from 'next/dynamic'
import { useTranslation } from "next-i18next";

const Logout = dynamic(() => import('@/pages/profile/logout'), {ssr: false})
const AdminLayout = ({ children }) => {
	const {t} = useTranslation('translation');

	return (
		<div className="admin_layout">
			<Logout />
			<Header />
			<div className="admin_layout_main">
				<div className="account" style={{ paddingBottom: 0 }}>
					<div className="container">
						<h1 className="accout__title section-title" suppressHydrationWarning={true}>{t('personalCabinet')}</h1>
						<div className="account-content">
							<div className="account-side">
								<Sidebar />
							</div>
							<div className="account-main">{children}</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}


export const withAdminLayout = (Component) => {
  return function withLayoutComponent(props) {
    return (
      <AdminLayout>
        <Component {...props} />
      </AdminLayout>
    );
  };
};