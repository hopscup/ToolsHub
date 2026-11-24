import source from '../data/freeAntidetectArticle.json';
import type {ArticleServiceOffer} from '../lib/articleServiceTracking';
import {AntidetectOverviewGuideArticle} from './AntidetectOverviewGuideArticle';
export const FreeAntidetectGuideArticle = ({offers}: {offers: ArticleServiceOffer[]}) => <AntidetectOverviewGuideArticle source={source} offers={offers}/>;
