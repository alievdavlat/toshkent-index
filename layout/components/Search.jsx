import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useCallback } from 'react'
import { useGetOne } from '@/hooks/crud'
import SearchIcon from '@/../../img/icons/search.svg'
import { useSelector, useDispatch } from 'react-redux'
import { homeSearchVisibleHandler, homeSearchHiddenHandler } from '@/store/features/system'
import { useRouter } from 'next/router'
import CloseIcon from '@/img/icons/close.svg'
import i18n from 'i18next'
import { useTranslation } from 'react-i18next'

const Search = () => {
  const [query, setQuery] = useState('')
  const timeoutId = useRef()
  const dispatch = useDispatch()
  const detectClickRef = useRef(null)
  const { homeSearchVisible } = useSelector(state => state.system)
  const { t } = useTranslation('translation')
  const router = useRouter()

  const { data, isLoading, isFetched, refetch, isFetching } = useGetOne({
    url: '/search/',
    name: '/search/' + query,
    propId: false,
    params: {
      extra: {
        q: query
      }
    },
    onSuccess: data => {
      // setResult(data);
      // setLoading(false);
    }
  })

  const handleSearch = useCallback(
    evt => {
      clearTimeout(timeoutId.current)
      setQuery(evt.target.value)

      timeoutId.current = setTimeout(() => {
        if (!!query) {
          refetch()
        }
      }, 300)
    },
    [setQuery, query, refetch]
  )

  const closeHandler = () => {
    // setResult([]);
    setQuery('')
  }

  useEffect(() => {
    const handleClickOutside = e => {
      if (detectClickRef.current && !detectClickRef.current.contains(e.target)) {
        dispatch(homeSearchVisibleHandler(false))
        dispatch(homeSearchHiddenHandler(false))
      }
    }

    document.body.addEventListener('click', handleClickOutside)

    return () => {
      document.body.removeEventListener('click', handleClickOutside)
    }
  }, [dispatch])



  return (
    <div className={homeSearchVisible ? 'home-search search-visible' : 'home-search'}>
      {homeSearchVisible ? ( 
        <div className='home-search__box' ref={detectClickRef}>
          <div style={{ position: 'relative' }}>
            <Image src={SearchIcon} width={20} height={20} alt='icon' className='home-search__ico' />
            <input type='search' placeholder='Search...' value={query} onChange={handleSearch} />
            <button className='home-search__close' onClick={closeHandler}>
              <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' viewBox='0 0 24 24'>
                <path
                  fill='black'
                  d='m12 10.807 5.172-5.172 1.194 1.193L13.193 12l5.172 5.172-1.193 1.194L12 13.193l-5.172 5.173-1.193-1.194L10.807 12 5.634 6.828l1.194-1.193L12 10.807Z'
                ></path>
              </svg>
            </button>
          </div>
          {!isFetched ? (
            <p className='no-result-title'>{t('Looking for a match, wait...')}</p>
          ) : data?.ad?.length == 0 &&
            data?.news?.length == 0 &&
            data?.category?.length == 0 &&
            data?.markets?.length == 0 ? (
            <p className='no-result-title'>{t('Nothing was found for your query')}</p>
          ) : (
            ''
          )}

          <div className='home__wrap'>
            {!!data?.ad?.length && !!query && (
              <ul className='home-search__dropdown'>
                <h3 className='home-search__title'>{t('autoshop')}</h3>
                {(data?.ad || []).map((item, idx) => (
                  <li
                    className='dropdown-item'
                    key={idx}
                    onClick={() => {
                      router.push(`/product/${item.slug}`)
                      dispatch(homeSearchVisibleHandler(false))
                    }}
                  >
                    <Image
                      src={item?.images?.[0] || '/no-image.png'}
                      width={120}
                      height={120}
                      alt='icon'
                      className='search-icon'
                    />
                    <div className='dropdown-item-child'>
                      <div className='dropdown-item__wrap'>
                        <a className='child-title'>{item?.title}</a>
                        <a className='child-sub-title'>{item?.marka__label?.[`label_${i18n.language}`]}</a>
                      </div>
                      <p className='child-year'>{item?.year}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!!data?.category?.length && !!query && (
              <ul className='home-search__dropdown'>
                <h3 className='home-search__title'>{t('category')}</h3>
                {/* /.home-search__title */}
                {(data?.category || []).map((item, idx) => (
                  <li
                    className='dropdown-item'
                    key={idx}
                    onClick={() => {
                      router.push(`/shop?id=${item.id}`)
                      dispatch(homeSearchVisibleHandler(false))
                    }}
                  >
                    <picture className='home-search__cat'>
                      <Image
                        src={item?.icon || '/no-image.png'}
                        width={120}
                        height={120}
                        alt='icon'
                        className='search-icon'
                      />
                    </picture>
                    <div className='dropdown-item-child'>
                      <a className='child-title'>{item?.title?.[`title_${i18n.language}`]}</a>
                      <a className='child-sub-title'>{item?.subtitle}</a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!!data?.markets?.length && !!query && (
              <ul className='home-search__dropdown'>
                <h3 className='home-search__title'>{t('shops')}</h3>
                {(data?.markets || []).map((item, idx) => (
                  <li
                    className='dropdown-item'
                    key={idx}
                    onClick={() => {
                      router.push(`/shop/${item.slug}?id=${item.id}`)
                      dispatch(homeSearchVisibleHandler(false))
                    }}
                  >
                    <picture className='home-search__market'>
                      <Image
                        src={item?.logo || '/no-image.png'}
                        width={120}
                        height={120}
                        alt='icon'
                        className='search-icon search-icon-markets'
                      />
                    </picture>
                    {/* /.home-search__market */}
                    <div className='dropdown-item-child'>
                      <a className='child-title'>{item?.title}</a>
                      <a className='child-sub-title'>{item?.sub_title}</a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {!!data?.news?.length && !!query && (
              <ul className='home-search__dropdown'>
                <h3 className='home-search__title'>Yangiliklar</h3>
                {(data?.news || []).map((item, idx) => (
                  <li
                    className='dropdown-item'
                    key={idx}
                    onClick={() => {
                      router.push(`/news?id=${item.id}`)
                      dispatch(homeSearchVisibleHandler(false))
                    }}
                  >
                    <Image
                      src={item?.image?.[0] || '/no-image.png'}
                      width={120}
                      height={120}
                      alt='icon'
                      className='search-icon'
                    />
                    <div className='dropdown-item-child dropdown-item-txt'>
                      <a className='child-title'>{item?.title?.[`title_${i18n.language}`]}</a>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default Search
