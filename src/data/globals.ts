import { getCachedGlobal } from '@/utilities/getGlobals'

/** Public, published Global data only; the cache tag is invalidated by Payload hooks. */
export const getSiteSettings = () => getCachedGlobal('site-settings', 1)()
export const getContactInformation = () => getCachedGlobal('contact-information', 0)()
export const getHeaderData = () => getCachedGlobal('header', 1)()
export const getFooterData = () => getCachedGlobal('footer', 1)()
export const getAboutSettings = () => getCachedGlobal('about-settings', 1)()
