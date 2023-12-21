import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	contactFormType: [],
	applicationFormList: {},
	successModalVisible: false,
	applicationFormSuccess: true,
	feedbackModalVisible: false,
	phone: '',
	categoryActive: null,
	subCategoryActive: null,
	categoryMode: '',
	infoItem: {},
	auctionItem: {},
	infoItemDetailVisible: false,
	auctionItemDetailVisible: false,
	fullpageScreenCount: 0,
	errorPopupVisible: false,
	logoutModalVisible: false,
	scrollEnabled: false,
	currentSlide: 0,
	fullPageTotalSlides: 0,
	homeSearchVisible: false,
	homeSearchHidden: false,
	storeDetail: {},
	applicationModalVisible: false,
	applicationSubmitLink: ''
};

export const systemSlice = createSlice({
	name: "system",
	initialState,
	reducers: {
		setContactFormType: (state, action) => {
			return {
				...state,
				contactFormType: action.payload
			};
		},
		applicationFormListHandler: (state, action) => {
			return {
				...state,
				applicationFormList: {...state.applicationFormList, ...action.payload}
			}
		},
		successModalHandler: (state, action) => {
			return {
				...state,
				successModalVisible: action.payload,
				applicationFormSucces: false
			}
		},
		applicationFormSuccesHandler: (state, action) => {
			return {
				...state,
				applicationFormSuccess: action.payload
			}
		},
		userPhoneHandler: (state, action) => {
			return {
				...state,
				phone: action.payload
			}
		},
		feedbackModalVisibleHandler: (state, action) => {
			return {
				...state,
				feedbackModalVisible: action.payload
			}
		},
		setCategoryActive: (state, action) => {
			return {
				...state,
				categoryActive: action.payload
			}
		},
		setSubCategoryActive: (state, action) => {
			return {
				...state,
				subCategoryActive: action.payload
			}
		},
		categoryModeHandler: (state, action) => {
			return {
				...state,
				categoryMode: action.payload
			}
		},
		infoItemHandler: (state, action) => {
			return {
				...state,
				infoItem: action.payload,
				scrollEnabled: true,
				infoItemDetailVisible: true
			}
		},
		infoItemCancelHandler: (state, action) => {
			return {
				...state,
				infoItem: action.payload,
				infoItemDetailVisible: false,
				scrollEnabled: false
			}
		},
		auctionItemHandler: (state, action) => {
			return {
				...state,
				auctionItem: action.payload,
				auctionItemDetailVisible: true,
				scrollEnabled: true
			}
		},
		auctionItemCancelHandler: (state, action) => {
			return {
				...state,
				auctionItem: action.payload,
				auctionItemDetailVisible: false,
				scrollEnabled: false
			}
		},
		fullpageScreenCountHandler: (state, action) => {
			return {
				...state,
				fullpageScreenCount: action.payload,
			}
		},
		errorPopupHandler: (state, action) => {
			return {
				...state,
				errorPopupVisible: action.payload,
			}
		},
		logoutModalVisibleHandler: (state, action) => {
			return {
				...state,
				logoutModalVisible: action.payload,
			}
		},
		currentSlideHandler: (state, action) => {
			return {
				...state,
				currentSlide: action.payload,
			}
		},
		fullPageTotalSlidesHandler: (state, action) => {
			return {
				...state,
				fullPageTotalSlides: action.payload,
			}
		},
		homeSearchVisibleHandler: (state, action) => {
			return {
				...state,
				homeSearchVisible: action.payload,
				scrollEnabled: true
			}
		},
		homeSearchHiddenHandler: (state, action)=> {
			return {
				...state,
				homeSearchHidden: action.payload,
				scrollEnabled: false
			}
		},
		setStoreDetailHandler: (state, action)=> {
			return {
				...state,
				storeDetail: action.payload,
			}
		},
		applicationModalVisibleHandler: (state, action)=> {
			return {
				...state,
				applicationSubmitLink: action.payload,
				applicationModalVisible: true,
			}
		},
		applicationModalVisibleHide: (state, action)=> {
			return {
				...state,
				applicationSubmitLink: action.payload,
				applicationModalVisible: false,
			}
		}
	}
});

export const { 
	setContactFormType, 
	applicationFormListHandler, 
	feedbackModalVisibleHandler, 
	applicationFormSuccesHandler, 
	userPhoneHandler, 
	setCategoryActive, 
	setSubCategoryActive, 
	categoryModeHandler,
	infoItemHandler,
	infoItemCancelHandler,
	auctionItemHandler,
	auctionItemCancelHandler,
	fullpageScreenCountHandler,
	errorPopupHandler,
	logoutModalVisibleHandler,
	currentSlideHandler,
	fullPageTotalSlidesHandler,
	homeSearchVisibleHandler,
	homeSearchHiddenHandler,
	setStoreDetailHandler,
	applicationModalVisibleHandler,
	applicationModalVisibleHide
} = systemSlice.actions;

export default systemSlice.reducer;